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

