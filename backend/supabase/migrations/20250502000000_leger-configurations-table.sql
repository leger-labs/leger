/**
      __                       
     / /                       
    / /     ___  __ _  ___ ___ 
   / /     / _ \/ _` |/ _ / __|
  / /___  |  __/ (_| |  __\__ \
 /_____/   \___|\__, |\___/___/
                 __/ |         
                |___/          

     Leger Configuration Tables
     This migration creates the configuration-centric tables for Leger's requirements.
 */

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/**
  * -------------------------------------------------------
  * Section - Configuration Tables
  * -------------------------------------------------------
 */

-- Create the main configurations table
CREATE TABLE IF NOT EXISTS public.configurations (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES basejump.accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    config_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create the configuration versions table for tracking history
CREATE TABLE IF NOT EXISTS public.configuration_versions (
    version_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID NOT NULL REFERENCES public.configurations(config_id) ON DELETE CASCADE,
    version INT NOT NULL,
    config_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_by UUID REFERENCES auth.users(id),
    change_description TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_configurations_account_id ON public.configurations(account_id);
CREATE INDEX idx_configurations_is_template ON public.configurations(is_template);
CREATE INDEX idx_configuration_versions_config_id ON public.configuration_versions(config_id);
CREATE INDEX idx_configuration_versions_version ON public.configuration_versions(version);

/**
  * -------------------------------------------------------
  * Section - Triggers
  * -------------------------------------------------------
 */

-- Create trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_configuration_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to track configuration user changes
CREATE OR REPLACE FUNCTION public.track_configuration_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.created_by = auth.uid();
        NEW.updated_by = auth.uid();
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to create a new version when configuration is updated
CREATE OR REPLACE FUNCTION public.create_configuration_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment version number
    NEW.version = OLD.version + 1;
    
    -- Insert the previous version into the versions table
    INSERT INTO public.configuration_versions(
        config_id,
        version,
        config_data,
        created_by,
        change_description
    ) VALUES (
        OLD.config_id,
        OLD.version,
        OLD.config_data,
        auth.uid(),
        'Version update'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the update timestamp trigger
CREATE TRIGGER update_configurations_timestamp
BEFORE UPDATE ON public.configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_configuration_timestamp();

-- Create the user tracking trigger
CREATE TRIGGER track_configurations_user_changes
BEFORE INSERT OR UPDATE ON public.configurations
FOR EACH ROW
EXECUTE FUNCTION public.track_configuration_user_changes();

-- Create the versioning trigger
CREATE TRIGGER create_configuration_version
BEFORE UPDATE OF config_data ON public.configurations
FOR EACH ROW
EXECUTE FUNCTION public.create_configuration_version();

/**
  * -------------------------------------------------------
  * Section - RLS Policies
  * -------------------------------------------------------
 */

-- Enable Row Level Security
ALTER TABLE public.configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuration_versions ENABLE ROW LEVEL SECURITY;

-- Configuration select policy
CREATE POLICY "Configurations are viewable by account members" ON public.configurations
    FOR SELECT
    USING (
        is_public = TRUE OR is_template = TRUE OR
        basejump.has_role_on_account(account_id) = true
    );

-- Configuration insert policy
CREATE POLICY "Configurations can be created by account members" ON public.configurations
    FOR INSERT
    WITH CHECK (
        basejump.has_role_on_account(account_id) = true
    );

-- Configuration update policy
CREATE POLICY "Configurations can be updated by account members" ON public.configurations
    FOR UPDATE
    USING (
        basejump.has_role_on_account(account_id) = true
    );

-- Configuration delete policy
CREATE POLICY "Configurations can be deleted by account owners" ON public.configurations
    FOR DELETE
    USING (
        basejump.has_role_on_account(account_id, 'owner') = true
    );

-- Configuration version select policy
CREATE POLICY "Configuration versions are viewable by account members" ON public.configuration_versions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.configurations c
            WHERE c.config_id = configuration_versions.config_id
            AND (c.is_public = TRUE OR c.is_template = TRUE OR
                 basejump.has_role_on_account(c.account_id) = true)
        )
    );

-- Configuration version insert policy
CREATE POLICY "Configuration versions can be created by system" ON public.configuration_versions
    FOR INSERT
    WITH CHECK (true); -- Allow system to create versions via trigger

/**
  * -------------------------------------------------------
  * Section - Functions
  * -------------------------------------------------------
 */

-- Function to get a configuration
CREATE OR REPLACE FUNCTION public.get_configuration(p_config_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'config_id', c.config_id,
        'account_id', c.account_id,
        'name', c.name,
        'description', c.description,
        'config_data', c.config_data,
        'is_template', c.is_template,
        'is_public', c.is_public,
        'version', c.version,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'created_by', c.created_by,
        'updated_by', c.updated_by
    ) INTO result
    FROM public.configurations c
    WHERE c.config_id = p_config_id
    AND (
        c.is_public = TRUE 
        OR c.is_template = TRUE 
        OR basejump.has_role_on_account(c.account_id) = true
    );
    
    IF result IS NULL THEN
        RAISE EXCEPTION 'Configuration not found or access denied';
    END IF;
    
    RETURN result;
END;
$$;

-- Function to create a new configuration
CREATE OR REPLACE FUNCTION public.create_configuration(
    p_account_id UUID,
    p_name TEXT,
    p_description TEXT DEFAULT NULL,
    p_config_data JSONB DEFAULT '{}'::jsonb,
    p_is_template BOOLEAN DEFAULT FALSE,
    p_is_public BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_config_id UUID;
    result JSONB;
BEGIN
    -- Check if the user has access to the account
    IF NOT basejump.has_role_on_account(p_account_id) THEN
        RAISE EXCEPTION 'You do not have permission to create configurations for this account';
    END IF;
    
    -- Insert the new configuration
    INSERT INTO public.configurations(
        account_id,
        name,
        description,
        config_data,
        is_template,
        is_public
    ) VALUES (
        p_account_id,
        p_name,
        p_description,
        p_config_data,
        p_is_template,
        p_is_public
    ) RETURNING config_id INTO v_config_id;
    
    -- Get the newly created configuration
    SELECT public.get_configuration(v_config_id) INTO result;
    
    RETURN result;
END;
$$;

-- Function to update a configuration
CREATE OR REPLACE FUNCTION public.update_configuration(
    p_config_id UUID,
    p_name TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_config_data JSONB DEFAULT NULL,
    p_is_template BOOLEAN DEFAULT NULL,
    p_is_public BOOLEAN DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_account_id UUID;
    result JSONB;
BEGIN
    -- Get the account_id for this configuration
    SELECT c.account_id
    INTO v_account_id
    FROM public.configurations c
    WHERE c.config_id = p_config_id;
    
    -- Check if configuration exists
    IF v_account_id IS NULL THEN
        RAISE EXCEPTION 'Configuration not found';
    END IF;
    
    -- Check if user has access to the account
    IF NOT basejump.has_role_on_account(v_account_id) THEN
        RAISE EXCEPTION 'You do not have permission to update this configuration';
    END IF;
    
    -- Update the configuration, only changing provided fields
    UPDATE public.configurations
    SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        config_data = CASE 
            WHEN p_config_data IS NOT NULL THEN p_config_data 
            ELSE config_data 
        END,
        is_template = COALESCE(p_is_template, is_template),
        is_public = COALESCE(p_is_public, is_public)
    WHERE config_id = p_config_id;
    
    -- Get the updated configuration
    SELECT public.get_configuration(p_config_id) INTO result;
    
    RETURN result;
END;
$$;

-- Function to get configuration versions
CREATE OR REPLACE FUNCTION public.get_configuration_versions(
    p_config_id UUID,
    p_limit INT DEFAULT 10,
    p_offset INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_account_id UUID;
    result JSONB;
BEGIN
    -- Get the account_id for this configuration
    SELECT c.account_id
    INTO v_account_id
    FROM public.configurations c
    WHERE c.config_id = p_config_id;
    
    -- Check if configuration exists
    IF v_account_id IS NULL THEN
        RAISE EXCEPTION 'Configuration not found';
    END IF;
    
    -- Check if user has access to the account
    IF NOT (
        EXISTS (
            SELECT 1 
            FROM public.configurations c
            WHERE c.config_id = p_config_id
            AND (c.is_public = TRUE OR c.is_template = TRUE)
        ) OR 
        basejump.has_role_on_account(v_account_id)
    ) THEN
        RAISE EXCEPTION 'You do not have permission to view this configuration';
    END IF;
    
    -- Get the versions
    SELECT jsonb_build_object(
        'config_id', p_config_id,
        'total_versions', (
            SELECT COUNT(*) 
            FROM public.configuration_versions
            WHERE config_id = p_config_id
        ),
        'versions', COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'version_id', v.version_id,
                    'version', v.version,
                    'created_at', v.created_at,
                    'created_by', v.created_by,
                    'change_description', v.change_description
                )
                ORDER BY v.version DESC
            ),
            '[]'::jsonb
        )
    ) INTO result
    FROM public.configuration_versions v
    WHERE v.config_id = p_config_id
    LIMIT p_limit OFFSET p_offset;
    
    RETURN result;
END;
$$;

-- Function to get a specific configuration version
CREATE OR REPLACE FUNCTION public.get_configuration_version(
    p_version_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_account_id UUID;
    v_config_id UUID;
    result JSONB;
BEGIN
    -- Get the config_id for this version
    SELECT v.config_id
    INTO v_config_id
    FROM public.configuration_versions v
    WHERE v.version_id = p_version_id;
    
    -- Check if version exists
    IF v_config_id IS NULL THEN
        RAISE EXCEPTION 'Version not found';
    END IF;
    
    -- Get the account_id for this configuration
    SELECT c.account_id
    INTO v_account_id
    FROM public.configurations c
    WHERE c.config_id = v_config_id;
    
    -- Check if user has access to the account
    IF NOT (
        EXISTS (
            SELECT 1 
            FROM public.configurations c
            WHERE c.config_id = v_config_id
            AND (c.is_public = TRUE OR c.is_template = TRUE)
        ) OR 
        basejump.has_role_on_account(v_account_id)
    ) THEN
        RAISE EXCEPTION 'You do not have permission to view this configuration version';
    END IF;
    
    -- Get the version details
    SELECT jsonb_build_object(
        'version_id', v.version_id,
        'config_id', v.config_id,
        'version', v.version,
        'config_data', v.config_data,
        'created_at', v.created_at,
        'created_by', v.created_by,
        'change_description', v.change_description
    ) INTO result
    FROM public.configuration_versions v
    WHERE v.version_id = p_version_id;
    
    RETURN result;
END;
$$;

-- Function to restore a configuration to a previous version
CREATE OR REPLACE FUNCTION public.restore_configuration_version(
    p_config_id UUID,
    p_version_id UUID,
    p_change_description TEXT DEFAULT 'Restored from previous version'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_account_id UUID;
    v_config_data JSONB;
    result JSONB;
BEGIN
    -- Get the account_id for this configuration
    SELECT c.account_id
    INTO v_account_id
    FROM public.configurations c
    WHERE c.config_id = p_config_id;
    
    -- Check if configuration exists
    IF v_account_id IS NULL THEN
        RAISE EXCEPTION 'Configuration not found';
    END IF;
    
    -- Check if user has access to the account
    IF NOT basejump.has_role_on_account(v_account_id) THEN
        RAISE EXCEPTION 'You do not have permission to update this configuration';
    END IF;
    
    -- Get the version data
    SELECT v.config_data
    INTO v_config_data
    FROM public.configuration_versions v
    WHERE v.version_id = p_version_id AND v.config_id = p_config_id;
    
    -- Check if version exists
    IF v_config_data IS NULL THEN
        RAISE EXCEPTION 'Version not found for this configuration';
    END IF;
    
    -- Create a new version record with the current state before restoring
    INSERT INTO public.configuration_versions(
        config_id,
        version,
        config_data,
        created_by,
        change_description
    )
    SELECT
        c.config_id,
        c.version,
        c.config_data,
        auth.uid(),
        'State before restoring to version ' || p_version_id::text
    FROM public.configurations c
    WHERE c.config_id = p_config_id;
    
    -- Update the configuration with the version data
    UPDATE public.configurations
    SET
        config_data = v_config_data,
        version = version + 1
    WHERE config_id = p_config_id;
    
    -- Get the updated configuration
    SELECT public.get_configuration(p_config_id) INTO result;
    
    RETURN result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_configuration(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_configuration(UUID, TEXT, TEXT, JSONB, BOOLEAN, BOOLEAN) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_configuration(UUID, TEXT, TEXT, JSONB, BOOLEAN, BOOLEAN) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_configuration_versions(UUID, INT, INT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_configuration_version(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.restore_configuration_version(UUID, UUID, TEXT) TO authenticated, service_role;

-- Grant table permissions
GRANT ALL ON TABLE public.configurations TO authenticated, service_role;
GRANT ALL ON TABLE public.configuration_versions TO authenticated, service_role;
