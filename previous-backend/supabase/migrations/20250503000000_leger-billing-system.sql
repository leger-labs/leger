/**
      __                       
     / /                       
    / /     ___  __ _  ___ ___ 
   / /     / _ \/ _` |/ _ / __|
  / /___  |  __/ (_| |  __\__ \
 /_____/   \___|\__, |\___/___/
                 __/ |         
                |___/          

     Leger Billing System Migration
     
     This migration adapts the Basejump billing tables for Leger's simplified
     fixed subscription model with a 14-day trial.
 */

/**
  * -------------------------------------------------------
  * Section - Billing Subscriptions Table Modifications
  * -------------------------------------------------------
 */

-- Clean up any existing usage-related columns
ALTER TABLE basejump.billing_subscriptions 
DROP COLUMN IF EXISTS quantity CASCADE;

-- Add column to track remaining trial days
ALTER TABLE basejump.billing_subscriptions
ADD COLUMN IF NOT EXISTS trial_remaining_days INTEGER;

-- Add column to flag if trial will end soon
ALTER TABLE basejump.billing_subscriptions
ADD COLUMN IF NOT EXISTS trial_will_end BOOLEAN DEFAULT FALSE;

-- Add simplified tier column 
ALTER TABLE basejump.billing_subscriptions
ADD COLUMN IF NOT EXISTS tier TEXT;

-- Update the subscription_status enum to remove unnecessary statuses
-- Note: We're keeping it compatible with Stripe's subscription statuses
-- but cleaning up any obsolete ones

-- Create temp table with existing subscriptions (if any)
CREATE TEMP TABLE IF NOT EXISTS temp_subscriptions AS
SELECT * FROM basejump.billing_subscriptions;

-- Ensure we have all needed subscription statuses
DO $$
BEGIN
    -- Check if any statuses need to be added
    IF NOT EXISTS (SELECT 1 FROM pg_type t 
                   JOIN pg_enum e ON t.oid = e.enumtypid 
                   WHERE t.typname = 'subscription_status' 
                   AND e.enumlabel = 'trialing') THEN
        
        -- Adding a value to enum requires creating a new type
        -- and migrating the data
        ALTER TYPE basejump.subscription_status ADD VALUE IF NOT EXISTS 'trialing';
    END IF;
    
    -- Repeat for other status values if needed
    IF NOT EXISTS (SELECT 1 FROM pg_type t 
                   JOIN pg_enum e ON t.oid = e.enumtypid 
                   WHERE t.typname = 'subscription_status' 
                   AND e.enumlabel = 'incomplete') THEN
        ALTER TYPE basejump.subscription_status ADD VALUE IF NOT EXISTS 'incomplete';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type t 
                   JOIN pg_enum e ON t.oid = e.enumtypid 
                   WHERE t.typname = 'subscription_status' 
                   AND e.enumlabel = 'incomplete_expired') THEN
        ALTER TYPE basejump.subscription_status ADD VALUE IF NOT EXISTS 'incomplete_expired';
    END IF;
END $$;

/**
  * -------------------------------------------------------
  * Section - Create Functions for Subscription Checking
  * -------------------------------------------------------
 */

-- Function to check if a user is on a paid plan
CREATE OR REPLACE FUNCTION public.is_paid_subscription(account_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM basejump.billing_subscriptions bs
        WHERE bs.account_id = is_paid_subscription.account_id
        AND bs.status IN ('active', 'trialing')
        ORDER BY bs.created DESC
        LIMIT 1
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Function to get subscription details
CREATE OR REPLACE FUNCTION public.get_subscription_details(account_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Check if the user has access to the account
    IF current_user NOT IN ('service_role') AND NOT basejump.has_role_on_account(account_id) THEN
        RAISE EXCEPTION 'You do not have permission to view this account''s subscription';
    END IF;
    
    -- Get latest subscription info
    SELECT jsonb_build_object(
        'status', COALESCE(bs.status::text, 'no_subscription'),
        'tier', bs.tier,
        'plan_name', bs.plan_name,
        'trial_end', bs.trial_end,
        'trial_remaining_days', bs.trial_remaining_days,
        'current_period_end', bs.current_period_end,
        'cancel_at_period_end', bs.cancel_at_period_end,
        'created', bs.created,
        'is_paid', (bs.status IN ('active', 'trialing'))
    )
    INTO result
    FROM basejump.billing_subscriptions bs
    WHERE bs.account_id = get_subscription_details.account_id
    ORDER BY bs.created DESC
    LIMIT 1;
    
    -- Handle case where no subscription exists
    IF result IS NULL THEN
        -- Check if user has ever had a subscription before
        IF EXISTS (
            SELECT 1 
            FROM basejump.billing_subscriptions bs 
            WHERE bs.account_id = get_subscription_details.account_id
        ) THEN
            -- Had a subscription before but canceled
            result := jsonb_build_object(
                'status', 'no_subscription',
                'plan_name', 'None',
                'is_paid', false
            );
        ELSE
            -- New user eligible for trial
            result := jsonb_build_object(
                'status', 'trialing',
                'plan_name', 'Trial',
                'is_paid', false,
                'trial_remaining_days', 14
            );
        END IF;
    END IF;
    
    RETURN result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_paid_subscription(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_subscription_details(UUID) TO authenticated, service_role;

/**
  * -------------------------------------------------------
  * Section - Billing Webhooks Function
  * -------------------------------------------------------
 */

-- Create a stored procedure for handling Stripe webhooks
CREATE OR REPLACE FUNCTION public.handle_stripe_subscription_webhook(
    subscription_id TEXT,
    customer_id TEXT,
    account_id UUID,
    status TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    trial_remaining_days INT DEFAULT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    event_type TEXT DEFAULT 'unknown'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Log the webhook event
    INSERT INTO public.webhook_logs (
        event_type,
        subscription_id,
        customer_id,
        account_id,
        data,
        created_at
    ) VALUES (
        event_type,
        subscription_id,
        customer_id,
        account_id,
        jsonb_build_object(
            'status', status,
            'current_period_start', current_period_start,
            'current_period_end', current_period_end,
            'cancel_at_period_end', cancel_at_period_end,
            'trial_start', trial_start,
            'trial_end', trial_end,
            'trial_remaining_days', trial_remaining_days,
            'metadata', metadata
        ),
        NOW()
    )
    ON CONFLICT DO NOTHING;
    
    -- Handle different event types
    IF event_type = 'customer.subscription.created' THEN
        -- New subscription
        INSERT INTO basejump.billing_subscriptions (
            id,
            account_id,
            billing_customer_id,
            status,
            tier,
            plan_name,
            cancel_at_period_end,
            created,
            current_period_start,
            current_period_end,
            trial_start,
            trial_end,
            trial_remaining_days,
            metadata,
            provider
        ) VALUES (
            subscription_id,
            account_id,
            customer_id,
            status::basejump.subscription_status,
            'standard',
            'Standard Plan',
            cancel_at_period_end,
            NOW(),
            current_period_start,
            current_period_end,
            trial_start,
            trial_end,
            trial_remaining_days,
            metadata,
            'stripe'
        )
        ON CONFLICT (id) DO UPDATE SET
            status = status::basejump.subscription_status,
            current_period_start = EXCLUDED.current_period_start,
            current_period_end = EXCLUDED.current_period_end,
            cancel_at_period_end = EXCLUDED.cancel_at_period_end,
            trial_start = EXCLUDED.trial_start,
            trial_end = EXCLUDED.trial_end,
            trial_remaining_days = EXCLUDED.trial_remaining_days;
            
    ELSIF event_type = 'customer.subscription.updated' THEN
        -- Update existing subscription
        UPDATE basejump.billing_subscriptions
        SET 
            status = status::basejump.subscription_status,
            current_period_start = handle_stripe_subscription_webhook.current_period_start,
            current_period_end = handle_stripe_subscription_webhook.current_period_end,
            cancel_at_period_end = handle_stripe_subscription_webhook.cancel_at_period_end,
            trial_start = handle_stripe_subscription_webhook.trial_start,
            trial_end = handle_stripe_subscription_webhook.trial_end,
            trial_remaining_days = handle_stripe_subscription_webhook.trial_remaining_days,
            metadata = handle_stripe_subscription_webhook.metadata
        WHERE id = subscription_id;
        
    ELSIF event_type = 'customer.subscription.deleted' THEN
        -- Mark subscription as canceled
        UPDATE basejump.billing_subscriptions
        SET 
            status = 'canceled'::basejump.subscription_status,
            canceled_at = NOW()
        WHERE id = subscription_id;
    END IF;
    
    -- Return success response
    result := jsonb_build_object(
        'success', true,
        'event_type', event_type,
        'subscription_id', subscription_id
    );
    
    RETURN result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_stripe_subscription_webhook(
    TEXT, TEXT, UUID, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, BOOLEAN, 
    TIMESTAMPTZ, TIMESTAMPTZ, INT, JSONB, TEXT
) TO service_role;

/**
  * -------------------------------------------------------
  * Section - Create Webhook Log Table
  * -------------------------------------------------------
 */

-- Create a table to log webhook events
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    subscription_id TEXT,
    customer_id TEXT,
    account_id UUID,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for webhook logs
CREATE INDEX IF NOT EXISTS idx_webhook_logs_subscription_id ON public.webhook_logs(subscription_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_account_id ON public.webhook_logs(account_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON public.webhook_logs(created_at);

-- Enable RLS on webhook logs
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Only service_role can insert into webhook logs
CREATE POLICY "Service role can insert webhook logs" ON public.webhook_logs
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Only service_role can select webhook logs
CREATE POLICY "Service role can view webhook logs" ON public.webhook_logs
    FOR SELECT
    TO service_role
    USING (true);

-- Update webhook logs
CREATE POLICY "Service role can update webhook logs" ON public.webhook_logs
    FOR UPDATE
    TO service_role
    USING (true);

-- Grant permissions on the table
GRANT ALL ON TABLE public.webhook_logs TO service_role;

/**
  * -------------------------------------------------------
  * Section - Update Check Billing Status Function
  * -------------------------------------------------------
 */

-- Create or replace function to check billing status
CREATE OR REPLACE FUNCTION public.check_account_billing_status(account_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    subscription RECORD;
    result JSONB;
BEGIN
    -- Check if the user has access to the account
    IF current_user NOT IN ('service_role') AND NOT basejump.has_role_on_account(account_id) THEN
        RAISE EXCEPTION 'You do not have permission to view this account''s billing status';
    END IF;
    
    -- Get latest subscription
    SELECT bs.*
    INTO subscription
    FROM basejump.billing_subscriptions bs
    WHERE bs.account_id = check_account_billing_status.account_id
    ORDER BY bs.created DESC
    LIMIT 1;
    
    -- Build response object
    IF subscription.id IS NOT NULL THEN
        -- Calculate trial days remaining if applicable
        IF subscription.status = 'trialing' AND subscription.trial_end IS NOT NULL THEN
            SELECT 
                GREATEST(0, EXTRACT(DAY FROM (subscription.trial_end - NOW()))::INT)
            INTO subscription.trial_remaining_days;
        END IF;
        
        result := jsonb_build_object(
            'can_access', (subscription.status IN ('active', 'trialing')),
            'status', subscription.status,
            'plan_name', COALESCE(subscription.plan_name, 'Standard Plan'),
            'trial_end', subscription.trial_end,
            'trial_remaining_days', subscription.trial_remaining_days,
            'current_period_end', subscription.current_period_end,
            'cancel_at_period_end', subscription.cancel_at_period_end,
            'is_paid', (subscription.status = 'active')
        );
        
        -- Add message based on status
        IF subscription.status = 'active' THEN
            result := result || jsonb_build_object('message', 'Subscription active');
        ELSIF subscription.status = 'trialing' THEN
            result := result || jsonb_build_object('message', 
                'Trial active with ' || COALESCE(subscription.trial_remaining_days, 0) || ' days remaining');
        ELSIF subscription.status = 'past_due' THEN
            result := result || jsonb_build_object('message', 
                'There is an issue with your payment. Please update your payment method.');
        ELSIF subscription.status = 'canceled' THEN
            result := result || jsonb_build_object('message', 
                'Your subscription has been canceled. Please renew to continue using all features.');
        ELSE
            result := result || jsonb_build_object('message', 
                'Subscription status: ' || subscription.status);
        END IF;
    ELSE
        -- No subscription found - check if they've had one before
        IF EXISTS (
            SELECT 1 
            FROM basejump.billing_subscriptions bs 
            WHERE bs.account_id = check_account_billing_status.account_id
        ) THEN
            -- Had a subscription before but canceled
            result := jsonb_build_object(
                'can_access', false,
                'status', 'no_subscription',
                'plan_name', 'None',
                'is_paid', false,
                'message', 'Your subscription has ended. Please subscribe to access the service.'
            );
        ELSE
            -- New user eligible for trial
            result := jsonb_build_object(
                'can_access', true,
                'status', 'trialing',
                'plan_name', 'Trial',
                'is_paid', false,
                'trial_remaining_days', 14,
                'message', 'Free trial active'
            );
        END IF;
    END IF;
    
    RETURN result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_account_billing_status(UUID) TO authenticated, service_role;
