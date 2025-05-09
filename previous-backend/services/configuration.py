"""
Configuration Management API endpoints for Leger.

This module provides endpoints for configuration management, including:
- Creating, reading, updating and deleting configurations
- Managing configuration templates
- Ensuring proper access control and validation
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Path
from typing import Optional, Dict, Any, List
from uuid import UUID
from models.configuration import (
    ConfigurationCreate, ConfigurationUpdate, ConfigurationResponse,
    TemplateCreateRequest, TemplateApplyRequest
)
from services.supabase import DBConnection
from utils.auth_utils import get_current_user_id_from_jwt
from utils.logger import logger
from services.subscription_utils import can_create_configuration, can_share_configuration

router = APIRouter(prefix="/configurations", tags=["configurations"])

# Configuration CRUD Endpoints
@router.get("", response_model=List[ConfigurationResponse])
async def list_configurations(
    account_id: Optional[UUID] = None,
    include_templates: bool = False,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    List configurations for an account.
    
    By default, this only returns regular configurations (not templates).
    Use include_templates=True to also include templates.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        if not account_id:
            # Get personal account ID if no account ID specified
            account_id = current_user_id
        
        # Check if user has access to this account
        account_response = await client.rpc(
            'current_user_account_role',
            {'account_id': str(account_id)}
        ).execute()
        
        if account_response.error:
            raise HTTPException(status_code=403, detail="You do not have access to this account")
        
        # List configurations
        config_list = await db.list_account_configurations(
            str(account_id),
            include_templates,
            limit,
            offset
        )
        
        if config_list is None:
            raise HTTPException(status_code=500, detail="Failed to retrieve configurations")
        
        return config_list
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing configurations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=ConfigurationResponse)
async def create_configuration(
    config: ConfigurationCreate,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Create a new configuration.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Check if user has access to this account
        account_response = await client.rpc(
            'current_user_account_role',
            {'account_id': str(config.account_id)}
        ).execute()
        
        if account_response.error:
            raise HTTPException(status_code=403, detail="You do not have access to this account")
        
        # Check if user can create more configurations (subscription/quota check)
        can_create, message = await can_create_configuration(str(config.account_id))
        if not can_create:
            raise HTTPException(status_code=403, detail=message)
        
        # For templates, check if user can share configurations
        if config.is_template:
            can_share, message = await can_share_configuration(str(config.account_id))
            if not can_share:
                raise HTTPException(status_code=403, detail=message)
        
        # Create the configuration
        created_config = await db.create_configuration(
            str(config.account_id),
            config.name,
            config.description,
            config.config_data,
            config.is_template,
            config.is_public
        )
        
        if created_config is None:
            raise HTTPException(status_code=500, detail="Failed to create configuration")
        
        return created_config
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating configuration: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{config_id}", response_model=ConfigurationResponse)
async def get_configuration(
    config_id: UUID = Path(..., description="The ID of the configuration to retrieve"),
    current_user_id: Optional[str] = Depends(get_current_user_id_from_jwt)
):
    """
    Get a specific configuration by ID.
    
    This endpoint supports both authenticated and unauthenticated access,
    allowing public configurations to be retrieved without authentication.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get the configuration
        configuration = await db.get_configuration(str(config_id))
        
        if configuration is None:
            raise HTTPException(status_code=404, detail="Configuration not found")
        
        return configuration
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving configuration {config_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{config_id}", response_model=ConfigurationResponse)
async def update_configuration(
    config_id: UUID,
    config_update: ConfigurationUpdate,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Update an existing configuration.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get the configuration to check ownership
        existing_config = await db.get_configuration(str(config_id))
        
        if existing_config is None:
            raise HTTPException(status_code=404, detail="Configuration not found")
        
        # Check if user has access to the account that owns this configuration
        account_id = existing_config.get("account_id")
        if account_id:
            account_response = await client.rpc(
                'current_user_account_role',
                {'account_id': account_id}
            ).execute()
            
            if account_response.error:
                raise HTTPException(status_code=403, detail="You do not have permission to update this configuration")
        
        # For templates, check if user can share configurations
        if config_update.is_template and config_update.is_template != existing_config.get("is_template"):
            can_share, message = await can_share_configuration(account_id)
            if not can_share:
                raise HTTPException(status_code=403, detail=message)
        
        # Update the configuration
        updated_config = await db.update_configuration(
            str(config_id),
            config_update.name,
            config_update.description,
            config_update.config_data,
            config_update.is_template,
            config_update.is_public
        )
        
        if updated_config is None:
            raise HTTPException(status_code=500, detail="Failed to update configuration")
        
        return updated_config
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating configuration {config_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{config_id}")
async def delete_configuration(
    config_id: UUID,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Delete a configuration.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get the configuration to check ownership
        existing_config = await db.get_configuration(str(config_id))
        
        if existing_config is None:
            raise HTTPException(status_code=404, detail="Configuration not found")
        
        # Check if user has access to the account that owns this configuration
        account_id = existing_config.get("account_id")
        if account_id:
            account_response = await client.rpc(
                'current_user_account_role',
                {'account_id': account_id}
            ).execute()
            
            if account_response.error:
                raise HTTPException(status_code=403, detail="You do not have permission to delete this configuration")
        
        # Delete the configuration using RLS policy (SQL deletion)
        result = await client.table('configurations').delete().eq('config_id', str(config_id)).execute()
        
        if result.error:
            raise HTTPException(status_code=400, detail=result.error.message)
        
        return {"success": True, "message": "Configuration deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting configuration {config_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Template Management Endpoints
@router.get("/templates/public", response_model=List[ConfigurationResponse])
async def list_public_templates(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    List public template configurations.
    
    This endpoint allows accessing public templates without authentication.
    """
    try:
        db = DBConnection()
        
        # List template configurations
        templates = await db.list_template_configurations(limit, offset)
        
        if templates is None:
            return []
        
        # Filter to only include public templates
        public_templates = [template for template in templates if template.get("is_public")]
        
        return public_templates
    
    except Exception as e:
        logger.error(f"Error listing public templates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/templates/create", response_model=ConfigurationResponse)
async def create_template(
    request: TemplateCreateRequest,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Create a template from an existing configuration.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get the source configuration
        source_config = await db.get_configuration(str(request.config_id))
        
        if source_config is None:
            raise HTTPException(status_code=404, detail="Source configuration not found")
        
        # Check if user has access to the account that owns this configuration
        account_id = source_config.get("account_id")
        if account_id:
            account_response = await client.rpc(
                'current_user_account_role',
                {'account_id': account_id}
            ).execute()
            
            if account_response.error:
                raise HTTPException(status_code=403, detail="You do not have permission to use this configuration")
        
        # Check if user can share configurations (required for templates)
        can_share, message = await can_share_configuration(account_id)
        if not can_share:
            raise HTTPException(status_code=403, detail=message)
        
        # Create template configuration
        template_name = request.name or f"{source_config.get('name')} Template"
        template_desc = request.description or f"Template created from {source_config.get('name')}"
        
        created_template = await db.create_configuration(
            account_id,
            template_name,
            template_desc,
            source_config.get("config_data"),
            True,  # is_template = True
            request.is_public
        )
        
        if created_template is None:
            raise HTTPException(status_code=500, detail="Failed to create template")
        
        return created_template
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating template: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/templates/apply", response_model=ConfigurationResponse)
async def apply_template(
    request: TemplateApplyRequest,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Apply a template to create a new configuration.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get the template configuration
        template = await db.get_configuration(str(request.template_id))
        
        if template is None:
            raise HTTPException(status_code=404, detail="Template not found")
        
        if not template.get("is_template"):
            raise HTTPException(status_code=400, detail="Specified configuration is not a template")
        
        # Check if this is a public template or if user has access to it
        is_public = template.get("is_public")
        if not is_public:
            template_account_id = template.get("account_id")
            if template_account_id:
                account_response = await client.rpc(
                    'current_user_account_role',
                    {'account_id': template_account_id}
                ).execute()
                
                if account_response.error:
                    raise HTTPException(status_code=403, detail="You do not have permission to use this template")
        
        # Get the user's personal account ID
        account_id = current_user_id
        
        # Check if user can create more configurations
        can_create, message = await can_create_configuration(account_id)
        if not can_create:
            raise HTTPException(status_code=403, detail=message)
        
        # Prepare configuration data
        config_data = template.get("config_data", {})
        
        # Apply overrides if provided
        if request.config_data_overrides:
            config_data.update(request.config_data_overrides)
        
        # Create the new configuration from template
        created_config = await db.create_configuration(
            account_id,
            request.name,
            request.description,
            config_data,
            False,  # is_template = False
            False   # is_public = False
        )
        
        if created_config is None:
            raise HTTPException(status_code=500, detail="Failed to create configuration from template")
        
        return created_config
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error applying template: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
