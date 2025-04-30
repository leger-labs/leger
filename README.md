## Ideal User Journeys

Leger is a comprehensive openwebui configuration management tool that works like Github Codespaces (or previously Gitpod, Coder and DevPod) but instead of launching VSCode-in-browser, Leger enables users to launch pre-configured Open-webui sessions with full batteries included.

Team admins are responsible for choosing the LLM APIs they want their team to use, and want to provision [openwebui](https://openwebui.com/) instance for their whole team to enjoy. They should not worry about the end-to-end deployment and maintenance of this tool with its myriad functionality on their own infrastructure. They want to be able to centralize user creation/management, provisioning and secret management. When they find new ways to integrate AI into their existing workflows or services, they should be able to propagate this to all other members of their team instantly.

Besides from the admin, users just want to access a company-approved ChatGPT-esque interface where they can do their work while remaining compliant with the company's internal LLM policy (especially if they are working in an industry where organizations are anxiously working to maintain full ownership over their data). They should enjoy any new functionality as soon as it is made available by the team admin/as if there were updates in ChatGPT/Claude/etc.

tldr; 
- leger.run is a SaaS platform that allows administrators to:
    - Deploy and configure OpenWebUI instances on Beam Pods
    - Manage configuration settings for these instances
    - Monitor deployment status and resource usage
    - View logs and troubleshoot issues
    - Manage user access and permissions
- The platform serves two primary user types:
    - Administrators: Technical users who deploy and configure OpenWebUI instances
    - End users: Users who access the deployed OpenWebUI instances

## Background
Minimum functional product used to validate usefulness was the [following railway.app template](https://railway.com/new/template/Hez7Hu).
Allowed for quick deployment of Open-webui and Pipelines backend combo with simple configuration management (environment variables). This was using the official docker images. Was limited by: annoying to maintain (openwebui project moving very fast, hard to update each time).
Instead we prefer python deployments.

Open-webui has [many environment variables which allow for advanced functionality](https://docs.openwebui.com/getting-started/env-configuration) but the administrator has to be aware of many configuration flags and environment variables, often relying on external services (third-party or hosted on own infra).
For example:
- [S3 Storage for uploaded files](https://docs.openwebui.com/tutorials/s3-storage)
- [Offloading background tasks to smaller LLM](https://docs.openwebui.com/tutorials/tips/improve-performance-local/)
- [Redis for session consistency/persistency](https://docs.openwebui.com/getting-started/env-configuration#redis)
- [Database structure, sqlite by default but we want Postgres](https://docs.openwebui.com/tutorials/tips/sqlite-database)

My vision for Leger is to enable "fully decked out" openwebui managed deployments out-of-the-box. This means that we are responsible for provisioning those "support" services (ie. different data/object storage types) automatically for each Leger account. For this we will rely on two providers (at least until Q4'25); in order of preference:
1) Beam.cloud: It's like Beam was purpose-built to exist as infrastructure support and backbone for Leger. We aim to rely maximally on its available tooling and capabilities, including its Pods deployments (example of this for a simple OWUI session at the end of this doc). It also has ASGI (asynchronous server gateway interface) already baked in.
2) Cloudflare: I have hundreds of thousands of dollars of Cloudflare credits, and we can benefit from its vast ecosystem of database services (including redis, s3 object, postgres equivalent etc.)

It is important to distinguish the OWUI deployments which rely entirely on Beam.cloud from the "actual webapp" that I will be coding myself. [Recent cloudflare workers developments](https://blog.cloudflare.com/full-stack-development-on-cloudflare-workers) make it very attractive option to host the Leger webapp (configuration management tool). More on this in a following section. 

Open-webui offers extremely comprehensive advanced AI capabilities, all in one OSS product but its configuration involves many moving pieces:
- [Standalone Front-end](https://github.com/open-webui/open-webui)
- [Pipelines Middleware](https://github.com/open-webui/pipelines)
- [External Tool Server Implementation](https://github.com/open-webui/openapi-servers)
- [MCP Proxy for standard compatibility](https://github.com/open-webui/mcpo)
This rich ecosystem shows that we need more than one service running on Beam.cloud at a time. Again this is why I am so excited about Pods. 
We also note that, by centralizing all our deployments on Beam, we avoid running into any complications related to CORS (cross-origin resource sharing) complications which I really do not want to deal with. I abstract this away, and assume that Pods running on the same Beam.cloud are on the same VPC (virtual private cloud) thereby reducing the complexity on my end.
Tools (either MCP or "regular" OpenAPI servers) exist as standardized servers in the OWUI world. My understanding is that it is best to have each tool as standalone microservice - making us indifferent to interacting with the tool "directly" through the OWUI front-end, or through  a pipeline middleware. It's all regular function calling after all. [MCP tools themselves](https://modelcontextprotocol.io/introduction) can be in Python, Java, Typescript, or even Kotlin and C# (lol). Ideally those are also hosted on Beam.cloud but if not [there are many companies building specifically in this space, including cloudflare](https://a16z.com/a-deep-dive-into-mcp-and-the-future-of-ai-tooling/).
I am not 100% on which service to set up as long-running (via `--keep-warm-seconds -1`) on Beam.cloud but the Beam team can help me evaluate cost considerations vs functionality.

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
Python middleware using FastAPI. Our configuration validation approach follows this pipeline:
1. OpenAPI specification automatically generated from Open WebUI's documentation
2. This specification serves as the "single source of truth" for environment variables
3. Backend validates against this schema using Pydantic models
4. Frontend validates using Zod schemas (derived from the same OpenAPI spec)
This dual-validation approach ensures configuration correctness at both client and server levels, with immediate feedback for administrators.

Further down the line, we can set up automated scripts that scan OWUI documentation for new environment variables ("features") made available. For this we could use [openhands github action](https://docs.all-hands.dev/modules/usage/how-to/github-action) but this is out of scope for an MVP. New fields would then be automatically incorporated into our Pydantic models.

### 3) Backend:
The backend implementation is well underway with core functionality already established:
- Account management system built with Supabase and custom API endpoints
- Authentication flows including signup, login, JWT handling
- Billing integration with Stripe supporting subscription management
- Configuration versioning and template management

The system uses Prisma for database operations, with models for account structure, configuration storage, and version history.

Implement functionality to import configurations from existing sources, or to export configuration as JSON should the admin's needs change (example: they decide to host OWUI on their own infrastructure or go for an OWUI enterprise license).

### 4) Configuration Management:
The configuration management system now follows a documentation-first approach:
- OpenAPI specification automatically derived from Open WebUI's official documentation
- Parsing system extracts all environment variables and their metadata
- Validation rules generated from the documentation ensure configurations meet requirements
- Future updates to Open WebUI will be automatically incorporated through documentation scanning

Beam.cloud remains the core infrastructure for OWUI deployments, with several key components:

Wrapper around Beam CLI/SDK that handles deployment and management of OWUI instances on Beam Pods
Configuration transformation from Leger's validated schema to Beam deployment parameters
Integration with the OpenAPI specifications derived from OWUI documentation to ensure all environment variables are properly set

This approach ensures deployments follow a "configuration as code" model that is version controlled and validated before deployment.

### 5) Persistent Storage:
Part of what makes OWUI so powerful is the 5+ auxiliary services that add functionality: Postgres db for chat data, Redis, S3/object storage for file uploads, etc.
At the moment of writing we are considering bundling by default:
- Cloudflare Workers Backend for the actual webapp
- Cloudflare D1 or compatible database
- Cloudflare R2 for file storage, or Beam alternative (preferred)
- [Upstash](https://developers.cloudflare.com/workers/databases/native-integrations/upstash/) ie. Redis
We need to decide which services are provided by Beam.cloud, and which ones to spin up on Cloudflare. 

### 6) Additional moving pieces:
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

## Front-end Dashboard Considerations
OWUI has over 340 configuration variables. Currently this was converted to a single OpenAPI json file (in `/schemas`) but we need to further refine the groupings or hierarchies.

Specifically we must first decide which flags to have by default, since Leger provisions some additional functionality by default (as mentioned previously: Redis and S3 storage at the minimum).

From the OWUI environment variables docs, we find that it has the following headers, implying an intuitive grouping:
- App/Backend
- Security Variables
- Vector Database
- RAG Content Extraction Engine
- Retrieval Augmented Generation (RAG)
- Web Search
- Audio
- Image Generation
- OAuth
- LDAP
- User Permissions
- Misc Environment Variables

Leger dashboard is actually used for more than only the OWUI environment variables configuration. 
namely there should be sections for:
* team management (since each admin can add people to his team) which lets them manage invites and other users to be added to their group [INVESTIGATE the leger /backend files to make sure that this is indeed possibler in my data model]; there might also be the opportunity for the admin to set user-specific permissions within the openwebui interface 
* secrets: this is where the admin can input LLM API keys (like openai, openrouter, claude anthropic etc etc) 
* tools: COMING SOON, but Leger goes beyond "simple" openwebui front end deployments. indeed, the admin should also be able to provision tools on demand. with openwebui, tools can be "injected" directly into the chat interface, or "abstracted" into an openwebui pipeline. we want to have a "gallery view" which shows all the preset/"approved" tools 
* api keys: some tools are MCP servers which connect to third-party services; for example a google calendar, linear.app or other servers (related to some of but not all the Tools in the section above)
* billing/plans: a simple button for managing account billing. is a stripe redirect to begin with but then is managed in-webapp.
* analytics: COMNG SOON lets the admin do some monitoring on their team's openwebui usage activity
Note: api keys and Secrets are managed by beam.cloud secrets directly rather than through my own database.



### Additional Information:

Beam.cloud team already prepared [simple open-webui deployment example](https://github.com/beam-cloud/examples/pull/79/files):
```markdown
# Open WebUI Server

We'll deploy [Open WebUI](https://github.com/open-webui/open-webui) using a Beam Pod. Useful for running a self-hosted chat UI connected to a custom LLM backend.

## Usage

Edit and run the script below to deploy your Open WebUI pod:

`python app.py`

Once deployed, the server URL will be printed to your console. Open it in your browser to access the WebUI.

## Notes

- Update your `BEAM_LLM_API_BASE_URL` and `BEAM_API_KEY` before running.
- The base URL must be an OpenAI-compatible endpoint.  
  For example, you can follow this [guide for using Qwen2.5-7B with SGLang](https://docs.beam.cloud/v2/examples/sglang).
```

app.py:
```python
from beam import Pod, Image

image = Image(
    python_version="python3.11",
).add_commands(
    [
        "pip install --ignore-installed blinker",
        "pip install open-webui",
    ]
)

BEAM_LLM_API_BASE_URL = ""  # Replace with your Beam LLM API base URL
BEAM_API_KEY = ""  # Replace with your Beam API key

webui_server = Pod(
    name="open-webui",
    cpu=12,
    memory="32Gi",
    gpu="A10G",
    ports=[8080],
    image=image,
    env={
        "OPENAI_API_BASE_URL": BEAM_LLM_API_BASE_URL,
        "OPENAI_API_KEY": BEAM_API_KEY,
    },
    entrypoint=["sh", "-c", "open-webui serve"],
)

result = webui_server.create()
print("URL:", result.url)
```


