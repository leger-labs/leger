# Authentication and Authorization Model

## Authentication System

While the reimplementation will use Cloudflare Access for authentication, it's important to understand the current authentication flows and requirements to ensure proper integration.

### Current Authentication Flow

1. **Registration Flow:**
   - User provides email, password, and optional display name
   - System validates credentials and creates user record
   - Personal account is created automatically
   - Authentication tokens (JWT) are issued

2. **Login Flow:**
   - User provides email and password
   - System validates credentials
   - Authentication tokens (JWT) are issued

3. **Token Mechanism:**
   - Access token (short-lived JWT, 60 minutes)
   - Refresh token (longer-lived)
   - Token refresh endpoint for extending sessions

4. **Password Reset Flow:**
   - User requests password reset via email
   - System sends reset token via email
   - User provides new password and reset token
   - System validates token and updates password

### Cloudflare Access Integration Requirements

For migration to Cloudflare Access, the system will need to:

1. Rely on Cloudflare Access for user identity and authentication
2. Map Cloudflare user identities to internal user records
3. Support the same user profile data (email, name, avatar)
4. Replace JWT validation with Cloudflare Access validation

## Authorization Model

The authorization model is independent of the authentication mechanism and will need to be implemented in the new system.

### Role-Based Access Control

The system uses a simple role-based permission model:

1. **Account Roles:**
   - `owner`: Full administrative privileges for an account
   - `member`: Standard user privileges for an account

2. **Special Designations:**
   - `primary_owner`: Special designation for the account creator or designated primary admin

### Permission Matrix

| Action | No Authentication | Account Member | Account Owner | Primary Owner |
|--------|------------------|----------------|---------------|--------------|
| View public templates | ✓ | ✓ | ✓ | ✓ |
| Use public templates | ✗ | ✓ | ✓ | ✓ |
| Create personal account | ✓ | N/A | N/A | N/A |
| Create team account | ✗ | ✓ | ✓ | ✓ |
| View account configurations | ✗ | ✓ | ✓ | ✓ |
| Create/edit configurations | ✗ | ✓ | ✓ | ✓ |
| Delete configurations | ✗ | ✗ | ✓ | ✓ |
| Create templates | ✗ | ✓* | ✓* | ✓* |
| View account members | ✗ | ✓ | ✓ | ✓ |
| Invite members | ✗ | ✗ | ✓ | ✓ |
| Remove members | ✗ | ✗ | ✓ | ✓ |
| Change member roles | ✗ | ✗ | ✓ | ✓ |
| Update account details | ✗ | ✗ | ✓ | ✓ |
| Delete account | ✗ | ✗ | ✗ | ✓ |
| Transfer primary ownership | ✗ | ✗ | ✗ | ✓ |
| Manage subscription | ✗ | ✗ | ✓ | ✓ |

*Requires active subscription or trial

### Authorization Logic

The system implements authorization through several mechanisms:

1. **API Level Checks:**
   - Each API endpoint validates user permissions before processing
   - For configuration endpoints, the system verifies account membership
   - For team management, role requirements are enforced
   - For billing operations, ownership verification is performed

2. **Account Membership Verification:**
   - Function: `has_role_on_account(account_id, [required_role])`
   - Verifies user is a member of the account
   - Optionally checks for a specific role

3. **Resource Ownership Verification:**
   - For configuration operations, the system verifies the configuration belongs to an account the user is a member of
   - Public templates are exempted from ownership checks

4. **Subscription-Based Feature Access:**
   - Functions check subscription status before allowing premium features
   - Implement quota limits based on subscription tier
   - Free trial users get full feature access for 14 days

### Authorization Implementation Requirements

The new implementation should:

1. Validate permissions at the API level for each endpoint
2. Maintain the same role-based access model (owner/member)
3. Implement subscription status checks for premium features
4. Continue supporting public vs. private resource visibility
5. Enforce quota limits based on subscription tier
6. Maintain the primary owner concept for ultimate account control
7. Support the same account invitation workflows
8. Enforce the same configuration sharing rules
