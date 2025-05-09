# API Endpoints

This document provides detailed information about all API endpoints in the Leger system, including their request/response formats, authentication requirements, and error handling.

## Authentication Endpoints

While authentication will transition to Cloudflare Access, understanding the current endpoints helps define required user management functionality.

### User Profile

#### `GET /api/accounts/profile`

Retrieves the current user's profile information.

**Authentication:** Required  
**Request:** None  
**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "avatar_url": "https://example.com/avatar.png",
    "created_at": "2023-01-01T00:00:00Z"
  },
  "personal_account": {
    "account_id": "uuid",
    "name": "Personal Account",
    "slug": "personal-account"
    // Other account details
  }
}
```
**Error Codes:**
- 401: Unauthorized
- 404: User not found
- 500: Server error

#### `PUT /api/accounts/profile`

Updates the current user's profile information.

**Authentication:** Required  
**Request:**
```json
{
  "name": "New Name",
  "avatar_url": "https://example.com/new-avatar.png"
}
```
**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "New Name",
    "avatar_url": "https://example.com/new-avatar.png",
    "created_at": "2023-01-01T00:00:00Z"
  }
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 500: Server error

## Account Management Endpoints

### Account Operations

#### `GET /api/accounts/list`

Lists all accounts that the current user is a member of.

**Authentication:** Required  
**Request:** None  
**Response:**
```json
{
  "accounts": [
    {
      "account_id": "uuid",
      "name": "Personal Account",
      "slug": "personal-account",
      "personal_account": true,
      "account_role": "owner",
      "is_primary_owner": true,
      "billing_status": "active",
      "created_at": "2023-01-01T00:00:00Z"
    },
    {
      "account_id": "uuid",
      "name": "Team Account",
      "slug": "team-account",
      "personal_account": false,
      "account_role": "member",
      "is_primary_owner": false,
      "billing_status": "active",
      "created_at": "2023-01-01T00:00:00Z"
    }
  ]
}
```
**Error Codes:**
- 401: Unauthorized
- 500: Server error

#### `POST /api/accounts`

Creates a new team account.

**Authentication:** Required  
**Request:**
```json
{
  "name": "New Team Account",
  "slug": "new-team-account",
  "metadata": {
    "custom_field": "value"
  }
}
```
**Response:**
```json
{
  "account_id": "uuid",
  "name": "New Team Account",
  "slug": "new-team-account",
  "personal_account": false,
  "account_role": "owner",
  "is_primary_owner": true,
  "created_at": "2023-01-01T00:00:00Z"
}
```
**Error Codes:**
- 400: Invalid request (e.g., slug already in use)
- 401: Unauthorized
- 500: Server error

#### `GET /api/accounts/{account_id}`

Gets details for a specific account.

**Authentication:** Required  
**Request:** None  
**Response:**
```json
{
  "account_id": "uuid",
  "name": "Team Account",
  "slug": "team-account",
  "personal_account": false,
  "account_role": "owner",
  "is_primary_owner": true,
  "billing_status": "active",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "metadata": {
    "custom_field": "value"
  }
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not a member of this account)
- 404: Account not found
- 500: Server error

#### `PUT /api/accounts/{account_id}`

Updates an existing account.

**Authentication:** Required (owner only)  
**Request:**
```json
{
  "name": "Updated Team Name",
  "slug": "updated-team-slug",
  "metadata": {
    "new_field": "new_value"
  },
  "replace_metadata": false
}
```
**Response:**
```json
{
  "account_id": "uuid",
  "name": "Updated Team Name",
  "slug": "updated-team-slug",
  "personal_account": false,
  "account_role": "owner",
  "is_primary_owner": true,
  "billing_status": "active",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z",
  "metadata": {
    "custom_field": "value",
    "new_field": "new_value"
  }
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not an owner)
- 404: Account not found
- 500: Server error

### Team Management

#### `GET /api/accounts/{account_id}/members`

Lists all members of an account.

**Authentication:** Required  
**Request Parameters:**
- `limit` (optional): Maximum number of members to return (default: 50)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
{
  "members": [
    {
      "user_id": "uuid",
      "account_role": "owner",
      "name": "Owner Name",
      "email": "owner@example.com",
      "is_primary_owner": true
    },
    {
      "user_id": "uuid",
      "account_role": "member",
      "name": "Member Name",
      "email": "member@example.com",
      "is_primary_owner": false
    }
  ]
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not a member of this account)
- 404: Account not found
- 500: Server error

#### `DELETE /api/accounts/{account_id}/members/{user_id}`

Removes a member from an account.

**Authentication:** Required (owner only)  
**Request:** None  
**Response:**
```json
{
  "success": true
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not an owner, or attempting to remove the primary owner)
- 404: Account or user not found
- 500: Server error

#### `PUT /api/accounts/{account_id}/members/{user_id}/role`

Updates a member's role in an account.

**Authentication:** Required (owner only)  
**Request Parameters:**
- `role`: New role (required, "owner" or "member")
- `make_primary_owner`: Whether to make this user the primary owner (optional, default: false)

**Response:**
```json
{
  "success": true
}
```
**Error Codes:**
- 400: Invalid role
- 401: Unauthorized
- 403: Forbidden (not an owner)
- 404: Account or user not found
- 500: Server error

### Invitation Management

#### `POST /api/accounts/{account_id}/invitations`

Creates an invitation to join an account.

**Authentication:** Required (owner only)  
**Request:**
```json
{
  "account_id": "uuid",
  "role": "member",
  "invitation_type": "one_time"
}
```
**Response:**
```json
{
  "invitation_id": "uuid",
  "account_id": "uuid",
  "token": "unique-token",
  "account_role": "member",
  "invitation_type": "one_time",
  "expires_at": null
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not an owner)
- 404: Account not found
- 500: Server error

#### `GET /api/accounts/{account_id}/invitations`

Lists all active invitations for an account.

**Authentication:** Required (account member)  
**Request Parameters:**
- `limit` (optional): Maximum number of invitations to return (default: 25)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
{
  "invitations": [
    {
      "invitation_id": "uuid",
      "account_role": "member",
      "created_at": "2023-01-01T00:00:00Z",
      "invitation_type": "one_time"
    }
  ]
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not a member of this account)
- 404: Account not found
- 500: Server error

#### `DELETE /api/accounts/invitations/{invitation_id}`

Deletes an invitation.

**Authentication:** Required (account owner)  
**Request:** None  
**Response:**
```json
{
  "success": true
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not an owner of the account)
- 404: Invitation not found
- 500: Server error

#### `POST /api/accounts/invitations/accept`

Accepts an invitation to join an account.

**Authentication:** Required  
**Request:**
```json
{
  "token": "invitation-token"
}
```
**Response:**
```json
{
  "account_id": "uuid",
  "account_name": "Team Account",
  "account_role": "member"
}
```
**Error Codes:**
- 400: Invalid or expired token
- 401: Unauthorized
- 409: Already a member of this account
- 500: Server error

#### `POST /api/accounts/invitations/lookup`

Looks up information about an invitation.

**Authentication:** Required  
**Request:**
```json
{
  "token": "invitation-token"
}
```
**Response:**
```json
{
  "account_id": "uuid",
  "account_name": "Team Account",
  "account_role": "member",
  "invitation_type": "one_time",
  "expires_at": null
}
```
**Error Codes:**
- 400: Invalid token
- 401: Unauthorized
- 404: Invitation not found or expired
- 500: Server error

## Configuration Management Endpoints

### Configuration Operations

#### `GET /api/configurations`

Lists configurations for an account.

**Authentication:** Required  
**Request Parameters:**
- `account_id` (optional): Account ID to list configurations for (defaults to personal account)
- `include_templates` (optional): Whether to include templates (default: false)
- `limit` (optional): Maximum number of configurations to return (default: 50)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
[
  {
    "config_id": "uuid",
    "account_id": "uuid",
    "name": "Configuration Name",
    "description": "Configuration description",
    "config_data": {
      "key": "value"
    },
    "is_template": false,
    "is_public": false,
    "version": 1,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "created_by": "uuid",
    "updated_by": "uuid"
  }
]
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 500: Server error

#### `POST /api/configurations`

Creates a new configuration.

**Authentication:** Required  
**Request:**
```json
{
  "account_id": "uuid",
  "name": "New Configuration",
  "description": "Configuration description",
  "config_data": {
    "key": "value"
  },
  "is_template": false,
  "is_public": false
}
```
**Response:**
```json
{
  "config_id": "uuid",
  "account_id": "uuid",
  "name": "New Configuration",
  "description": "Configuration description",
  "config_data": {
    "key": "value"
  },
  "is_template": false,
  "is_public": false,
  "version": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "created_by": "uuid",
  "updated_by": "uuid"
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (quota exceeded or not a member of the account)
- 500: Server error

#### `GET /api/configurations/{config_id}`

Gets a specific configuration by ID.

**Authentication:** Optional (required for private configurations)  
**Request:** None  
**Response:**
```json
{
  "config_id": "uuid",
  "account_id": "uuid",
  "name": "Configuration Name",
  "description": "Configuration description",
  "config_data": {
    "key": "value"
  },
  "is_template": false,
  "is_public": false,
  "version": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "created_by": "uuid",
  "updated_by": "uuid"
}
```
**Error Codes:**
- 401: Unauthorized (for private configurations)
- 403: Forbidden (not a member of the owning account for private configurations)
- 404: Configuration not found
- 500: Server error

#### `PUT /api/configurations/{config_id}`

Updates an existing configuration.

**Authentication:** Required  
**Request:**
```json
{
  "name": "Updated Configuration",
  "description": "Updated description",
  "config_data": {
    "key": "new_value"
  },
  "is_template": true,
  "is_public": false
}
```
**Response:**
```json
{
  "config_id": "uuid",
  "account_id": "uuid",
  "name": "Updated Configuration",
  "description": "Updated description",
  "config_data": {
    "key": "new_value"
  },
  "is_template": true,
  "is_public": false,
  "version": 2,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z",
  "created_by": "uuid",
  "updated_by": "uuid"
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not a member of the account or cannot create templates)
- 404: Configuration not found
- 500: Server error

#### `DELETE /api/configurations/{config_id}`

Deletes a configuration.

**Authentication:** Required (account owner)  
**Request:** None  
**Response:**
```json
{
  "success": true,
  "message": "Configuration deleted successfully"
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not an owner of the account)
- 404: Configuration not found
- 500: Server error

### Template Operations

#### `GET /api/configurations/templates/public`

Lists public template configurations.

**Authentication:** None (public endpoint)  
**Request Parameters:**
- `limit` (optional): Maximum number of templates to return (default: 50)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
[
  {
    "config_id": "uuid",
    "account_id": "uuid",
    "name": "Template Name",
    "description": "Template description",
    "config_data": {
      "key": "value"
    },
    "is_template": true,
    "is_public": true,
    "version": 1,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "created_by": "uuid",
    "updated_by": "uuid"
  }
]
```
**Error Codes:**
- 500: Server error

#### `POST /api/configurations/templates/create`

Creates a template from an existing configuration.

**Authentication:** Required  
**Request:**
```json
{
  "config_id": "uuid",
  "name": "New Template Name",
  "description": "Template description",
  "is_public": true
}
```
**Response:**
```json
{
  "config_id": "uuid",
  "account_id": "uuid",
  "name": "New Template Name",
  "description": "Template description",
  "config_data": {
    "key": "value"
  },
  "is_template": true,
  "is_public": true,
  "version": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "created_by": "uuid",
  "updated_by": "uuid"
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not a member of the account or subscription required)
- 404: Source configuration not found
- 500: Server error

#### `POST /api/configurations/templates/apply`

Applies a template to create a new configuration.

**Authentication:** Required  
**Request:**
```json
{
  "template_id": "uuid",
  "name": "New Configuration",
  "description": "Configuration description",
  "config_data_overrides": {
    "key": "override_value"
  }
}
```
**Response:**
```json
{
  "config_id": "uuid",
  "account_id": "uuid",
  "name": "New Configuration",
  "description": "Configuration description",
  "config_data": {
    "key": "override_value",
    "template_key": "template_value"
  },
  "is_template": false,
  "is_public": false,
  "version": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "created_by": "uuid",
  "updated_by": "uuid"
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (quota exceeded)
- 404: Template not found
- 500: Server error

## Version Management Endpoints

#### `GET /api/versions/{config_id}`

Lists version history for a configuration.

**Authentication:** Required  
**Request Parameters:**
- `limit` (optional): Maximum number of versions to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
{
  "config_id": "uuid",
  "total_versions": 2,
  "versions": [
    {
      "version_id": "uuid",
      "version": 2,
      "created_at": "2023-01-02T00:00:00Z",
      "created_by": "uuid",
      "change_description": "Updated configuration"
    },
    {
      "version_id": "uuid",
      "version": 1,
      "created_at": "2023-01-01T00:00:00Z",
      "created_by": "uuid",
      "change_description": null
    }
  ]
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 404: Configuration not found
- 500: Server error

#### `GET /api/versions/latest/{config_id}`

Gets the latest version of a configuration.

**Authentication:** Required  
**Request:** None  
**Response:**
```json
{
  "version_id": "uuid",
  "config_id": "uuid",
  "version": 2,
  "config_data": {
    "key": "value"
  },
  "created_at": "2023-01-02T00:00:00Z",
  "created_by": "uuid",
  "change_description": "Updated configuration"
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 404: Configuration or version not found
- 500: Server error

#### `GET /api/versions/single/{version_id}`

Gets a specific configuration version.

**Authentication:** Required  
**Request:** None  
**Response:**
```json
{
  "version_id": "uuid",
  "config_id": "uuid",
  "version": 1,
  "config_data": {
    "key": "old_value"
  },
  "created_at": "2023-01-01T00:00:00Z",
  "created_by": "uuid",
  "change_description": null
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 404: Version not found
- 500: Server error

#### `POST /api/versions/{config_id}/restore`

Restores a configuration to a previous version.

**Authentication:** Required  
**Request:**
```json
{
  "version_id": "uuid",
  "change_description": "Restored from previous version"
}
```
**Response:**
```json
{
  "config_id": "uuid",
  "account_id": "uuid",
  "name": "Configuration Name",
  "description": "Configuration description",
  "config_data": {
    "key": "old_value"
  },
  "is_template": false,
  "is_public": false,
  "version": 3,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-03T00:00:00Z",
  "created_by": "uuid",
  "updated_by": "uuid"
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 404: Configuration or version not found
- 500: Server error

#### `GET /api/versions/compare/{config_id}/{version_id}`

Compares two versions of a configuration.

**Authentication:** Required  
**Request Parameters:**
- `current_version_id` (optional): Version ID to compare with (defaults to latest)

**Response:**
```json
{
  "config_id": "uuid",
  "old_version": {
    "version_id": "uuid",
    "version": 1,
    "created_at": "2023-01-01T00:00:00Z",
    "created_by": "uuid",
    "change_description": null
  },
  "current_version": {
    "version_id": "uuid",
    "version": 2,
    "created_at": "2023-01-02T00:00:00Z",
    "created_by": "uuid",
    "change_description": "Updated configuration"
  },
  "differences": {
    "added_keys": ["new_key"],
    "removed_keys": ["old_key"],
    "modified_keys": ["key"]
  }
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 404: Configuration or version not found
- 500: Server error

## Billing Endpoints

#### `POST /api/billing/create-checkout-session`

Creates a Stripe Checkout session for subscription.

**Authentication:** Required  
**Request:**
```json
{
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel"
}
```
**Response:**
```json
{
  "session_id": "stripe_session_id",
  "url": "https://checkout.stripe.com/...",
  "status": "new"
}
```
**Error Codes:**
- 401: Unauthorized
- 500: Server error (includes Stripe errors)

#### `POST /api/billing/create-portal-session`

Creates a Stripe Customer Portal session for subscription management.

**Authentication:** Required  
**Request:**
```json
{
  "return_url": "https://example.com/billing"
}
```
**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```
**Error Codes:**
- 401: Unauthorized
- 404: No billing customer found
- 500: Server error

#### `GET /api/billing/subscription`

Gets the current subscription status for the user.

**Authentication:** Required  
**Request:** None  
**Response:**
```json
{
  "status": "active",
  "plan_name": "Standard",
  "current_period_end": "2023-02-01T00:00:00Z",
  "cancel_at_period_end": false,
  "trial_end": null,
  "trial_remaining_days": null,
  "created_at": "2023-01-01T00:00:00Z"
}
```
**Error Codes:**
- 401: Unauthorized
- 500: Server error

#### `GET /api/billing/check-status`

Checks if the user has an active subscription or trial.

**Authentication:** Required  
**Request:** None  
**Response:**
```json
{
  "can_access": true,
  "message": "Subscription active",
  "subscription": {
    "status": "active",
    "plan_name": "Standard",
    "current_period_end": "2023-02-01T00:00:00Z"
  }
}
```
**Error Codes:**
- 401: Unauthorized
- 500: Server error

#### `POST /api/billing/webhook`

Handles Stripe webhook events for subscription lifecycle.

**Authentication:** None (secured by webhook signature)  
**Request:** Stripe webhook event payload  
**Response:**
```json
{
  "status": "success"
}
```
**Error Codes:**
- 400: Invalid payload or signature
- 500: Server error

## System Endpoints

#### `GET /api/health`

API health check endpoint.

**Authentication:** None  
**Request:** None  
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00Z",
  "instance_id": "instance_id",
  "version": "1.0.0"
}
```
**Error Codes:**
- 500: Server error
