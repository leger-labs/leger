# Worker Route Handlers

This document provides detailed information about all route handlers in the Leger Worker, including their request/response formats, authentication requirements, and error handling patterns.

## Architecture Overview

The Leger application uses a single Cloudflare Worker that implements domain-driven design. Instead of a traditional REST API, the application uses route handlers organized by business domain:

```
├── domains/                   # Business domains
│   ├── auth/                  # Authentication and user management
│   ├── accounts/              # Account management
│   ├── configurations/        # Configuration management
│   ├── versions/              # Version management
│   ├── billing/               # Billing and subscription
│   ├── deployments/           # OpenWebUI deployments
│   └── resources/             # Tenant resource provisioning
├── middleware/                # Request middleware
│   ├── auth.ts                # Authentication middleware
│   ├── error.ts               # Error handling middleware
│   └── validation.ts          # Request validation middleware
├── db/                        # Database with Drizzle ORM
├── utils/                     # Utility functions
└── index.ts                   # Worker entry point
```

Each route handler follows a consistent pattern:
- Authentication via Cloudflare Access
- Request validation using Zod schemas
- Business logic execution in domain service
- Standardized response formatting
- Consistent error handling

## Domain-Driven API Structure

Instead of a traditional REST architecture, Leger adopts a domain-driven API structure that aligns with the single Cloudflare Worker approach. This structure provides several advantages:

1. **Business-Oriented Organization**: Routes reflect business domains rather than technical resources
2. **Streamlined Validation**: Validation logic and schemas organized by domain
3. **Consistent Error Handling**: Domain-specific error types and responses
4. **Clarity of Purpose**: Each endpoint's intent is clear from its domain and path

This approach ensures the API structure stays aligned with the application's business logic as it evolves.

## Edge-Optimized API Design

The API is designed to leverage Cloudflare's edge computing capabilities:

1. **Efficient Routing**: Lightweight path-based routing with minimal overhead
2. **Streamlined Middleware**: Purpose-built middleware functions for authentication, validation, and error handling
3. **Response Streaming**: Support for streaming responses when appropriate
4. **Edge Caching**: Strategic cache directives for improved performance

These optimizations ensure the API remains responsive even under high load.

## Request Pipeline Architecture

Each API request follows a consistent processing pipeline:

```mermaid
flowchart TD
    Request[Client Request] --> Router[Route Matching]
    Router --> AuthMiddleware[Authentication Middleware]
    AuthMiddleware --> ValidationMiddleware[Validation Middleware]
    ValidationMiddleware --> Handler[Domain Handler]
    Handler --> Service[Domain Service]
    Service --> Database[(Cloudflare D1)]
    Service --> ResponseFormatter[Response Formatter]
    ResponseFormatter --> Response[Client Response]
    
    AuthMiddleware -- Error --> ErrorMiddleware[Error Middleware]
    ValidationMiddleware -- Error --> ErrorMiddleware
    Handler -- Error --> ErrorMiddleware
    Service -- Error --> ErrorMiddleware
    ErrorMiddleware --> ErrorResponse[Error Response]
```

This pipeline architecture ensures:

- Consistent Processing: All requests follow the same flow
- Separation of Concerns: Each component has a clear responsibility
- Centralized Error Handling: Errors are caught and processed uniformly
- Type Safety: Strong typing throughout the request lifecycle

## Authentication Integration

Authentication is handled by Cloudflare Access:

- Cloudflare Access validates the user's identity
- The Worker receives requests with an `CF-Access-JWT-Assertion` header
- The JWT is verified and decoded to extract user information
- The user is mapped to an internal user record
- Authorization is checked based on the route requirements

## Advanced Authentication Patterns

The Cloudflare Access authentication integration employs several advanced patterns:

### JWT Verification Optimization

JWT verification is optimized for performance:

1. **Key Caching**: JWKS keys cached with appropriate TTL
2. **Verification Caching**: Verified token results cached for the token lifetime
3. **Minimal Parsing**: Token parsing optimized to minimize overhead

### Identity Reconciliation

The system carefully reconciles Cloudflare identities with internal user records:

1. **JIT Provisioning**: Users automatically created on first authentication
2. **Identity Matching**: Cloudflare identities matched to existing accounts by email
3. **Profile Synchronization**: User profile data kept in sync with Cloudflare
4. **Session Mapping**: Cloudflare sessions mapped to internal session management

### Authorization Framework

Beyond authentication, the system implements a comprehensive authorization framework:

1. **Role-Based Access Control**: Permissions assigned based on user roles
2. **Resource Ownership**: Resource access restricted to appropriate owners
3. **Subscription-Based Features**: Feature access controlled by subscription status
4. **Context-Aware Permissions**: Permissions adjusted based on request context

This layered security approach ensures proper access controls throughout the application.

## Authentication Endpoints

### User Profile

#### `GET /auth/profile`

Retrieves the current user's profile information.

**Authentication:** Required via Cloudflare Access  
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

#### `PUT /auth/profile`

Updates the current user's profile information.

**Authentication:** Required via Cloudflare Access  
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

#### `GET /accounts`

Lists all accounts that the current user is a member of.

**Authentication:** Required via Cloudflare Access  
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

#### `POST /accounts`

Creates a new team account.

**Authentication:** Required via Cloudflare Access  
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

#### `GET /accounts/:account_id`

Gets details for a specific account.

**Authentication:** Required via Cloudflare Access  
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

#### `PUT /accounts/:account_id`

Updates an existing account.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Owner role required  
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

#### `GET /accounts/:account_id/members`

Lists all members of an account.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
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

#### `DELETE /accounts/:account_id/members/:user_id`

Removes a member from an account.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Owner role required  
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

#### `PUT /accounts/:account_id/members/:user_id/role`

Updates a member's role in an account.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Owner role required  
**Request:**
```json
{
  "role": "owner",
  "make_primary_owner": false
}
```
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

#### `POST /accounts/:account_id/invitations`

Creates an invitation to join an account.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Owner role required  
**Request:**
```json
{
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

#### `GET /accounts/:account_id/invitations`

Lists all active invitations for an account.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
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

#### `DELETE /accounts/invitations/:invitation_id`

Deletes an invitation.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account owner for the invitation  
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

#### `POST /accounts/invitations/accept`

Accepts an invitation to join an account.

**Authentication:** Required via Cloudflare Access  
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

#### `POST /accounts/invitations/lookup`

Looks up information about an invitation.

**Authentication:** Required via Cloudflare Access  
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

#### `GET /configurations`

Lists configurations for an account.

**Authentication:** Required via Cloudflare Access  
**Request Parameters:**
- `account_id` (required): Account ID to list configurations for
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
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 500: Server error

#### `POST /configurations`

Creates a new configuration.

**Authentication:** Required via Cloudflare Access  
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
- 403: Forbidden (quota exceeded)
- 404: Template not found
- 500: Server error

## Version Management Endpoints

#### `GET /versions/:config_id`

Lists version history for a configuration.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
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

#### `GET /versions/single/:version_id`

Gets a specific configuration version.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
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

#### `POST /versions/:config_id/restore`

Restores a configuration to a previous version.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
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

#### `GET /versions/compare/:config_id/:version_id`

Compares two versions of a configuration.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required, subscription check for advanced features  
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
- 403: Forbidden (not a member of the account or subscription required)
- 404: Configuration or version not found
- 500: Server error

## Deployment Endpoints

#### `POST /deployments`

Creates a new deployment from a configuration.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
**Request:**
```json
{
  "config_id": "uuid",
  "account_id": "uuid"
}
```
**Response:**
```json
{
  "deployment_id": "uuid",
  "config_id": "uuid",
  "account_id": "uuid",
  "status": "pending",
  "created_at": "2023-01-01T00:00:00Z",
  "created_by": "uuid"
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 404: Configuration not found
- 500: Server error

#### `GET /deployments/:deployment_id`

Gets deployment status and details.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
**Request:** None  
**Response:**
```json
{
  "deployment_id": "uuid",
  "config_id": "uuid",
  "account_id": "uuid",
  "beam_pod_id": "pod-id",
  "status": "active",
  "url": "https://pod-id.beam.cloud",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:10Z",
  "created_by": "uuid"
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 404: Deployment not found
- 500: Server error

#### `POST /deployments/:deployment_id/stop`

Stops an active deployment.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
**Request:** None  
**Response:**
```json
{
  "deployment_id": "uuid",
  "status": "stopped",
  "updated_at": "2023-01-01T01:00:00Z"
}
```
**Error Codes:**
- 400: Invalid request (deployment not active)
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 404: Deployment not found
- 500: Server error

#### `GET /deployments`

Lists deployments for an account.

**Authentication:** Required via Cloudflare Access  
**Request Parameters:**
- `account_id` (required): Account ID to list deployments for
- `status` (optional): Filter by status (active, pending, failed, stopped)
- `limit` (optional): Maximum number of deployments to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
{
  "deployments": [
    {
      "deployment_id": "uuid",
      "config_id": "uuid",
      "config_name": "Configuration Name",
      "status": "active",
      "url": "https://pod-id.beam.cloud",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:10Z"
    }
  ],
  "total": 1
}
```
**Error Codes:**
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 500: Server error

## Billing Endpoints

#### `POST /billing/create-checkout-session`

Creates a Stripe Checkout session for subscription.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account owner required  
**Request:**
```json
{
  "account_id": "uuid",
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
- 403: Forbidden (not an account owner)
- 404: Account not found
- 500: Server error (includes Stripe errors)

#### `POST /billing/create-portal-session`

Creates a Stripe Customer Portal session for subscription management.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account owner required  
**Request:**
```json
{
  "account_id": "uuid",
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
- 403: Forbidden (not an account owner)
- 404: No billing customer found
- 500: Server error

#### `GET /billing/:account_id/subscription`

Gets the current subscription status for an account.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
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
- 403: Forbidden (not a member of the account)
- 404: Account not found
- 500: Server error

#### `GET /billing/:account_id/check-status`

Checks if an account has an active subscription or trial.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
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
- 403: Forbidden (not a member of the account)
- 404: Account not found
- 500: Server error

#### `POST /billing/webhook`

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

## Tenant Resources Endpoints

#### `GET /resources/:account_id`

Gets information about resources provisioned for an account.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
**Request:** None  
**Response:**
```json
{
  "resources": [
    {
      "resource_id": "uuid",
      "resource_type": "r2",
      "status": "provisioned",
      "created_at": "2023-01-01T00:00:00Z"
    },
    {
      "resource_id": "uuid",
      "resource_type": "redis",
      "status": "provisioned",
      "created_at": "2023-01-01T00:00:00Z"
    }
  ]
}
```
**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (not a member of the account)
- 404: Account not found
- 500: Server error

## System Endpoints

#### `GET /health`

API health check endpoint.

**Authentication:** None  
**Request:** None  
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00Z",
  "worker_version": "1.0.0"
}
```
**Error Codes:**
- 500: Server error

## Error Handling

All endpoints follow a consistent error handling pattern:

1. **Standard Error Format**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "request_id": "unique-request-id"
  }
}
```

2. **Common Error Codes**
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Permission denied
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `QUOTA_EXCEEDED`: Account quota exceeded
- `SUBSCRIPTION_REQUIRED`: Paid subscription required
- `INTERNAL_ERROR`: Server error

3. **Validation Errors**
Validation errors include details about the specific fields that failed validation:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "request_id": "unique-request-id",
    "validation": [
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  }
}
```

## API Response Formatting

The API implements consistent response formatting across all endpoints:

### Success Response Format

Successful responses follow these patterns:

1. **Single Resource Response**: Returns the resource directly as a JSON object
```json
{
  "config_id": "cuid",
  "name": "Configuration Name",
  "description": "Description text",
  // Other resource properties
}
```

2. Collection Response: Returns an array of resources with pagination metadata

```json
{
  "data": [
    {
      "config_id": "cuid1",
      "name": "Configuration 1"
      // Other resource properties
    },
    {
      "config_id": "cuid2",
      "name": "Configuration 2"
      // Other resource properties
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "page_size": 10,
    "next_page": 2,
    "prev_page": null
  }
}
```

3. **Action Response**: Returns action result with confirmation
```json
{
  "success": true,
  "message": "Configuration deployed successfully",
  "resource_id": "cuid",
  "status": "pending"
}
```

### HTTP Status Codes

The API uses appropriate HTTP status codes:

| Code | Description | Example Usage |
|------|-------------|---------------|
| 200  | OK | Successful GET, PUT, DELETE operations |
| 201  | Created | Successful resource creation |
| 204  | No Content | Successful operation with no response body |
| 400  | Bad Request | Invalid input data |
| 401  | Unauthorized | Missing or invalid authentication |
| 403  | Forbidden | Authenticated but insufficient permissions |
| 404  | Not Found | Resource not found |
| 409  | Conflict | Resource state conflict |
| 422  | Unprocessable Entity | Valid data but business rule violation |
| 429  | Too Many Requests | Rate limit exceeded |
| 500  | Internal Server Error | Unexpected system error |

These consistent patterns make the API predictable and easier to integrate with.

## Advanced Validation Patterns

The API validation uses several advanced techniques:

### Cross-Field Validation

Validations that span multiple fields:

1. **Dependency Validation**: Fields required based on other field values
2. **Exclusivity Rules**: Fields that cannot be used together
3. **Conditional Requirements**: Context-specific validation rules

### Complex Data Validation

Specialized validation for complex data types:

1. **JSON Schema Validation**: Complex nested structures validated against JSON schemas
2. **Configuration-Specific Rules**: Domain-specific validation for configuration data
3. **Semantic Validation**: Validation of meaning and relationships, not just syntax

### Contextual Validation

Validation rules that depend on external context:

1. **User Role Validation**: Different validation based on user role
2. **Subscription-Based Validation**: Features validated against subscription status
3. **State-Based Validation**: Rules that depend on resource state

These advanced validation patterns ensure data integrity while providing clear feedback to users.

## API Versioning Approach

The API is designed with a forward-compatible versioning strategy:

### Versioning Philosophy

1. **Non-Breaking Extensions**: New fields and endpoints added without breaking existing clients
2. **Graceful Deprecation**: Deprecated features marked and supported for transition period
3. **Explicit Breaking Changes**: Major changes introduced with clear version indicators

### Implementation Mechanism

The versioning mechanism uses a pragmatic approach:

1. **Content Negotiation**: Clients can request specific versions via Accept header
2. **Default Latest Stable**: Unversioned requests receive latest stable behavior
3. **Gradual Feature Transition**: Features move through preview, stable, and deprecated stages

This approach balances stability for existing clients with the ability to evolve the API.

## API Documentation Strategy

The API documentation follows these principles:

### Documentation Sources

1. **Schema-Driven**: Core documentation generated from validation schemas
2. **Code Examples**: Real-world usage examples for each endpoint
3. **Contextual Annotations**: Business rules and constraints clearly documented

### Documentation Format

1. **OpenAPI Specification**: Formal API documentation following OpenAPI standards
2. **Interactive Documentation**: Live testing capabilities for developers
3. **SDK Generation**: Type-safe client libraries generated from specifications

This documentation approach ensures developers have comprehensive, accurate references for API integration.


## Caching Strategy

The Worker implements an efficient caching strategy:

1. **Public Templates**: Cached with `s-maxage=300` to improve discovery performance
2. **User Accounts List**: Cached in KV with 5-minute TTL to reduce database queries
3. **Configuration Data**: Cached with appropriate invalidation on updates
4. **User Profile**: Cached with short TTL to improve responsiveness

Cache invalidation is triggered automatically when resources are updated, ensuring data consistency while optimizing performance.
": "2023-01-01T00:00:00Z",
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

#### `GET /configurations/:config_id`

Gets a specific configuration by ID.

**Authentication:** Required via Cloudflare Access (for private configurations)  
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

#### `PUT /configurations/:config_id`

Updates an existing configuration.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required  
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

#### `DELETE /configurations/:config_id`

Deletes a configuration.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account owner required  
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

#### `GET /configurations/templates/public`

Lists public template configurations.

**Authentication:** Optional  
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

#### `POST /configurations/templates/create`

Creates a template from an existing configuration.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Account membership required, subscription check  
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

#### `POST /configurations/templates/apply`

Applies a template to create a new configuration.

**Authentication:** Required via Cloudflare Access  
**Authorization:** Configuration quota check  
**Request:**
```json
{
  "template_id": "uuid",
  "account_id": "uuid",
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
  "created_at

## Testing Architecture

The API includes a comprehensive testing architecture:

### Test Categories

1. **Unit Tests**: Isolated testing of domain services and utilities
2. **Integration Tests**: Testing of service interactions and database operations
3. **API Tests**: End-to-end testing of API endpoints
4. **Load Tests**: Performance testing under various load conditions

### Test Infrastructure

1. **Test Database**: Isolated test database for integration testing
2. **Mocking Framework**: Consistent approach to mocking external dependencies
3. **Fixtures and Factories**: Standard test data generation
4. **Assertions Library**: Domain-specific assertions for validation

This testing architecture ensures the API remains stable and reliable through development iterations.

## Security Architecture

The API implements multiple security layers:

### Request Security

1. **Input Sanitization**: Prevention of injection attacks
2. **Content Security Policies**: Protection against XSS attacks
3. **CORS Configuration**: Controlled cross-origin access
4. **Rate Limiting**: Protection against abuse and DoS attacks

### Data Security

1. **Encryption at Rest**: Sensitive data encrypted in storage
2. **Transport Security**: All communications encrypted with TLS
3. **Field-Level Security**: Access control at the data field level
4. **Audit Logging**: Comprehensive activity logging for security events

These security measures protect both the API and its data from various threat vectors.

## Performance Optimization

The API is optimized for performance in several ways:

### Database Optimization

1. **Query Optimization**: Efficient database queries with proper indexing
2. **Connection Pooling**: Reuse of database connections
3. **Batch Operations**: Grouping of related operations for efficiency
4. **Pagination Guidelines**: Consistent approach to result pagination

### Worker Optimization

1. **Cold Start Minimization**: Code organization to reduce cold start impact
2. **Bundle Size Management**: Dependencies optimized for minimal size
3. **Memory Usage Patterns**: Careful management of memory within Worker constraints
4. **Request Prioritization**: Critical paths optimized for minimal latency

These optimizations ensure the API remains responsive even under high load conditions.
