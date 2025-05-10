# Updated Sitemap for Leger (Vite + React SPA Architecture)

This sitemap reflects the Vite + React SPA architecture with a Cloudflare Worker backend. The overall structure remains largely consistent with the original sitemap, with adjustments to reflect the single-page application architecture and routing approach.

## Application Structure

```
Leger Platform (SPA)
├── Authentication
│   ├── Login (via Cloudflare Access)
│   ├── First-time User Onboarding
│   │   ├── Welcome Screen
│   │   ├── Personal Account Creation (automatic)
│   │   ├── Trial Period Information
│   │   └── Feature Overview
│   └── Password Reset (handled by Cloudflare Access)
│
├── Dashboard
│   ├── Overview
│   │   ├── Active Deployments Summary
│   │   ├── Configuration Status
│   │   ├── Resource Usage Metrics
│   │   └── Recent Activity Timeline
│   └── Quick Actions Menu
│
├── Configurations
│   ├── Configuration List
│   │   ├── List View with Filters and Search
│   │   ├── Grid View (optional alternative)
│   │   └── Sort Options (name, date created, last updated)
│   ├── Configuration Detail
│   │   ├── Basic Information Section
│   │   ├── Configuration Editor
│   │   │   ├── General Settings
│   │   │   ├── Vector Database Settings
│   │   │   ├── RAG Content Extraction Settings
│   │   │   ├── Retrieval Augmented Generation Settings
│   │   │   ├── Web Search Settings
│   │   │   ├── Audio Settings
│   │   │   ├── Image Generation Settings
│   │   │   └── Miscellaneous Settings
│   │   ├── Version History
│   │   │   ├── Version List
│   │   │   ├── Version Comparison
│   │   │   └── Restore Version Dialog
│   │   └── Deployment Controls
│   │       ├── Deploy Button
│   │       ├── Deployment Status
│   │       └── Deployment Logs
│   ├── Create New Configuration
│   │   ├── From Scratch
│   │   ├── From Template
│   │   │   ├── Public Templates
│   │   │   └── Team Templates
│   │   └── Import Configuration
│   └── Templates Management
│       ├── My Templates
│       ├── Team Templates
│       ├── Public Templates
│       └── Template Detail View
│
├── Deployments
│   ├── Active Deployments
│   │   ├── List View with Status Indicators
│   │   └── Deployment Controls (Stop, Restart)
│   ├── Deployment History
│   │   ├── List View with Filters
│   │   └── Historical Metrics
│   └── Deployment Detail
│       ├── Configuration Used
│       ├── Status and Metrics
│       ├── Logs
│       ├── Access URL
│       └── Stop/Restart Controls
│
├── Team Management
│   ├── Team Overview
│   │   ├── Member List
│   │   └── Team Settings
│   ├── Invitations
│   │   ├── Active Invitations
│   │   ├── Create Invitation
│   │   └── Invitation History
│   ├── Member Detail
│   │   ├── Profile Information
│   │   ├── Role Management
│   │   └── Activity History
│   └── Access Control
│       ├── Role Definitions
│       └── Permission Settings
│
├── API Keys/Secrets
│   ├── Key Management
│   │   ├── List View
│   │   ├── Create New Key
│   │   └── Edit/Delete Controls
│   ├── Secret Types
│   │   ├── LLM Provider Secrets
│   │   ├── Tool-specific Secrets
│   │   └── Deployment Secrets
│   └── Usage Audit Log
│
├── Tools (Future Feature)
│   ├── Tool Gallery
│   ├── Active Tools
│   └── Tool Configuration
│
├── Settings
│   ├── Account Settings
│   │   ├── Profile Information
│   │   ├── Notification Preferences
│   │   └── Account Security
│   ├── Billing
│   │   ├── Subscription Status
│   │   ├── Payment Methods
│   │   ├── Invoice History
│   │   └── Plan Management (Upgrade/Downgrade)
│   ├── Appearance
│   │   ├── Theme Settings
│   │   └── Display Preferences
│   └── Advanced Settings
│       ├── API Access
│       └── Export/Import Configurations
│
└── Help & Support
    ├── Documentation
    ├── FAQ
    ├── Contact Support
    └── Feature Requests
```

## Client-Side Routes

In a Vite + React SPA architecture, all routes are handled by client-side routing. The application will use a routing library (likely React Router) to manage navigation between these views without full page reloads.

The routes would follow this pattern:
- `/` - Dashboard
- `/configurations` - Configuration List
- `/configurations/:id` - Configuration Detail
- `/configurations/new` - Create New Configuration
- `/configurations/templates` - Templates Management
- `/deployments` - Active Deployments
- `/deployments/history` - Deployment History
- `/deployments/:id` - Deployment Detail
- `/teams` - Team Overview
- `/teams/invitations` - Invitations
- `/teams/members/:id` - Member Detail
- `/teams/access` - Access Control
- `/secrets` - API Keys/Secrets
- `/tools` - Tool Gallery (Future Feature)
- `/settings` - Account Settings
- `/settings/billing` - Billing
- `/settings/appearance` - Appearance
- `/settings/advanced` - Advanced Settings
- `/help` - Help & Support

## Modal Dialogs and Overlays

The modals and overlay components in the SPA architecture remain consistent with the original plan:

```
Modal Dialogs
├── Configuration Creation
│   ├── Template Selection
│   └── Initial Configuration
├── Version Management
│   ├── Version Comparison
│   ├── Restore Confirmation
│   └── Version Detail
├── Team Management
│   ├── Invite Member
│   ├── Edit Member Role
│   └── Remove Member Confirmation
├── Deployment
│   ├── Deployment Confirmation
│   ├── Deployment Status
│   └── Deployment Error Details
├── Secret Management
│   ├── Add New Secret
│   ├── Edit Secret
│   └── Delete Secret Confirmation
└── Billing and Subscription
    ├── Plan Comparison
    ├── Payment Information
    └── Cancellation Confirmation
```

## API Endpoints

To support the SPA frontend, the Cloudflare Worker backend will provide these API endpoints:

```
API Routes
├── /api/auth
│   └── /api/auth/profile - Get current user profile
├── /api/accounts
│   ├── /api/accounts - List accounts, create account
│   ├── /api/accounts/:id - Get, update, delete account
│   ├── /api/accounts/:id/members - Manage members
│   └── /api/accounts/invitations - Manage invitations
├── /api/configurations
│   ├── /api/configurations - List, create configurations
│   ├── /api/configurations/:id - Get, update, delete configuration
│   ├── /api/configurations/templates - Manage templates
│   └── /api/configurations/:id/versions - Configuration versions
├── /api/deployments
│   ├── /api/deployments - List, create deployments
│   ├── /api/deployments/:id - Get, update, stop deployment
│   └── /api/deployments/:id/logs - Get deployment logs
├── /api/secrets
│   ├── /api/secrets - List, create secrets
│   └── /api/secrets/:id - Get, update, delete secret
└── /api/billing
    ├── /api/billing/subscription - Manage subscription
    └── /api/billing/payment - Manage payment methods
```

## Architectural Implications

The SPA architecture has these implications for the sitemap implementation:

1. **Navigation Flow**: All navigation happens client-side, providing a smoother, more app-like experience.

2. **Data Loading**: Each view will load data via API calls to the backend, potentially with loading states.

3. **State Management**: Application state (like current user, selected account) will be managed in client-side state.

4. **Authentication**: Cloudflare Access will handle authentication before the SPA loads, with the Worker validating tokens.

5. **Form Submission**: Forms will be submitted via API calls rather than traditional form submissions.

This architecture maintains all the functionality of the original sitemap while adapting it to the Vite + React SPA model with a Cloudflare Worker backend.
