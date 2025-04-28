/**
      __                       
     / /                       
    / /     ___  __ _  ___ ___ 
   / /     / _ \/ _` |/ _ / __|
  / /___  |  __/ (_| |  __\__ \
 /_____/   \___|\__, |\___/___/
                 __/ |         
                |___/          

     Leger RLS Policy Updates
     This migration updates the Row Level Security policies for Leger's requirements.
 */

/**
  * -------------------------------------------------------
  * Section - Update Account Table RLS Policies
  * -------------------------------------------------------
 */

-- Drop existing account update policy if it exists
DROP POLICY IF EXISTS "Accounts can be edited by owners" ON basejump.accounts;

-- Create updated policy for account editing
CREATE POLICY "Accounts can be edited by owners" ON basejump.accounts
    FOR UPDATE
    TO authenticated
    USING (
        basejump.has_role_on_account(id, 'owner') = true
    );

/**
  * -------------------------------------------------------
  * Section - Update Billing Tables RLS Policies
  * -------------------------------------------------------
 */

-- Drop existing billing customer policy if it exists
DROP POLICY IF EXISTS "Can only view own billing customer data." ON basejump.billing_customers;

-- Create updated policy for billing customers
CREATE POLICY "Can only view own billing customer data." ON basejump.billing_customers
    FOR SELECT
    TO authenticated
    USING (
        basejump.has_role_on_account(account_id) = true
    );

-- Create policy for updating billing customers (only for account owners)
CREATE POLICY "Can only update own billing customer data as owner." ON basejump.billing_customers
    FOR UPDATE
    TO authenticated
    USING (
        basejump.has_role_on_account(account_id, 'owner') = true
    );

-- Drop existing billing subscription policy if it exists
DROP POLICY IF EXISTS "Can only view own billing subscription data." ON basejump.billing_subscriptions;

-- Create updated policy for billing subscriptions
CREATE POLICY "Can only view own billing subscription data." ON basejump.billing_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        basejump.has_role_on_account(account_id) = true
    );

/**
  * -------------------------------------------------------
  * Section - Additional Helper Functions
  * -------------------------------------------------------
 */

-- Function to get configuration stats for an account
CREATE OR REPLACE FUNCTION public.get_account_configuration_stats(
    p_account_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- Check if user has access to the account
    IF NOT basejump.has_role_on_account(p_account_id) THEN
        RAISE EXCEPTION 'You do not have permission to view this account';
    END IF;
    
    -- Get configuration stats
    SELECT json_build_object(
        'total_configurations', COUNT(*),
        'templates', COUNT(*) FILTER (WHERE is_template = TRUE),
        'recent_configurations', json_agg(
            json_build_object(
                'config_id', config_id,
                'name', name,
                'updated_at', updated_at
            )
        ) FILTER (WHERE created_at > (NOW() - INTERVAL '30 days'))
    ) INTO result
    FROM public.configurations
    WHERE account_id = p_account_id;
    
    RETURN result;
END;
$$;

-- Grant execution permissions for the stats function
GRANT EXECUTE ON FUNCTION public.get_account_configuration_stats(UUID) TO authenticated, service_role;

-- Function to share a configuration as a template
CREATE OR REPLACE FUNCTION public.share_configuration_as_template(
    p_config_id UUID,
    p_is_template BOOLEAN DEFAULT TRUE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    account_id UUID;
BEGIN
    -- Get the account_id for this configuration
    SELECT c.account_id
    INTO account_id
    FROM public.configurations c
    WHERE c.config_id = p_config_id;
    
    -- Check if configuration exists
    IF account_id IS NULL THEN
        RAISE EXCEPTION 'Configuration not found';
    END IF;
    
    -- Check if user has owner access to the account
    IF NOT basejump.has_role_on_account(account_id, 'owner') THEN
        RAISE EXCEPTION 'Only account owners can share configurations as templates';
    END IF;
    
    -- Update the configuration to set it as a template
    UPDATE public.configurations
    SET is_template = p_is_template
    WHERE config_id = p_config_id;
    
    RETURN TRUE;
END;
$$;

-- Grant execution permissions for the share template function
GRANT EXECUTE ON FUNCTION public.share_configuration_as_template(UUID, BOOLEAN) TO authenticated, service_role;

/**
  * -------------------------------------------------------
  * Section - Create Test Templates
  * -------------------------------------------------------
 */

-- Create a system account for sample templates if it doesn't exist
DO $$
DECLARE
    system_account_id UUID;
BEGIN
    -- Check if we already have a system account
    SELECT id INTO system_account_id
    FROM basejump.accounts
    WHERE name = 'Leger System Templates'
    LIMIT 1;
    
    -- Create the system account if it doesn't exist
    IF system_account_id IS NULL THEN
        INSERT INTO basejump.accounts (name, slug, personal_account, metadata)
        VALUES ('Leger System Templates', 'leger-system-templates', false, '{"is_system": true}'::jsonb)
        RETURNING id INTO system_account_id;
    END IF;
    
    -- Create a sample template if we don't have any yet
    IF NOT EXISTS (SELECT 1 FROM public.configurations WHERE is_template = TRUE) THEN
        INSERT INTO public.configurations (
            account_id,
            name,
            description,
            is_template,
            config_data
        ) VALUES (
            system_account_id,
            'Basic Configuration Template',
            'A starter configuration template for Leger',
            TRUE,
            '{
                "schema_version": "1.0",
                "settings": {
                    "default_modules": ["core", "reporting"],
                    "notification_settings": {
                        "email": true,
                        "push": false
                    }
                },
                "layout": {
                    "dashboard": {
                        "widgets": [
                            {"type": "summary", "position": "top"},
                            {"type": "chart", "position": "middle"},
                            {"type": "activity", "position": "bottom"}
                        ]
                    }
                }
            }'::jsonb
        );
    END IF;
END $$;
