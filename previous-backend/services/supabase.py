"""
Centralized database connection management for Leger using Supabase.
This file maintains compatibility with the Basejump framework while
adapting it for Leger's configuration-centric model.
"""

import os
from typing import Optional, Dict, Any, List
from supabase import create_async_client, AsyncClient
from utils.logger import logger
from utils.config import config

class DBConnection:
    """Singleton database connection manager using Supabase."""
    
    _instance: Optional['DBConnection'] = None
    _initialized = False
    _client: Optional[AsyncClient] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """No initialization needed in __init__ as it's handled in __new__"""
        pass

    async def initialize(self):
        """Initialize the database connection."""
        if self._initialized:
            return
                
        try:
            supabase_url = config.SUPABASE_URL
            # Use service role key preferentially for backend operations
            supabase_key = config.SUPABASE_SERVICE_ROLE_KEY or config.SUPABASE_ANON_KEY
            
            if not supabase_url or not supabase_key:
                logger.error("Missing required environment variables for Supabase connection")
                raise RuntimeError("SUPABASE_URL and a key (SERVICE_ROLE_KEY or ANON_KEY) environment variables must be set.")

            logger.debug("Initializing Supabase connection")
            self._client = await create_async_client(supabase_url, supabase_key)
            self._initialized = True
            key_type = "SERVICE_ROLE_KEY" if config.SUPABASE_SERVICE_ROLE_KEY else "ANON_KEY"
            logger.debug(f"Database connection initialized with Supabase using {key_type}")
        except Exception as e:
            logger.error(f"Database initialization error: {e}")
            raise RuntimeError(f"Failed to initialize database connection: {str(e)}")

    @classmethod
    async def disconnect(cls):
        """Disconnect from the database."""
        if cls._client:
            logger.info("Disconnecting from Supabase database")
            await cls._client.close()
            cls._initialized = False
            logger.info("Database disconnected successfully")

    @property
    async def client(self) -> AsyncClient:
        """Get the Supabase client instance."""
        if not self._initialized:
            logger.debug("Supabase client not initialized, initializing now")
            await self.initialize()
        if not self._client:
            logger.error("Database client is None after initialization")
            raise RuntimeError("Database not initialized")
        return self._client

    # Configuration-specific utility methods
    async def get_configuration(self, config_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific configuration by ID.
        
        Args:
            config_id: The ID of the configuration to retrieve
            
        Returns:
            Optional[Dict[str, Any]]: The configuration data, or None if not found
        """
        try:
            client = await self.client
            response = await client.rpc('get_configuration', {'p_config_id': config_id}).execute()
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Error retrieving configuration {config_id}: {str(e)}")
            return None
    
    async def create_configuration(
        self, 
        account_id: str, 
        name: str, 
        description: str = None, 
        config_data: Dict[str, Any] = None, 
        is_template: bool = False,
        is_public: bool = False
    ) -> Optional[Dict[str, Any]]:
        """
        Create a new configuration.
        
        Args:
            account_id: The account ID that owns this configuration
            name: The name of the configuration
            description: Optional description
            config_data: Optional initial configuration data
            is_template: Whether this is a template configuration
            is_public: Whether this configuration is public
            
        Returns:
            Optional[Dict[str, Any]]: The created configuration, or None if creation failed
        """
        try:
            client = await self.client
            
            # Default empty config data if none provided
            if config_data is None:
                config_data = {}
                
            # Create the configuration using the RPC function
            response = await client.rpc(
                'create_configuration', 
                {
                    'p_account_id': account_id,
                    'p_name': name,
                    'p_description': description,
                    'p_config_data': config_data,
                    'p_is_template': is_template,
                    'p_is_public': is_public
                }
            ).execute()
            
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Error creating configuration for account {account_id}: {str(e)}")
            return None
    
    async def update_configuration(
        self,
        config_id: str,
        name: str = None,
        description: str = None,
        config_data: Dict[str, Any] = None,
        is_template: bool = None,
        is_public: bool = None
    ) -> Optional[Dict[str, Any]]:
        """
        Update an existing configuration.
        
        Args:
            config_id: The ID of the configuration to update
            name: Optional new name
            description: Optional new description
            config_data: Optional new configuration data
            is_template: Optional new template status
            is_public: Optional new public status
            
        Returns:
            Optional[Dict[str, Any]]: The updated configuration, or None if update failed
        """
        try:
            client = await self.client
            
            # Create the update parameter dictionary
            update_params = {
                'p_config_id': config_id
            }
            
            # Add optional parameters if provided
            if name is not None:
                update_params['p_name'] = name
            if description is not None:
                update_params['p_description'] = description
            if config_data is not None:
                update_params['p_config_data'] = config_data
            if is_template is not None:
                update_params['p_is_template'] = is_template
            if is_public is not None:
                update_params['p_is_public'] = is_public
                
            # Update the configuration using the RPC function
            response = await client.rpc('update_configuration', update_params).execute()
            
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Error updating configuration {config_id}: {str(e)}")
            return None
    
    async def get_configuration_versions(
        self,
        config_id: str,
        limit: int = 10,
        offset: int = 0
    ) -> Optional[Dict[str, Any]]:
        """
        Get the version history of a configuration.
        
        Args:
            config_id: The ID of the configuration
            limit: Maximum number of versions to retrieve
            offset: Offset for pagination
            
        Returns:
            Optional[Dict[str, Any]]: The version history, or None if retrieval failed
        """
        try:
            client = await self.client
            
            response = await client.rpc(
                'get_configuration_versions', 
                {
                    'p_config_id': config_id,
                    'p_limit': limit,
                    'p_offset': offset
                }
            ).execute()
            
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Error retrieving versions for configuration {config_id}: {str(e)}")
            return None
    
    async def get_configuration_version(self, version_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific configuration version.
        
        Args:
            version_id: The ID of the version to retrieve
            
        Returns:
            Optional[Dict[str, Any]]: The version data, or None if not found
        """
        try:
            client = await self.client
            
            response = await client.rpc(
                'get_configuration_version', 
                {
                    'p_version_id': version_id
                }
            ).execute()
            
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Error retrieving configuration version {version_id}: {str(e)}")
            return None
    
    async def restore_configuration_version(
        self,
        config_id: str,
        version_id: str,
        change_description: str = "Restored from previous version"
    ) -> Optional[Dict[str, Any]]:
        """
        Restore a configuration to a previous version.
        
        Args:
            config_id: The ID of the configuration to update
            version_id: The ID of the version to restore
            change_description: Description of the restoration
            
        Returns:
            Optional[Dict[str, Any]]: The updated configuration, or None if restoration failed
        """
        try:
            client = await self.client
            
            response = await client.rpc(
                'restore_configuration_version', 
                {
                    'p_config_id': config_id,
                    'p_version_id': version_id,
                    'p_change_description': change_description
                }
            ).execute()
            
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Error restoring configuration {config_id} to version {version_id}: {str(e)}")
            return None
    
    async def list_account_configurations(
        self, 
        account_id: str,
        include_templates: bool = False,
        limit: int = 50,
        offset: int = 0
    ) -> Optional[List[Dict[str, Any]]]:
        """
        List configurations for an account.
        
        Args:
            account_id: The account ID to list configurations for
            include_templates: Whether to include template configurations
            limit: Maximum number of configurations to retrieve
            offset: Offset for pagination
            
        Returns:
            Optional[List[Dict[str, Any]]]: List of configurations, or None if retrieval failed
        """
        try:
            client = await self.client
            
            # Build the query
            query = client.table('configurations').select('*').eq('account_id', account_id)
            
            # Filter out templates if not included
            if not include_templates:
                query = query.eq('is_template', False)
                
            # Add limit and offset for pagination
            query = query.limit(limit).offset(offset).order('updated_at', desc=True)
            
            # Execute the query
            response = await query.execute()
            
            if response.data:
                return response.data
            return []
        except Exception as e:
            logger.error(f"Error listing configurations for account {account_id}: {str(e)}")
            return None
    
    async def list_template_configurations(
        self,
        limit: int = 50,
        offset: int = 0
    ) -> Optional[List[Dict[str, Any]]]:
        """
        List template configurations that are available to all users.
        
        Args:
            limit: Maximum number of templates to retrieve
            offset: Offset for pagination
            
        Returns:
            Optional[List[Dict[str, Any]]]: List of template configurations, or None if retrieval failed
        """
        try:
            client = await self.client
            
            # Build the query for templates
            query = client.table('configurations').select('*').eq('is_template', True).order('updated_at', desc=True)
                
            # Add limit and offset for pagination
            query = query.limit(limit).offset(offset)
            
            # Execute the query
            response = await query.execute()
            
            if response.data:
                return response.data
            return []
        except Exception as e:
            logger.error(f"Error listing template configurations: {str(e)}")
            return None
            
    # Account-related utility methods 
    async def get_account_user_role(self, user_id: str, account_id: str) -> Optional[str]:
        """
        Get the role of a user in an account.
        
        Args:
            user_id: The user ID
            account_id: The account ID
            
        Returns:
            Optional[str]: The role ('owner' or 'member'), or None if user is not a member
        """
        try:
            client = await self.client
            
            # Query the account user table
            response = await client.schema('basejump').from_('account_user').select('account_role').eq('user_id', user_id).eq('account_id', account_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]['account_role']
            return None
        except Exception as e:
            logger.error(f"Error getting user role for user {user_id} in account {account_id}: {str(e)}")
            return None
    
    async def get_account_info(self, account_id: str) -> Optional[Dict[str, Any]]:
        """
        Get basic information about an account.
        
        Args:
            account_id: The account ID
            
        Returns:
            Optional[Dict[str, Any]]: The account information, or None if not found
        """
        try:
            client = await self.client
            
            # Use the custom RPC function for account info
            response = await client.rpc('get_account', {'account_id': account_id}).execute()
            
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Error getting account info for account {account_id}: {str(e)}")
            return None
    
    async def list_user_accounts(self, user_id: str) -> Optional[List[Dict[str, Any]]]:
        """
        List all accounts that a user is a member of.
        
        Args:
            user_id: The user ID
            
        Returns:
            Optional[List[Dict[str, Any]]]: List of accounts, or None if retrieval failed
        """
        try:
            client = await self.client
            
            # Use the custom RPC function for account list
            response = await client.rpc('get_accounts').execute()
            
            if response.data:
                return response.data
            return []
        except Exception as e:
            logger.error(f"Error listing accounts for user {user_id}: {str(e)}")
            return None
