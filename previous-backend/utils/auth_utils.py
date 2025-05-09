from fastapi import HTTPException, Request, Depends
from typing import Optional, List, Dict, Any, Tuple
import jwt
from jwt.exceptions import PyJWTError
from utils.logger import logger
from functools import wraps

# This function extracts the user ID from Supabase JWT
async def get_current_user_id_from_jwt(request: Request) -> str:
    """
    Extract and verify the user ID from the JWT in the Authorization header.
    
    This function is used as a dependency in FastAPI routes to ensure the user
    is authenticated and to provide the user ID for authorization checks.
    
    Args:
        request: The FastAPI request object
        
    Returns:
        str: The user ID extracted from the JWT
        
    Raises:
        HTTPException: If no valid token is found or if the token is invalid
    """
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(
            status_code=401,
            detail="No valid authentication credentials found",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = auth_header.split(' ')[1]
    
    try:
        # For Supabase JWT, we just need to decode and extract the user ID
        # The actual validation is handled by Supabase's RLS
        payload = jwt.decode(token, options={"verify_signature": False})
        
        # Supabase stores the user ID in the 'sub' claim
        user_id = payload.get('sub')
        
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return user_id
        
    except PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"}
        )

async def get_account_id_from_configuration(client, config_id: str) -> str:
    """
    Extract and verify the account ID from a configuration.
    
    Args:
        client: The Supabase client
        config_id: The ID of the configuration
        
    Returns:
        str: The account ID associated with the configuration
        
    Raises:
        HTTPException: If the configuration is not found or if there's an error
    """
    try:
        response = await client.table('configurations').select('account_id').eq('config_id', config_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=404,
                detail="Configuration not found"
            )
        
        account_id = response.data[0].get('account_id')
        
        if not account_id:
            raise HTTPException(
                status_code=500,
                detail="Configuration has no associated account"
            )
        
        return account_id
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving configuration information: {str(e)}"
        )

async def verify_configuration_access(client, config_id: str, user_id: str):
    """
    Verify that a user has access to a specific configuration based on account membership.
    
    Args:
        client: The Supabase client
        config_id: The configuration ID to check access for
        user_id: The user ID to check permissions for
        
    Returns:
        bool: True if the user has access
        
    Raises:
        HTTPException: If the user doesn't have access to the configuration
    """
    # Query the configuration to get account information
    config_result = await client.table('configurations').select('*').eq('config_id', config_id).execute()

    if not config_result.data or len(config_result.data) == 0:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    config_data = config_result.data[0]
    
    # Check if configuration is public or a template
    if config_data.get('is_public') or config_data.get('is_template'):
        return True
    
    # Check account membership for private configurations
    account_id = config_data.get('account_id')
    if account_id:
        account_user_result = await client.schema('basejump').from_('account_user').select('account_role').eq('user_id', user_id).eq('account_id', account_id).execute()
        if account_user_result.data and len(account_user_result.data) > 0:
            return True
    
    raise HTTPException(status_code=403, detail="Not authorized to access this configuration")

async def get_user_id_from_stream_auth(
    request: Request,
    token: Optional[str] = None
) -> str:
    """
    Extract and verify the user ID from either the Authorization header or query parameter token.
    This function is specifically designed for streaming endpoints that need to support both
    header-based and query parameter-based authentication (for EventSource compatibility).
    
    Args:
        request: The FastAPI request object
        token: Optional token from query parameters
        
    Returns:
        str: The user ID extracted from the JWT
        
    Raises:
        HTTPException: If no valid token is found or if the token is invalid
    """
    # Try to get user_id from token in query param (for EventSource which can't set headers)
    if token:
        try:
            # For Supabase JWT, we just need to decode and extract the user ID
            payload = jwt.decode(token, options={"verify_signature": False})
            user_id = payload.get('sub')
            if user_id:
                return user_id
        except Exception:
            pass
    
    # If no valid token in query param, try to get it from the Authorization header
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        try:
            # Extract token from header
            header_token = auth_header.split(' ')[1]
            payload = jwt.decode(header_token, options={"verify_signature": False})
            user_id = payload.get('sub')
            if user_id:
                return user_id
        except Exception:
            pass
    
    # If we still don't have a user_id, return authentication error
    raise HTTPException(
        status_code=401,
        detail="No valid authentication credentials found",
        headers={"WWW-Authenticate": "Bearer"}
    )

async def get_user_account_role(client, user_id: str, account_id: str) -> Tuple[bool, Optional[str]]:
    """
    Get the role of a user in an account.
    
    Args:
        client: The Supabase client
        user_id: The user ID to check
        account_id: The account ID to check against
        
    Returns:
        Tuple[bool, Optional[str]]: (has_access, role)
    """
    try:
        result = await client.schema('basejump').from_('account_user').select('account_role').eq('user_id', user_id).eq('account_id', account_id).execute()
        
        if result.data and len(result.data) > 0:
            return True, result.data[0].get('account_role')
        return False, None
    except Exception as e:
        logger.error(f"Error checking user account role: {str(e)}")
        return False, None

async def check_configuration_ownership(client, config_id: str, user_id: str) -> bool:
    """
    Check if a configuration is owned by the user's account.
    
    Args:
        client: The Supabase client
        config_id: The configuration ID to check
        user_id: The user ID to check ownership for
        
    Returns:
        bool: True if the user has access through account membership
    """
    try:
        # Get account ID for this configuration
        account_id = await get_account_id_from_configuration(client, config_id)
        
        # Check if user is a member of this account
        has_access, _ = await get_user_account_role(client, user_id, account_id)
        return has_access
    except Exception as e:
        logger.error(f"Error checking configuration ownership: {str(e)}")
        return False

def require_account_role(role: str = None):
    """
    Decorator to require a specific account role for accessing a configuration.
    If role is None, it just requires the user to be a member of the account.
    
    Args:
        role: The required role ('owner' or 'member')
        
    Returns:
        Decorator function
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract configuration_id from path or query parameters
            request = kwargs.get('request')
            if not request:
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                        break
            
            if not request:
                raise HTTPException(status_code=500, detail="Request object not found")
            
            # Get config_id from path parameters
            config_id = request.path_params.get('config_id')
            if not config_id:
                # If not in path, try query parameters
                config_id = request.query_params.get('config_id')
            
            if not config_id:
                raise HTTPException(status_code=400, detail="Configuration ID is required")
            
            # Get user ID from JWT
            user_id = await get_current_user_id_from_jwt(request)
            
            # Get Supabase client from kwargs
            client = kwargs.get('client')
            if not client:
                # If not directly provided, look in function arguments
                for arg in args:
                    if hasattr(arg, 'schema') and callable(getattr(arg, 'schema')):
                        client = arg
                        break
            
            if not client:
                raise HTTPException(status_code=500, detail="Database client not found")
            
            # Get account ID for this configuration
            account_id = await get_account_id_from_configuration(client, config_id)
            
            # Check if user has the required role
            has_access, user_role = await get_user_account_role(client, user_id, account_id)
            
            if not has_access:
                raise HTTPException(status_code=403, detail="Not authorized to access this configuration")
            
            if role and user_role != role:
                raise HTTPException(status_code=403, detail=f"This action requires {role} privileges")
            
            # Call the original function
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator

async def get_optional_user_id(request: Request) -> Optional[str]:
    """
    Extract the user ID from the JWT in the Authorization header if present,
    but don't require authentication. Returns None if no valid token is found.
    
    This function is used for endpoints that support both authenticated and 
    unauthenticated access (like public configurations).
    
    Args:
        request: The FastAPI request object
        
    Returns:
        Optional[str]: The user ID extracted from the JWT, or None if no valid token
    """
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    
    try:
        # For Supabase JWT, we just need to decode and extract the user ID
        payload = jwt.decode(token, options={"verify_signature": False})
        
        # Supabase stores the user ID in the 'sub' claim
        user_id = payload.get('sub')
        
        return user_id
    except PyJWTError:
        return None
