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
