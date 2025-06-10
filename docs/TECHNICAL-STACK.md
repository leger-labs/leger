# Technical Stack

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
1. OpenAPI specification automatically derived from Open WebUI's official documentation
2. This specification serves as the "single source of truth" for environment variables
3. Frontend validates using Zod schemas (derived from the same OpenAPI spec)
This validation approach ensures configuration correctness at both client and server levels, with immediate feedback for administrators.

The Leger Configuration management UI lets the admin create multiple OWUI configurations. Each OWUI config gets assigned a UUID, and a json file that contains the entire configuration that is to be turned into .env and passed to the beam.cloud owui session at launch.

Further down the line, we can set up automated scripts that scan OWUI documentation for new environment variables ("features") made available. For this we could use [openhands github action](https://docs.all-hands.dev/modules/usage/how-to/github-action).

### 3) Backend:
A single Cloudflare Worker implements the backend with domain-driven design:
- Worker handles both API requests and serves the frontend application
- Domain-driven design organizes code by business function rather than technical layer
- Middleware pipeline for authentication, validation, and error handling
- Cloudflare Access for authentication and identity management
- Type-safe API with shared types between frontend and backend

### 4) Persistent Storage:
Part of what makes OWUI so powerful is the 5+ auxiliary services that add functionality: Postgres db for chat data, Redis, S3/object storage for file uploads, etc.
At the moment of writing we are implementing:
- Cloudflare Workers Backend for the single Worker architecture
- Cloudflare D1 for database (SQLite-compatible with Drizzle ORM)
- Cloudflare R2 for tenant-specific file storage
- Cloudflare KV for secrets management only
- [Upstash](https://developers.cloudflare.com/workers/databases/native-integrations/upstash/) Redis provisioned for each tenant

### 5) Additional moving pieces:
#### (A) Account creation/user authentication/authorization
- Cloudflare Access for authentication
- JWT mapping to internal user records
- Role-based authorization system with owner/member permissions
- Application-level authorization checks

#### (B) Subscription management/billing system
- Stripe integration with webhook handling
- Single pricing tier at $99/month with a 14-day free trial
- Trial period management for new users
- Subscription tier enforcement for premium features
- Billing functions integrated with account permissions

The subscription system provides clear limitations between tiers:
- Free tier: Maximum 3 configurations per account, no template creation
- Paid tier ($99/month): Maximum 50 configurations, full template creation and sharing
- Trial period: 14 days of full access to all premium features

#### (C) Secrets configuration
A special part of the Leger UI is the secrets section. This is where admins enter their LLM API keys (for example OpenAI, OpenRouter, or basically any other..) and possibly third-party API keys (if using MCP servers or other tooling).
Secrets are managed in Cloudflare KV and synchronized with Beam.cloud secrets for deployments.

##### (D) Future improvements:
- [Langfuse integration](https://docs.openwebui.com/tutorials/integrations/langfuse/) for observability and evaluations
- [Monitoring](https://docs.openwebui.com/getting-started/advanced-topics/monitoring/) for monitoring performance
- [Logging](https://docs.openwebui.com/getting-started/advanced-topics/logging/) for advanced monitoring 

##### (E) Code execution:
- [Code Execution](https://docs.openwebui.com/features/code-execution/) seems like a natural fit for Beam but we would need some additional piping work if the code contains libraries that are not pre-included [python](https://docs.openwebui.com/features/code-execution/python) 
- [Jupyter Notebooks](https://docs.openwebui.com/tutorials/jupyter/) another natural use case for Beam especially useful for users coming from preexisting notebook flows
- [ComfyUI and Automatic1111 Scheduler](https://docs.openwebui.com/getting-started/env-configuration#comfyui) given that Beam has already [prepared templates](https://docs.beam.cloud/v2/examples/comfy-ui) for those
- [Arbitrary Code Execution using Daytona](https://www.daytona.io/dotfiles) for any flow that falls out of scope from Beam side, since I already have a good relationship with Ivan Burazin
