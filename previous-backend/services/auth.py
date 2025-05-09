"""
Authentication API endpoints for Leger.

This module provides endpoints for user authentication, including:
- Login and signup
- Password reset
- JWT validation and refresh
- Session management

All authentication is handled through Supabase Auth.
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Response
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr
from utils.logger import logger
from utils.config import config
from services.supabase import DBConnection
from utils.auth_utils import get_current_user_id_from_jwt

router = APIRouter(prefix="/auth", tags=["authentication"])

# Pydantic models for request/response validation
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordUpdateRequest(BaseModel):
    new_password: str = Field(..., min_length=6)
    token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    created_at: str

class AuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str
    expires_at: int

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """
    Create a new user account.
    
    This endpoint registers a new user with Supabase Auth and creates
    a corresponding personal account in the database.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Register the user with Supabase Auth
        auth_response = await client.auth.sign_up({
            "email": request.email,
            "password": request.password
        })
        
        if auth_response.error:
            logger.error(f"Signup error: {auth_response.error.message}")
            raise HTTPException(status_code=400, detail=auth_response.error.message)
        
        if not auth_response.user:
            raise HTTPException(status_code=500, detail="User creation failed")
        
        # Update user metadata if name is provided
        if request.name:
            await client.auth.admin.update_user_by_id(
                auth_response.user.id,
                {"user_metadata": {"name": request.name}}
            )
        
        # Format and return the response
        # Note: The personal account creation is handled by the Supabase trigger (run_new_user_setup)
        user_data = {
            "id": auth_response.user.id,
            "email": auth_response.user.email,
            "name": request.name or auth_response.user.user_metadata.get("name"),
            "created_at": auth_response.user.created_at
        }
        
        return {
            "user": user_data,
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "expires_at": auth_response.session.expires_at
        }
    
    except Exception as e:
        logger.error(f"Error during signup: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Authenticate a user and return session tokens.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Authenticate the user with Supabase Auth
        auth_response = await client.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if auth_response.error:
            logger.error(f"Login error: {auth_response.error.message}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Format and return the response
        user_data = {
            "id": auth_response.user.id,
            "email": auth_response.user.email,
            "name": auth_response.user.user_metadata.get("name"),
            "created_at": auth_response.user.created_at
        }
        
        return {
            "user": user_data,
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "expires_at": auth_response.session.expires_at
        }
    
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh an existing session with a valid refresh token.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Refresh the token with Supabase Auth
        refresh_response = await client.auth.refresh_session(
            refresh_token=request.refresh_token
        )
        
        if refresh_response.error:
            logger.error(f"Token refresh error: {refresh_response.error.message}")
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        # Format and return the response
        return {
            "access_token": refresh_response.session.access_token,
            "refresh_token": refresh_response.session.refresh_token,
            "expires_at": refresh_response.session.expires_at
        }
    
    except Exception as e:
        logger.error(f"Error during token refresh: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reset-password")
async def reset_password(request: PasswordResetRequest):
    """
    Send a password reset email to the user.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Send the password reset email through Supabase Auth
        reset_response = await client.auth.reset_password_email(
            email=request.email
        )
        
        if reset_response.error:
            logger.error(f"Password reset error: {reset_response.error.message}")
            # Don't reveal if the email exists or not for security
            pass
        
        return {"message": "If the email exists, a password reset link has been sent"}
    
    except Exception as e:
        logger.error(f"Error during password reset: {str(e)}")
        # Don't reveal the error details for security
        return {"message": "If the email exists, a password reset link has been sent"}

@router.post("/update-password")
async def update_password(request: PasswordUpdateRequest):
    """
    Update a user's password using a reset token.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Update the password with Supabase Auth
        update_response = await client.auth.exchange_code_for_session({
            "type": "recovery",
            "token": request.token,
            "new_password": request.new_password
        })
        
        if update_response.error:
            logger.error(f"Password update error: {update_response.error.message}")
            raise HTTPException(status_code=400, detail="Invalid or expired token")
        
        return {"message": "Password updated successfully"}
    
    except Exception as e:
        logger.error(f"Error during password update: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout(current_user_id: str = Depends(get_current_user_id_from_jwt)):
    """
    Invalidate the current user session.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Sign out the user with Supabase Auth
        await client.auth.sign_out()
        
        return {"message": "Successfully logged out"}
    
    except Exception as e:
        logger.error(f"Error during logout: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user")
async def get_current_user(current_user_id: str = Depends(get_current_user_id_from_jwt)):
    """
    Get the current authenticated user's information.
    """
    try:
        db = DBConnection()
        client = await db.client
        
        # Get the user from Supabase Auth
        user_response = await client.auth.admin.get_user_by_id(current_user_id)
        
        if not user_response or not user_response.user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Format and return the response
        user_data = {
            "id": user_response.user.id,
            "email": user_response.user.email,
            "name": user_response.user.user_metadata.get("name"),
            "created_at": user_response.user.created_at
        }
        
        return {"user": user_data}
    
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session")
async def verify_session(request: Request):
    """
    Verify that the current session is valid.
    """
    try:
        # This will throw an exception if the token is invalid
        current_user_id = await get_current_user_id_from_jwt(request)
        
        return {"valid": True, "user_id": current_user_id}
    
    except Exception as e:
        return {"valid": False, "error": str(e)}
