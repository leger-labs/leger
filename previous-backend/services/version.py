"""
Configuration Version Management API endpoints for Leger.

This module provides endpoints for managing configuration versions, including:
- Listing version history
- Retrieving specific versions
- Reverting to previous versions
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Path
from typing import Optional
from uuid import UUID
from models.configuration import (
    ConfigurationVersionResponse, ConfigurationVersionsResponse,
    ConfigurationRestoreRequest, ConfigurationResponse
)
from services.supabase import DBConnection
from utils.auth_utils import get_current_user_id_from_jwt
from utils.logger import logger

router = APIRouter(prefix="/versions", tags=["versions"])

@router.get("/latest/{config_id}", response_model=ConfigurationVersionResponse)
async def get_latest_version(
    config_id: UUID = Path(..., description="The ID of the configuration to get the latest version for"),
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Get the latest version of a configuration.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Check if configuration exists
        config = await db.get_configuration(str(config_id))
        if not config:
            raise HTTPException(status_code=404, detail="Configuration not found")
        
        # Get configuration versions (limit to 1 to get only the latest)
        versions = await db.get_configuration_versions(
            str(config_id),
            1,
            0
        )
        
        if versions is None or not versions.get("versions") or len(versions.get("versions", [])) == 0:
            raise HTTPException(status_code=404, detail="No versions found for this configuration")
        
        # Return the first (most recent) version
        return versions.get("versions")[0]
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving latest version for configuration {config_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/compare/{config_id}/{version_id}")
async def compare_versions(
    config_id: UUID,
    version_id: UUID,
    current_version_id: Optional[UUID] = None,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Compare two versions of a configuration.
    
    If current_version_id is not provided, compares with the latest version.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Check if configuration exists
        config = await db.get_configuration(str(config_id))
        if not config:
            raise HTTPException(status_code=404, detail="Configuration not found")
        
        # Get old version
        old_version = await db.get_configuration_version(str(version_id))
        if not old_version:
            raise HTTPException(status_code=404, detail="Version not found")
        
        # Get current version (either specified or latest)
        current_version = None
        if current_version_id:
            current_version = await db.get_configuration_version(str(current_version_id))
            if not current_version:
                raise HTTPException(status_code=404, detail="Current version not found")
        else:
            # Get the latest version
            versions = await db.get_configuration_versions(str(config_id), 1, 0)
            if versions and versions.get("versions") and len(versions.get("versions", [])) > 0:
                current_version = versions.get("versions")[0]
            else:
                raise HTTPException(status_code=404, detail="No current version found")
        
        # Verify both versions belong to this configuration
        if old_version.get("config_id") != str(config_id) or current_version.get("config_id") != str(config_id):
            raise HTTPException(status_code=400, detail="One or more versions do not belong to this configuration")
        
        # Build comparison response
        return {
            "config_id": str(config_id),
            "old_version": {
                "version_id": old_version.get("version_id"),
                "version": old_version.get("version"),
                "created_at": old_version.get("created_at"),
                "created_by": old_version.get("created_by"),
                "change_description": old_version.get("change_description")
            },
            "current_version": {
                "version_id": current_version.get("version_id"),
                "version": current_version.get("version"),
                "created_at": current_version.get("created_at"),
                "created_by": current_version.get("created_by"),
                "change_description": current_version.get("change_description")
            },
            "differences": {
                "added_keys": get_added_keys(old_version.get("config_data", {}), current_version.get("config_data", {})),
                "removed_keys": get_removed_keys(old_version.get("config_data", {}), current_version.get("config_data", {})),
                "modified_keys": get_modified_keys(old_version.get("config_data", {}), current_version.get("config_data", {}))
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error comparing versions for configuration {config_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions for version comparison
def get_added_keys(old_data: dict, new_data: dict) -> list:
    """Get keys that exist in new_data but not in old_data."""
    return list(set(new_data.keys()) - set(old_data.keys()))

def get_removed_keys(old_data: dict, new_data: dict) -> list:
    """Get keys that exist in old_data but not in new_data."""
    return list(set(old_data.keys()) - set(new_data.keys()))

def get_modified_keys(old_data: dict, new_data: dict) -> list:
    """Get keys that exist in both but have different values."""
    return [k for k in set(old_data.keys()) & set(new_data.keys()) 
            if old_data[k] != new_data[k]]get("/{config_id}", response_model=ConfigurationVersionsResponse)
async def list_versions(
    config_id: UUID = Path(..., description="The ID of the configuration to list versions for"),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    List version history for a configuration.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Check if configuration exists
        config = await db.get_configuration(str(config_id))
        if not config:
            raise HTTPException(status_code=404, detail="Configuration not found")
        
        # Get configuration versions
        versions = await db.get_configuration_versions(
            str(config_id),
            limit,
            offset
        )
        
        if versions is None:
            raise HTTPException(status_code=500, detail="Failed to retrieve versions")
        
        return versions
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing versions for configuration {config_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/single/{version_id}", response_model=ConfigurationVersionResponse)
async def get_version(
    version_id: UUID = Path(..., description="The ID of the version to retrieve"),
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Get a specific configuration version.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get the version
        version = await db.get_configuration_version(str(version_id))
        
        if version is None:
            raise HTTPException(status_code=404, detail="Version not found")
        
        return version
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving version {version_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{config_id}/restore", response_model=ConfigurationResponse)
async def restore_version(
    config_id: UUID,
    restore_request: ConfigurationRestoreRequest,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Restore a configuration to a previous version.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Check if configuration exists and user has access
        config = await db.get_configuration(str(config_id))
        if not config:
            raise HTTPException(status_code=404, detail="Configuration not found")
        
        # Check if user has access to the account that owns this configuration
        account_id = config.get("account_id")
        if account_id:
            account_response = await client.rpc(
                'current_user_account_role',
                {'account_id': account_id}
            ).execute()
            
            if account_response.error:
                raise HTTPException(status_code=403, detail="You do not have permission to modify this configuration")
        
        # Check if version exists
        version = await db.get_configuration_version(str(restore_request.version_id))
        if not version:
            raise HTTPException(status_code=404, detail="Version not found")
        
        # Verify version belongs to this configuration
        if version.get("config_id") != str(config_id):
            raise HTTPException(status_code=400, detail="Version does not belong to this configuration")
        
        # Restore to the specified version
        restored_config = await db.restore_configuration_version(
            str(config_id),
            str(restore_request.version_id),
            restore_request.change_description
        )
        
        if restored_config is None:
            raise HTTPException(status_code=500, detail="Failed to restore configuration")
        
        return restored_config
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error restoring version for configuration {config_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.
