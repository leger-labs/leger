## Business Logic

```mermaid
sequenceDiagram
    participant User
    participant API as Leger API
    participant DB as Database
    participant Stripe
    
    %% Customer Creation
    User->>API: Request checkout
    API->>DB: Check for existing customer
    alt No customer exists
        API->>Stripe: Create customer
        Stripe-->>API: Return customer ID
        API->>DB: Store customer ID
    else Customer exists
        DB-->>API: Return customer ID
    end
    
    %% Checkout Session
    API->>Stripe: Create checkout session
    Stripe-->>API: Return session URL
    API-->>User: Return session URL
    User->>Stripe: Complete checkout
    
    %% Webhook processing
    Stripe->>API: subscription.created webhook
    API->>API: Verify webhook signature
    API->>DB: Log webhook event
    API->>DB: Create/update subscription
    API-->>Stripe: Return 200 OK
    
    %% Customer Portal
    User->>API: Request customer portal
    API->>Stripe: Create portal session
    Stripe-->>API: Return portal URL
    API-->>User: Return portal URL
    User->>Stripe: Manage subscription
    
    %% Subscription Updates
    Stripe->>API: subscription.updated webhook
    API->>API: Verify webhook signature
    API->>DB: Log webhook event
    API->>DB: Update subscription status
    API-->>Stripe: Return 200 OK
    
    %% Payment issues
    Stripe->>API: invoice.payment_failed webhook
    API->>API: Verify webhook signature
    API->>DB: Log webhook event
    API->>DB: Update subscription to past_due
    API-->>Stripe: Return 200 OK
    
    %% Cancellation
    Stripe->>API: subscription.deleted webhook
    API->>API: Verify webhook signature
    API->>DB: Log webhook event
    API->>DB: Mark subscription as canceled
    API-->>Stripe: Return 200 OK
```

# Core Business Logic

This section documents the essential business functions, rules, workflows, and constraints that form the core logic of the Leger system. These logic components need to be reimplemented in the Cloudflare ecosystem.

## Account Management Logic

### User Registration and Account Creation

When a new user registers with the system, several operations are performed automatically:

1. Create a user record with the provided email and optional name
2. Create a personal account for the user with:
   - The user as the primary owner with "owner" role
   - Name derived from the user's name or email
   - `personal_account` flag set to true
3. The new user automatically enters a 14-day trial period with full feature access

**Business Rules:**
- Email addresses must be unique across all users
- Personal accounts are automatically created and cannot be deleted while the user exists
- Personal accounts can have only one member (the owner)
- All users must have exactly one personal account

### Team Account Management

Team accounts allow multiple users to collaborate on shared configurations.

**Account Creation:**
1. Only authenticated users can create team accounts
2. The creator becomes the primary owner with "owner" role
3. Account name and optional slug must be provided
4. Account slug must be URL-safe and unique across all accounts

**Account Update:**
1. Only account owners can update account details
2. Account name can be modified at any time
3. Account slug can be changed if not already in use
4. Account metadata can be updated, replaced, or merged

**Member Management:**
1. Only account owners can add or remove members
2. Members can be assigned "owner" or "member" roles
3. The primary owner cannot be removed from the account
4. An account must always have at least one owner
5. If an owner attempts to leave, they must transfer primary ownership first
6. Users can be members of multiple accounts simultaneously

### Invitation Management

Invitations allow account owners to add new members to team accounts.

**Invitation Creation:**
1. Only account owners can create invitations
2. Invitations can specify a role ("owner" or "member")
3. Invitations can be one-time use or time-limited (24-hour)
4. Each invitation has a unique secure token

**Invitation Acceptance:**
1. Invitations can only be used once
2. Expired invitations cannot be accepted
3. Users cannot accept invitations to accounts they already belong to
4. Accepting an invitation creates an AccountUser record with the specified role

**Invitation Management:**
1. Account owners can view all pending invitations for their accounts
2. Account owners can delete any pending invitation
3. Users can look up invitation details using the token before accepting

## Configuration Management Logic

### Configuration CRUD Operations

**Configuration Creation:**
1. Users can create configurations within any account they belong to
2. A configuration requires a name and is associated with an account
3. Configuration creation is subject to quota limits based on subscription
4. Each configuration starts at version 1
5. Creator is tracked in the `created_by` field

**Configuration Retrieval:**
1. Users can view configurations for accounts they belong to
2. Public templates are visible to all users
3. Non-public templates are visible only to members of the owning account

**Configuration Update:**
1. Account members can update configurations within their accounts
2. Each update to configuration data creates a new version
3. Version number is incremented automatically
4. Previous version is preserved in the version history
5. Last modifier is tracked in the `updated_by` field

**Configuration Deletion:**
1. Account owners can delete configurations
2. Deletion removes the configuration and all its versions
3. Deletion is permanent and cannot be undone

### Template Management

Templates are special configurations that can be shared and reused.

**Template Creation:**
1. Users can create templates from existing configurations
2. Templates can be marked as public or private
3. Public templates are accessible to all users
4. Private templates are accessible only to members of the owning account
5. Creating templates requires a paid subscription or active trial

**Template Application:**
1. Users can apply templates to create new configurations
2. Application creates a new configuration based on the template data
3. Users can override specific values during application
4. The new configuration is not linked to the original template after creation

### Version Management

Version management tracks the history of changes to configurations.

**Version Creation:**
1. A new version is created automatically whenever configuration data is updated
2. Each version preserves the complete state of the configuration at that point
3. Version numbers are sequential integers starting from 1
4. Versions include metadata about who made the change and when

**Version Retrieval:**
1. Users can list all versions of a configuration they have access to
2. Users can retrieve a specific version by ID or number
3. Version history provides a complete audit trail of changes

**Version Comparison:**
1. Users can compare any two versions of a configuration
2. Comparison shows added, removed, and modified keys in the configuration data
3. Comparison includes metadata about both versions

**Version Restoration:**
1. Users can restore a configuration to any previous version
2. Restoration creates a new version with the restored data
3. The version number is incremented, not reverted
4. Restoration action is recorded in the version history

## Subscription and Billing Logic

### Subscription Management

**Trial Period:**
1. New users automatically receive a 14-day trial with full feature access
2. Trial period begins at user registration
3. Trial status and remaining days are tracked in the subscription record
4. Trial expiration reverts the user to free tier access

**Checkout Process:**
1. Users can initiate subscription checkout from the UI
2. System creates or retrieves a Stripe customer for the account
3. System creates a Stripe checkout session with the correct pricing
4. After successful checkout, the subscription becomes active
5. If a user already has a subscription, they are redirected to the customer portal

**Subscription Status:**
1. Valid subscription statuses: "active", "trialing", "past_due", "canceled", "incomplete", "incomplete_expired"
2. Only "active" and "trialing" statuses grant full feature access
3. Other statuses may have restricted feature access
4. Free tier status is represented by "no_subscription" (not a database value)

**Subscription Termination:**
1. Users can cancel their subscription through the Stripe customer portal
2. Canceled subscriptions remain active until the end of the current billing period
3. After the billing period ends, the account reverts to free tier access

### Feature Access Control

The subscription status determines feature access through a layered control system:

**Free Tier Limitations:**
1. Maximum 3 configurations per account
2. Cannot create or share templates
3. Cannot access advanced versioning features
4. Can use templates created by others

**Paid Tier Features:**
1. Maximum 50 configurations per account
2. Can create and share templates
3. Full access to versioning features
4. All collaboration features enabled

**Access Control Functions:**
1. `can_create_configuration()` - Checks if the account has reached its configuration limit
2. `can_share_configuration()` - Checks if the account can create and share templates
3. `can_use_advanced_features()` - Checks access to premium features

**Subscription Verification:**
1. Feature access is checked before each relevant operation
2. System enforces limits based on the current subscription status
3. Clear error messages explain subscription requirements when access is denied

