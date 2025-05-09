# Leger: OpenWebUI Configuration Management

A configuration management platform for managed OpenWebUI deployments.

Leger is a comprehensive openwebui configuration management tool that works like Github Codespaces (or previously [Gitpod](gitpod.io), Coder and DevPod) and [ComfyUI Deploy](comfydeploy.com) but instead of launching VSCode-in-browser or comfyui; Leger enables users to launch pre-configured Open-webui sessions with full batteries included.

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

[Optional: A short demo video or screenshot]

## Core Features

- [Key feature 1]
- [Key feature 2]
- [Key feature 3]

## User Journeys

### Administrator Journey
Team admins are responsible for choosing the LLM APIs they want their team to use, and want to provision [openwebui](https://openwebui.com/) instance for their whole team to enjoy. They should not worry about the end-to-end deployment and maintenance of this tool with its myriad functionality on their own infrastructure. They want to be able to centralize user creation/management, provisioning and secret management. When they find new ways to integrate AI into their existing workflows or services, they should be able to propagate this to all other members of their team instantly.

### End User Journey
Besides from the admin, users just want to access a company-approved ChatGPT-esque interface where they can do their work while remaining compliant with the company's internal LLM policy (especially if they are working in an industry where organizations are anxiously working to maintain full ownership over their data). They should enjoy any new functionality as soon as it is made available by the team admin/as if there were updates in ChatGPT/Claude/etc.

## Architecture Overview

[Simplified architecture diagram or description]

## Technical Details & Implementation Considerations

It is important to distinguish the OWUI deployments which rely entirely on Beam.cloud from the "actual webapp" that I will be coding myself. 

My vision for Leger is to enable "fully decked out" openwebui managed deployments out-of-the-box. This means that we are responsible for provisioning those "support" services (ie. different data/object storage types) automatically for each Leger account. For this we will rely on two providers (at least until Q4'25); in order of preference:
1) Beam.cloud: It's like Beam was purpose-built to exist as infrastructure support and backbone for Leger. We aim to rely maximally on its available tooling and capabilities, including its Pods deployments (example of this for a simple OWUI session at the end of this doc). It also has ASGI (asynchronous server gateway interface) already baked in.
2) Cloudflare: I have access to Cloudflare credits, and we can benefit from its vast ecosystem of database services (including redis, s3 object, postgres equivalent etc). [Recent cloudflare workers developments](https://blog.cloudflare.com/full-stack-development-on-cloudflare-workers) make it very attractive option to host the Leger webapp (configuration management tool). More on this in a following section. 

Open-webui offers extremely comprehensive advanced AI capabilities, all in one OSS product but its configuration involves many moving pieces:
- [Standalone Front-end](https://github.com/open-webui/open-webui)
- [Pipelines Middleware](https://github.com/open-webui/pipelines)
- [External Tool Server Implementation](https://github.com/open-webui/openapi-servers)
- [MCP Proxy for standard compatibility](https://github.com/open-webui/mcpo)
This rich ecosystem shows that we need more than one service running on Beam.cloud at a time. Again this is why I am so excited about Pods. 
We also note that, by centralizing all our deployments on Beam, we avoid running into any complications related to CORS (cross-origin resource sharing) complications which I really do not want to deal with. I abstract this away, and assume that Pods running on the same Beam.cloud are on the same VPC (virtual private cloud) thereby reducing the complexity on my end.
Tools (either MCP or "regular" OpenAPI servers) exist as standardized servers in the OWUI world. My understanding is that it is best to have each tool as standalone microservice - making us indifferent to interacting with the tool "directly" through the OWUI front-end, or through  a pipeline middleware. It's all regular function calling after all. [MCP tools themselves](https://modelcontextprotocol.io/introduction) can be in Python, Java, Typescript, or even Kotlin and C# (lol). Ideally those are also hosted on Beam.cloud but if not [there are many companies building specifically in this space, including cloudflare](https://a16z.com/a-deep-dive-into-mcp-and-the-future-of-ai-tooling/).
I am not 100% on which service to set up as long-running (via `--keep-warm-seconds -1`) on Beam.cloud but the Beam team can help me evaluate cost considerations vs functionality.
