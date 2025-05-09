## Selected Components
### 1) Frontend:
React with Shadcn UI component library. This provides:
- Pre-built, accessible components that integrate well with form validation
- Consistent design language following [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) standards  
- Built-in keyboard navigation and semantic HTML structure

The frontend will use a comprehensive form validation approach:
- React Hook Form for efficient form state management
- Zod for schema validation with zodResolver integration
- Real-time feedback on configuration errors

### 2) Middleware:
Our configuration validation approach follows this pipeline:
1. OpenAPI specification automatically generated from Open WebUI's documentation
2. This specification serves as the "single source of truth" for environment variables
3. Frontend validates using Zod schemas (derived from the same OpenAPI spec)
This validation approach ensures configuration correctness at both client and server levels, with immediate feedback for administrators.

The Leger Configuration management UI lets the admin create multiple OWUI configurations. Each OWUI config gets assigned a UUID, and a json file that contains the entire configuration that is to be turned into .env and passed to the beam.cloud owui session at launch.

Further down the line, we can set up automated scripts that scan OWUI documentation for new environment variables ("features") made available. For this we could use [openhands github action](https://docs.all-hands.dev/modules/usage/how-to/github-action).

### 3) Backend:
The backend implementation is well underway with core functionality already established:
- Account management system built with Supabase and custom API endpoints
- Authentication flows including signup, login, JWT handling
- Billing integration with Stripe supporting subscription management
- Configuration versioning and template management

Implement functionality to import configurations from existing sources, or to export configuration as JSON should the admin's needs change (example: they decide to host OWUI on their own infrastructure or go for an OWUI enterprise license).

### 4) Persistent Storage:
Part of what makes OWUI so powerful is the 5+ auxiliary services that add functionality: Postgres db for chat data, Redis, S3/object storage for file uploads, etc.
At the moment of writing we are considering bundling by default:
- Cloudflare Workers Backend for the actual webapp
- Cloudflare D1 or compatible database
- Cloudflare R2 for file storage, or Beam alternative (preferred)
- [Upstash](https://developers.cloudflare.com/workers/databases/native-integrations/upstash/) ie. Redis
We need to decide which services are provided by Beam.cloud, and which ones to spin up on Cloudflare. 

### 5) Additional moving pieces:
#### (A) Account creation/user authentication/authorization
✅ Implemented using Basejump framework with Supabase Auth
✅ Personal and team account management 
✅ Role-based authorization system with owner/member permissions

#### (B) Subscription management/billing system
✅ Stripe integration with webhook handling
✅ Trial period management
✅ Subscription tier enforcement
✅ Billing functions integrated with account permissions

#### (C) Secrets configuration
A special part of the Leger UI is the secrets section. This is where admins enter their LLM API keys (for example OpenAI, OpenRouter, or basically any other..) and possibly third-party API keys (if using MCP servers or other tooling).
For this, it is desirable to leverage [Beam.cloud's secrets management tool](https://docs.beam.cloud/v2/environment/secrets#using-secrets) directly rather than storing them on cloudflare.

##### (D) Future improvements:
- [Langfuse integration](https://docs.openwebui.com/tutorials/integrations/langfuse/) for observability and evaluations
- [Monitoring](https://docs.openwebui.com/getting-started/advanced-topics/monitoring/) for monitoring performance
- [Logging](https://docs.openwebui.com/getting-started/advanced-topics/logging/) for advanced monitoring 

##### (E) Code execution:
- [Code Execution](https://docs.openwebui.com/features/code-execution/) seems like a natural fit for Beam but we would need some additional piping work if the code contains libraries that are not pre-included [python](https://docs.openwebui.com/features/code-execution/python) 
- [Jupyter Notebooks](https://docs.openwebui.com/tutorials/jupyter/) another natural use case for Beam especially useful for users coming from preexisting notebook flows
- [ComfyUI and Automatic1111 Scheduler](https://docs.openwebui.com/getting-started/env-configuration#comfyui) given that Beam has already [prepared templates](https://docs.beam.cloud/v2/examples/comfy-ui) for those
- [Arbitrary Code Execution using Daytona](https://www.daytona.io/dotfiles) for any flow that falls out of scope from Beam side, since I already have a good relationship with Ivan Burazin

### REPORT OF WORK DONE SO FAR
Detailed report regarding account creation and subscription work so far is below. This is subject to change because we have decided to move away from a python backend, instead prefering a cloudflare (typescript) logic.

---

## Overview
We've successfully completed the first phase of adapting key components from the Suna codebase to support Leger's configuration-centric platform. The implementation focused on two critical areas as specified:
1. **Authentication and Account Database Elements** - Adapting the Basejump/Supabase user and account management system
2. **Billing System** - Transforming the usage-based billing to a fixed subscription model with Stripe integration
## Key Components Implemented
### 1. Database Schema Adaptation
We've successfully modified the Basejump account structure and created new schemas for Leger's configuration management:
- Simplified account metadata structure for cleaner implementation
- Created configuration tables with version history tracking
- Implemented template sharing functionality
- Updated Row Level Security (RLS) policies to enforce proper access controls
- Added helper functions for common database operations
The migration scripts follow a logical sequence that maintains compatibility with the Basejump framework while adding Leger-specific functionality:
- `20250501000000_leger-basejump-updates.sql` - Updates to account and billing structures
- `20250501000100_leger-configuration-schema.sql` - New configuration schema
- `20250501000200_leger-rls-updates.sql` - Security policy updates
- `20250502000000_leger-configurations-table.sql` - Main configuration tables
- `20250503000000_leger-billing-system.sql` - Simplified billing system
### 2. Authentication System Adaptation
The authentication system has been preserved and enhanced to support Leger's requirements:
- Maintained JWT-based authentication with Supabase
- Added configuration-specific access control functions
- Implemented a decorator system for role-based access control
- Created utility functions for verifying configuration access and ownership
Key files:
- `backend/utils/auth_utils.py` - Authentication utilities
- `backend/services/auth.py` - Authentication endpoints
### 3. Billing System Adaptation
The billing system has been successfully transformed from Suna's usage-based model to Leger's fixed subscription approach:
- Simplified to a single $99/month subscription with a 14-day trial
- Removed usage tracking and minute-based billing
- Maintained Stripe integration for subscription management
- Updated webhook handling for subscription lifecycle events
- Implemented feature flag enforcement based on subscription status
Key files:
- `backend/services/billing.py` - Billing services and Stripe integration
- `backend/services/subscription_utils.py` - Subscription utility functions
- `backend/utils/config.py` - Configuration with subscription settings
### 4. API Structure Adaptation
The API structure has been updated to support Leger's configuration-centric model:
- Authentication and account management endpoints preserved
- Simplified billing endpoints for the fixed subscription model
- New configuration management endpoints with CRUD operations
- Version control functionality for configurations
- Template sharing and management endpoints
Key files:
- `backend/api.py` - Main API application
- `backend/services/*.py` - Service modules for different functionality
- `backend/models/configuration.py` - Pydantic models for request/response validation
## Architecture Decisions
### Configuration-Centric Model
We've designed the system around configurations as the central resource, with:
- Version history tracking for all changes
- Template functionality for sharing and reuse
- Fine-grained access control based on account membership
- Feature flags tied to subscription status
### Simplified Subscription Model
We've implemented a clean, straightforward subscription system:
- Single paid tier at $99/month
- 14-day free trial for new accounts
- Clear feature limitations for free vs. paid users
- Smooth trial-to-paid conversion flow
NOTE: This specific section is subject to change, as we have not made a final decision on pricing plans yet.
### Security and Access Control
We've maintained strong security practices:
- Row Level Security policies at the database level
- Role-based access control for all operations
- Secure handling of subscription information
- Clean separation of public and private resources

