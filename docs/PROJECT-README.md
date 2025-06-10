# Leger: OpenWebUI Configuration Management

A configuration management platform for managed OpenWebUI deployments.

Leger is a comprehensive openwebui configuration management tool that works like Github Codespaces (or previously [Gitpod](gitpod.io), Coder and DevPod) and [ComfyUI Deploy](comfydeploy.com) but instead of launching VSCode-in-browser or comfyui; Leger enables users to launch pre-configured Open-webui sessions with full batteries included.

Openwebui has over a hundred flags/environment variables it can be run with. 
My goal with leger is to abstract away the overhead of spinning up additional services to get a "fully featured" openwebui deplyoment, from the admin who just wants to givve their team a chatgpt equivalent "with superpowers".

## How It Works

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

New user flow:
* admin opens leger configurator
* uses the gui to create a new deployment config
* the gui is written in a way that catches any error before pushing with its robust zod schema for validation on the front end
* admin saves the config which is now a new json file with a uuid (saved in D1 database, with timestamps)
* admin can "launch" an openwebui workspace which starts the beam.cloud pod with all the environment variables

## Core Features

- **Configuration Management**: Create, update, and version JSON configuration data for OpenWebUI
- **Template System**: Create and share configuration templates
- **Team Collaboration**: Team accounts with role-based permissions
- **Version Control**: Track changes to configurations with comparison and restoration
- **Subscription Model**: Tiered access with free and paid options
- **Per-Account Resource Provisioning**: Dedicated storage and services for each tenant

## Subscription Plans

- **Free Tier**:
  - Available after trial expiration
  - Limited to 3 configurations
  - Cannot create or share templates
  - Basic versioning features only

- **Standard Plan** ($99/month):
  - 50 configurations maximum
  - Full template creation and sharing
  - Advanced versioning features
  - All collaboration capabilities

- **Trial Period**:
  - 14 days of full access
  - Automatically provided to new users
  - All premium features available
  - Seamless transition to paid plan

## User Journeys

### Administrator Journey
Team admins are responsible for choosing the LLM APIs they want their team to use, and want to provision [openwebui](https://openwebui.com/) instance for their whole team to enjoy. They should not worry about the end-to-end deployment and maintenance of this tool with its myriad functionality on their own infrastructure. They want to be able to centralize user creation/management, provisioning and secret management. When they find new ways to integrate AI into their existing workflows or services, they should be able to propagate this to all other members of their team instantly.

### End User Journey
Besides from the admin, users just want to access a company-approved ChatGPT-esque interface where they can do their work while remaining compliant with the company's internal LLM policy (especially if they are working in an industry where organizations are anxiously working to maintain full ownership over their data). They should enjoy any new functionality as soon as it is made available by the team admin/as if there were updates in ChatGPT/Claude/etc.

## Architecture Overview

Leger employs a single Cloudflare Worker architecture that handles both frontend and backend responsibilities, with Cloudflare Workers Python providing direct integration to Beam.cloud for OpenWebUI deployments:

```
Frontend/Backend (Cloudflare Worker) → Beam.cloud → OpenWebUI Pods
```

## Technical Details & Implementation Considerations

Leger is built with the following architecture:

1. **Single Cloudflare Worker**: 
   - Handles both frontend rendering and backend API logic
   - Uses domain-driven design to organize code by business function
   - Implements React for frontend with shadcn/ui components

2. **Database**:
   - Cloudflare D1 (SQLite-compatible) with Drizzle ORM
   - Type-safe database operations with comprehensive schema
   - Version tracking for configurations

3. **Authentication**:
   - Cloudflare Access for identity management
   - JWT-based authentication flow
   - Application-level authorization with role-based permissions

4. **Resource Management**:
   - Per-tenant R2 buckets for dedicated object storage
   - Per-tenant Upstash Redis instances
   - Cloudflare KV for secrets management (synchronized with Beam.cloud)

5. **Deployment Bridge**:
   - Cloudflare Workers Python runtime connects directly to Beam.cloud
   - Python-based deployment orchestration
   - Environment variable transformation for OpenWebUI pods

Open-webui offers extremely comprehensive advanced AI capabilities, all in one OSS product but its configuration involves many moving pieces:
- [Standalone Front-end](https://github.com/open-webui/open-webui)
- [Pipelines Middleware](https://github.com/open-webui/pipelines)
- [External Tool Server Implementation](https://github.com/open-webui/openapi-servers)
- [MCP Proxy for standard compatibility](https://github.com/open-webui/mcpo)
This rich ecosystem shows that we need more than one service running on Beam.cloud at a time. Again this is why I am so excited about Pods. 
We also note that, by centralizing all our deployments on Beam, we avoid running into any complications related to CORS (cross-origin resource sharing) complications which I really do not want to deal with. I abstract this away, and assume that Pods running on the same Beam.cloud are on the same VPC (virtual private cloud) thereby reducing the complexity on my end.
Tools (either MCP or "regular" OpenAPI servers) exist as standardized servers in the OWUI world. My understanding is that it is best to have each tool as standalone microservice - making us indifferent to interacting with the tool "directly" through the OWUI front-end, or through  a pipeline middleware. It's all regular function calling after all. [MCP tools themselves](https://modelcontextprotocol.io/introduction) can be in Python, Java, Typescript, or even Kotlin and C# (lol). Ideally those are also hosted on Beam.cloud but if not [there are many companies building specifically in this space, including cloudflare](https://a16z.com/a-deep-dive-into-mcp-and-the-future-of-ai-tooling/).
I am not 100% on which service to set up as long-running (via `--keep-warm-seconds -1`) on Beam.cloud but the Beam team can help me evaluate cost considerations vs functionality.
