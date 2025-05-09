"""
Pydantic models for Configuration API.

This module defines the schema validation models for configuration
endpoints, ensuring proper data structure and type safety.
"""

from pydantic import BaseModel, Field, validator
from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID

class ConfigurationBase(BaseModel):
    """Base model for configuration data."""
    name: str = Field(..., description="Name of the configuration")
    description: Optional[str] = Field(None, description="Description of the configuration")
    config_data: Dict[str, Any] = Field(default_factory=dict, description="Configuration data stored as JSON")
    is_template: Optional[bool] = Field(False, description="Whether this is a template configuration")
    is_public: Optional[bool] = Field(False, description="Whether this configuration is publicly accessible")

class ConfigurationCreate(ConfigurationBase):
    """Model for creating a new configuration."""
    account_id: UUID = Field(..., description="Account ID that owns this configuration")

class ConfigurationUpdate(BaseModel):
    """Model for updating an existing configuration."""
    name: Optional[str] = Field(None, description="Name of the configuration")
    description: Optional[str] = Field(None, description="Description of the configuration")
    config_data: Optional[Dict[str, Any]] = Field(None, description="Configuration data stored as JSON")
    is_template: Optional[bool] = Field(None, description="Whether this is a template configuration")
    is_public: Optional[bool] = Field(None, description="Whether this configuration is publicly accessible")
    
    class Config:
        validate_assignment = True

    @validator('config_data')
    def validate_config_data(cls, v):
        """Ensure config_data is a valid JSON object."""
        if v is not None and not isinstance(v, dict):
            raise ValueError("config_data must be a valid JSON object")
        return v

class ConfigurationResponse(ConfigurationBase):
    """Model for configuration response data."""
    config_id: UUID = Field(..., description="Unique ID of the configuration")
    account_id: UUID = Field(..., description="Account ID that owns this configuration")
    version: int = Field(..., description="Current version number")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    created_by: Optional[UUID] = Field(None, description="User ID who created this configuration")
    updated_by: Optional[UUID] = Field(None, description="User ID who last updated this configuration")

class ConfigurationVersionBase(BaseModel):
    """Base model for configuration version data."""
    version: int = Field(..., description="Version number")
    config_data: Dict[str, Any] = Field(..., description="Configuration data for this version")
    created_at: datetime = Field(..., description="Version creation timestamp")
    created_by: Optional[UUID] = Field(None, description="User ID who created this version")
    change_description: Optional[str] = Field(None, description="Description of changes made in this version")

class ConfigurationVersionResponse(ConfigurationVersionBase):
    """Model for configuration version response data."""
    version_id: UUID = Field(..., description="Unique ID of the version")
    config_id: UUID = Field(..., description="ID of the configuration this version belongs to")

class ConfigurationVersionsResponse(BaseModel):
    """Model for listing multiple configuration versions."""
    config_id: UUID = Field(..., description="ID of the configuration")
    total_versions: int = Field(..., description="Total number of versions")
    versions: List[ConfigurationVersionResponse] = Field(..., description="List of versions")

class ConfigurationRestoreRequest(BaseModel):
    """Model for restoring a configuration to a previous version."""
    version_id: UUID = Field(..., description="ID of the version to restore to")
    change_description: Optional[str] = Field("Restored from previous version", 
                                           description="Description of the restoration action")

class TemplateCreateRequest(BaseModel):
    """Model for creating a template from an existing configuration."""
    config_id: UUID = Field(..., description="ID of the configuration to use as template")
    name: Optional[str] = Field(None, description="New name for the template (defaults to original name)")
    description: Optional[str] = Field(None, description="New description for the template")
    is_public: Optional[bool] = Field(False, description="Whether this template should be public")

class TemplateApplyRequest(BaseModel):
    """Model for applying a template to create a new configuration."""
    template_id: UUID = Field(..., description="ID of the template to apply")
    name: str = Field(..., description="Name for the new configuration")
    description: Optional[str] = Field(None, description="Description for the new configuration")
    config_data_overrides: Optional[Dict[str, Any]] = Field(None, 
                                                         description="Optional overrides for template data")
