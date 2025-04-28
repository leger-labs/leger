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
React for the admin UI, and Headless UI using [Catalyst](https://catalyst.tailwindui.com/docs)
Aim to make it compliant with [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) standards with keyboard navigation and semantic HTML structure.
We use FastAPI with RESTful endpoints for our API, which provides automatic OpenAPI documentation for client integration. The frontend will consume these APIs through standard fetch calls with appropriate error handling.
This is where the admin does configuration and team/user management, we would also need a proper hierarchy model in the database for teams, sending email notifications for new invites, or initial setup guidance.

### 2) Middleware:
Python middleware using FastAPI. We use Pydantic models for form/user input validation on the backend. These models serve as the "single source of truth" for the ensemble of environment variables and flags to be passed to the OWUI deployment. We can generate TypeScript types from the OpenAPI schema for frontend type safety.

Further down the line, we can set up automated scripts that scan OWUI documentation for new environment variables ("features") made available. For this we could use [openhands github action](https://docs.all-hands.dev/modules/usage/how-to/github-action) but this is out of scope for an MVP. New fields would then be automatically incorporated into our Pydantic models.

### 3) Backend:
Prisma to manage user accounts/authentication info, deployment history, status information, usage tracking, billing data, saved configurations for each user, and presents/config templates for OWUI deployments.
Implement functionality to import configurations from existing sources, or to export configuration as JSON should the admin's needs change (example: they decide to host OWUI on their own infrastructure or go for an OWUI enterprise license).

NOTE: Our validation approach combines Pydantic on the backend with Prisma for database management. This provides strong validation at both the API and database layers, creating a robust system for configuration management. Our goal with Leger is to simplify OWUI configuration management so it is crucial to feed consistent environment variables into the OWUI deployment on Beam otherwise the product breaks.

### 4) Beam deployment Backend:
Wrapper around Beam CLI/SDK that handles deployment and management of OWUI instances on Beam Pods.
Co-development opportunity to be discussed, depending on Beam's availability and willingness to help.

Further down the line, we could also implement some lifecycle management functionality to/from Beam backend directly into Leger dashboard: session analytics, monitoring dashboard for resource utilization, deployment logs and diagnostics.

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
Basejump schema for account/user management

#### (B) Subscription management/billing system
Stripe!

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



Previous scoping with claude yielded the following demo Open-webui Configuration Dashboard in react:
```js
import React, { useState } from 'react';
import { Save, Server, User, Search, Image, Globe, Database, Settings, Key, AlertTriangle } from 'lucide-react';

// Main configurator component
export default function OpenWebUIConfigurator() {
  // State for all configuration options
  const [config, setConfig] = useState({
    // Authentication & User Management
    enableSignup: true,
    enableLoginForm: true,
    
    // API Connections
    openaiApiKeys: "",
    openaiApiBaseUrl: "https://api.openai.com/v1",
    openaiApiBaseUrls: "",
    enableOllamaApi: false,
    
    // Feature Flags
    enableSearchQuery: true,
    enableRagWebSearch: true,
    ragWebSearchEngine: "duckduckgo",
    enableImageGeneration: true,
    imageGenerationEngine: "openai",
    enableRealtimeChatSave: false,
    
    // Deployment Config
    podName: "ollama-webui",
    cpu: 12,
    memory: 32,
    gpu: "A10G",
    port: 8080,
    pythonVersion: "3.11",
    volumeSize: 10
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would generate and download the Beam script
    console.log("Configuration submitted:", config);
    
    // Generate Python code
    const pythonCode = generatePythonCode(config);
    console.log(pythonCode);
  };

  // Generate Python code based on configuration
  const generatePythonCode = (config) => {
    // This would actually generate the Python code
    return `# Generated OpenWebUI Beam configuration`;
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Server className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-semibold">OpenWebUI Configurator</h1>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={handleSubmit}
          >
            <Save className="h-4 w-4 mr-2" />
            Generate Deployment Code
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto py-6 px-4 md:px-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Deployment Settings */}
            <ConfigSection 
              title="Pod Deployment" 
              icon={<Server className="h-6 w-6 text-blue-600" />}
              description="Configure the compute resources for your OpenWebUI deployment."
            >
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Pod Name</label>
                  <input
                    type="text"
                    name="podName"
                    value={config.podName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">CPU Cores</label>
                    <input
                      type="number"
                      name="cpu"
                      value={config.cpu}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Memory (GB)</label>
                    <input
                      type="number"
                      name="memory"
                      value={config.memory}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">GPU Type</label>
                    <select
                      name="gpu"
                      value={config.gpu}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="none">None</option>
                      <option value="A10G">NVIDIA A10G</option>
                      <option value="L4">NVIDIA L4</option>
                      <option value="A100">NVIDIA A100</option>
                      <option value="H100">NVIDIA H100</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Port</label>
                    <input
                      type="number"
                      name="port"
                      value={config.port}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Python Version</label>
                    <select
                      name="pythonVersion"
                      value={config.pythonVersion}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="3.9">Python 3.9</option>
                      <option value="3.10">Python 3.10</option>
                      <option value="3.11">Python 3.11</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Volume Size (GB)</label>
                    <input
                      type="number"
                      name="volumeSize"
                      value={config.volumeSize}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </ConfigSection>
            
            {/* Authentication Settings */}
            <ConfigSection 
              title="Authentication" 
              icon={<User className="h-6 w-6 text-blue-600" />}
              description="Configure user authentication and account management options."
            >
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableSignup"
                    name="enableSignup"
                    checked={config.enableSignup}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="enableSignup" className="ml-2 font-medium">
                    Enable Signup
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  When enabled, new users can register accounts. When disabled, only existing users can log in.
                </p>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableLoginForm"
                    name="enableLoginForm"
                    checked={config.enableLoginForm}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="enableLoginForm" className="ml-2 font-medium">
                    Enable Login Form
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  Controls visibility of the traditional login form elements including email, password fields, and sign-in button.
                </p>
              </div>
            </ConfigSection>
            
            {/* API Configuration */}
            <ConfigSection 
              title="API Configuration" 
              icon={<Key className="h-6 w-6 text-blue-600" />}
              description="Configure connections to OpenAI and other model providers."
            >
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">OpenAI API Keys (semicolon-separated)</label>
                  <textarea
                    name="openaiApiKeys"
                    value={config.openaiApiKeys}
                    onChange={handleChange}
                    placeholder="key1;key2;key3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="2"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block font-medium mb-1">OpenAI API Base URL</label>
                  <input
                    type="text"
                    name="openaiApiBaseUrl"
                    value={config.openaiApiBaseUrl}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block font-medium mb-1">OpenAI API Base URLs (semicolon-separated)</label>
                  <textarea
                    name="openaiApiBaseUrls"
                    value={config.openaiApiBaseUrls}
                    onChange={handleChange}
                    placeholder="url1;url2;url3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="2"
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableOllamaApi"
                    name="enableOllamaApi"
                    checked={config.enableOllamaApi}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="enableOllamaApi" className="ml-2 font-medium">
                    Enable Ollama API
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  Enables connections to Ollama API for local model hosting.
                </p>
              </div>
            </ConfigSection>
            
            {/* Search Features */}
            <ConfigSection 
              title="Search & RAG Features" 
              icon={<Search className="h-6 w-6 text-blue-600" />}
              description="Configure search and retrieval-augmented generation capabilities."
            >
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableSearchQuery"
                    name="enableSearchQuery"
                    checked={config.enableSearchQuery}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="enableSearchQuery" className="ml-2 font-medium">
                    Enable Search Query Generation
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  Enables automatic generation of search queries from user prompts.
                </p>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableRagWebSearch"
                    name="enableRagWebSearch"
                    checked={config.enableRagWebSearch}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="enableRagWebSearch" className="ml-2 font-medium">
                    Enable RAG Web Search
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  Enables web search capabilities for retrieval-augmented generation.
                </p>
                
                {config.enableRagWebSearch && (
                  <div>
                    <label className="block font-medium mb-1">Search Engine</label>
                    <select
                      name="ragWebSearchEngine"
                      value={config.ragWebSearchEngine}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="duckduckgo">DuckDuckGo</option>
                      <option value="google">Google</option>
                      <option value="bing">Bing</option>
                    </select>
                  </div>
                )}
              </div>
            </ConfigSection>
            
            {/* Additional Features */}
            <ConfigSection 
              title="Additional Features" 
              icon={<Settings className="h-6 w-6 text-blue-600" />}
              description="Configure additional OpenWebUI features and capabilities."
            >
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableImageGeneration"
                    name="enableImageGeneration"
                    checked={config.enableImageGeneration}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="enableImageGeneration" className="ml-2 font-medium">
                    Enable Image Generation
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  Controls whether image generation features are available.
                </p>
                
                {config.enableImageGeneration && (
                  <div>
                    <label className="block font-medium mb-1">Image Generation Engine</label>
                    <select
                      name="imageGenerationEngine"
                      value={config.imageGenerationEngine}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="openai">OpenAI (DALL-E)</option>
                      <option value="stable-diffusion">Stable Diffusion</option>
                      <option value="midjourney">Midjourney</option>
                    </select>
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableRealtimeChatSave"
                    name="enableRealtimeChatSave"
                    checked={config.enableRealtimeChatSave}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="enableRealtimeChatSave" className="ml-2 font-medium">
                    Enable Realtime Chat Save
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  Controls whether chat history is saved in real-time. Disabling improves performance but risks losing unsaved messages.
                </p>
              </div>
            </ConfigSection>
          </div>
          
          {/* Code output preview */}
          <div className="mt-8">
            <ConfigSection 
              title="Generated Deployment Code" 
              icon={<Database className="h-6 w-6 text-blue-600" />}
              description="This code will be used to deploy your OpenWebUI instance on Beam."
              isExpanded={false}
            >
              <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto">
                <pre className="text-sm">
                  {`from beam import Pod, Image, Secret, Volume, VolumeMount

# Configuration for OpenWebUI
env_vars = {
    # Authentication & User Management
    "ENABLE_SIGNUP": "${config.enableSignup}",
    "ENABLE_LOGIN_FORM": "${config.enableLoginForm}",
    
    # API Connections
    "OPENAI_API_KEYS": "${config.openaiApiKeys}",
    "OPENAI_API_BASE_URL": "${config.openaiApiBaseUrl}",
    "OPENAI_API_BASE_URLS": "${config.openaiApiBaseUrls}",
    "ENABLE_OLLAMA_API": "${config.enableOllamaApi}",
    
    # Feature Flags
    "ENABLE_SEARCH_QUERY": "${config.enableSearchQuery}",
    "ENABLE_RAG_WEB_SEARCH": "${config.enableRagWebSearch}",
    "RAG_WEB_SEARCH_ENGINE": "${config.ragWebSearchEngine}",
    "ENABLE_IMAGE_GENERATION": "${config.enableImageGeneration}",
    "IMAGE_GENERATION_ENGINE": "${config.imageGenerationEngine}",
    "ENABLE_REALTIME_CHAT_SAVE": "${config.enableRealtimeChatSave}",
}

# Create a persistent volume for storing data
data_volume = Volume(
    name="webui-data",
    size="${config.volumeSize}Gi"
)

# Deploy OpenWebUI on a Pod
openwebui_server = Pod(
    name="${config.podName}",
    cpu=${config.cpu},
    memory="${config.memory}Gi",
    gpu="${config.gpu}",
    ports=[${config.port}],
    env=env_vars,
    volumes=[data_volume],
    volume_mounts=[
        VolumeMount(
            volume="webui-data",
            mount_path="/app/backend/data"
        )
    ],
    image=Image(
        python_version="python${config.pythonVersion}",
    )
    .add_commands([
        "pip install --ignore-installed blinker",
    ])
    .add_python_packages([
        "open-webui", 
        "duckduckgo-search", 
        "openai"
    ]),
    entrypoint=["sh", "-c", "open-webui serve"],
)

# Create the Pod
result = openwebui_server.create()
print("URL:", result.url)`}
                </pre>
              </div>
            </ConfigSection>
          </div>
        </form>
      </main>
    </div>
  );
}

// Configuration section component
function ConfigSection({ title, icon, description, children, isExpanded = true }) {
  const [expanded, setExpanded] = useState(isExpanded);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {icon}
          <h2 className="text-xl font-semibold ml-2">{title}</h2>
        </div>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
        >
          {expanded ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-200">
          <div className="p-4 bg-gray-50 text-sm text-gray-600">
            {description}
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

```
