"""
Account Management API endpoints for Leger.

This module provides endpoints for account management, including:
- User profile management
- Account creation and management
- Team management
- Invitation handling
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Response
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, EmailStr
from utils.logger import logger
from utils.config import config
from services.supabase import DBConnection
from utils.auth_utils import get_current_user_id_from_jwt

router = APIRouter(prefix="/accounts", tags=["accounts"])

# Pydantic models for request/response validation
class UpdateUserProfileRequest(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None

class AccountRequest(BaseModel):
    name: str
    slug: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class UpdateAccountRequest(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    replace_metadata: bool = False

class InviteRequest(BaseModel):
    account_id: str
    role: str = Field(..., regex='^(owner|member)$')
    invitation_type: str = Field(..., regex='^(one_time|24_hour)$')

class AccountMember(BaseModel):
    user_id: str
    account_role: str
    name: Optional[str] = None
    email: str
    is_primary_owner: bool

class AccountInvitation(BaseModel):
    account_role: str
    created_at: str
    invitation_type: str
    invitation_id: str

# User Profile Endpoints
@router.get("/profile")
async def get_profile(current_user_id: str = Depends(get_current_user_id_from_jwt)):
    """
    Get the current user's profile information.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get user from Supabase Auth
        user_response = await client.auth.admin.get_user_by_id(current_user_id)
        
        if not user_response or not user_response.user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get personal account info
        personal_account_response = await client.rpc(
            'get_personal_account'
        ).execute()
        
        # Format and return the response
        return {
            "user": {
                "id": user_response.user.id,
                "email": user_response.user.email,
                "name": user_response.user.user_metadata.get("name"),
                "avatar_url": user_response.user.user_metadata.get("avatar_url"),
                "created_at": user_response.user.created_at
            },
            "personal_account": personal_account_response.data
        }
    
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/profile")
async def update_profile(
    request: UpdateUserProfileRequest,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Update the current user's profile information.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Build user metadata update
        metadata = {}
        if request.name is not None:
            metadata["name"] = request.name
        if request.avatar_url is not None:
            metadata["avatar_url"] = request.avatar_url
        
        # Update the user in Supabase Auth
        update_response = await client.auth.admin.update_user_by_id(
            current_user_id,
            {"user_metadata": metadata}
        )
        
        if not update_response or update_response.error:
            error_msg = update_response.error.message if update_response and update_response.error else "Unknown error"
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Get updated user
        user_response = await client.auth.admin.get_user_by_id(current_user_id)
        
        # Format and return the response
        return {
            "user": {
                "id": user_response.user.id,
                "email": user_response.user.email,
                "name": user_response.user.user_metadata.get("name"),
                "avatar_url": user_response.user.user_metadata.get("avatar_url"),
                "created_at": user_response.user.created_at
            }
        }
    
    except Exception as e:
        logger.error(f"Error updating user profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Account Management Endpoints
@router.get("/list")
async def list_accounts(current_user_id: str = Depends(get_current_user_id_from_jwt)):
    """
    List all accounts that the current user is a member of.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get accounts from Supabase
        accounts_response = await client.rpc(
            'get_accounts'
        ).execute()
        
        if accounts_response.error:
            raise HTTPException(status_code=400, detail=accounts_response.error.message)
        
        return {"accounts": accounts_response.data}
    
    except Exception as e:
        logger.error(f"Error listing accounts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def create_account(
    request: AccountRequest,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Create a new team account.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Create the account
        account_response = await client.rpc(
            'create_account',
            {
                'slug': request.slug,
                'name': request.name
            }
        ).execute()
        
        if account_response.error:
            raise HTTPException(status_code=400, detail=account_response.error.message)
        
        # Update account metadata if provided
        if request.metadata:
            account_id = account_response.data.get('account_id')
            if account_id:
                await client.rpc(
                    'update_account',
                    {
                        'account_id': account_id,
                        'public_metadata': request.metadata,
                        'replace_metadata': True
                    }
                ).execute()
        
        return account_response.data
    
    except Exception as e:
        logger.error(f"Error creating account: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{account_id}")
async def get_account(
    account_id: str,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Get details for a specific account.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get the account
        account_response = await client.rpc(
            'get_account',
            {'account_id': account_id}
        ).execute()
        
        if account_response.error:
            raise HTTPException(status_code=400, detail=account_response.error.message)
        
        if not account_response.data:
            raise HTTPException(status_code=404, detail="Account not found")
        
        return account_response.data
    
    except Exception as e:
        logger.error(f"Error getting account {account_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{account_id}")
async def update_account(
    account_id: str,
    request: UpdateAccountRequest,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Update an existing account.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Update the account
        update_params = {
            'account_id': account_id,
            'replace_metadata': request.replace_metadata
        }
        
        if request.name is not None:
            update_params['name'] = request.name
        if request.slug is not None:
            update_params['slug'] = request.slug
        if request.metadata is not None:
            update_params['public_metadata'] = request.metadata
        
        account_response = await client.rpc(
            'update_account',
            update_params
        ).execute()
        
        if account_response.error:
            raise HTTPException(status_code=400, detail=account_response.error.message)
        
        return account_response.data
    
    except Exception as e:
        logger.error(f"Error updating account {account_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Team Management Endpoints
@router.get("/{account_id}/members")
async def list_account_members(
    account_id: str,
    limit: int = 50,
    offset: int = 0,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    List all members of an account.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get account members
        members_response = await client.rpc(
            'get_account_members',
            {
                'account_id': account_id,
                'results_limit': limit,
                'results_offset': offset
            }
        ).execute()
        
        if members_response.error:
            raise HTTPException(status_code=400, detail=members_response.error.message)
        
        return {"members": members_response.data or []}
    
    except Exception as e:
        logger.error(f"Error listing members for account {account_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{account_id}/members/{user_id}")
async def remove_account_member(
    account_id: str,
    user_id: str,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Remove a member from an account.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Remove the member
        remove_response = await client.rpc(
            'remove_account_member',
            {
                'account_id': account_id,
                'user_id': user_id
            }
        ).execute()
        
        if remove_response.error:
            raise HTTPException(status_code=400, detail=remove_response.error.message)
        
        return {"success": True}
    
    except Exception as e:
        logger.error(f"Error removing member {user_id} from account {account_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{account_id}/members/{user_id}/role")
async def update_member_role(
    account_id: str,
    user_id: str,
    role: str = "member",
    make_primary_owner: bool = False,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Update a member's role in an account.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Validate role
        if role not in ["owner", "member"]:
            raise HTTPException(status_code=400, detail="Invalid role. Must be 'owner' or 'member'")
        
        # Update the member's role
        update_response = await client.rpc(
            'update_account_user_role',
            {
                'account_id': account_id,
                'user_id': user_id,
                'new_account_role': role,
                'make_primary_owner': make_primary_owner
            }
        ).execute()
        
        if update_response.error:
            raise HTTPException(status_code=400, detail=update_response.error.message)
        
        return {"success": True}
    
    except Exception as e:
        logger.error(f"Error updating role for member {user_id} in account {account_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Invitation Endpoints
@router.post("/{account_id}/invitations")
async def create_invitation(
    account_id: str,
    request: InviteRequest,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Create an invitation to join an account.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Validate parameters
        if request.role not in ["owner", "member"]:
            raise HTTPException(status_code=400, detail="Invalid role. Must be 'owner' or 'member'")
        
        if request.invitation_type not in ["one_time", "24_hour"]:
            raise HTTPException(status_code=400, detail="Invalid invitation type. Must be 'one_time' or '24_hour'")
        
        # Create the invitation
        invitation_response = await client.rpc(
            'create_invitation',
            {
                'account_id': account_id,
                'account_role': request.role,
                'invitation_type': request.invitation_type
            }
        ).execute()
        
        if invitation_response.error:
            raise HTTPException(status_code=400, detail=invitation_response.error.message)
        
        return invitation_response.data
    
    except Exception as e:
        logger.error(f"Error creating invitation for account {account_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{account_id}/invitations")
async def list_invitations(
    account_id: str,
    limit: int = 25,
    offset: int = 0,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    List all active invitations for an account.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get invitations
        invitations_response = await client.rpc(
            'get_account_invitations',
            {
                'account_id': account_id,
                'results_limit': limit,
                'results_offset': offset
            }
        ).execute()
        
        if invitations_response.error:
            raise HTTPException(status_code=400, detail=invitations_response.error.message)
        
        return {"invitations": invitations_response.data or []}
    
    except Exception as e:
        logger.error(f"Error listing invitations for account {account_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/invitations/{invitation_id}")
async def delete_invitation(
    invitation_id: str,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Delete an invitation.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Delete the invitation
        delete_response = await client.rpc(
            'delete_invitation',
            {'invitation_id': invitation_id}
        ).execute()
        
        if delete_response.error:
            raise HTTPException(status_code=400, detail=delete_response.error.message)
        
        return {"success": True}
    
    except Exception as e:
        logger.error(f"Error deleting invitation {invitation_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/invitations/accept")
async def accept_invitation(
    token: str,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Accept an invitation to join an account.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Accept the invitation
        accept_response = await client.rpc(
            'accept_invitation',
            {'lookup_invitation_token': token}
        ).execute()
        
        if accept_response.error:
            raise HTTPException(status_code=400, detail=accept_response.error.message)
        
        return accept_response.data
    
    except Exception as e:
        logger.error(f"Error accepting invitation with token {token}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/invitations/lookup")
async def lookup_invitation(
    token: str,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """
    Look up information about an invitation.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Look up the invitation
        lookup_response = await client.rpc(
            'lookup_invitation',
            {'lookup_invitation_token': token}
        ).execute()
        
        if lookup_response.error:
            raise HTTPException(status_code=400, detail=lookup_response.error.message)
        
        return lookup_response.data
    
    except Exception as e:
        logger.error(f"Error looking up invitation with token {token}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
