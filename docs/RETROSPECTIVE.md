# Leger Project Retrospective

## Initial Concept & Validation
Minimum functional product used to validate usefulness was the [following railway.app template](https://railway.com/new/template/Hez7Hu).
Allowed for quick deployment of Open-webui and Pipelines backend combo with simple configuration management (environment variables). This was using the official docker images. Was limited by: annoying to maintain (openwebui project moving very fast, hard to update each time).
Instead we prefer python deployments.

Open-webui has [many environment variables which allow for advanced functionality](https://docs.openwebui.com/getting-started/env-configuration) but the administrator has to be aware of many configuration flags and environment variables, often relying on external services (third-party or hosted on own infra).

## Technical Exploration Outcomes
### Vercel UI Component Analysis
### Storing owui configs in supabase database
Save the configuration in jsonb format in the database as it makes migrations easier down the road:
```
CREATE TABLE user_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Config UUID
  user_id UUID NOT NULL,                         -- Reference to your users
  name TEXT,                                     -- Optional: user-friendly label (e.g., "Prod S3 Config")
  schema_version TEXT NOT NULL,                  -- Ties this config to your OpenAPI spec version
  config JSONB NOT NULL,                         -- The actual stripped-down config
  created_at TIMESTAMPTZ DEFAULT NOW(),          -- When this version was saved
  updated_at TIMESTAMPTZ DEFAULT NOW(),          -- Updated on modification
  is_latest BOOLEAN DEFAULT TRUE,                -- Helps with quick lookups
  version INTEGER GENERATED ALWAYS AS IDENTITY,  -- Auto-incrementing version for each config set
  rollback_of UUID                               -- Optional: tracks if this was a rollback of another version
);
```
Potential future improvement: Besides UUIDs, let users label their configs as `dev`, `prod`, `staging` as this makes config retrieval more human-readable and reduces errors
### Single source of truth schema Enhancement Explorations
The zod validation schema was not a good choice for being single source of truth because it has to be per-page. It is not a unified file and on a per data entry form per entity basis (entity is a grouping of env variables).
This is why we chose the OpenAPI specification, which can serve as single source of truth for the dashboard.
### Secrets management on Leger:
```
Architecture Overview
1. Cloudflare Workers + KV (Frontend/UI + Local Cache)
- You build a lightweight web UI using Cloudflare Workers.
- Cloudflare KV stores a mirror/cached copy of the secrets.
- Users interact with this UI to view, create, edit, or delete secrets.

2. Sync Layer (2-Way Sync to/from Beam)
- Since Beam secrets can only be managed via CLI:
- You run a backend script (could be a server, or even a GitHub Action, etc.) that:
- Reads KV state and pushes changes to Beam via beam secret create|modify|delete.
- Fetches current Beam secrets via beam secret list/show, and updates KV.
- Can run periodically or be triggered via webhook.
```
### Authentication management for OWUI instances:
Comments on auth-less owui instances with beam.cloud follow:

```
# Unguessable URL Security Approach for Ephemeral OpenWebUI Instances
## MVP Security Implementation
For the Minimum Viable Product (MVP) of our ephemeral OpenWebUI instance platform, we will implement the "unguessable URL" security approach. This method provides a reasonable balance between security and ease of use during initial deployment.
### How Unguessable URLs Work
When a user authenticates through our central portal and requests a new OpenWebUI instance, our system will:
1. Generate a cryptographically secure random UUID (128-bit value)
2. Create a URL pattern such as `https://instance-[UUID].our-domain.com`
3. Provision the requested OpenWebUI environment at this URL
4. Present the URL to the authenticated user
This approach relies on the mathematical improbability of guessing a valid UUID. With 2^128 possible combinations (approximately 340 undecillion unique values), brute-force discovery of active instances becomes practically impossible.
### Key Security Properties
- **No Secondary Authentication**: Once the URL is generated, accessing the OpenWebUI instance requires no additional login step
- **Ephemeral Nature**: Instances are temporary by design, limiting the window of potential exposure
- **Low Friction**: Users can easily share access with collaborators by simply sharing the URL
- **Session Isolation**: Each instance operates in isolation from other users' environments
## Future Security Enhancements
As our platform matures beyond MVP, we plan to implement additional security layers:
### Short-Term Enhancements
- **Configurable Session Timeouts**: Automatic termination of inactive instances after a predetermined period
- **IP Restriction Options**: Allow administrators to limit access to specific IP ranges or corporate networks
- **Manual Termination Controls**: Enable users to explicitly end sessions when work is complete
- **Access Logs**: Implement comprehensive logging of all instance access attempts
### Long-Term Security Roadmap
- **Continuous Authentication**: Require periodic re-authentication during longer sessions
- **JWT-Based Access Tokens**: Implement short-lived JWT tokens in the URL that expire automatically
- **OIDC Integration**: Deeper integration with organizational identity providers for seamless authentication
- **Role-Based Access Controls**: Different permission levels within shared instances
- **Encrypted Storage**: End-to-end encryption for any persistent data within instances
- **Network Isolation**: Advanced network controls to restrict what services instances can connect to
By starting with the unguessable URL approach and progressively enhancing security, we can deliver immediate value while establishing a path toward enterprise-grade security for more demanding use cases. 
```

## Architectural Evolution: Single-Worker Cloudflare Architecture

After extensive analysis of requirements and implementation options, we've made the strategic decision to adopt a single Cloudflare Worker architecture that handles both frontend and backend responsibilities. This architecture provides several advantages:

1. **Simplified Deployment**: A single Worker reduces deployment complexity and ensures consistency between frontend and backend code.
2. **Edge Computing Benefits**: Leveraging Cloudflare's global edge network provides low-latency access worldwide.
3. **Domain-Driven Design**: Organizing code by business domain rather than technical layer better aligns with Leger's configuration-centric model.
4. **Streamlined Development**: Using TypeScript throughout the entire stack with shared validation schemas reduces duplication and ensures consistency.

## Cloudflare Workers Python for Beam.cloud Integration

For OpenWebUI deployments, we leverage Cloudflare Workers Python runtime for direct integration with Beam.cloud. This approach utilizes the native Python support in Cloudflare Workers to run the Beam.cloud Python SDK directly. The Workers Python runtime provides:

1. **Native Python Environment**: Runs the Beam.cloud Python SDK natively within the Worker
2. **Direct API Integration**: Eliminates intermediate services by connecting directly to Beam.cloud
3. **Deployment Orchestration**: Handles the complete lifecycle of OpenWebUI pod deployments within the Worker
4. **Integrated Secret Management**: Manages credentials directly within the Cloudflare ecosystem

This streamlined approach combines the strengths of Cloudflare's edge computing platform with direct access to Beam.cloud's specialized container deployment capabilities.

## Future Exploration Areas
[Areas that warrant further investigation]

## Consolidated Development Approach
[The go-forward development methodology]

## Architectural Evolution: Backe-end heavy to Front-end heavy
Previously drew maximal inspiration from [Suna](https://github.com/kortix-ai/suna) which open-sourced their Manus alternative. Afterwards, based on our thorough analysis of both codebases, we decided to deviate from their decisions. Reasoning below:
```
## Why Suna Needed a Comprehensive Python Backend

Suna's architecture requirements were fundamentally driven by its core functionality as an AI agent execution platform:
2. **Sandbox Isolation**: Running untrusted code and browser automation required Docker-based isolation, which is much more naturally implemented in Python.
3. **Streaming Responses**: Handling real-time streaming of AI responses from multiple providers needed sophisticated async capabilities.
4. **Complex Tool Integration**: Suna's tools (browser automation, file management, API integration) required deep system-level access.
5. **State Management**: Long-running agent processes needed sophisticated state tracking and persistence.
These requirements made Python with FastAPI a natural choice, as Python excels at system integration, has a rich AI/ML ecosystem, and FastAPI offers excellent async capabilities.

## Why Leger Can Use a More Frontend-Heavy Approach

Leger's core functionality is fundamentally different:
1. **Configuration Management**: Your primary task is validating and storing configuration data - essentially a sophisticated form.
2. **Type Validation**: You've correctly placed this at the frontend using React Hook Form and Zod, which provides immediate feedback.
3. **Deployment Orchestration**: Your backend primarily needs to convert validated JSON to environment variables and call Beam.cloud APIs.
4. **No Streaming Requirements**: You don't need to handle real-time streaming of content generated by AI.
5. **No Sandbox Needs**: You're not running user code or browser automation within your application.
The complexity in Leger is primarily in the frontend validation logic and ensuring configurations are correct. The backend operations are more straightforward - converting configurations and making API calls to Beam.cloud.

## The Right Architecture for Leger
Your approach using Cloudflare Workers as a lightweight backend is well-aligned with Leger's actual requirements:
1. **Frontend Handles Complexity**: Placing the validation complexity in the frontend with React Hook Form and Zod is appropriate since configuration validation is your primary challenge.
2. **Workers for Orchestration**: Cloudflare Workers excels at request-response operations like configuration conversion and API orchestration.
3. **Beam.cloud for Execution**: Offloading the actual OpenWebUI execution to Beam.cloud eliminates the need for container management in your backend.
This creates a more streamlined architecture that still fulfills all your requirements without the overhead of maintaining a complex Python backend that you simply don't need.

## Conclusion
Your intuition is correct: Leger does not need the same level of backend complexity as Suna. Your frontend-heavy approach with Cloudflare Workers is not only adequate but actually better aligned with your specific requirements.
Suna's robust Python backend was necessary for its AI agent execution requirements. Leger's configuration management needs are fundamentally different and more suited to your frontend-heavy approach with a lightweight Cloudflare Workers backend.
By understanding these architectural differences, you've made a sound decision that will likely result in a more maintainable system that's better aligned with your actual requirements while avoiding unnecessary complexity.
```
## Direct Comparison with Suna

| Requirement | Suna's Approach | Leger's Approach | Why Leger's Approach Works |
|-------------|-----------------|------------------|----------------------------|
| User Input Processing | Backend validation | Frontend validation with Zod | Configuration validation is naturally a frontend concern |
| Data Storage | PostgreSQL via Supabase | JSON configurations in database | Configuration storage is simpler than agent state management |
| Backend Processing | Complex agent execution | Simple JSON-to-ENV conversion | No need for the computational complexity Suna requires |
| Deployment | Container sandbox management | API calls to Beam.cloud | Beam.cloud handles the execution complexity |
| Real-time Features | Streaming responses | Status polling is sufficient | No need for sophisticated streaming capabilities |

# Initial Exploration: Selecting Beam.cloud as dedicated compute:

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
