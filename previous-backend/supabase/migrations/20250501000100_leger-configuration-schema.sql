/**
      __                       
     / /                       
    / /     ___  __ _  ___ ___ 
   / /     / _ \/ _` |/ _ / __|
  / /___  |  __/ (_| |  __\__ \
 /_____/   \___|\__, |\___/___/
                 __/ |         
                |___/          

     Leger is built on top of the Basejump framework for Supabase.
     This migration adapts the Basejump schema for Leger's specific requirements.
 */

/**
  * -------------------------------------------------------
  * Section - Account Structure Updates
  * -------------------------------------------------------
 */

-- Simplify metadata fields related to usage limits in accounts table
ALTER TABLE basejump.accounts
DROP COLUMN IF EXISTS private_metadata; -- Removing complex metadata field

-- Rename public_metadata to just metadata for simplicity
ALTER TABLE basejump.accounts
RENAME COLUMN public_metadata TO metadata;

-- Ensure metadata has a default value
ALTER TABLE basejump.accounts
ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;

/**
  * -------------------------------------------------------
  * Section - Billing Structure Updates
  * -------------------------------------------------------
 */

-- Modify billing_subscriptions table to simplify tier-related fields and add trial tracking
ALTER TABLE basejump.billing_subscriptions
DROP COLUMN IF EXISTS quantity; -- Remove usage tracking field

-- Add trial specific fields if not already present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'basejump' 
                  AND table_name = 'billing_subscriptions'
                  AND column_name = 'trial_remaining_days') THEN
        ALTER TABLE basejump.billing_subscriptions 
        ADD COLUMN trial_remaining_days INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'basejump' 
                  AND table_name = 'billing_subscriptions'
                  AND column_name = 'trial_will_end') THEN
        ALTER TABLE basejump.billing_subscriptions 
        ADD COLUMN trial_will_end BOOLEAN DEFAULT FALSE;
    END IF;
END
$$;

-- Simplify tier-related fields
ALTER TABLE basejump.billing_subscriptions
DROP COLUMN IF EXISTS price_id CASCADE; -- Remove complex pricing structure

-- Add a simple tier field instead
ALTER TABLE basejump.billing_subscriptions
ADD COLUMN IF NOT EXISTS tier TEXT;

/**
  * -------------------------------------------------------
  * Section - Update Config for Leger
  * -------------------------------------------------------
 */

-- Update config to use Leger settings
UPDATE basejump.config 
SET 
  enable_team_accounts = TRUE, -- Keep team accounts enabled
  enable_personal_account_billing = TRUE, -- Keep personal billing enabled
  enable_team_account_billing = TRUE; -- Keep team billing enabled

-- Add Leger-specific config if needed
ALTER TABLE basejump.config
ADD COLUMN IF NOT EXISTS leger_version TEXT DEFAULT '1.0.0';

/**
  * -------------------------------------------------------
  * Section - Update Account Functions
  * -------------------------------------------------------
 */

-- Update the get_account function to reflect the simplified metadata structure
CREATE OR REPLACE FUNCTION public.get_account(account_id uuid)
    RETURNS json
    LANGUAGE plpgsql
AS $$
BEGIN
    -- check if the user is a member of the account or a service_role user
    if current_user IN ('anon', 'authenticated') and
       (select current_user_account_role(get_account.account_id) ->> 'account_role' IS NULL) then
        raise exception 'You must be a member of an account to access it';
    end if;

    return (select json_build_object(
                           'account_id', a.id,
                           'account_role', wu.account_role,
                           'is_primary_owner', a.primary_owner_user_id = auth.uid(),
                           'name', a.name,
                           'slug', a.slug,
                           'personal_account', a.personal_account,
                           'billing_enabled', case
                                                  when a.personal_account = true then
                                                      config.enable_personal_account_billing
                                                  else
                                                      config.enable_team_account_billing
                               end,
                           'billing_status', bs.status,
                           'created_at', a.created_at,
                           'updated_at', a.updated_at,
                           'metadata', a.metadata
                       )
            from basejump.accounts a
                     left join basejump.account_user wu on a.id = wu.account_id and wu.user_id = auth.uid()
                     join basejump.config config on true
                     left join (select bs.account_id, status
                                from basejump.billing_subscriptions bs
                                where bs.account_id = get_account.account_id
                                order by created desc
                                limit 1) bs on bs.account_id = a.id
            where a.id = get_account.account_id);
END;
$$;

-- Update the update_account function for the renamed metadata column
CREATE OR REPLACE FUNCTION public.update_account(account_id uuid, slug text default null, name text default null,
                                                 metadata jsonb default null,
                                                 replace_metadata boolean default false)
    RETURNS json
    LANGUAGE plpgsql
AS $$
BEGIN
    -- check if postgres role is service_role
    if current_user IN ('anon', 'authenticated') and
       not (select current_user_account_role(update_account.account_id) ->> 'account_role' = 'owner') then
        raise exception 'Only account owners can update an account';
    end if;

    update basejump.accounts accounts
    set slug            = coalesce(update_account.slug, accounts.slug),
        name            = coalesce(update_account.name, accounts.name),
        metadata = case
                       when update_account.metadata is null then accounts.metadata -- do nothing
                       when accounts.metadata IS NULL then update_account.metadata -- set metadata
                       when update_account.replace_metadata
                           then update_account.metadata -- replace metadata
                       else accounts.metadata || update_account.metadata end -- merge metadata
    where accounts.id = update_account.account_id;

    return public.get_account(account_id);
END;
$$;
