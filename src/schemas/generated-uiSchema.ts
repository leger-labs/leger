/**
 * Generated uiSchema from OpenWebUI OpenAPI Configuration
 * DO NOT EDIT DIRECTLY - Changes will be overwritten
 *
 * This file contains UI organization metadata extracted from the OpenAPI schema
 * for use with RJSF-compatible form generation and react-ts-form integration.
 *
 * Generated at: 2025-05-25T09:27:23.150Z
 * Source: OpenWebUI OpenAPI Configuration
 *
 * Statistics:
 * - Total fields: 370
 * - Categories: 55
 * - Conditional fields: 240
 */

// Core type definitions for uiSchema structure
export interface CategoryInfo {
  name: string;
  displayName: string;
  description: string;
  order: number;
  fields: FieldInCategory[];
  characteristics: CategoryCharacteristics;
  renderingHints: RenderingHints;
}

export interface FieldInCategory {
  name: string;
  order: number;
  category: string;
}

export interface CategoryCharacteristics {
  fieldCount: number;
  hasConditionalFields: boolean;
  hasSensitiveFields: boolean;
  isHierarchical: boolean;
  parent: string | null;
  child: string | null;
}

export interface RenderingHints {
  expandable: boolean;
  collapsible: boolean;
  inline: boolean;
  requiresSpecialHandling: boolean;
}

export interface HierarchicalCategory {
  name: string;
  displayName: string;
  description: string;
  isParent: boolean;
  totalFields: number;
  children: ChildCategory[];
  characteristics: {
    hasConditionalFields: boolean;
    hasSensitiveFields: boolean;
    totalFieldCount: number;
  };
}

export interface ChildCategory {
  name: string;
  displayName: string;
  fieldCount: number;
  fields: string[];
  order: number;
}

export interface FieldConfiguration {
  name: string;
  type: string;
  format?: string;
  'ui:title': string;
  'ui:description'?: string;
  'ui:help'?: string;
  'ui:widget': string;
  'ui:options': FieldOptions;
  'ui:category'?: string;
  'ui:order': number;
  'ui:condition'?: ConditionRule;
  'ui:validation': ValidationHints;
  'ui:extensions': ExtensionMetadata;
}

export interface FieldOptions {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  enumOptions?: Array<{ value: any; label: string }>;
  conditional?: boolean;
  conditionCount?: number;
  reactTsForm: ReactTsFormHints;
  inputType?: string;
  autoComplete?: string;
  sensitive?: boolean;
}

export interface ReactTsFormHints {
  suggestedComponent: string;
  hasComplexLogic: boolean;
  isProviderDependent: boolean;
}

export interface ConditionRule {
  field?: string;
  operator?: string;
  value?: any;
  conditions?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
}

export interface ValidationHints {
  required: boolean;
  constraints: Array<{
    type: string;
    value: any;
  }>;
}

export interface ExtensionMetadata {
  visibility?: string;
  defaultHandling?: string;
  rationale?: string;
  envVar?: string;
  persistentConfig?: boolean;
}

export interface ConditionalRule {
  type: 'simple' | 'complex' | 'provider';
  operator: 'and' | 'or';
  rules: Array<{
    field: string;
    operator: string;
    value: any;
    type: string;
  }>;
  metadata: {
    complexity: 'simple' | 'complex';
    conditionCount: number;
    chainDepth: number;
  };
}

export interface ComponentMapping {
  component: string;
  alternatives: string[];
  props: Record<string, any>;
  wrappers: string[];
}

export interface CategoryOrganization {
  categories: CategoryInfo[];
  hierarchy: HierarchicalCategory[];
  metadata: {
    totalCategories: number;
    hierarchicalGroups: number;
    avgFieldsPerCategory: number;
    categoryDistribution: Record<string, number>;
  };
}

export interface OpenWebUIUiSchema {
  $schema: string;
  $generated: {
    generatedAt: string;
    sourceSchema: string;
    totalFields: number;
    totalCategories: number;
    conditionalFields: number;
  };
  categoryOrganization: CategoryOrganization;
  fieldConfigurations: Record<string, FieldConfiguration>;
  conditionalRules: Record<string, ConditionalRule>;
  componentMappings: Record<string, ComponentMapping>;
  integration: {
    validation: any;
    reactTsForm: {
      ready: boolean;
      totalFields: number;
      conditionalFields: number;
      componentMappings: number;
    };
  };
}

// Category Organization - Defines how fields are grouped and organized
export const categoryOrganization: CategoryOrganization = {
  categories: [
    {
      name: 'App/Backend - General',
      displayName: 'App/Backend - General',
      description: 'Configuration options for App/Backend - General',
      order: 1,
      fields: [
        {
          name: 'WEBUI_URL',
          order: 1,
          category: 'App/Backend - General',
        },
        {
          name: 'ENABLE_SIGNUP',
          order: 2,
          category: 'App/Backend - General',
        },
        {
          name: 'ENABLE_LOGIN_FORM',
          order: 3,
          category: 'App/Backend - General',
        },
        {
          name: 'DEFAULT_LOCALE',
          order: 4,
          category: 'App/Backend - General',
        },
        {
          name: 'DEFAULT_MODELS',
          order: 5,
          category: 'App/Backend - General',
        },
        {
          name: 'DEFAULT_USER_ROLE',
          order: 6,
          category: 'App/Backend - General',
        },
        {
          name: 'PENDING_USER_OVERLAY_TITLE',
          order: 7,
          category: 'App/Backend - General',
        },
        {
          name: 'PENDING_USER_OVERLAY_CONTENT',
          order: 8,
          category: 'App/Backend - General',
        },
        {
          name: 'ENABLE_CHANNELS',
          order: 9,
          category: 'App/Backend - General',
        },
        {
          name: 'WEBHOOK_URL',
          order: 10,
          category: 'App/Backend - General',
        },
        {
          name: 'ENABLE_ADMIN_EXPORT',
          order: 11,
          category: 'App/Backend - General',
        },
        {
          name: 'ENABLE_ADMIN_CHAT_ACCESS',
          order: 12,
          category: 'App/Backend - General',
        },
        {
          name: 'ENABLE_USER_WEBHOOKS',
          order: 13,
          category: 'App/Backend - General',
        },
        {
          name: 'RESPONSE_WATERMARK',
          order: 14,
          category: 'App/Backend - General',
        },
        {
          name: 'THREAD_POOL_SIZE',
          order: 15,
          category: 'App/Backend - General',
        },
        {
          name: 'SHOW_ADMIN_DETAILS',
          order: 16,
          category: 'App/Backend - General',
        },
        {
          name: 'ADMIN_EMAIL',
          order: 17,
          category: 'App/Backend - General',
        },
        {
          name: 'ENV',
          order: 18,
          category: 'App/Backend - General',
        },
        {
          name: 'ENABLE_PERSISTENT_CONFIG',
          order: 19,
          category: 'App/Backend - General',
        },
        {
          name: 'CUSTOM_NAME',
          order: 20,
          category: 'App/Backend - General',
        },
        {
          name: 'WEBUI_NAME',
          order: 21,
          category: 'App/Backend - General',
        },
        {
          name: 'PORT',
          order: 22,
          category: 'App/Backend - General',
        },
        {
          name: 'ENABLE_REALTIME_CHAT_SAVE',
          order: 23,
          category: 'App/Backend - General',
        },
        {
          name: 'BYPASS_MODEL_ACCESS_CONTROL',
          order: 24,
          category: 'App/Backend - General',
        },
        {
          name: 'WEBUI_BUILD_HASH',
          order: 25,
          category: 'App/Backend - General',
        },
        {
          name: 'WEBUI_BANNERS',
          order: 26,
          category: 'App/Backend - General',
        },
        {
          name: 'USE_CUDA_DOCKER',
          order: 27,
          category: 'App/Backend - General',
        },
        {
          name: 'EXTERNAL_PWA_MANIFEST_URL',
          order: 28,
          category: 'App/Backend - General',
        },
        {
          name: 'ENABLE_TITLE_GENERATION',
          order: 29,
          category: 'App/Backend - General',
        },
        {
          name: 'LICENSE_KEY',
          order: 30,
          category: 'App/Backend - General',
        },
        {
          name: 'SSL_ASSERT_FINGERPRINT',
          order: 31,
          category: 'App/Backend - General',
        },
        {
          name: 'DEFAULT_PROMPT_SUGGESTIONS',
          order: 32,
          category: 'App/Backend - General',
        },
      ],
      characteristics: {
        fieldCount: 32,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'General',
      },
      renderingHints: {
        expandable: true,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'App/Backend - AIOHTTP Client',
      displayName: 'App/Backend - AIOHTTP Client',
      description: 'Configuration options for App/Backend - AIOHTTP Client',
      order: 33,
      fields: [
        {
          name: 'AIOHTTP_CLIENT_TIMEOUT',
          order: 33,
          category: 'App/Backend - AIOHTTP Client',
        },
        {
          name: 'AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST',
          order: 34,
          category: 'App/Backend - AIOHTTP Client',
        },
        {
          name: 'AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST',
          order: 35,
          category: 'App/Backend - AIOHTTP Client',
        },
      ],
      characteristics: {
        fieldCount: 3,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'AIOHTTP Client',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: false,
      },
    },
    {
      name: 'App/Backend - Directories',
      displayName: 'App/Backend - Directories',
      description: 'Configuration options for App/Backend - Directories',
      order: 36,
      fields: [
        {
          name: 'DATA_DIR',
          order: 36,
          category: 'App/Backend - Directories',
        },
        {
          name: 'FONTS_DIR',
          order: 37,
          category: 'App/Backend - Directories',
        },
        {
          name: 'FRONTEND_BUILD_DIR',
          order: 38,
          category: 'App/Backend - Directories',
        },
        {
          name: 'STATIC_DIR',
          order: 39,
          category: 'App/Backend - Directories',
        },
      ],
      characteristics: {
        fieldCount: 4,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'Directories',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: false,
      },
    },
    {
      name: 'App/Backend - Ollama',
      displayName: 'App/Backend - Ollama',
      description: 'Configuration options for App/Backend - Ollama',
      order: 40,
      fields: [
        {
          name: 'ENABLE_OLLAMA_API',
          order: 40,
          category: 'App/Backend - Ollama',
        },
        {
          name: 'OLLAMA_BASE_URLS',
          order: 41,
          category: 'App/Backend - Ollama',
        },
        {
          name: 'USE_OLLAMA_DOCKER',
          order: 42,
          category: 'App/Backend - Ollama',
        },
        {
          name: 'K8S_FLAG',
          order: 43,
          category: 'App/Backend - Ollama',
        },
      ],
      characteristics: {
        fieldCount: 4,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'Ollama',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'App/Backend - OpenAI',
      displayName: 'App/Backend - OpenAI',
      description: 'Configuration options for App/Backend - OpenAI',
      order: 44,
      fields: [
        {
          name: 'ENABLE_OPENAI_API',
          order: 44,
          category: 'App/Backend - OpenAI',
        },
        {
          name: 'OPENAI_API_BASE_URL',
          order: 45,
          category: 'App/Backend - OpenAI',
        },
        {
          name: 'OPENAI_API_BASE_URLS',
          order: 46,
          category: 'App/Backend - OpenAI',
        },
        {
          name: 'OPENAI_API_KEY',
          order: 47,
          category: 'App/Backend - OpenAI',
        },
        {
          name: 'OPENAI_API_KEYS',
          order: 48,
          category: 'App/Backend - OpenAI',
        },
      ],
      characteristics: {
        fieldCount: 5,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'OpenAI',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'App/Backend - Tasks',
      displayName: 'App/Backend - Tasks',
      description: 'Configuration options for App/Backend - Tasks',
      order: 49,
      fields: [
        {
          name: 'TASK_MODEL',
          order: 49,
          category: 'App/Backend - Tasks',
        },
        {
          name: 'TASK_MODEL_EXTERNAL',
          order: 50,
          category: 'App/Backend - Tasks',
        },
        {
          name: 'TITLE_GENERATION_PROMPT_TEMPLATE',
          order: 51,
          category: 'App/Backend - Tasks',
        },
        {
          name: 'TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE',
          order: 52,
          category: 'App/Backend - Tasks',
        },
      ],
      characteristics: {
        fieldCount: 4,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'Tasks',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'App/Backend - Code Execution',
      displayName: 'App/Backend - Code Execution',
      description: 'Configuration options for App/Backend - Code Execution',
      order: 53,
      fields: [
        {
          name: 'ENABLE_CODE_EXECUTION',
          order: 53,
          category: 'App/Backend - Code Execution',
        },
        {
          name: 'CODE_EXECUTION_ENGINE',
          order: 54,
          category: 'App/Backend - Code Execution',
        },
        {
          name: 'CODE_EXECUTION_JUPYTER_URL',
          order: 55,
          category: 'App/Backend - Code Execution',
        },
        {
          name: 'CODE_EXECUTION_JUPYTER_AUTH',
          order: 56,
          category: 'App/Backend - Code Execution',
        },
        {
          name: 'CODE_EXECUTION_JUPYTER_AUTH_TOKEN',
          order: 57,
          category: 'App/Backend - Code Execution',
        },
        {
          name: 'CODE_EXECUTION_JUPYTER_AUTH_PASSWORD',
          order: 58,
          category: 'App/Backend - Code Execution',
        },
        {
          name: 'CODE_EXECUTION_JUPYTER_TIMEOUT',
          order: 59,
          category: 'App/Backend - Code Execution',
        },
      ],
      characteristics: {
        fieldCount: 7,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'Code Execution',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'App/Backend - Code Interpreter',
      displayName: 'App/Backend - Code Interpreter',
      description: 'Configuration options for App/Backend - Code Interpreter',
      order: 60,
      fields: [
        {
          name: 'ENABLE_CODE_INTERPRETER',
          order: 60,
          category: 'App/Backend - Code Interpreter',
        },
        {
          name: 'CODE_INTERPRETER_ENGINE',
          order: 61,
          category: 'App/Backend - Code Interpreter',
        },
        {
          name: 'CODE_INTERPRETER_PROMPT_TEMPLATE',
          order: 62,
          category: 'App/Backend - Code Interpreter',
        },
        {
          name: 'CODE_INTERPRETER_JUPYTER_URL',
          order: 63,
          category: 'App/Backend - Code Interpreter',
        },
        {
          name: 'CODE_INTERPRETER_JUPYTER_AUTH',
          order: 64,
          category: 'App/Backend - Code Interpreter',
        },
        {
          name: 'CODE_INTERPRETER_JUPYTER_AUTH_TOKEN',
          order: 65,
          category: 'App/Backend - Code Interpreter',
        },
        {
          name: 'CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD',
          order: 66,
          category: 'App/Backend - Code Interpreter',
        },
        {
          name: 'CODE_INTERPRETER_JUPYTER_TIMEOUT',
          order: 67,
          category: 'App/Backend - Code Interpreter',
        },
      ],
      characteristics: {
        fieldCount: 8,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'Code Interpreter',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'App/Backend - Direct Connections (OpenAPI/MCPO Tool Servers)',
      displayName: 'App/Backend - Direct Connections (OpenAPI/MCPO Tool Servers)',
      description:
        'Configuration options for App/Backend - Direct Connections (OpenAPI/MCPO Tool Servers)',
      order: 68,
      fields: [
        {
          name: 'ENABLE_DIRECT_CONNECTIONS',
          order: 68,
          category: 'App/Backend - Direct Connections (OpenAPI/MCPO Tool Servers)',
        },
      ],
      characteristics: {
        fieldCount: 1,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'Direct Connections (OpenAPI/MCPO Tool Servers)',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: false,
      },
    },
    {
      name: 'App/Backend - Autocomplete',
      displayName: 'App/Backend - Autocomplete',
      description: 'Configuration options for App/Backend - Autocomplete',
      order: 69,
      fields: [
        {
          name: 'ENABLE_AUTOCOMPLETE_GENERATION',
          order: 69,
          category: 'App/Backend - Autocomplete',
        },
        {
          name: 'AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH',
          order: 70,
          category: 'App/Backend - Autocomplete',
        },
        {
          name: 'AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE',
          order: 71,
          category: 'App/Backend - Autocomplete',
        },
      ],
      characteristics: {
        fieldCount: 3,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'Autocomplete',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'App/Backend - Evaluation Arena Model',
      displayName: 'App/Backend - Evaluation Arena Model',
      description: 'Configuration options for App/Backend - Evaluation Arena Model',
      order: 72,
      fields: [
        {
          name: 'ENABLE_EVALUATION_ARENA_MODELS',
          order: 72,
          category: 'App/Backend - Evaluation Arena Model',
        },
        {
          name: 'ENABLE_MESSAGE_RATING',
          order: 73,
          category: 'App/Backend - Evaluation Arena Model',
        },
        {
          name: 'ENABLE_COMMUNITY_SHARING',
          order: 74,
          category: 'App/Backend - Evaluation Arena Model',
        },
      ],
      characteristics: {
        fieldCount: 3,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'Evaluation Arena Model',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: false,
      },
    },
    {
      name: 'App/Backend - Tags Generation',
      displayName: 'App/Backend - Tags Generation',
      description: 'Configuration options for App/Backend - Tags Generation',
      order: 75,
      fields: [
        {
          name: 'ENABLE_TAGS_GENERATION',
          order: 75,
          category: 'App/Backend - Tags Generation',
        },
        {
          name: 'TAGS_GENERATION_PROMPT_TEMPLATE',
          order: 76,
          category: 'App/Backend - Tags Generation',
        },
      ],
      characteristics: {
        fieldCount: 2,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'Tags Generation',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'App/Backend - API Key Endpoint Restrictions',
      displayName: 'App/Backend - API Key Endpoint Restrictions',
      description: 'Configuration options for App/Backend - API Key Endpoint Restrictions',
      order: 77,
      fields: [
        {
          name: 'ENABLE_API_KEY',
          order: 77,
          category: 'App/Backend - API Key Endpoint Restrictions',
        },
        {
          name: 'ENABLE_API_KEY_ENDPOINT_RESTRICTIONS',
          order: 78,
          category: 'App/Backend - API Key Endpoint Restrictions',
        },
        {
          name: 'API_KEY_ALLOWED_ENDPOINTS',
          order: 79,
          category: 'App/Backend - API Key Endpoint Restrictions',
        },
        {
          name: 'JWT_EXPIRES_IN',
          order: 80,
          category: 'App/Backend - API Key Endpoint Restrictions',
        },
      ],
      characteristics: {
        fieldCount: 4,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'App/Backend',
        child: 'API Key Endpoint Restrictions',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Security Variables',
      displayName: 'Security Variables',
      description: 'Configuration options for Security Variables',
      order: 81,
      fields: [
        {
          name: 'ENABLE_FORWARD_USER_INFO_HEADERS',
          order: 81,
          category: 'Security Variables',
        },
        {
          name: 'ENABLE_WEB_LOADER_SSL_VERIFICATION',
          order: 82,
          category: 'Security Variables',
        },
        {
          name: 'WEBUI_SESSION_COOKIE_SAME_SITE',
          order: 83,
          category: 'Security Variables',
        },
        {
          name: 'WEBUI_SESSION_COOKIE_SECURE',
          order: 84,
          category: 'Security Variables',
        },
        {
          name: 'WEBUI_AUTH_COOKIE_SAME_SITE',
          order: 85,
          category: 'Security Variables',
        },
        {
          name: 'WEBUI_AUTH_COOKIE_SECURE',
          order: 86,
          category: 'Security Variables',
        },
        {
          name: 'WEBUI_AUTH',
          order: 87,
          category: 'Security Variables',
        },
        {
          name: 'WEBUI_SECRET_KEY',
          order: 88,
          category: 'Security Variables',
        },
        {
          name: 'OFFLINE_MODE',
          order: 89,
          category: 'Security Variables',
        },
        {
          name: 'RESET_CONFIG_ON_START',
          order: 90,
          category: 'Security Variables',
        },
        {
          name: 'SAFE_MODE',
          order: 91,
          category: 'Security Variables',
        },
        {
          name: 'CORS_ALLOW_ORIGIN',
          order: 92,
          category: 'Security Variables',
        },
        {
          name: 'RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE',
          order: 93,
          category: 'Security Variables',
        },
        {
          name: 'RAG_RERANKING_MODEL_TRUST_REMOTE_CODE',
          order: 94,
          category: 'Security Variables',
        },
        {
          name: 'RAG_EMBEDDING_MODEL_AUTO_UPDATE',
          order: 95,
          category: 'Security Variables',
        },
        {
          name: 'RAG_RERANKING_MODEL_AUTO_UPDATE',
          order: 96,
          category: 'Security Variables',
        },
      ],
      characteristics: {
        fieldCount: 16,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: false,
        parent: null,
        child: null,
      },
      renderingHints: {
        expandable: true,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Vector Database',
      displayName: 'Vector Database',
      description: 'Configuration options for Vector Database',
      order: 97,
      fields: [
        {
          name: 'VECTOR_DB',
          order: 97,
          category: 'Vector Database',
        },
      ],
      characteristics: {
        fieldCount: 1,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: false,
        parent: null,
        child: null,
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: false,
      },
    },
    {
      name: 'Vector Database - ChromaDB',
      displayName: 'Vector Database - ChromaDB',
      description: 'Configuration options for Vector Database - ChromaDB',
      order: 98,
      fields: [
        {
          name: 'CHROMA_TENANT',
          order: 98,
          category: 'Vector Database - ChromaDB',
        },
        {
          name: 'CHROMA_DATABASE',
          order: 99,
          category: 'Vector Database - ChromaDB',
        },
        {
          name: 'CHROMA_HTTP_HOST',
          order: 100,
          category: 'Vector Database - ChromaDB',
        },
        {
          name: 'CHROMA_HTTP_PORT',
          order: 101,
          category: 'Vector Database - ChromaDB',
        },
        {
          name: 'CHROMA_HTTP_HEADERS',
          order: 102,
          category: 'Vector Database - ChromaDB',
        },
        {
          name: 'CHROMA_HTTP_SSL',
          order: 103,
          category: 'Vector Database - ChromaDB',
        },
        {
          name: 'CHROMA_CLIENT_AUTH_PROVIDER',
          order: 104,
          category: 'Vector Database - ChromaDB',
        },
        {
          name: 'CHROMA_CLIENT_AUTH_CREDENTIALS',
          order: 105,
          category: 'Vector Database - ChromaDB',
        },
      ],
      characteristics: {
        fieldCount: 8,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Vector Database',
        child: 'ChromaDB',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Vector Database - Elasticsearch',
      displayName: 'Vector Database - Elasticsearch',
      description: 'Configuration options for Vector Database - Elasticsearch',
      order: 106,
      fields: [
        {
          name: 'ELASTICSEARCH_API_KEY',
          order: 106,
          category: 'Vector Database - Elasticsearch',
        },
        {
          name: 'ELASTICSEARCH_CA_CERTS',
          order: 107,
          category: 'Vector Database - Elasticsearch',
        },
        {
          name: 'ELASTICSEARCH_CLOUD_ID',
          order: 108,
          category: 'Vector Database - Elasticsearch',
        },
        {
          name: 'ELASTICSEARCH_INDEX_PREFIX',
          order: 109,
          category: 'Vector Database - Elasticsearch',
        },
        {
          name: 'ELASTICSEARCH_PASSWORD',
          order: 110,
          category: 'Vector Database - Elasticsearch',
        },
        {
          name: 'ELASTICSEARCH_URL',
          order: 111,
          category: 'Vector Database - Elasticsearch',
        },
        {
          name: 'ELASTICSEARCH_USERNAME',
          order: 112,
          category: 'Vector Database - Elasticsearch',
        },
      ],
      characteristics: {
        fieldCount: 7,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Vector Database',
        child: 'Elasticsearch',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Vector Database - Milvus',
      displayName: 'Vector Database - Milvus',
      description: 'Configuration options for Vector Database - Milvus',
      order: 113,
      fields: [
        {
          name: 'MILVUS_URI',
          order: 113,
          category: 'Vector Database - Milvus',
        },
        {
          name: 'MILVUS_DB',
          order: 114,
          category: 'Vector Database - Milvus',
        },
        {
          name: 'MILVUS_TOKEN',
          order: 115,
          category: 'Vector Database - Milvus',
        },
        {
          name: 'MILVUS_INDEX_TYPE',
          order: 116,
          category: 'Vector Database - Milvus',
        },
        {
          name: 'MILVUS_METRIC_TYPE',
          order: 117,
          category: 'Vector Database - Milvus',
        },
        {
          name: 'MILVUS_HNSW_M',
          order: 118,
          category: 'Vector Database - Milvus',
        },
        {
          name: 'MILVUS_HNSW_EFCONSTRUCTION',
          order: 119,
          category: 'Vector Database - Milvus',
        },
        {
          name: 'MILVUS_IVF_FLAT_NLIST',
          order: 120,
          category: 'Vector Database - Milvus',
        },
      ],
      characteristics: {
        fieldCount: 8,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Vector Database',
        child: 'Milvus',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Vector Database - OpenSearch',
      displayName: 'Vector Database - OpenSearch',
      description: 'Configuration options for Vector Database - OpenSearch',
      order: 121,
      fields: [
        {
          name: 'OPENSEARCH_CERT_VERIFY',
          order: 121,
          category: 'Vector Database - OpenSearch',
        },
        {
          name: 'OPENSEARCH_PASSWORD',
          order: 122,
          category: 'Vector Database - OpenSearch',
        },
        {
          name: 'OPENSEARCH_SSL',
          order: 123,
          category: 'Vector Database - OpenSearch',
        },
        {
          name: 'OPENSEARCH_URI',
          order: 124,
          category: 'Vector Database - OpenSearch',
        },
        {
          name: 'OPENSEARCH_USERNAME',
          order: 125,
          category: 'Vector Database - OpenSearch',
        },
      ],
      characteristics: {
        fieldCount: 5,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Vector Database',
        child: 'OpenSearch',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Vector Database - PGVector',
      displayName: 'Vector Database - PGVector',
      description: 'Configuration options for Vector Database - PGVector',
      order: 126,
      fields: [
        {
          name: 'PGVECTOR_DB_URL',
          order: 126,
          category: 'Vector Database - PGVector',
        },
        {
          name: 'PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH',
          order: 127,
          category: 'Vector Database - PGVector',
        },
      ],
      characteristics: {
        fieldCount: 2,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Vector Database',
        child: 'PGVector',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Vector Database - Qdrant',
      displayName: 'Vector Database - Qdrant',
      description: 'Configuration options for Vector Database - Qdrant',
      order: 128,
      fields: [
        {
          name: 'QDRANT_API_KEY',
          order: 128,
          category: 'Vector Database - Qdrant',
        },
        {
          name: 'QDRANT_URI',
          order: 129,
          category: 'Vector Database - Qdrant',
        },
        {
          name: 'QDRANT_ON_DISK',
          order: 130,
          category: 'Vector Database - Qdrant',
        },
        {
          name: 'QDRANT_PREFER_GRPC',
          order: 131,
          category: 'Vector Database - Qdrant',
        },
        {
          name: 'QDRANT_GRPC_PORT',
          order: 132,
          category: 'Vector Database - Qdrant',
        },
        {
          name: 'ENABLE_QDRANT_MULTITENANCY_MODE',
          order: 133,
          category: 'Vector Database - Qdrant',
        },
      ],
      characteristics: {
        fieldCount: 6,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Vector Database',
        child: 'Qdrant',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Vector Database - Pinecone',
      displayName: 'Vector Database - Pinecone',
      description: 'Configuration options for Vector Database - Pinecone',
      order: 134,
      fields: [
        {
          name: 'PINECONE_API_KEY',
          order: 134,
          category: 'Vector Database - Pinecone',
        },
        {
          name: 'PINECONE_ENVIRONMENT',
          order: 135,
          category: 'Vector Database - Pinecone',
        },
        {
          name: 'PINECONE_INDEX_NAME',
          order: 136,
          category: 'Vector Database - Pinecone',
        },
        {
          name: 'PINECONE_DIMENSION',
          order: 137,
          category: 'Vector Database - Pinecone',
        },
        {
          name: 'PINECONE_METRIC',
          order: 138,
          category: 'Vector Database - Pinecone',
        },
        {
          name: 'PINECONE_CLOUD',
          order: 139,
          category: 'Vector Database - Pinecone',
        },
      ],
      characteristics: {
        fieldCount: 6,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Vector Database',
        child: 'Pinecone',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'RAG Content Extraction Engine',
      displayName: 'RAG Content Extraction Engine',
      description: 'Configuration options for RAG Content Extraction Engine',
      order: 140,
      fields: [
        {
          name: 'CONTENT_EXTRACTION_ENGINE',
          order: 140,
          category: 'RAG Content Extraction Engine',
        },
        {
          name: 'MISTRAL_OCR_API_KEY',
          order: 141,
          category: 'RAG Content Extraction Engine',
        },
        {
          name: 'EXTERNAL_DOCUMENT_LOADER_URL',
          order: 142,
          category: 'RAG Content Extraction Engine',
        },
        {
          name: 'EXTERNAL_DOCUMENT_LOADER_API_KEY',
          order: 143,
          category: 'RAG Content Extraction Engine',
        },
        {
          name: 'TIKA_SERVER_URL',
          order: 144,
          category: 'RAG Content Extraction Engine',
        },
        {
          name: 'DOCLING_SERVER_URL',
          order: 145,
          category: 'RAG Content Extraction Engine',
        },
        {
          name: 'DOCLING_OCR_ENGINE',
          order: 146,
          category: 'RAG Content Extraction Engine',
        },
        {
          name: 'DOCLING_OCR_LANG',
          order: 147,
          category: 'RAG Content Extraction Engine',
        },
      ],
      characteristics: {
        fieldCount: 8,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: false,
        parent: null,
        child: null,
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Retrieval Augmented Generation (RAG)',
      displayName: 'Retrieval Augmented Generation (RAG)',
      description: 'Configuration options for Retrieval Augmented Generation (RAG)',
      order: 148,
      fields: [
        {
          name: 'RAG_EMBEDDING_ENGINE',
          order: 148,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_EMBEDDING_MODEL',
          order: 149,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'ENABLE_RAG_HYBRID_SEARCH',
          order: 150,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_TOP_K',
          order: 151,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_TOP_K_RERANKER',
          order: 152,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_RELEVANCE_THRESHOLD',
          order: 153,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_TEMPLATE',
          order: 154,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_TEXT_SPLITTER',
          order: 155,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'TIKTOKEN_CACHE_DIR',
          order: 156,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'TIKTOKEN_ENCODING_NAME',
          order: 157,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'CHUNK_SIZE',
          order: 158,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'CHUNK_OVERLAP',
          order: 159,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'PDF_EXTRACT_IMAGES',
          order: 160,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_FILE_MAX_SIZE',
          order: 161,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_FILE_MAX_COUNT',
          order: 162,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_ALLOWED_FILE_EXTENSIONS',
          order: 163,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_RERANKING_MODEL',
          order: 164,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_OPENAI_API_BASE_URL',
          order: 165,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_OPENAI_API_KEY',
          order: 166,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_EMBEDDING_OPENAI_BATCH_SIZE',
          order: 167,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_EMBEDDING_BATCH_SIZE',
          order: 168,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_OLLAMA_API_KEY',
          order: 169,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_OLLAMA_BASE_URL',
          order: 170,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'ENABLE_RETRIEVAL_QUERY_GENERATION',
          order: 171,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'QUERY_GENERATION_PROMPT_TEMPLATE',
          order: 172,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'BYPASS_EMBEDDING_AND_RETRIEVAL',
          order: 173,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'DOCUMENT_INTELLIGENCE_ENDPOINT',
          order: 174,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'DOCUMENT_INTELLIGENCE_KEY',
          order: 175,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'ENABLE_RAG_LOCAL_WEB_FETCH',
          order: 176,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_EMBEDDING_CONTENT_PREFIX',
          order: 177,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_EMBEDDING_PREFIX_FIELD_NAME',
          order: 178,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_EMBEDDING_QUERY_PREFIX',
          order: 179,
          category: 'Retrieval Augmented Generation (RAG)',
        },
        {
          name: 'RAG_FULL_CONTEXT',
          order: 180,
          category: 'Retrieval Augmented Generation (RAG)',
        },
      ],
      characteristics: {
        fieldCount: 33,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: false,
        parent: null,
        child: null,
      },
      renderingHints: {
        expandable: true,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Retrieval Augmented Generation (RAG) - Google Drive',
      displayName: 'Retrieval Augmented Generation (RAG) - Google Drive',
      description: 'Configuration options for Retrieval Augmented Generation (RAG) - Google Drive',
      order: 181,
      fields: [
        {
          name: 'ENABLE_GOOGLE_DRIVE_INTEGRATION',
          order: 181,
          category: 'Retrieval Augmented Generation (RAG) - Google Drive',
        },
        {
          name: 'GOOGLE_DRIVE_CLIENT_ID',
          order: 182,
          category: 'Retrieval Augmented Generation (RAG) - Google Drive',
        },
        {
          name: 'GOOGLE_DRIVE_API_KEY',
          order: 183,
          category: 'Retrieval Augmented Generation (RAG) - Google Drive',
        },
      ],
      characteristics: {
        fieldCount: 3,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Retrieval Augmented Generation (RAG)',
        child: 'Google Drive',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Retrieval Augmented Generation (RAG) - OneDrive',
      displayName: 'Retrieval Augmented Generation (RAG) - OneDrive',
      description: 'Configuration options for Retrieval Augmented Generation (RAG) - OneDrive',
      order: 184,
      fields: [
        {
          name: 'ENABLE_ONEDRIVE_INTEGRATION',
          order: 184,
          category: 'Retrieval Augmented Generation (RAG) - OneDrive',
        },
        {
          name: 'ONEDRIVE_CLIENT_ID',
          order: 185,
          category: 'Retrieval Augmented Generation (RAG) - OneDrive',
        },
      ],
      characteristics: {
        fieldCount: 2,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Retrieval Augmented Generation (RAG)',
        child: 'OneDrive',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Web Search',
      displayName: 'Web Search',
      description: 'Configuration options for Web Search',
      order: 186,
      fields: [
        {
          name: 'ENABLE_WEB_SEARCH',
          order: 186,
          category: 'Web Search',
        },
        {
          name: 'ENABLE_SEARCH_QUERY_GENERATION',
          order: 187,
          category: 'Web Search',
        },
        {
          name: 'WEB_SEARCH_TRUST_ENV',
          order: 188,
          category: 'Web Search',
        },
        {
          name: 'WEB_SEARCH_RESULT_COUNT',
          order: 189,
          category: 'Web Search',
        },
        {
          name: 'WEB_SEARCH_CONCURRENT_REQUESTS',
          order: 190,
          category: 'Web Search',
        },
        {
          name: 'WEB_SEARCH_ENGINE',
          order: 191,
          category: 'Web Search',
        },
        {
          name: 'BYPASS_WEB_SEARCH_EMBEDDING_AND_RETRIEVAL',
          order: 192,
          category: 'Web Search',
        },
        {
          name: 'SEARXNG_QUERY_URL',
          order: 193,
          category: 'Web Search',
        },
        {
          name: 'GOOGLE_PSE_API_KEY',
          order: 194,
          category: 'Web Search',
        },
        {
          name: 'GOOGLE_PSE_ENGINE_ID',
          order: 195,
          category: 'Web Search',
        },
        {
          name: 'BRAVE_SEARCH_API_KEY',
          order: 196,
          category: 'Web Search',
        },
        {
          name: 'KAGI_SEARCH_API_KEY',
          order: 197,
          category: 'Web Search',
        },
        {
          name: 'MOJEEK_SEARCH_API_KEY',
          order: 198,
          category: 'Web Search',
        },
        {
          name: 'SERPSTACK_API_KEY',
          order: 199,
          category: 'Web Search',
        },
        {
          name: 'SERPSTACK_HTTPS',
          order: 200,
          category: 'Web Search',
        },
        {
          name: 'SERPER_API_KEY',
          order: 201,
          category: 'Web Search',
        },
        {
          name: 'SERPLY_API_KEY',
          order: 202,
          category: 'Web Search',
        },
        {
          name: 'SEARCHAPI_API_KEY',
          order: 203,
          category: 'Web Search',
        },
        {
          name: 'SEARCHAPI_ENGINE',
          order: 204,
          category: 'Web Search',
        },
        {
          name: 'TAVILY_API_KEY',
          order: 205,
          category: 'Web Search',
        },
        {
          name: 'JINA_API_KEY',
          order: 206,
          category: 'Web Search',
        },
        {
          name: 'BING_SEARCH_V7_ENDPOINT',
          order: 207,
          category: 'Web Search',
        },
        {
          name: 'BING_SEARCH_V7_SUBSCRIPTION_KEY',
          order: 208,
          category: 'Web Search',
        },
        {
          name: 'BOCHA_SEARCH_API_KEY',
          order: 209,
          category: 'Web Search',
        },
        {
          name: 'EXA_API_KEY',
          order: 210,
          category: 'Web Search',
        },
        {
          name: 'SERPAPI_API_KEY',
          order: 211,
          category: 'Web Search',
        },
        {
          name: 'SERPAPI_ENGINE',
          order: 212,
          category: 'Web Search',
        },
        {
          name: 'SOUGOU_API_SID',
          order: 213,
          category: 'Web Search',
        },
        {
          name: 'SOUGOU_API_SK',
          order: 214,
          category: 'Web Search',
        },
        {
          name: 'TAVILY_EXTRACT_DEPTH',
          order: 215,
          category: 'Web Search',
        },
      ],
      characteristics: {
        fieldCount: 30,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: false,
        parent: null,
        child: null,
      },
      renderingHints: {
        expandable: true,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Web Search - Web Loader Configuration',
      displayName: 'Web Search - Web Loader Configuration',
      description: 'Configuration options for Web Search - Web Loader Configuration',
      order: 216,
      fields: [
        {
          name: 'WEB_LOADER_ENGINE',
          order: 216,
          category: 'Web Search - Web Loader Configuration',
        },
        {
          name: 'PLAYWRIGHT_WS_URL',
          order: 217,
          category: 'Web Search - Web Loader Configuration',
        },
        {
          name: 'FIRECRAWL_API_BASE_URL',
          order: 218,
          category: 'Web Search - Web Loader Configuration',
        },
        {
          name: 'FIRECRAWL_API_KEY',
          order: 219,
          category: 'Web Search - Web Loader Configuration',
        },
        {
          name: 'PERPLEXITY_API_KEY',
          order: 220,
          category: 'Web Search - Web Loader Configuration',
        },
        {
          name: 'PLAYWRIGHT_TIMEOUT',
          order: 221,
          category: 'Web Search - Web Loader Configuration',
        },
      ],
      characteristics: {
        fieldCount: 6,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Web Search',
        child: 'Web Loader Configuration',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Web Search - YouTube Loader',
      displayName: 'Web Search - YouTube Loader',
      description: 'Configuration options for Web Search - YouTube Loader',
      order: 222,
      fields: [
        {
          name: 'YOUTUBE_LOADER_PROXY_URL',
          order: 222,
          category: 'Web Search - YouTube Loader',
        },
        {
          name: 'YOUTUBE_LOADER_LANGUAGE',
          order: 223,
          category: 'Web Search - YouTube Loader',
        },
      ],
      characteristics: {
        fieldCount: 2,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Web Search',
        child: 'YouTube Loader',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: false,
      },
    },
    {
      name: 'Audio - Whisper Speech-to-Text (Local)',
      displayName: 'Audio - Whisper Speech-to-Text (Local)',
      description: 'Configuration options for Audio - Whisper Speech-to-Text (Local)',
      order: 224,
      fields: [
        {
          name: 'WHISPER_MODEL',
          order: 224,
          category: 'Audio - Whisper Speech-to-Text (Local)',
        },
        {
          name: 'WHISPER_MODEL_DIR',
          order: 225,
          category: 'Audio - Whisper Speech-to-Text (Local)',
        },
        {
          name: 'WHISPER_VAD_FILTER',
          order: 226,
          category: 'Audio - Whisper Speech-to-Text (Local)',
        },
        {
          name: 'WHISPER_MODEL_AUTO_UPDATE',
          order: 227,
          category: 'Audio - Whisper Speech-to-Text (Local)',
        },
        {
          name: 'WHISPER_LANGUAGE',
          order: 228,
          category: 'Audio - Whisper Speech-to-Text (Local)',
        },
      ],
      characteristics: {
        fieldCount: 5,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Audio',
        child: 'Whisper Speech-to-Text (Local)',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Audio - Speech-to-Text (OpenAI)',
      displayName: 'Audio - Speech-to-Text (OpenAI)',
      description: 'Configuration options for Audio - Speech-to-Text (OpenAI)',
      order: 229,
      fields: [
        {
          name: 'AUDIO_STT_ENGINE',
          order: 229,
          category: 'Audio - Speech-to-Text (OpenAI)',
        },
        {
          name: 'AUDIO_STT_MODEL',
          order: 230,
          category: 'Audio - Speech-to-Text (OpenAI)',
        },
        {
          name: 'AUDIO_STT_OPENAI_API_BASE_URL',
          order: 231,
          category: 'Audio - Speech-to-Text (OpenAI)',
        },
        {
          name: 'AUDIO_STT_OPENAI_API_KEY',
          order: 232,
          category: 'Audio - Speech-to-Text (OpenAI)',
        },
      ],
      characteristics: {
        fieldCount: 4,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Audio',
        child: 'Speech-to-Text (OpenAI)',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Audio - Speech-to-Text (Azure)',
      displayName: 'Audio - Speech-to-Text (Azure)',
      description: 'Configuration options for Audio - Speech-to-Text (Azure)',
      order: 233,
      fields: [
        {
          name: 'AUDIO_STT_AZURE_API_KEY',
          order: 233,
          category: 'Audio - Speech-to-Text (Azure)',
        },
        {
          name: 'AUDIO_STT_AZURE_REGION',
          order: 234,
          category: 'Audio - Speech-to-Text (Azure)',
        },
        {
          name: 'AUDIO_STT_AZURE_LOCALES',
          order: 235,
          category: 'Audio - Speech-to-Text (Azure)',
        },
      ],
      characteristics: {
        fieldCount: 3,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Audio',
        child: 'Speech-to-Text (Azure)',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Audio - Speech-to-Text (Deepgram)',
      displayName: 'Audio - Speech-to-Text (Deepgram)',
      description: 'Configuration options for Audio - Speech-to-Text (Deepgram)',
      order: 236,
      fields: [
        {
          name: 'DEEPGRAM_API_KEY',
          order: 236,
          category: 'Audio - Speech-to-Text (Deepgram)',
        },
      ],
      characteristics: {
        fieldCount: 1,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Audio',
        child: 'Speech-to-Text (Deepgram)',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Audio - Text-to-Speech',
      displayName: 'Audio - Text-to-Speech',
      description: 'Configuration options for Audio - Text-to-Speech',
      order: 237,
      fields: [
        {
          name: 'AUDIO_TTS_API_KEY',
          order: 237,
          category: 'Audio - Text-to-Speech',
        },
        {
          name: 'AUDIO_TTS_ENGINE',
          order: 238,
          category: 'Audio - Text-to-Speech',
        },
        {
          name: 'AUDIO_TTS_MODEL',
          order: 239,
          category: 'Audio - Text-to-Speech',
        },
        {
          name: 'AUDIO_TTS_VOICE',
          order: 240,
          category: 'Audio - Text-to-Speech',
        },
        {
          name: 'AUDIO_TTS_SPLIT_ON',
          order: 241,
          category: 'Audio - Text-to-Speech',
        },
      ],
      characteristics: {
        fieldCount: 5,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Audio',
        child: 'Text-to-Speech',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Audio - Azure Text-to-Speech',
      displayName: 'Audio - Azure Text-to-Speech',
      description: 'Configuration options for Audio - Azure Text-to-Speech',
      order: 242,
      fields: [
        {
          name: 'AUDIO_TTS_AZURE_SPEECH_REGION',
          order: 242,
          category: 'Audio - Azure Text-to-Speech',
        },
        {
          name: 'AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT',
          order: 243,
          category: 'Audio - Azure Text-to-Speech',
        },
      ],
      characteristics: {
        fieldCount: 2,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Audio',
        child: 'Azure Text-to-Speech',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Audio - OpenAI Text-to-Speech',
      displayName: 'Audio - OpenAI Text-to-Speech',
      description: 'Configuration options for Audio - OpenAI Text-to-Speech',
      order: 244,
      fields: [
        {
          name: 'AUDIO_TTS_OPENAI_API_BASE_URL',
          order: 244,
          category: 'Audio - OpenAI Text-to-Speech',
        },
        {
          name: 'AUDIO_TTS_OPENAI_API_KEY',
          order: 245,
          category: 'Audio - OpenAI Text-to-Speech',
        },
      ],
      characteristics: {
        fieldCount: 2,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Audio',
        child: 'OpenAI Text-to-Speech',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Image Generation',
      displayName: 'Image Generation',
      description: 'Configuration options for Image Generation',
      order: 246,
      fields: [
        {
          name: 'IMAGE_GENERATION_ENGINE',
          order: 246,
          category: 'Image Generation',
        },
        {
          name: 'ENABLE_IMAGE_GENERATION',
          order: 247,
          category: 'Image Generation',
        },
        {
          name: 'ENABLE_IMAGE_PROMPT_GENERATION',
          order: 248,
          category: 'Image Generation',
        },
        {
          name: 'IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE',
          order: 249,
          category: 'Image Generation',
        },
        {
          name: 'IMAGE_SIZE',
          order: 250,
          category: 'Image Generation',
        },
        {
          name: 'IMAGE_STEPS',
          order: 251,
          category: 'Image Generation',
        },
        {
          name: 'IMAGE_GENERATION_MODEL',
          order: 252,
          category: 'Image Generation',
        },
      ],
      characteristics: {
        fieldCount: 7,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: false,
        parent: null,
        child: null,
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Image Generation - AUTOMATIC1111',
      displayName: 'Image Generation - AUTOMATIC1111',
      description: 'Configuration options for Image Generation - AUTOMATIC1111',
      order: 253,
      fields: [
        {
          name: 'AUTOMATIC1111_BASE_URL',
          order: 253,
          category: 'Image Generation - AUTOMATIC1111',
        },
        {
          name: 'AUTOMATIC1111_API_AUTH',
          order: 254,
          category: 'Image Generation - AUTOMATIC1111',
        },
        {
          name: 'AUTOMATIC1111_CFG_SCALE',
          order: 255,
          category: 'Image Generation - AUTOMATIC1111',
        },
        {
          name: 'AUTOMATIC1111_SAMPLER',
          order: 256,
          category: 'Image Generation - AUTOMATIC1111',
        },
        {
          name: 'AUTOMATIC1111_SCHEDULER',
          order: 257,
          category: 'Image Generation - AUTOMATIC1111',
        },
      ],
      characteristics: {
        fieldCount: 5,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Image Generation',
        child: 'AUTOMATIC1111',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Image Generation - ComfyUI',
      displayName: 'Image Generation - ComfyUI',
      description: 'Configuration options for Image Generation - ComfyUI',
      order: 258,
      fields: [
        {
          name: 'COMFYUI_BASE_URL',
          order: 258,
          category: 'Image Generation - ComfyUI',
        },
        {
          name: 'COMFYUI_API_KEY',
          order: 259,
          category: 'Image Generation - ComfyUI',
        },
        {
          name: 'COMFYUI_WORKFLOW',
          order: 260,
          category: 'Image Generation - ComfyUI',
        },
      ],
      characteristics: {
        fieldCount: 3,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Image Generation',
        child: 'ComfyUI',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Image Generation - Gemini',
      displayName: 'Image Generation - Gemini',
      description: 'Configuration options for Image Generation - Gemini',
      order: 261,
      fields: [
        {
          name: 'GEMINI_API_BASE_URL',
          order: 261,
          category: 'Image Generation - Gemini',
        },
        {
          name: 'GEMINI_API_KEY',
          order: 262,
          category: 'Image Generation - Gemini',
        },
        {
          name: 'IMAGES_GEMINI_API_BASE_URL',
          order: 263,
          category: 'Image Generation - Gemini',
        },
        {
          name: 'IMAGES_GEMINI_API_KEY',
          order: 264,
          category: 'Image Generation - Gemini',
        },
      ],
      characteristics: {
        fieldCount: 4,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Image Generation',
        child: 'Gemini',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Image Generation - OpenAI DALL-E',
      displayName: 'Image Generation - OpenAI DALL-E',
      description: 'Configuration options for Image Generation - OpenAI DALL-E',
      order: 265,
      fields: [
        {
          name: 'IMAGES_OPENAI_API_BASE_URL',
          order: 265,
          category: 'Image Generation - OpenAI DALL-E',
        },
        {
          name: 'IMAGES_OPENAI_API_KEY',
          order: 266,
          category: 'Image Generation - OpenAI DALL-E',
        },
      ],
      characteristics: {
        fieldCount: 2,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Image Generation',
        child: 'OpenAI DALL-E',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'OAuth',
      displayName: 'OAuth',
      description: 'Configuration options for OAuth',
      order: 267,
      fields: [
        {
          name: 'ENABLE_OAUTH_SIGNUP',
          order: 267,
          category: 'OAuth',
        },
        {
          name: 'OAUTH_MERGE_ACCOUNTS_BY_EMAIL',
          order: 268,
          category: 'OAuth',
        },
        {
          name: 'OAUTH_UPDATE_PICTURE_ON_LOGIN',
          order: 269,
          category: 'OAuth',
        },
        {
          name: 'WEBUI_AUTH_TRUSTED_EMAIL_HEADER',
          order: 270,
          category: 'OAuth',
        },
        {
          name: 'WEBUI_AUTH_TRUSTED_NAME_HEADER',
          order: 271,
          category: 'OAuth',
        },
      ],
      characteristics: {
        fieldCount: 5,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: false,
        parent: null,
        child: null,
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'OAuth - Google',
      displayName: 'OAuth - Google',
      description: 'Configuration options for OAuth - Google',
      order: 272,
      fields: [
        {
          name: 'GOOGLE_CLIENT_ID',
          order: 272,
          category: 'OAuth - Google',
        },
        {
          name: 'GOOGLE_CLIENT_SECRET',
          order: 273,
          category: 'OAuth - Google',
        },
        {
          name: 'GOOGLE_OAUTH_SCOPE',
          order: 274,
          category: 'OAuth - Google',
        },
        {
          name: 'GOOGLE_REDIRECT_URI',
          order: 275,
          category: 'OAuth - Google',
        },
      ],
      characteristics: {
        fieldCount: 4,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'OAuth',
        child: 'Google',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'OAuth - Microsoft',
      displayName: 'OAuth - Microsoft',
      description: 'Configuration options for OAuth - Microsoft',
      order: 276,
      fields: [
        {
          name: 'MICROSOFT_CLIENT_ID',
          order: 276,
          category: 'OAuth - Microsoft',
        },
        {
          name: 'MICROSOFT_CLIENT_SECRET',
          order: 277,
          category: 'OAuth - Microsoft',
        },
        {
          name: 'MICROSOFT_CLIENT_TENANT_ID',
          order: 278,
          category: 'OAuth - Microsoft',
        },
        {
          name: 'MICROSOFT_OAUTH_SCOPE',
          order: 279,
          category: 'OAuth - Microsoft',
        },
        {
          name: 'MICROSOFT_REDIRECT_URI',
          order: 280,
          category: 'OAuth - Microsoft',
        },
      ],
      characteristics: {
        fieldCount: 5,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'OAuth',
        child: 'Microsoft',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'OAuth - GitHub',
      displayName: 'OAuth - GitHub',
      description: 'Configuration options for OAuth - GitHub',
      order: 281,
      fields: [
        {
          name: 'GITHUB_CLIENT_ID',
          order: 281,
          category: 'OAuth - GitHub',
        },
        {
          name: 'GITHUB_CLIENT_SECRET',
          order: 282,
          category: 'OAuth - GitHub',
        },
        {
          name: 'GITHUB_CLIENT_SCOPE',
          order: 283,
          category: 'OAuth - GitHub',
        },
        {
          name: 'GITHUB_CLIENT_REDIRECT_URI',
          order: 284,
          category: 'OAuth - GitHub',
        },
      ],
      characteristics: {
        fieldCount: 4,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'OAuth',
        child: 'GitHub',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'OAuth - OpenID (OIDC)',
      displayName: 'OAuth - OpenID (OIDC)',
      description: 'Configuration options for OAuth - OpenID (OIDC)',
      order: 285,
      fields: [
        {
          name: 'OAUTH_CLIENT_ID',
          order: 285,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_CLIENT_SECRET',
          order: 286,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OPENID_PROVIDER_URL',
          order: 287,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OPENID_REDIRECT_URI',
          order: 288,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_SCOPES',
          order: 289,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_CODE_CHALLENGE_METHOD',
          order: 290,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_PROVIDER_NAME',
          order: 291,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_USERNAME_CLAIM',
          order: 292,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_EMAIL_CLAIM',
          order: 293,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_PICTURE_CLAIM',
          order: 294,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_GROUP_CLAIM',
          order: 295,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'ENABLE_OAUTH_ROLE_MANAGEMENT',
          order: 296,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'ENABLE_OAUTH_GROUP_MANAGEMENT',
          order: 297,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_ROLES_CLAIM',
          order: 298,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_ALLOWED_ROLES',
          order: 299,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_ADMIN_ROLES',
          order: 300,
          category: 'OAuth - OpenID (OIDC)',
        },
        {
          name: 'OAUTH_ALLOWED_DOMAINS',
          order: 301,
          category: 'OAuth - OpenID (OIDC)',
        },
      ],
      characteristics: {
        fieldCount: 17,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'OAuth',
        child: 'OpenID (OIDC)',
      },
      renderingHints: {
        expandable: true,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'LDAP',
      displayName: 'LDAP',
      description: 'Configuration options for LDAP',
      order: 302,
      fields: [
        {
          name: 'ENABLE_LDAP',
          order: 302,
          category: 'LDAP',
        },
        {
          name: 'LDAP_SERVER_LABEL',
          order: 303,
          category: 'LDAP',
        },
        {
          name: 'LDAP_SERVER_HOST',
          order: 304,
          category: 'LDAP',
        },
        {
          name: 'LDAP_SERVER_PORT',
          order: 305,
          category: 'LDAP',
        },
        {
          name: 'LDAP_ATTRIBUTE_FOR_MAIL',
          order: 306,
          category: 'LDAP',
        },
        {
          name: 'LDAP_ATTRIBUTE_FOR_USERNAME',
          order: 307,
          category: 'LDAP',
        },
        {
          name: 'LDAP_APP_DN',
          order: 308,
          category: 'LDAP',
        },
        {
          name: 'LDAP_APP_PASSWORD',
          order: 309,
          category: 'LDAP',
        },
        {
          name: 'LDAP_SEARCH_BASE',
          order: 310,
          category: 'LDAP',
        },
        {
          name: 'LDAP_SEARCH_FILTER',
          order: 311,
          category: 'LDAP',
        },
        {
          name: 'LDAP_SEARCH_FILTERS',
          order: 312,
          category: 'LDAP',
        },
        {
          name: 'LDAP_USE_TLS',
          order: 313,
          category: 'LDAP',
        },
        {
          name: 'LDAP_CA_CERT_FILE',
          order: 314,
          category: 'LDAP',
        },
        {
          name: 'LDAP_VALIDATE_CERT',
          order: 315,
          category: 'LDAP',
        },
        {
          name: 'LDAP_CIPHERS',
          order: 316,
          category: 'LDAP',
        },
      ],
      characteristics: {
        fieldCount: 15,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: false,
        parent: null,
        child: null,
      },
      renderingHints: {
        expandable: true,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'User Permissions - Chat Permissions',
      displayName: 'User Permissions - Chat Permissions',
      description: 'Configuration options for User Permissions - Chat Permissions',
      order: 317,
      fields: [
        {
          name: 'USER_PERMISSIONS_CHAT_CONTROLS',
          order: 317,
          category: 'User Permissions - Chat Permissions',
        },
        {
          name: 'USER_PERMISSIONS_CHAT_FILE_UPLOAD',
          order: 318,
          category: 'User Permissions - Chat Permissions',
        },
        {
          name: 'USER_PERMISSIONS_CHAT_DELETE',
          order: 319,
          category: 'User Permissions - Chat Permissions',
        },
        {
          name: 'USER_PERMISSIONS_CHAT_EDIT',
          order: 320,
          category: 'User Permissions - Chat Permissions',
        },
        {
          name: 'USER_PERMISSIONS_CHAT_STT',
          order: 321,
          category: 'User Permissions - Chat Permissions',
        },
        {
          name: 'USER_PERMISSIONS_CHAT_TTS',
          order: 322,
          category: 'User Permissions - Chat Permissions',
        },
        {
          name: 'USER_PERMISSIONS_CHAT_CALL',
          order: 323,
          category: 'User Permissions - Chat Permissions',
        },
        {
          name: 'USER_PERMISSIONS_CHAT_MULTIPLE_MODELS',
          order: 324,
          category: 'User Permissions - Chat Permissions',
        },
        {
          name: 'USER_PERMISSIONS_CHAT_TEMPORARY',
          order: 325,
          category: 'User Permissions - Chat Permissions',
        },
        {
          name: 'USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED',
          order: 326,
          category: 'User Permissions - Chat Permissions',
        },
      ],
      characteristics: {
        fieldCount: 10,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'User Permissions',
        child: 'Chat Permissions',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'User Permissions - Feature Permissions',
      displayName: 'User Permissions - Feature Permissions',
      description: 'Configuration options for User Permissions - Feature Permissions',
      order: 327,
      fields: [
        {
          name: 'USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS',
          order: 327,
          category: 'User Permissions - Feature Permissions',
        },
        {
          name: 'USER_PERMISSIONS_FEATURES_WEB_SEARCH',
          order: 328,
          category: 'User Permissions - Feature Permissions',
        },
        {
          name: 'USER_PERMISSIONS_FEATURES_IMAGE_GENERATION',
          order: 329,
          category: 'User Permissions - Feature Permissions',
        },
        {
          name: 'USER_PERMISSIONS_FEATURES_CODE_INTERPRETER',
          order: 330,
          category: 'User Permissions - Feature Permissions',
        },
      ],
      characteristics: {
        fieldCount: 4,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'User Permissions',
        child: 'Feature Permissions',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: false,
        requiresSpecialHandling: false,
      },
    },
    {
      name: 'User Permissions - Workspace Permissions',
      displayName: 'User Permissions - Workspace Permissions',
      description: 'Configuration options for User Permissions - Workspace Permissions',
      order: 331,
      fields: [
        {
          name: 'USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS',
          order: 331,
          category: 'User Permissions - Workspace Permissions',
        },
        {
          name: 'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS',
          order: 332,
          category: 'User Permissions - Workspace Permissions',
        },
        {
          name: 'USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS',
          order: 333,
          category: 'User Permissions - Workspace Permissions',
        },
        {
          name: 'USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS',
          order: 334,
          category: 'User Permissions - Workspace Permissions',
        },
        {
          name: 'USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING',
          order: 335,
          category: 'User Permissions - Workspace Permissions',
        },
        {
          name: 'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING',
          order: 336,
          category: 'User Permissions - Workspace Permissions',
        },
        {
          name: 'USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING',
          order: 337,
          category: 'User Permissions - Workspace Permissions',
        },
        {
          name: 'USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING',
          order: 338,
          category: 'User Permissions - Workspace Permissions',
        },
      ],
      characteristics: {
        fieldCount: 8,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'User Permissions',
        child: 'Workspace Permissions',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Misc Environment Variables - Cloud Storage',
      displayName: 'Misc Environment Variables - Cloud Storage',
      description: 'Configuration options for Misc Environment Variables - Cloud Storage',
      order: 339,
      fields: [
        {
          name: 'STORAGE_PROVIDER',
          order: 339,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'S3_ACCESS_KEY_ID',
          order: 340,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'S3_ADDRESSING_STYLE',
          order: 341,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'S3_BUCKET_NAME',
          order: 342,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'S3_ENDPOINT_URL',
          order: 343,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'S3_KEY_PREFIX',
          order: 344,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'S3_REGION_NAME',
          order: 345,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'S3_SECRET_ACCESS_KEY',
          order: 346,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'S3_USE_ACCELERATE_ENDPOINT',
          order: 347,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'S3_ENABLE_TAGGING',
          order: 348,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'GOOGLE_APPLICATION_CREDENTIALS_JSON',
          order: 349,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'GCS_BUCKET_NAME',
          order: 350,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'AZURE_STORAGE_ENDPOINT',
          order: 351,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'AZURE_STORAGE_CONTAINER_NAME',
          order: 352,
          category: 'Misc Environment Variables - Cloud Storage',
        },
        {
          name: 'AZURE_STORAGE_KEY',
          order: 353,
          category: 'Misc Environment Variables - Cloud Storage',
        },
      ],
      characteristics: {
        fieldCount: 15,
        hasConditionalFields: true,
        hasSensitiveFields: true,
        isHierarchical: true,
        parent: 'Misc Environment Variables',
        child: 'Cloud Storage',
      },
      renderingHints: {
        expandable: true,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Misc Environment Variables - Database Pool',
      displayName: 'Misc Environment Variables - Database Pool',
      description: 'Configuration options for Misc Environment Variables - Database Pool',
      order: 354,
      fields: [
        {
          name: 'DATABASE_URL',
          order: 354,
          category: 'Misc Environment Variables - Database Pool',
        },
        {
          name: 'DATABASE_SCHEMA',
          order: 355,
          category: 'Misc Environment Variables - Database Pool',
        },
        {
          name: 'DATABASE_POOL_SIZE',
          order: 356,
          category: 'Misc Environment Variables - Database Pool',
        },
        {
          name: 'DATABASE_POOL_MAX_OVERFLOW',
          order: 357,
          category: 'Misc Environment Variables - Database Pool',
        },
        {
          name: 'DATABASE_POOL_TIMEOUT',
          order: 358,
          category: 'Misc Environment Variables - Database Pool',
        },
        {
          name: 'DATABASE_POOL_RECYCLE',
          order: 359,
          category: 'Misc Environment Variables - Database Pool',
        },
      ],
      characteristics: {
        fieldCount: 6,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Misc Environment Variables',
        child: 'Database Pool',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: false,
      },
    },
    {
      name: 'Misc Environment Variables - Redis',
      displayName: 'Misc Environment Variables - Redis',
      description: 'Configuration options for Misc Environment Variables - Redis',
      order: 360,
      fields: [
        {
          name: 'REDIS_URL',
          order: 360,
          category: 'Misc Environment Variables - Redis',
        },
        {
          name: 'REDIS_SENTINEL_HOSTS',
          order: 361,
          category: 'Misc Environment Variables - Redis',
        },
        {
          name: 'REDIS_SENTINEL_PORT',
          order: 362,
          category: 'Misc Environment Variables - Redis',
        },
        {
          name: 'ENABLE_WEBSOCKET_SUPPORT',
          order: 363,
          category: 'Misc Environment Variables - Redis',
        },
        {
          name: 'WEBSOCKET_MANAGER',
          order: 364,
          category: 'Misc Environment Variables - Redis',
        },
        {
          name: 'WEBSOCKET_REDIS_URL',
          order: 365,
          category: 'Misc Environment Variables - Redis',
        },
        {
          name: 'WEBSOCKET_SENTINEL_HOSTS',
          order: 366,
          category: 'Misc Environment Variables - Redis',
        },
        {
          name: 'WEBSOCKET_SENTINEL_PORT',
          order: 367,
          category: 'Misc Environment Variables - Redis',
        },
      ],
      characteristics: {
        fieldCount: 8,
        hasConditionalFields: true,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Misc Environment Variables',
        child: 'Redis',
      },
      renderingHints: {
        expandable: false,
        collapsible: true,
        inline: false,
        requiresSpecialHandling: true,
      },
    },
    {
      name: 'Misc Environment Variables - Uvicorn Settings',
      displayName: 'Misc Environment Variables - Uvicorn Settings',
      description: 'Configuration options for Misc Environment Variables - Uvicorn Settings',
      order: 368,
      fields: [
        {
          name: 'UVICORN_WORKERS',
          order: 368,
          category: 'Misc Environment Variables - Uvicorn Settings',
        },
      ],
      characteristics: {
        fieldCount: 1,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Misc Environment Variables',
        child: 'Uvicorn Settings',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: false,
      },
    },
    {
      name: 'Misc Environment Variables - Install Required Python Packages',
      displayName: 'Misc Environment Variables - Install Required Python Packages',
      description:
        'Configuration options for Misc Environment Variables - Install Required Python Packages',
      order: 369,
      fields: [
        {
          name: 'PIP_OPTIONS',
          order: 369,
          category: 'Misc Environment Variables - Install Required Python Packages',
        },
        {
          name: 'PIP_PACKAGE_INDEX_OPTIONS',
          order: 370,
          category: 'Misc Environment Variables - Install Required Python Packages',
        },
      ],
      characteristics: {
        fieldCount: 2,
        hasConditionalFields: false,
        hasSensitiveFields: false,
        isHierarchical: true,
        parent: 'Misc Environment Variables',
        child: 'Install Required Python Packages',
      },
      renderingHints: {
        expandable: false,
        collapsible: false,
        inline: true,
        requiresSpecialHandling: false,
      },
    },
  ],
  hierarchy: [
    {
      name: 'App/Backend',
      displayName: 'App/Backend',
      description: 'Configuration options for App/Backend',
      isParent: true,
      totalFields: 80,
      children: [
        {
          name: 'App/Backend - General',
          displayName: 'App/Backend - General',
          fieldCount: 32,
          fields: [
            'ADMIN_EMAIL',
            'BYPASS_MODEL_ACCESS_CONTROL',
            'CUSTOM_NAME',
            'DEFAULT_LOCALE',
            'DEFAULT_MODELS',
            'DEFAULT_PROMPT_SUGGESTIONS',
            'DEFAULT_USER_ROLE',
            'ENABLE_ADMIN_CHAT_ACCESS',
            'ENABLE_ADMIN_EXPORT',
            'ENABLE_CHANNELS',
            'ENABLE_LOGIN_FORM',
            'ENABLE_PERSISTENT_CONFIG',
            'ENABLE_REALTIME_CHAT_SAVE',
            'ENABLE_SIGNUP',
            'ENABLE_TITLE_GENERATION',
            'ENABLE_USER_WEBHOOKS',
            'ENV',
            'EXTERNAL_PWA_MANIFEST_URL',
            'LICENSE_KEY',
            'PENDING_USER_OVERLAY_CONTENT',
            'PENDING_USER_OVERLAY_TITLE',
            'PORT',
            'RESPONSE_WATERMARK',
            'SHOW_ADMIN_DETAILS',
            'SSL_ASSERT_FINGERPRINT',
            'THREAD_POOL_SIZE',
            'USE_CUDA_DOCKER',
            'WEBHOOK_URL',
            'WEBUI_BANNERS',
            'WEBUI_BUILD_HASH',
            'WEBUI_NAME',
            'WEBUI_URL',
          ],
          order: 1,
        },
        {
          name: 'App/Backend - AIOHTTP Client',
          displayName: 'App/Backend - AIOHTTP Client',
          fieldCount: 3,
          fields: [
            'AIOHTTP_CLIENT_TIMEOUT',
            'AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST',
            'AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST',
          ],
          order: 33,
        },
        {
          name: 'App/Backend - Directories',
          displayName: 'App/Backend - Directories',
          fieldCount: 4,
          fields: ['DATA_DIR', 'FONTS_DIR', 'FRONTEND_BUILD_DIR', 'STATIC_DIR'],
          order: 36,
        },
        {
          name: 'App/Backend - Ollama',
          displayName: 'App/Backend - Ollama',
          fieldCount: 4,
          fields: ['ENABLE_OLLAMA_API', 'K8S_FLAG', 'OLLAMA_BASE_URLS', 'USE_OLLAMA_DOCKER'],
          order: 40,
        },
        {
          name: 'App/Backend - OpenAI',
          displayName: 'App/Backend - OpenAI',
          fieldCount: 5,
          fields: [
            'ENABLE_OPENAI_API',
            'OPENAI_API_BASE_URL',
            'OPENAI_API_BASE_URLS',
            'OPENAI_API_KEY',
            'OPENAI_API_KEYS',
          ],
          order: 44,
        },
        {
          name: 'App/Backend - Tasks',
          displayName: 'App/Backend - Tasks',
          fieldCount: 4,
          fields: [
            'TASK_MODEL',
            'TASK_MODEL_EXTERNAL',
            'TITLE_GENERATION_PROMPT_TEMPLATE',
            'TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE',
          ],
          order: 49,
        },
        {
          name: 'App/Backend - Code Execution',
          displayName: 'App/Backend - Code Execution',
          fieldCount: 7,
          fields: [
            'CODE_EXECUTION_ENGINE',
            'CODE_EXECUTION_JUPYTER_AUTH',
            'CODE_EXECUTION_JUPYTER_AUTH_PASSWORD',
            'CODE_EXECUTION_JUPYTER_AUTH_TOKEN',
            'CODE_EXECUTION_JUPYTER_TIMEOUT',
            'CODE_EXECUTION_JUPYTER_URL',
            'ENABLE_CODE_EXECUTION',
          ],
          order: 53,
        },
        {
          name: 'App/Backend - Code Interpreter',
          displayName: 'App/Backend - Code Interpreter',
          fieldCount: 8,
          fields: [
            'CODE_INTERPRETER_ENGINE',
            'CODE_INTERPRETER_JUPYTER_AUTH',
            'CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD',
            'CODE_INTERPRETER_JUPYTER_AUTH_TOKEN',
            'CODE_INTERPRETER_JUPYTER_TIMEOUT',
            'CODE_INTERPRETER_JUPYTER_URL',
            'CODE_INTERPRETER_PROMPT_TEMPLATE',
            'ENABLE_CODE_INTERPRETER',
          ],
          order: 60,
        },
        {
          name: 'App/Backend - Direct Connections (OpenAPI/MCPO Tool Servers)',
          displayName: 'App/Backend - Direct Connections (OpenAPI/MCPO Tool Servers)',
          fieldCount: 1,
          fields: ['ENABLE_DIRECT_CONNECTIONS'],
          order: 68,
        },
        {
          name: 'App/Backend - Autocomplete',
          displayName: 'App/Backend - Autocomplete',
          fieldCount: 3,
          fields: [
            'AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH',
            'AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE',
            'ENABLE_AUTOCOMPLETE_GENERATION',
          ],
          order: 69,
        },
        {
          name: 'App/Backend - Evaluation Arena Model',
          displayName: 'App/Backend - Evaluation Arena Model',
          fieldCount: 3,
          fields: [
            'ENABLE_COMMUNITY_SHARING',
            'ENABLE_EVALUATION_ARENA_MODELS',
            'ENABLE_MESSAGE_RATING',
          ],
          order: 72,
        },
        {
          name: 'App/Backend - Tags Generation',
          displayName: 'App/Backend - Tags Generation',
          fieldCount: 2,
          fields: ['ENABLE_TAGS_GENERATION', 'TAGS_GENERATION_PROMPT_TEMPLATE'],
          order: 75,
        },
        {
          name: 'App/Backend - API Key Endpoint Restrictions',
          displayName: 'App/Backend - API Key Endpoint Restrictions',
          fieldCount: 4,
          fields: [
            'API_KEY_ALLOWED_ENDPOINTS',
            'ENABLE_API_KEY',
            'ENABLE_API_KEY_ENDPOINT_RESTRICTIONS',
            'JWT_EXPIRES_IN',
          ],
          order: 77,
        },
      ],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 80,
      },
    },
    {
      name: 'Security Variables',
      displayName: 'Security Variables',
      description: 'Configuration options for Security Variables',
      isParent: false,
      totalFields: 16,
      children: [],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 16,
      },
    },
    {
      name: 'Vector Database',
      displayName: 'Vector Database',
      description: 'Configuration options for Vector Database',
      isParent: true,
      totalFields: 42,
      children: [
        {
          name: 'Vector Database - ChromaDB',
          displayName: 'Vector Database - ChromaDB',
          fieldCount: 8,
          fields: [
            'CHROMA_CLIENT_AUTH_CREDENTIALS',
            'CHROMA_CLIENT_AUTH_PROVIDER',
            'CHROMA_DATABASE',
            'CHROMA_HTTP_HEADERS',
            'CHROMA_HTTP_HOST',
            'CHROMA_HTTP_PORT',
            'CHROMA_HTTP_SSL',
            'CHROMA_TENANT',
          ],
          order: 98,
        },
        {
          name: 'Vector Database - Elasticsearch',
          displayName: 'Vector Database - Elasticsearch',
          fieldCount: 7,
          fields: [
            'ELASTICSEARCH_API_KEY',
            'ELASTICSEARCH_CA_CERTS',
            'ELASTICSEARCH_CLOUD_ID',
            'ELASTICSEARCH_INDEX_PREFIX',
            'ELASTICSEARCH_PASSWORD',
            'ELASTICSEARCH_URL',
            'ELASTICSEARCH_USERNAME',
          ],
          order: 106,
        },
        {
          name: 'Vector Database - Milvus',
          displayName: 'Vector Database - Milvus',
          fieldCount: 8,
          fields: [
            'MILVUS_DB',
            'MILVUS_HNSW_EFCONSTRUCTION',
            'MILVUS_HNSW_M',
            'MILVUS_INDEX_TYPE',
            'MILVUS_IVF_FLAT_NLIST',
            'MILVUS_METRIC_TYPE',
            'MILVUS_TOKEN',
            'MILVUS_URI',
          ],
          order: 113,
        },
        {
          name: 'Vector Database - OpenSearch',
          displayName: 'Vector Database - OpenSearch',
          fieldCount: 5,
          fields: [
            'OPENSEARCH_CERT_VERIFY',
            'OPENSEARCH_PASSWORD',
            'OPENSEARCH_SSL',
            'OPENSEARCH_URI',
            'OPENSEARCH_USERNAME',
          ],
          order: 121,
        },
        {
          name: 'Vector Database - PGVector',
          displayName: 'Vector Database - PGVector',
          fieldCount: 2,
          fields: ['PGVECTOR_DB_URL', 'PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH'],
          order: 126,
        },
        {
          name: 'Vector Database - Qdrant',
          displayName: 'Vector Database - Qdrant',
          fieldCount: 6,
          fields: [
            'ENABLE_QDRANT_MULTITENANCY_MODE',
            'QDRANT_API_KEY',
            'QDRANT_GRPC_PORT',
            'QDRANT_ON_DISK',
            'QDRANT_PREFER_GRPC',
            'QDRANT_URI',
          ],
          order: 128,
        },
        {
          name: 'Vector Database - Pinecone',
          displayName: 'Vector Database - Pinecone',
          fieldCount: 6,
          fields: [
            'PINECONE_API_KEY',
            'PINECONE_CLOUD',
            'PINECONE_DIMENSION',
            'PINECONE_ENVIRONMENT',
            'PINECONE_INDEX_NAME',
            'PINECONE_METRIC',
          ],
          order: 134,
        },
      ],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 42,
      },
    },
    {
      name: 'RAG Content Extraction Engine',
      displayName: 'RAG Content Extraction Engine',
      description: 'Configuration options for RAG Content Extraction Engine',
      isParent: false,
      totalFields: 8,
      children: [],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 8,
      },
    },
    {
      name: 'Retrieval Augmented Generation (RAG)',
      displayName: 'Retrieval Augmented Generation (RAG)',
      description: 'Configuration options for Retrieval Augmented Generation (RAG)',
      isParent: true,
      totalFields: 5,
      children: [
        {
          name: 'Retrieval Augmented Generation (RAG) - Google Drive',
          displayName: 'Retrieval Augmented Generation (RAG) - Google Drive',
          fieldCount: 3,
          fields: [
            'ENABLE_GOOGLE_DRIVE_INTEGRATION',
            'GOOGLE_DRIVE_API_KEY',
            'GOOGLE_DRIVE_CLIENT_ID',
          ],
          order: 181,
        },
        {
          name: 'Retrieval Augmented Generation (RAG) - OneDrive',
          displayName: 'Retrieval Augmented Generation (RAG) - OneDrive',
          fieldCount: 2,
          fields: ['ENABLE_ONEDRIVE_INTEGRATION', 'ONEDRIVE_CLIENT_ID'],
          order: 184,
        },
      ],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 5,
      },
    },
    {
      name: 'Web Search',
      displayName: 'Web Search',
      description: 'Configuration options for Web Search',
      isParent: true,
      totalFields: 8,
      children: [
        {
          name: 'Web Search - Web Loader Configuration',
          displayName: 'Web Search - Web Loader Configuration',
          fieldCount: 6,
          fields: [
            'FIRECRAWL_API_BASE_URL',
            'FIRECRAWL_API_KEY',
            'PERPLEXITY_API_KEY',
            'PLAYWRIGHT_TIMEOUT',
            'PLAYWRIGHT_WS_URL',
            'WEB_LOADER_ENGINE',
          ],
          order: 216,
        },
        {
          name: 'Web Search - YouTube Loader',
          displayName: 'Web Search - YouTube Loader',
          fieldCount: 2,
          fields: ['YOUTUBE_LOADER_LANGUAGE', 'YOUTUBE_LOADER_PROXY_URL'],
          order: 222,
        },
      ],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 8,
      },
    },
    {
      name: 'Audio',
      displayName: 'Audio',
      description: 'Configuration options for Audio',
      isParent: true,
      totalFields: 22,
      children: [
        {
          name: 'Audio - Whisper Speech-to-Text (Local)',
          displayName: 'Audio - Whisper Speech-to-Text (Local)',
          fieldCount: 5,
          fields: [
            'WHISPER_LANGUAGE',
            'WHISPER_MODEL',
            'WHISPER_MODEL_AUTO_UPDATE',
            'WHISPER_MODEL_DIR',
            'WHISPER_VAD_FILTER',
          ],
          order: 224,
        },
        {
          name: 'Audio - Speech-to-Text (OpenAI)',
          displayName: 'Audio - Speech-to-Text (OpenAI)',
          fieldCount: 4,
          fields: [
            'AUDIO_STT_ENGINE',
            'AUDIO_STT_MODEL',
            'AUDIO_STT_OPENAI_API_BASE_URL',
            'AUDIO_STT_OPENAI_API_KEY',
          ],
          order: 229,
        },
        {
          name: 'Audio - Speech-to-Text (Azure)',
          displayName: 'Audio - Speech-to-Text (Azure)',
          fieldCount: 3,
          fields: ['AUDIO_STT_AZURE_API_KEY', 'AUDIO_STT_AZURE_LOCALES', 'AUDIO_STT_AZURE_REGION'],
          order: 233,
        },
        {
          name: 'Audio - Speech-to-Text (Deepgram)',
          displayName: 'Audio - Speech-to-Text (Deepgram)',
          fieldCount: 1,
          fields: ['DEEPGRAM_API_KEY'],
          order: 236,
        },
        {
          name: 'Audio - Text-to-Speech',
          displayName: 'Audio - Text-to-Speech',
          fieldCount: 5,
          fields: [
            'AUDIO_TTS_API_KEY',
            'AUDIO_TTS_ENGINE',
            'AUDIO_TTS_MODEL',
            'AUDIO_TTS_SPLIT_ON',
            'AUDIO_TTS_VOICE',
          ],
          order: 237,
        },
        {
          name: 'Audio - Azure Text-to-Speech',
          displayName: 'Audio - Azure Text-to-Speech',
          fieldCount: 2,
          fields: ['AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT', 'AUDIO_TTS_AZURE_SPEECH_REGION'],
          order: 242,
        },
        {
          name: 'Audio - OpenAI Text-to-Speech',
          displayName: 'Audio - OpenAI Text-to-Speech',
          fieldCount: 2,
          fields: ['AUDIO_TTS_OPENAI_API_BASE_URL', 'AUDIO_TTS_OPENAI_API_KEY'],
          order: 244,
        },
      ],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 22,
      },
    },
    {
      name: 'Image Generation',
      displayName: 'Image Generation',
      description: 'Configuration options for Image Generation',
      isParent: true,
      totalFields: 14,
      children: [
        {
          name: 'Image Generation - AUTOMATIC1111',
          displayName: 'Image Generation - AUTOMATIC1111',
          fieldCount: 5,
          fields: [
            'AUTOMATIC1111_API_AUTH',
            'AUTOMATIC1111_BASE_URL',
            'AUTOMATIC1111_CFG_SCALE',
            'AUTOMATIC1111_SAMPLER',
            'AUTOMATIC1111_SCHEDULER',
          ],
          order: 253,
        },
        {
          name: 'Image Generation - ComfyUI',
          displayName: 'Image Generation - ComfyUI',
          fieldCount: 3,
          fields: ['COMFYUI_API_KEY', 'COMFYUI_BASE_URL', 'COMFYUI_WORKFLOW'],
          order: 258,
        },
        {
          name: 'Image Generation - Gemini',
          displayName: 'Image Generation - Gemini',
          fieldCount: 4,
          fields: [
            'GEMINI_API_BASE_URL',
            'GEMINI_API_KEY',
            'IMAGES_GEMINI_API_BASE_URL',
            'IMAGES_GEMINI_API_KEY',
          ],
          order: 261,
        },
        {
          name: 'Image Generation - OpenAI DALL-E',
          displayName: 'Image Generation - OpenAI DALL-E',
          fieldCount: 2,
          fields: ['IMAGES_OPENAI_API_BASE_URL', 'IMAGES_OPENAI_API_KEY'],
          order: 265,
        },
      ],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 14,
      },
    },
    {
      name: 'OAuth',
      displayName: 'OAuth',
      description: 'Configuration options for OAuth',
      isParent: true,
      totalFields: 30,
      children: [
        {
          name: 'OAuth - Google',
          displayName: 'OAuth - Google',
          fieldCount: 4,
          fields: [
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'GOOGLE_OAUTH_SCOPE',
            'GOOGLE_REDIRECT_URI',
          ],
          order: 272,
        },
        {
          name: 'OAuth - Microsoft',
          displayName: 'OAuth - Microsoft',
          fieldCount: 5,
          fields: [
            'MICROSOFT_CLIENT_ID',
            'MICROSOFT_CLIENT_SECRET',
            'MICROSOFT_CLIENT_TENANT_ID',
            'MICROSOFT_OAUTH_SCOPE',
            'MICROSOFT_REDIRECT_URI',
          ],
          order: 276,
        },
        {
          name: 'OAuth - GitHub',
          displayName: 'OAuth - GitHub',
          fieldCount: 4,
          fields: [
            'GITHUB_CLIENT_ID',
            'GITHUB_CLIENT_REDIRECT_URI',
            'GITHUB_CLIENT_SCOPE',
            'GITHUB_CLIENT_SECRET',
          ],
          order: 281,
        },
        {
          name: 'OAuth - OpenID (OIDC)',
          displayName: 'OAuth - OpenID (OIDC)',
          fieldCount: 17,
          fields: [
            'ENABLE_OAUTH_GROUP_MANAGEMENT',
            'ENABLE_OAUTH_ROLE_MANAGEMENT',
            'OAUTH_ADMIN_ROLES',
            'OAUTH_ALLOWED_DOMAINS',
            'OAUTH_ALLOWED_ROLES',
            'OAUTH_CLIENT_ID',
            'OAUTH_CLIENT_SECRET',
            'OAUTH_CODE_CHALLENGE_METHOD',
            'OAUTH_EMAIL_CLAIM',
            'OAUTH_GROUP_CLAIM',
            'OAUTH_PICTURE_CLAIM',
            'OAUTH_PROVIDER_NAME',
            'OAUTH_ROLES_CLAIM',
            'OAUTH_SCOPES',
            'OAUTH_USERNAME_CLAIM',
            'OPENID_PROVIDER_URL',
            'OPENID_REDIRECT_URI',
          ],
          order: 285,
        },
      ],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 30,
      },
    },
    {
      name: 'LDAP',
      displayName: 'LDAP',
      description: 'Configuration options for LDAP',
      isParent: false,
      totalFields: 15,
      children: [],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 15,
      },
    },
    {
      name: 'User Permissions',
      displayName: 'User Permissions',
      description: 'Configuration options for User Permissions',
      isParent: true,
      totalFields: 22,
      children: [
        {
          name: 'User Permissions - Chat Permissions',
          displayName: 'User Permissions - Chat Permissions',
          fieldCount: 10,
          fields: [
            'USER_PERMISSIONS_CHAT_CALL',
            'USER_PERMISSIONS_CHAT_CONTROLS',
            'USER_PERMISSIONS_CHAT_DELETE',
            'USER_PERMISSIONS_CHAT_EDIT',
            'USER_PERMISSIONS_CHAT_FILE_UPLOAD',
            'USER_PERMISSIONS_CHAT_MULTIPLE_MODELS',
            'USER_PERMISSIONS_CHAT_STT',
            'USER_PERMISSIONS_CHAT_TEMPORARY',
            'USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED',
            'USER_PERMISSIONS_CHAT_TTS',
          ],
          order: 317,
        },
        {
          name: 'User Permissions - Feature Permissions',
          displayName: 'User Permissions - Feature Permissions',
          fieldCount: 4,
          fields: [
            'USER_PERMISSIONS_FEATURES_CODE_INTERPRETER',
            'USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS',
            'USER_PERMISSIONS_FEATURES_IMAGE_GENERATION',
            'USER_PERMISSIONS_FEATURES_WEB_SEARCH',
          ],
          order: 327,
        },
        {
          name: 'User Permissions - Workspace Permissions',
          displayName: 'User Permissions - Workspace Permissions',
          fieldCount: 8,
          fields: [
            'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS',
            'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING',
            'USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS',
            'USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING',
            'USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS',
            'USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING',
            'USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS',
            'USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING',
          ],
          order: 331,
        },
      ],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: false,
        totalFieldCount: 22,
      },
    },
    {
      name: 'Misc Environment Variables',
      displayName: 'Misc Environment Variables',
      description: 'Configuration options for Misc Environment Variables',
      isParent: true,
      totalFields: 32,
      children: [
        {
          name: 'Misc Environment Variables - Cloud Storage',
          displayName: 'Misc Environment Variables - Cloud Storage',
          fieldCount: 15,
          fields: [
            'AZURE_STORAGE_CONTAINER_NAME',
            'AZURE_STORAGE_ENDPOINT',
            'AZURE_STORAGE_KEY',
            'GCS_BUCKET_NAME',
            'GOOGLE_APPLICATION_CREDENTIALS_JSON',
            'S3_ACCESS_KEY_ID',
            'S3_ADDRESSING_STYLE',
            'S3_BUCKET_NAME',
            'S3_ENABLE_TAGGING',
            'S3_ENDPOINT_URL',
            'S3_KEY_PREFIX',
            'S3_REGION_NAME',
            'S3_SECRET_ACCESS_KEY',
            'S3_USE_ACCELERATE_ENDPOINT',
            'STORAGE_PROVIDER',
          ],
          order: 339,
        },
        {
          name: 'Misc Environment Variables - Database Pool',
          displayName: 'Misc Environment Variables - Database Pool',
          fieldCount: 6,
          fields: [
            'DATABASE_POOL_MAX_OVERFLOW',
            'DATABASE_POOL_RECYCLE',
            'DATABASE_POOL_SIZE',
            'DATABASE_POOL_TIMEOUT',
            'DATABASE_SCHEMA',
            'DATABASE_URL',
          ],
          order: 354,
        },
        {
          name: 'Misc Environment Variables - Redis',
          displayName: 'Misc Environment Variables - Redis',
          fieldCount: 8,
          fields: [
            'ENABLE_WEBSOCKET_SUPPORT',
            'REDIS_SENTINEL_HOSTS',
            'REDIS_SENTINEL_PORT',
            'REDIS_URL',
            'WEBSOCKET_MANAGER',
            'WEBSOCKET_REDIS_URL',
            'WEBSOCKET_SENTINEL_HOSTS',
            'WEBSOCKET_SENTINEL_PORT',
          ],
          order: 360,
        },
        {
          name: 'Misc Environment Variables - Uvicorn Settings',
          displayName: 'Misc Environment Variables - Uvicorn Settings',
          fieldCount: 1,
          fields: ['UVICORN_WORKERS'],
          order: 368,
        },
        {
          name: 'Misc Environment Variables - Install Required Python Packages',
          displayName: 'Misc Environment Variables - Install Required Python Packages',
          fieldCount: 2,
          fields: ['PIP_OPTIONS', 'PIP_PACKAGE_INDEX_OPTIONS'],
          order: 369,
        },
      ],
      characteristics: {
        hasConditionalFields: true,
        hasSensitiveFields: true,
        totalFieldCount: 32,
      },
    },
  ],
  metadata: {
    totalCategories: 55,
    hierarchicalGroups: 12,
    avgFieldsPerCategory: 7,
    categoryDistribution: {
      '20+': 3,
      '1-5': 34,
      '6-10': 14,
      '11-20': 4,
    },
  },
} as const;

// Flat array of categories for easy iteration
export const categories = categoryOrganization.categories;

// Hierarchical category structure for nested UI rendering
export const hierarchicalCategories = categoryOrganization.hierarchy;

// Category metadata and statistics
export const categoryMetadata = categoryOrganization.metadata;

// Field Configurations - Individual field UI configuration
const fieldConfigurationsPart1 = {
  WEBUI_URL: {
    name: 'WEBUI_URL',
    type: 'string',
    'ui:title': 'Webui Url',
    'ui:description':
      'Specifies the URL where the Open WebUI is reachable. Currently used for search engine support.',
    'ui:help': 'Environment variable: WEBUI_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 1,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'WEBUI_URL',
      persistentConfig: true,
    },
  },
  ENABLE_SIGNUP: {
    name: 'ENABLE_SIGNUP',
    type: 'boolean',
    'ui:title': 'Enable Signup',
    'ui:description': 'Toggles user account creation.',
    'ui:help': 'Environment variable: ENABLE_SIGNUP',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 2,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_SIGNUP',
      persistentConfig: true,
    },
  },
  ENABLE_LOGIN_FORM: {
    name: 'ENABLE_LOGIN_FORM',
    type: 'boolean',
    'ui:title': 'Enable Login Form',
    'ui:description':
      'Toggles email, password, sign-in and "or" (only when `ENABLE_OAUTH_SIGNUP` is set to True) elements.',
    'ui:help': 'Environment variable: ENABLE_LOGIN_FORM',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 3,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_LOGIN_FORM',
      persistentConfig: true,
    },
  },
  DEFAULT_LOCALE: {
    name: 'DEFAULT_LOCALE',
    type: 'string',
    'ui:title': 'Default Locale',
    'ui:description': 'Sets the default locale for the application.',
    'ui:help': 'Environment variable: DEFAULT_LOCALE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 4,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'DEFAULT_LOCALE',
      persistentConfig: true,
    },
  },
  DEFAULT_MODELS: {
    name: 'DEFAULT_MODELS',
    type: 'string',
    'ui:title': 'Default Models',
    'ui:description': 'Sets a default Language Model.',
    'ui:help': 'Environment variable: DEFAULT_MODELS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 5,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'DEFAULT_MODELS',
      persistentConfig: true,
    },
  },
  DEFAULT_USER_ROLE: {
    name: 'DEFAULT_USER_ROLE',
    type: 'string',
    'ui:title': 'Default User Role',
    'ui:description':
      'Sets the default role assigned to new users.\n\nOptions:\n  - `pending` - New users are pending until their accounts are manually activated by an admin.\n  - `user` - New users are automatically activated with regular user permissions.\n  - `admin` - New users are automatically activated with administrator permissions.\n',
    'ui:help': 'Environment variable: DEFAULT_USER_ROLE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'pending',
          label: 'Pending',
        },
        {
          value: 'user',
          label: 'User',
        },
        {
          value: 'admin',
          label: 'Admin',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 6,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'DEFAULT_USER_ROLE',
      persistentConfig: true,
    },
  },
  PENDING_USER_OVERLAY_TITLE: {
    name: 'PENDING_USER_OVERLAY_TITLE',
    type: 'string',
    'ui:title': 'Pending User Overlay Title',
    'ui:description': 'Sets a custom title for the pending user overlay.',
    'ui:help': 'Environment variable: PENDING_USER_OVERLAY_TITLE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 7,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'PENDING_USER_OVERLAY_TITLE',
      persistentConfig: true,
    },
  },
  PENDING_USER_OVERLAY_CONTENT: {
    name: 'PENDING_USER_OVERLAY_CONTENT',
    type: 'string',
    'ui:title': 'Pending User Overlay Content',
    'ui:description': 'Sets a custom text content for the pending user overlay.',
    'ui:help': 'Environment variable: PENDING_USER_OVERLAY_CONTENT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 8,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'PENDING_USER_OVERLAY_CONTENT',
      persistentConfig: true,
    },
  },
  ENABLE_CHANNELS: {
    name: 'ENABLE_CHANNELS',
    type: 'boolean',
    'ui:title': 'Enable Channels',
    'ui:description': 'Enables or disables channel support.',
    'ui:help': 'Environment variable: ENABLE_CHANNELS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 9,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_CHANNELS',
      persistentConfig: true,
    },
  },
  WEBHOOK_URL: {
    name: 'WEBHOOK_URL',
    type: 'string',
    'ui:title': 'Webhook Url',
    'ui:description': 'Sets a webhook for integration with Discord/Slack/Microsoft Teams.',
    'ui:help':
      'This field is shown when ENABLE_USER_WEBHOOKS is set to "true". Environment variable: WEBHOOK_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 10,
    'ui:condition': {
      field: 'ENABLE_USER_WEBHOOKS',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      envVar: 'WEBHOOK_URL',
      persistentConfig: true,
    },
  },
  ENABLE_ADMIN_EXPORT: {
    name: 'ENABLE_ADMIN_EXPORT',
    type: 'boolean',
    'ui:title': 'Enable Admin Export',
    'ui:description': 'Controls whether admin users can export data.',
    'ui:help': 'Environment variable: ENABLE_ADMIN_EXPORT',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 11,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_ADMIN_EXPORT',
      persistentConfig: false,
    },
  },
  ENABLE_ADMIN_CHAT_ACCESS: {
    name: 'ENABLE_ADMIN_CHAT_ACCESS',
    type: 'boolean',
    'ui:title': 'Enable Admin Chat Access',
    'ui:description': 'Enables admin users to access all chats.',
    'ui:help': 'Environment variable: ENABLE_ADMIN_CHAT_ACCESS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 12,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_ADMIN_CHAT_ACCESS',
      persistentConfig: false,
    },
  },
  ENABLE_USER_WEBHOOKS: {
    name: 'ENABLE_USER_WEBHOOKS',
    type: 'boolean',
    'ui:title': 'Enable User Webhooks',
    'ui:description': 'Enables or disables user webhooks.',
    'ui:help': 'Environment variable: ENABLE_USER_WEBHOOKS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 13,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_USER_WEBHOOKS',
      persistentConfig: true,
    },
  },
  RESPONSE_WATERMARK: {
    name: 'RESPONSE_WATERMARK',
    type: 'string',
    'ui:title': 'Response Watermark',
    'ui:description':
      'Sets a custom text that will be included when you copy a message in the chat. E.g. `"This text is AI generated"` -> will add "This text is AI generated" to every message, when copied.',
    'ui:help': 'Environment variable: RESPONSE_WATERMARK',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 14,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'RESPONSE_WATERMARK',
      persistentConfig: true,
    },
  },
  THREAD_POOL_SIZE: {
    name: 'THREAD_POOL_SIZE',
    type: 'integer',
    'ui:title': 'Thread Pool Size',
    'ui:description':
      'Sets the thread pool size for FastAPI/AnyIO blocking calls. By default (when set to 0) FastAPI/AnyIO use `40` threads. In case of large instances and many concurrent users, it may be needed to increase `THREAD_POOL_SIZE` to prevent blocking.',
    'ui:help': 'Environment variable: THREAD_POOL_SIZE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 15,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'THREAD_POOL_SIZE',
      persistentConfig: false,
    },
  },
  SHOW_ADMIN_DETAILS: {
    name: 'SHOW_ADMIN_DETAILS',
    type: 'boolean',
    'ui:title': 'Show Admin Details',
    'ui:description': 'Toggles whether to show admin user details in the interface.',
    'ui:help': 'Not sure Environment variable: SHOW_ADMIN_DETAILS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 16,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'SHOW_ADMIN_DETAILS',
      persistentConfig: true,
    },
  },
  ADMIN_EMAIL: {
    name: 'ADMIN_EMAIL',
    type: 'string',
    'ui:title': 'Admin Email',
    'ui:description': 'Sets the admin email shown by `SHOW_ADMIN_DETAILS`',
    'ui:help':
      'Has to be ingested from supabase details This field is shown when SHOW_ADMIN_DETAILS is set to "true". Environment variable: ADMIN_EMAIL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 17,
    'ui:condition': {
      field: 'SHOW_ADMIN_DETAILS',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Has to be ingested from supabase details',
      envVar: 'ADMIN_EMAIL',
      persistentConfig: true,
    },
  },
  ENV: {
    name: 'ENV',
    type: 'string',
    'ui:title': 'E N V',
    'ui:description':
      'Environment setting.\n\nOptions:\n  - `dev` - Enables the FastAPI API documentation on `/docs`\n  - `prod` - Automatically configures several environment variables\n',
    'ui:help': 'Environment variable: ENV',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'dev',
          label: 'Dev',
        },
        {
          value: 'prod',
          label: 'Prod',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 18,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'ENV',
      persistentConfig: false,
    },
  },
  ENABLE_PERSISTENT_CONFIG: {
    name: 'ENABLE_PERSISTENT_CONFIG',
    type: 'boolean',
    'ui:title': 'Enable Persistent Config',
    'ui:description':
      'If set to `False`, all `PersistentConfig` variables are treated as regular variables.',
    'ui:help': 'Environment variable: ENABLE_PERSISTENT_CONFIG',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 19,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_PERSISTENT_CONFIG',
      persistentConfig: false,
    },
  },
  CUSTOM_NAME: {
    name: 'CUSTOM_NAME',
    type: 'string',
    'ui:title': 'Custom Name',
    'ui:description': 'Sets `WEBUI_NAME` but polls **api.openwebui.com** for metadata.',
    'ui:help': 'unsure? Environment variable: CUSTOM_NAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 20,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'unsure?',
      envVar: 'CUSTOM_NAME',
      persistentConfig: false,
    },
  },
  WEBUI_NAME: {
    name: 'WEBUI_NAME',
    type: 'string',
    'ui:title': 'Webui Name',
    'ui:description': 'Sets the main WebUI name. Appends `(Open WebUI)` if overridden.',
    'ui:help': 'unsure Environment variable: WEBUI_NAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 21,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'unsure',
      envVar: 'WEBUI_NAME',
      persistentConfig: false,
    },
  },
  PORT: {
    name: 'PORT',
    type: 'integer',
    'ui:title': 'P O R T',
    'ui:description': 'Sets the port to run Open WebUI from.',
    'ui:help':
      'port environment variabled disregarded with python `open-webui serve` Environment variable: PORT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 22,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'port environment variabled disregarded with python `open-webui serve`',
      envVar: 'PORT',
      persistentConfig: false,
    },
  },
  ENABLE_REALTIME_CHAT_SAVE: {
    name: 'ENABLE_REALTIME_CHAT_SAVE',
    type: 'boolean',
    'ui:title': 'Enable Realtime Chat Save',
    'ui:description':
      "When enabled, the system saves each chunk of streamed chat data to the database in real time to ensure maximum data persistency. This feature provides robust data recovery and allows accurate session tracking. However, the tradeoff is increased latency, as saving to the database introduces a delay. Disabling this feature can improve performance and reduce delays, but it risks potential data loss in the event of a system failure or crash. Use based on your application's requirements and acceptable tradeoffs.",
    'ui:help':
      'make sure no added latency or at least compare Environment variable: ENABLE_REALTIME_CHAT_SAVE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 23,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'make sure no added latency or at least compare',
      envVar: 'ENABLE_REALTIME_CHAT_SAVE',
      persistentConfig: false,
    },
  },
  BYPASS_MODEL_ACCESS_CONTROL: {
    name: 'BYPASS_MODEL_ACCESS_CONTROL',
    type: 'boolean',
    'ui:title': 'Bypass Model Access Control',
    'ui:description': 'Bypasses model access control.',
    'ui:help': 'experiment with True Environment variable: BYPASS_MODEL_ACCESS_CONTROL',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 24,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'experiment with True',
      envVar: 'BYPASS_MODEL_ACCESS_CONTROL',
      persistentConfig: false,
    },
  },
  WEBUI_BUILD_HASH: {
    name: 'WEBUI_BUILD_HASH',
    type: 'string',
    'ui:title': 'Webui Build Hash',
    'ui:description': 'Used for identifying the Git SHA of the build for releases.',
    'ui:help': 'default maintained Environment variable: WEBUI_BUILD_HASH',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 25,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'default maintained',
      envVar: 'WEBUI_BUILD_HASH',
      persistentConfig: false,
    },
  },
  WEBUI_BANNERS: {
    name: 'WEBUI_BANNERS',
    type: 'array',
    'ui:title': 'Webui Banners',
    'ui:description': 'List of banners to show to users. The format for banners are:',
    'ui:help':
      'type should be list of strings as indicated in owui docs Environment variable: WEBUI_BANNERS',
    'ui:widget': 'default',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 26,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'type should be list of strings as indicated in owui docs',
      envVar: 'WEBUI_BANNERS',
      persistentConfig: true,
    },
  },
  USE_CUDA_DOCKER: {
    name: 'USE_CUDA_DOCKER',
    type: 'boolean',
    'ui:title': 'Use Cuda Docker',
    'ui:description':
      'Builds the Docker image with NVIDIA CUDA support. Enables GPU acceleration for local Whisper and embeddings.',
    'ui:help': 'not used since not using docker Environment variable: USE_CUDA_DOCKER',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 27,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'not used since not using docker',
      envVar: 'USE_CUDA_DOCKER',
      persistentConfig: false,
    },
  },
  EXTERNAL_PWA_MANIFEST_URL: {
    name: 'EXTERNAL_PWA_MANIFEST_URL',
    type: 'string',
    'ui:title': 'External Pwa Manifest Url',
    'ui:description':
      'When defined as a fully qualified URL (e.g., https://path/to/manifest.webmanifest), requests sent to /manifest.json will use the external manifest file. When not defined, the default manifest.json file will be used.',
    'ui:help':
      'left as empty string but to be investigated Environment variable: EXTERNAL_PWA_MANIFEST_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 28,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'left as empty string but to be investigated',
      envVar: 'EXTERNAL_PWA_MANIFEST_URL',
      persistentConfig: false,
    },
  },
  ENABLE_TITLE_GENERATION: {
    name: 'ENABLE_TITLE_GENERATION',
    type: 'boolean',
    'ui:title': 'Enable Title Generation',
    'ui:description': 'Enables or disables chat title generation.',
    'ui:help': 'Environment variable: ENABLE_TITLE_GENERATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 29,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_TITLE_GENERATION',
      persistentConfig: true,
    },
  },
  LICENSE_KEY: {
    name: 'LICENSE_KEY',
    type: 'string',
    'ui:title': 'License Key',
    'ui:description': 'Specifies the license key to use (for Enterprise users only).',
    'ui:help': 'Environment variable: LICENSE_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 30,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'unset',
      envVar: 'LICENSE_KEY',
      persistentConfig: true,
    },
  },
  SSL_ASSERT_FINGERPRINT: {
    name: 'SSL_ASSERT_FINGERPRINT',
    type: 'string',
    'ui:title': 'Ssl Assert Fingerprint',
    'ui:description': 'Specifies the SSL assert fingerprint to use.',
    'ui:help': 'left empty, investigate  Environment variable: SSL_ASSERT_FINGERPRINT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 31,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'left empty, investigate ',
      envVar: 'SSL_ASSERT_FINGERPRINT',
      persistentConfig: true,
    },
  },
  DEFAULT_PROMPT_SUGGESTIONS: {
    name: 'DEFAULT_PROMPT_SUGGESTIONS',
    type: 'array',
    'ui:title': 'Default Prompt Suggestions',
    'ui:description': 'List of prompt suggestions. The format for prompt suggestions are:',
    'ui:help': 'Environment variable: DEFAULT_PROMPT_SUGGESTIONS',
    'ui:widget': 'default',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - General',
    'ui:order': 32,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'DEFAULT_PROMPT_SUGGESTIONS',
      persistentConfig: false,
    },
  },
  AIOHTTP_CLIENT_TIMEOUT: {
    name: 'AIOHTTP_CLIENT_TIMEOUT',
    type: 'integer',
    'ui:title': 'Aiohttp Client Timeout',
    'ui:description':
      'Specifies the timeout duration in seconds for the AIOHTTP client. This impacts things',
    'ui:help': 'experiment with performance Environment variable: AIOHTTP_CLIENT_TIMEOUT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - AIOHTTP Client',
    'ui:order': 33,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'experiment with performance',
      envVar: 'AIOHTTP_CLIENT_TIMEOUT',
      persistentConfig: false,
    },
  },
  AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST: {
    name: 'AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST',
    type: 'integer',
    'ui:title': 'Aiohttp Client Timeout Model List',
    'ui:description':
      'Sets the timeout in seconds for fetching the model list. This can be useful in cases where network latency requires a longer timeout duration to successfully retrieve the model list.',
    'ui:help':
      'experiment with performance Environment variable: AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - AIOHTTP Client',
    'ui:order': 34,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'experiment with performance',
      envVar: 'AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST',
      persistentConfig: false,
    },
  },
  AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST: {
    name: 'AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST',
    type: 'integer',
    'ui:title': 'Aiohttp Client Timeout Openai Model List',
    'ui:description':
      'Sets the timeout in seconds for fetching the model list. This can be useful in cases where network latency requires a longer timeout duration to successfully retrieve the model list.',
    'ui:help':
      'experiment with performance Environment variable: AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - AIOHTTP Client',
    'ui:order': 35,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'experiment with performance',
      envVar: 'AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST',
      persistentConfig: false,
    },
  },
  DATA_DIR: {
    name: 'DATA_DIR',
    type: 'string',
    'ui:title': 'Data Dir',
    'ui:description':
      'Specifies the base directory for data storage, including uploads, cache, vector database, etc.',
    'ui:help':
      'Not sure is to be user-configurable, default behavior Environment variable: DATA_DIR',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Directories',
    'ui:order': 36,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure is to be user-configurable, default behavior',
      envVar: 'DATA_DIR',
      persistentConfig: false,
    },
  },
  FONTS_DIR: {
    name: 'FONTS_DIR',
    type: 'string',
    'ui:title': 'Fonts Dir',
    'ui:description': 'Specifies the directory for fonts.',
    'ui:help':
      'Not sure is to be user-configurable, default behavior Environment variable: FONTS_DIR',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Directories',
    'ui:order': 37,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Not sure is to be user-configurable, default behavior',
      envVar: 'FONTS_DIR',
      persistentConfig: false,
    },
  },
  FRONTEND_BUILD_DIR: {
    name: 'FRONTEND_BUILD_DIR',
    type: 'string',
    'ui:title': 'Frontend Build Dir',
    'ui:description': 'Specifies the location of the built frontend files.',
    'ui:help':
      'Not sure is to be user-configurable, default behavior Environment variable: FRONTEND_BUILD_DIR',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Directories',
    'ui:order': 38,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure is to be user-configurable, default behavior',
      envVar: 'FRONTEND_BUILD_DIR',
      persistentConfig: false,
    },
  },
  STATIC_DIR: {
    name: 'STATIC_DIR',
    type: 'string',
    'ui:title': 'Static Dir',
    'ui:description': 'Specifies the directory for static files, such as the favicon.',
    'ui:help':
      'Not sure is to be user-configurable, default behavior Environment variable: STATIC_DIR',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Directories',
    'ui:order': 39,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure is to be user-configurable, default behavior',
      envVar: 'STATIC_DIR',
      persistentConfig: false,
    },
  },
  ENABLE_OLLAMA_API: {
    name: 'ENABLE_OLLAMA_API',
    type: 'boolean',
    'ui:title': 'Enable Ollama Api',
    'ui:description': 'Enables the use of Ollama APIs.',
    'ui:help': 'Environment variable: ENABLE_OLLAMA_API',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Ollama',
    'ui:order': 40,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_OLLAMA_API',
      persistentConfig: true,
    },
  },
  OLLAMA_BASE_URLS: {
    name: 'OLLAMA_BASE_URLS',
    type: 'string',
    'ui:title': 'Ollama Base Urls',
    'ui:description': 'Configures load-balanced Ollama backend hosts, separated by `;`. See',
    'ui:help':
      'This field is shown when ENABLE_OLLAMA_API is set to "true". Environment variable: OLLAMA_BASE_URLS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Ollama',
    'ui:order': 41,
    'ui:condition': {
      field: 'ENABLE_OLLAMA_API',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'OLLAMA_BASE_URLS',
      persistentConfig: true,
    },
  },
  USE_OLLAMA_DOCKER: {
    name: 'USE_OLLAMA_DOCKER',
    type: 'boolean',
    'ui:title': 'Use Ollama Docker',
    'ui:description': 'Builds the Docker image with a bundled Ollama instance.',
    'ui:help': 'Environment variable: USE_OLLAMA_DOCKER',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Ollama',
    'ui:order': 42,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'USE_OLLAMA_DOCKER',
      persistentConfig: false,
    },
  },
  K8S_FLAG: {
    name: 'K8S_FLAG',
    type: 'boolean',
    'ui:title': 'K8s Flag',
    'ui:description':
      'If set, assumes Helm chart deployment and sets [`OLLAMA_BASE_URL`](#ollama_base_url) to `http://ollama-service.open-webui.svc.cluster.local:11434`',
    'ui:help': 'Environment variable: K8S_FLAG',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Ollama',
    'ui:order': 43,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'K8S_FLAG',
      persistentConfig: false,
    },
  },
  ENABLE_OPENAI_API: {
    name: 'ENABLE_OPENAI_API',
    type: 'boolean',
    'ui:title': 'Enable Openai Api',
    'ui:description': 'Enables the use of OpenAI APIs.',
    'ui:help':
      'Only unlocked if user specifies OpenAI API key Environment variable: ENABLE_OPENAI_API',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - OpenAI',
    'ui:order': 44,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Only unlocked if user specifies OpenAI API key',
      envVar: 'ENABLE_OPENAI_API',
      persistentConfig: true,
    },
  },
  OPENAI_API_BASE_URL: {
    name: 'OPENAI_API_BASE_URL',
    type: 'string',
    'ui:title': 'Openai Api Base Url',
    'ui:description': 'Configures the OpenAI base API URL.',
    'ui:help':
      'Only unlocked if user specifies OpenAI API key This field is shown when ENABLE_OPENAI_API is set to "true". Environment variable: OPENAI_API_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - OpenAI',
    'ui:order': 45,
    'ui:condition': {
      field: 'ENABLE_OPENAI_API',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Only unlocked if user specifies OpenAI API key',
      envVar: 'OPENAI_API_BASE_URL',
      persistentConfig: true,
    },
  },
  OPENAI_API_BASE_URLS: {
    name: 'OPENAI_API_BASE_URLS',
    type: 'string',
    'ui:title': 'Openai Api Base Urls',
    'ui:description': 'Supports balanced OpenAI base API URLs, semicolon-separated.',
    'ui:help':
      'Only unlocked if user specifies OpenAI API key This field is shown when ENABLE_OPENAI_API is set to "true". Environment variable: OPENAI_API_BASE_URLS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - OpenAI',
    'ui:order': 46,
    'ui:condition': {
      field: 'ENABLE_OPENAI_API',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Only unlocked if user specifies OpenAI API key',
      envVar: 'OPENAI_API_BASE_URLS',
      persistentConfig: true,
    },
  },
  OPENAI_API_KEY: {
    name: 'OPENAI_API_KEY',
    type: 'string',
    'ui:title': 'Openai Api Key',
    'ui:description': 'Sets the OpenAI API key.',
    'ui:help':
      'Only unlocked if user specifies OpenAI API key This field is shown when ENABLE_OPENAI_API is set to "true". Environment variable: OPENAI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - OpenAI',
    'ui:order': 47,
    'ui:condition': {
      field: 'ENABLE_OPENAI_API',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Only unlocked if user specifies OpenAI API key',
      envVar: 'OPENAI_API_KEY',
      persistentConfig: true,
    },
  },
  OPENAI_API_KEYS: {
    name: 'OPENAI_API_KEYS',
    type: 'string',
    'ui:title': 'Openai Api Keys',
    'ui:description': 'Supports multiple OpenAI API keys, semicolon-separated.',
    'ui:help':
      'Only unlocked if user specifies OpenAI API key This field is shown when ENABLE_OPENAI_API is set to "true". Environment variable: OPENAI_API_KEYS',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - OpenAI',
    'ui:order': 48,
    'ui:condition': {
      field: 'ENABLE_OPENAI_API',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Only unlocked if user specifies OpenAI API key',
      envVar: 'OPENAI_API_KEYS',
      persistentConfig: true,
    },
  },
  TASK_MODEL: {
    name: 'TASK_MODEL',
    type: 'string',
    'ui:title': 'Task Model',
    'ui:description':
      'The default model to use for tasks such as title and web search query generation',
    'ui:help': 'left empty for now Environment variable: TASK_MODEL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Tasks',
    'ui:order': 49,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'left empty for now',
      envVar: 'TASK_MODEL',
      persistentConfig: true,
    },
  },
  TASK_MODEL_EXTERNAL: {
    name: 'TASK_MODEL_EXTERNAL',
    type: 'string',
    'ui:title': 'Task Model External',
    'ui:description':
      'The default model to use for tasks such as title and web search query generation',
    'ui:help': 'left empty for now Environment variable: TASK_MODEL_EXTERNAL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Tasks',
    'ui:order': 50,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'left empty for now',
      envVar: 'TASK_MODEL_EXTERNAL',
      persistentConfig: true,
    },
  },
} as const;

const fieldConfigurationsPart2 = {
  TITLE_GENERATION_PROMPT_TEMPLATE: {
    name: 'TITLE_GENERATION_PROMPT_TEMPLATE',
    type: 'string',
    'ui:title': 'Title Generation Prompt Template',
    'ui:description': 'Prompt to use when generating chat titles.',
    'ui:help':
      'left empty for now This field is shown when ENABLE_TITLE_GENERATION is set to "true". Environment variable: TITLE_GENERATION_PROMPT_TEMPLATE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Tasks',
    'ui:order': 51,
    'ui:condition': {
      field: 'ENABLE_TITLE_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'left empty for now',
      envVar: 'TITLE_GENERATION_PROMPT_TEMPLATE',
      persistentConfig: true,
    },
  },
  TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE: {
    name: 'TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE',
    type: 'string',
    'ui:title': 'Tools Function Calling Prompt Template',
    'ui:description': 'Prompt to use when calling tools.',
    'ui:help': 'left empty for now Environment variable: TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Tasks',
    'ui:order': 52,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'left empty for now',
      envVar: 'TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE',
      persistentConfig: true,
    },
  },
  ENABLE_CODE_EXECUTION: {
    name: 'ENABLE_CODE_EXECUTION',
    type: 'boolean',
    'ui:title': 'Enable Code Execution',
    'ui:description': 'Enables or disables code execution.',
    'ui:help': 'Environment variable: ENABLE_CODE_EXECUTION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Execution',
    'ui:order': 53,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_CODE_EXECUTION',
      persistentConfig: true,
    },
  },
  CODE_EXECUTION_ENGINE: {
    name: 'CODE_EXECUTION_ENGINE',
    type: 'string',
    'ui:title': 'Code Execution Engine',
    'ui:description': 'Specifies the code execution engine to use.',
    'ui:help':
      'This field is shown when ENABLE_CODE_EXECUTION is set to "true". Environment variable: CODE_EXECUTION_ENGINE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'jupyter',
          label: 'Jupyter',
        },
        {
          value: 'pyodide',
          label: 'Pyodide',
        },
      ],
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'select-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Execution',
    'ui:order': 54,
    'ui:condition': {
      field: 'ENABLE_CODE_EXECUTION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'CODE_EXECUTION_ENGINE',
      persistentConfig: true,
    },
  },
  CODE_EXECUTION_JUPYTER_URL: {
    name: 'CODE_EXECUTION_JUPYTER_URL',
    type: 'string',
    'ui:title': 'Code Execution Jupyter Url',
    'ui:description': 'Specifies the Jupyter URL to use for code execution.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_EXECUTION_JUPYTER_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Execution',
    'ui:order': 55,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_EXECUTION',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_EXECUTION_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_EXECUTION_JUPYTER_URL',
      persistentConfig: true,
    },
  },
  CODE_EXECUTION_JUPYTER_AUTH: {
    name: 'CODE_EXECUTION_JUPYTER_AUTH',
    type: 'string',
    'ui:title': 'Code Execution Jupyter Auth',
    'ui:description': 'Specifies the Jupyter authentication method to use for code execution.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_EXECUTION_JUPYTER_AUTH',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Execution',
    'ui:order': 56,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_EXECUTION',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_EXECUTION_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_EXECUTION_JUPYTER_AUTH',
      persistentConfig: true,
    },
  },
  CODE_EXECUTION_JUPYTER_AUTH_TOKEN: {
    name: 'CODE_EXECUTION_JUPYTER_AUTH_TOKEN',
    type: 'string',
    'ui:title': 'Code Execution Jupyter Auth Token',
    'ui:description': 'Specifies the Jupyter authentication token to use for code execution.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_EXECUTION_JUPYTER_AUTH_TOKEN',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - Code Execution',
    'ui:order': 57,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_EXECUTION',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_EXECUTION_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_EXECUTION_JUPYTER_AUTH_TOKEN',
      persistentConfig: true,
    },
  },
  CODE_EXECUTION_JUPYTER_AUTH_PASSWORD: {
    name: 'CODE_EXECUTION_JUPYTER_AUTH_PASSWORD',
    type: 'string',
    'ui:title': 'Code Execution Jupyter Auth Password',
    'ui:description': 'Specifies the Jupyter authentication password to use for code execution.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_EXECUTION_JUPYTER_AUTH_PASSWORD',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - Code Execution',
    'ui:order': 58,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_EXECUTION',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_EXECUTION_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_EXECUTION_JUPYTER_AUTH_PASSWORD',
      persistentConfig: true,
    },
  },
  CODE_EXECUTION_JUPYTER_TIMEOUT: {
    name: 'CODE_EXECUTION_JUPYTER_TIMEOUT',
    type: 'string',
    'ui:title': 'Code Execution Jupyter Timeout',
    'ui:description': 'Specifies the timeout for Jupyter code execution.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_EXECUTION_JUPYTER_TIMEOUT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Execution',
    'ui:order': 59,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_EXECUTION',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_EXECUTION_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_EXECUTION_JUPYTER_TIMEOUT',
      persistentConfig: true,
    },
  },
  ENABLE_CODE_INTERPRETER: {
    name: 'ENABLE_CODE_INTERPRETER',
    type: 'boolean',
    'ui:title': 'Enable Code Interpreter',
    'ui:description': 'Enables or disables code interpreter.',
    'ui:help': 'Environment variable: ENABLE_CODE_INTERPRETER',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Interpreter',
    'ui:order': 60,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_CODE_INTERPRETER',
      persistentConfig: true,
    },
  },
  CODE_INTERPRETER_ENGINE: {
    name: 'CODE_INTERPRETER_ENGINE',
    type: 'string',
    'ui:title': 'Code Interpreter Engine',
    'ui:description': 'Specifies the code interpreter engine to use.',
    'ui:help':
      'This field is shown when ENABLE_CODE_INTERPRETER is set to "true". Environment variable: CODE_INTERPRETER_ENGINE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'jupyter',
          label: 'Jupyter',
        },
        {
          value: 'pyodide',
          label: 'Pyodide',
        },
      ],
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'select-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Interpreter',
    'ui:order': 61,
    'ui:condition': {
      field: 'ENABLE_CODE_INTERPRETER',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'CODE_INTERPRETER_ENGINE',
      persistentConfig: true,
    },
  },
  CODE_INTERPRETER_PROMPT_TEMPLATE: {
    name: 'CODE_INTERPRETER_PROMPT_TEMPLATE',
    type: 'string',
    'ui:title': 'Code Interpreter Prompt Template',
    'ui:description': 'Specifies the prompt template to use for code interpreter.',
    'ui:help':
      'tbd This field is shown when ENABLE_CODE_INTERPRETER is set to "true". Environment variable: CODE_INTERPRETER_PROMPT_TEMPLATE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Interpreter',
    'ui:order': 62,
    'ui:condition': {
      field: 'ENABLE_CODE_INTERPRETER',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'tbd',
      envVar: 'CODE_INTERPRETER_PROMPT_TEMPLATE',
      persistentConfig: true,
    },
  },
  CODE_INTERPRETER_JUPYTER_URL: {
    name: 'CODE_INTERPRETER_JUPYTER_URL',
    type: 'string',
    'ui:title': 'Code Interpreter Jupyter Url',
    'ui:description': 'Specifies the Jupyter URL to use for code interpreter.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_INTERPRETER_JUPYTER_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Interpreter',
    'ui:order': 63,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_INTERPRETER',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_INTERPRETER_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_INTERPRETER_JUPYTER_URL',
      persistentConfig: true,
    },
  },
  CODE_INTERPRETER_JUPYTER_AUTH: {
    name: 'CODE_INTERPRETER_JUPYTER_AUTH',
    type: 'string',
    'ui:title': 'Code Interpreter Jupyter Auth',
    'ui:description': 'Specifies the Jupyter authentication method to use for code interpreter.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_INTERPRETER_JUPYTER_AUTH',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Interpreter',
    'ui:order': 64,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_INTERPRETER',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_INTERPRETER_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_INTERPRETER_JUPYTER_AUTH',
      persistentConfig: true,
    },
  },
  CODE_INTERPRETER_JUPYTER_AUTH_TOKEN: {
    name: 'CODE_INTERPRETER_JUPYTER_AUTH_TOKEN',
    type: 'string',
    'ui:title': 'Code Interpreter Jupyter Auth Token',
    'ui:description': 'Specifies the Jupyter authentication token to use for code interpreter.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_INTERPRETER_JUPYTER_AUTH_TOKEN',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - Code Interpreter',
    'ui:order': 65,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_INTERPRETER',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_INTERPRETER_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_INTERPRETER_JUPYTER_AUTH_TOKEN',
      persistentConfig: true,
    },
  },
  CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD: {
    name: 'CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD',
    type: 'string',
    'ui:title': 'Code Interpreter Jupyter Auth Password',
    'ui:description': 'Specifies the Jupyter authentication password to use for code interpreter.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - Code Interpreter',
    'ui:order': 66,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_INTERPRETER',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_INTERPRETER_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD',
      persistentConfig: true,
    },
  },
  CODE_INTERPRETER_JUPYTER_TIMEOUT: {
    name: 'CODE_INTERPRETER_JUPYTER_TIMEOUT',
    type: 'string',
    'ui:title': 'Code Interpreter Jupyter Timeout',
    'ui:description': 'Specifies the timeout for the Jupyter code interpreter.',
    'ui:help':
      'FEATURE 7 - to be provisioned on beam This field has 2 conditional requirements. Environment variable: CODE_INTERPRETER_JUPYTER_TIMEOUT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Code Interpreter',
    'ui:order': 67,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_CODE_INTERPRETER',
          operator: 'equals',
          value: true,
        },
        {
          field: 'CODE_INTERPRETER_ENGINE',
          operator: 'equals',
          value: 'jupyter',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 7 - to be provisioned on beam',
      envVar: 'CODE_INTERPRETER_JUPYTER_TIMEOUT',
      persistentConfig: true,
    },
  },
  ENABLE_DIRECT_CONNECTIONS: {
    name: 'ENABLE_DIRECT_CONNECTIONS',
    type: 'boolean',
    'ui:title': 'Enable Direct Connections',
    'ui:description': 'Enables or disables direct connections.',
    'ui:help':
      'FEATURE 8 - identify ideal hosting solution Environment variable: ENABLE_DIRECT_CONNECTIONS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Direct Connections (OpenAPI/MCPO Tool Servers)',
    'ui:order': 68,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'FEATURE 8 - identify ideal hosting solution',
      envVar: 'ENABLE_DIRECT_CONNECTIONS',
      persistentConfig: true,
    },
  },
  ENABLE_AUTOCOMPLETE_GENERATION: {
    name: 'ENABLE_AUTOCOMPLETE_GENERATION',
    type: 'boolean',
    'ui:title': 'Enable Autocomplete Generation',
    'ui:description': 'Enables or disables autocomplete generation.',
    'ui:help': 'Environment variable: ENABLE_AUTOCOMPLETE_GENERATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Autocomplete',
    'ui:order': 69,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_AUTOCOMPLETE_GENERATION',
      persistentConfig: true,
    },
  },
  AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH: {
    name: 'AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH',
    type: 'integer',
    'ui:title': 'Autocomplete Generation Input Max Length',
    'ui:description': 'Sets the maximum input length for autocomplete generation.',
    'ui:help':
      'This field is shown when ENABLE_AUTOCOMPLETE_GENERATION is set to "true". Environment variable: AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Autocomplete',
    'ui:order': 70,
    'ui:condition': {
      field: 'ENABLE_AUTOCOMPLETE_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH',
      persistentConfig: true,
    },
  },
  AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE: {
    name: 'AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE',
    type: 'string',
    'ui:title': 'Autocomplete Generation Prompt Template',
    'ui:description': 'Sets the prompt template for autocomplete generation.',
    'ui:help':
      'left so it can use default This field is shown when ENABLE_AUTOCOMPLETE_GENERATION is set to "true". Environment variable: AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Autocomplete',
    'ui:order': 71,
    'ui:condition': {
      field: 'ENABLE_AUTOCOMPLETE_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'left so it can use default',
      envVar: 'AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE',
      persistentConfig: true,
    },
  },
  ENABLE_EVALUATION_ARENA_MODELS: {
    name: 'ENABLE_EVALUATION_ARENA_MODELS',
    type: 'boolean',
    'ui:title': 'Enable Evaluation Arena Models',
    'ui:description': 'Enables or disables evaluation arena models.',
    'ui:help': 'Environment variable: ENABLE_EVALUATION_ARENA_MODELS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Evaluation Arena Model',
    'ui:order': 72,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_EVALUATION_ARENA_MODELS',
      persistentConfig: true,
    },
  },
  ENABLE_MESSAGE_RATING: {
    name: 'ENABLE_MESSAGE_RATING',
    type: 'boolean',
    'ui:title': 'Enable Message Rating',
    'ui:description': 'Enables message rating feature.',
    'ui:help': 'Environment variable: ENABLE_MESSAGE_RATING',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Evaluation Arena Model',
    'ui:order': 73,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_MESSAGE_RATING',
      persistentConfig: true,
    },
  },
  ENABLE_COMMUNITY_SHARING: {
    name: 'ENABLE_COMMUNITY_SHARING',
    type: 'boolean',
    'ui:title': 'Enable Community Sharing',
    'ui:description': 'Controls whether users are shown the share to community button.',
    'ui:help': 'Off by default Environment variable: ENABLE_COMMUNITY_SHARING',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Evaluation Arena Model',
    'ui:order': 74,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Off by default',
      envVar: 'ENABLE_COMMUNITY_SHARING',
      persistentConfig: true,
    },
  },
  ENABLE_TAGS_GENERATION: {
    name: 'ENABLE_TAGS_GENERATION',
    type: 'boolean',
    'ui:title': 'Enable Tags Generation',
    'ui:description': 'Enables or disables tag generation.',
    'ui:help': 'Environment variable: ENABLE_TAGS_GENERATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Tags Generation',
    'ui:order': 75,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_TAGS_GENERATION',
      persistentConfig: true,
    },
  },
  TAGS_GENERATION_PROMPT_TEMPLATE: {
    name: 'TAGS_GENERATION_PROMPT_TEMPLATE',
    type: 'string',
    'ui:title': 'Tags Generation Prompt Template',
    'ui:description': 'Sets the prompt template for tag generation.',
    'ui:help':
      'left empty for default use This field is shown when ENABLE_TAGS_GENERATION is set to "true". Environment variable: TAGS_GENERATION_PROMPT_TEMPLATE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - Tags Generation',
    'ui:order': 76,
    'ui:condition': {
      field: 'ENABLE_TAGS_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'left empty for default use',
      envVar: 'TAGS_GENERATION_PROMPT_TEMPLATE',
      persistentConfig: true,
    },
  },
  ENABLE_API_KEY: {
    name: 'ENABLE_API_KEY',
    type: 'boolean',
    'ui:title': 'Enable Api Key',
    'ui:description': 'Enables API key authentication.',
    'ui:help':
      'With Leger this is handled externally and OWUI is only used as frontend  Environment variable: ENABLE_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - API Key Endpoint Restrictions',
    'ui:order': 77,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'With Leger this is handled externally and OWUI is only used as frontend ',
      envVar: 'ENABLE_API_KEY',
      persistentConfig: true,
    },
  },
  ENABLE_API_KEY_ENDPOINT_RESTRICTIONS: {
    name: 'ENABLE_API_KEY_ENDPOINT_RESTRICTIONS',
    type: 'boolean',
    'ui:title': 'Enable Api Key Endpoint Restrictions',
    'ui:description':
      'Enables API key endpoint restrictions for added security and configurability.',
    'ui:help':
      'With Leger this is handled externally and OWUI is only used as frontend  Environment variable: ENABLE_API_KEY_ENDPOINT_RESTRICTIONS',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - API Key Endpoint Restrictions',
    'ui:order': 78,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'With Leger this is handled externally and OWUI is only used as frontend ',
      envVar: 'ENABLE_API_KEY_ENDPOINT_RESTRICTIONS',
      persistentConfig: true,
    },
  },
  API_KEY_ALLOWED_ENDPOINTS: {
    name: 'API_KEY_ALLOWED_ENDPOINTS',
    type: 'string',
    'ui:title': 'Api Key Allowed Endpoints',
    'ui:description':
      'Specifies a comma-separated list of allowed API endpoints when API key endpoint restrictions are enabled.',
    'ui:help':
      'With Leger this is handled externally and OWUI is only used as frontend  This field is shown when ENABLE_API_KEY_ENDPOINT_RESTRICTIONS is set to "true". Environment variable: API_KEY_ALLOWED_ENDPOINTS',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'App/Backend - API Key Endpoint Restrictions',
    'ui:order': 79,
    'ui:condition': {
      field: 'ENABLE_API_KEY_ENDPOINT_RESTRICTIONS',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'With Leger this is handled externally and OWUI is only used as frontend ',
      envVar: 'API_KEY_ALLOWED_ENDPOINTS',
      persistentConfig: true,
    },
  },
  JWT_EXPIRES_IN: {
    name: 'JWT_EXPIRES_IN',
    type: 'integer',
    'ui:title': 'Jwt Expires In',
    'ui:description':
      'Sets the JWT expiration time in seconds. Valid time units: `s`, `m`, `h`, `d`, `w` or `-1` for no expiration.',
    'ui:help': 'Environment variable: JWT_EXPIRES_IN',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'App/Backend - API Key Endpoint Restrictions',
    'ui:order': 80,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'JWT_EXPIRES_IN',
      persistentConfig: true,
    },
  },
  ENABLE_FORWARD_USER_INFO_HEADERS: {
    name: 'ENABLE_FORWARD_USER_INFO_HEADERS',
    type: 'string',
    'ui:title': 'Enable Forward User Info Headers',
    'ui:description':
      'Forwards user information (name, ID, email, and role) as X-headers to OpenAI API and Ollama API.',
    'ui:help': 'Not sure Environment variable: ENABLE_FORWARD_USER_INFO_HEADERS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 81,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'ENABLE_FORWARD_USER_INFO_HEADERS',
      persistentConfig: false,
    },
  },
  ENABLE_WEB_LOADER_SSL_VERIFICATION: {
    name: 'ENABLE_WEB_LOADER_SSL_VERIFICATION',
    type: 'boolean',
    'ui:title': 'Enable Web Loader Ssl Verification',
    'ui:description': 'Bypass SSL Verification for RAG on Websites.',
    'ui:help': 'Not sure Environment variable: ENABLE_WEB_LOADER_SSL_VERIFICATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 82,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'ENABLE_WEB_LOADER_SSL_VERIFICATION',
      persistentConfig: true,
    },
  },
  WEBUI_SESSION_COOKIE_SAME_SITE: {
    name: 'WEBUI_SESSION_COOKIE_SAME_SITE',
    type: 'string',
    'ui:title': 'Webui Session Cookie Same Site',
    'ui:description':
      'Sets the `SameSite` attribute for session cookies.\n\nOptions:\n  - `lax` - Sets the `SameSite` attribute to lax, allowing session cookies to be sent with\nrequests initiated by third-party websites.\n  - `strict` - Sets the `SameSite` attribute to strict, blocking session cookies from being sent\nwith requests initiated by third-party websites.\n  - `none` - Sets the `SameSite` attribute to none, allowing session cookies to be sent with\nrequests initiated by third-party websites, but only over HTTPS.\n',
    'ui:help':
      'Not sure This field is shown when WEBUI_AUTH is set to "true". Environment variable: WEBUI_SESSION_COOKIE_SAME_SITE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'lax',
          label: 'Lax',
        },
        {
          value: 'strict',
          label: 'Strict',
        },
        {
          value: 'none',
          label: 'None',
        },
      ],
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'select-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 83,
    'ui:condition': {
      field: 'WEBUI_AUTH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'WEBUI_SESSION_COOKIE_SAME_SITE',
      persistentConfig: false,
    },
  },
  WEBUI_SESSION_COOKIE_SECURE: {
    name: 'WEBUI_SESSION_COOKIE_SECURE',
    type: 'boolean',
    'ui:title': 'Webui Session Cookie Secure',
    'ui:description': 'Sets the `Secure` attribute for session cookies if set to `True`.',
    'ui:help':
      'Not sure This field is shown when WEBUI_AUTH is set to "true". Environment variable: WEBUI_SESSION_COOKIE_SECURE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 84,
    'ui:condition': {
      field: 'WEBUI_AUTH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'WEBUI_SESSION_COOKIE_SECURE',
      persistentConfig: false,
    },
  },
  WEBUI_AUTH_COOKIE_SAME_SITE: {
    name: 'WEBUI_AUTH_COOKIE_SAME_SITE',
    type: 'string',
    'ui:title': 'Webui Auth Cookie Same Site',
    'ui:description':
      'Sets the `SameSite` attribute for auth cookies.\n\nOptions:\n  - `lax` - Sets the `SameSite` attribute to lax, allowing auth cookies to be sent with\nrequests initiated by third-party websites.\n  - `strict` - Sets the `SameSite` attribute to strict, blocking auth cookies from being sent\nwith requests initiated by third-party websites.\n  - `none` - Sets the `SameSite` attribute to none, allowing auth cookies to be sent with\nrequests initiated by third-party websites, but only over HTTPS.\n',
    'ui:help':
      'Not sure This field is shown when WEBUI_AUTH is set to "true". Environment variable: WEBUI_AUTH_COOKIE_SAME_SITE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'lax',
          label: 'Lax',
        },
        {
          value: 'strict',
          label: 'Strict',
        },
        {
          value: 'none',
          label: 'None',
        },
      ],
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'select-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 85,
    'ui:condition': {
      field: 'WEBUI_AUTH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'WEBUI_AUTH_COOKIE_SAME_SITE',
      persistentConfig: false,
    },
  },
  WEBUI_AUTH_COOKIE_SECURE: {
    name: 'WEBUI_AUTH_COOKIE_SECURE',
    type: 'boolean',
    'ui:title': 'Webui Auth Cookie Secure',
    'ui:description': 'Sets the `Secure` attribute for auth cookies if set to `True`.',
    'ui:help':
      'Not sure This field is shown when WEBUI_AUTH is set to "true". Environment variable: WEBUI_AUTH_COOKIE_SECURE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 86,
    'ui:condition': {
      field: 'WEBUI_AUTH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'WEBUI_AUTH_COOKIE_SECURE',
      persistentConfig: false,
    },
  },
  WEBUI_AUTH: {
    name: 'WEBUI_AUTH',
    type: 'boolean',
    'ui:title': 'Webui Auth',
    'ui:description': 'This setting enables or disables authentication.',
    'ui:help':
      'make sure that no users present in database per docs otherwise cannot disable this. explore impact on "chanels" feature Environment variable: WEBUI_AUTH',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 87,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale:
        'make sure that no users present in database per docs otherwise cannot disable this. explore impact on "chanels" feature',
      envVar: 'WEBUI_AUTH',
      persistentConfig: false,
    },
  },
  WEBUI_SECRET_KEY: {
    name: 'WEBUI_SECRET_KEY',
    type: 'string',
    'ui:title': 'Webui Secret Key',
    'ui:description': 'Overrides the randomly generated string used for JSON Web Token.',
    'ui:help':
      'Not sure This field is shown when WEBUI_AUTH is set to "true". Environment variable: WEBUI_SECRET_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Security Variables',
    'ui:order': 88,
    'ui:condition': {
      field: 'WEBUI_AUTH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'WEBUI_SECRET_KEY',
      persistentConfig: false,
    },
  },
  OFFLINE_MODE: {
    name: 'OFFLINE_MODE',
    type: 'boolean',
    'ui:title': 'Offline Mode',
    'ui:description': 'Enables or disables offline mode.',
    'ui:help': 'Not sure Environment variable: OFFLINE_MODE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 89,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'OFFLINE_MODE',
      persistentConfig: false,
    },
  },
  RESET_CONFIG_ON_START: {
    name: 'RESET_CONFIG_ON_START',
    type: 'boolean',
    'ui:title': 'Reset Config On Start',
    'ui:description': 'Resets the `config.json` file on startup.',
    'ui:help':
      'theoretically we pass in specific env variables at the start anyway Environment variable: RESET_CONFIG_ON_START',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 90,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'theoretically we pass in specific env variables at the start anyway',
      envVar: 'RESET_CONFIG_ON_START',
      persistentConfig: false,
    },
  },
  SAFE_MODE: {
    name: 'SAFE_MODE',
    type: 'boolean',
    'ui:title': 'Safe Mode',
    'ui:description':
      'Enables safe mode, which disables potentially unsafe features, deactivating all functions.',
    'ui:help':
      'user should be aware that this disables tools. interesting if using external robust pipelines.  Environment variable: SAFE_MODE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 91,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale:
        'user should be aware that this disables tools. interesting if using external robust pipelines. ',
      envVar: 'SAFE_MODE',
      persistentConfig: false,
    },
  },
  CORS_ALLOW_ORIGIN: {
    name: 'CORS_ALLOW_ORIGIN',
    type: 'string',
    'ui:title': 'Cors Allow Origin',
    'ui:description': 'Sets the allowed origins for Cross-Origin Resource Sharing (CORS).',
    'ui:help':
      'explore this, key consideration for additional services Environment variable: CORS_ALLOW_ORIGIN',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 92,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'explore this, key consideration for additional services',
      envVar: 'CORS_ALLOW_ORIGIN',
      persistentConfig: false,
    },
  },
  RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE: {
    name: 'RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE',
    type: 'boolean',
    'ui:title': 'Rag Embedding Model Trust Remote Code',
    'ui:description':
      'Determines whether to allow custom models defined on the Hub in their own modeling files.',
    'ui:help':
      'default rec, need to understand why This field is shown when RAG_EMBEDDING_MODEL_AUTO_UPDATE is set to "true". Environment variable: RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 93,
    'ui:condition': {
      field: 'RAG_EMBEDDING_MODEL_AUTO_UPDATE',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'default rec, need to understand why',
      envVar: 'RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE',
      persistentConfig: false,
    },
  },
  RAG_RERANKING_MODEL_TRUST_REMOTE_CODE: {
    name: 'RAG_RERANKING_MODEL_TRUST_REMOTE_CODE',
    type: 'boolean',
    'ui:title': 'Rag Reranking Model Trust Remote Code',
    'ui:description': 'Determines whether to allow custom models defined on the Hub in their own.',
    'ui:help':
      'default rec, need to understand why This field is shown when RAG_RERANKING_MODEL_AUTO_UPDATE is set to "true". Environment variable: RAG_RERANKING_MODEL_TRUST_REMOTE_CODE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 94,
    'ui:condition': {
      field: 'RAG_RERANKING_MODEL_AUTO_UPDATE',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'default rec, need to understand why',
      envVar: 'RAG_RERANKING_MODEL_TRUST_REMOTE_CODE',
      persistentConfig: false,
    },
  },
  RAG_EMBEDDING_MODEL_AUTO_UPDATE: {
    name: 'RAG_EMBEDDING_MODEL_AUTO_UPDATE',
    type: 'boolean',
    'ui:title': 'Rag Embedding Model Auto Update',
    'ui:description': 'Toggles automatic update of the Sentence-Transformer model.',
    'ui:help': 'recommended Environment variable: RAG_EMBEDDING_MODEL_AUTO_UPDATE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 95,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'recommended',
      envVar: 'RAG_EMBEDDING_MODEL_AUTO_UPDATE',
      persistentConfig: false,
    },
  },
  RAG_RERANKING_MODEL_AUTO_UPDATE: {
    name: 'RAG_RERANKING_MODEL_AUTO_UPDATE',
    type: 'boolean',
    'ui:title': 'Rag Reranking Model Auto Update',
    'ui:description': 'Toggles automatic update of the reranking model.',
    'ui:help': 'recommended Environment variable: RAG_RERANKING_MODEL_AUTO_UPDATE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Security Variables',
    'ui:order': 96,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'recommended',
      envVar: 'RAG_RERANKING_MODEL_AUTO_UPDATE',
      persistentConfig: false,
    },
  },
  VECTOR_DB: {
    name: 'VECTOR_DB',
    type: 'string',
    'ui:title': 'Vector Db',
    'ui:description':
      'Specifies which vector database system to use. This setting determines which vector storage system will be used for managing embeddings.',
    'ui:help': 'Feature 10: rag selection Environment variable: VECTOR_DB',
    'ui:widget': 'SelectWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'chroma',
          label: 'Chroma',
        },
        {
          value: 'elasticsearch',
          label: 'Elasticsearch',
        },
        {
          value: 'milvus',
          label: 'Milvus',
        },
        {
          value: 'opensearch',
          label: 'Opensearch',
        },
        {
          value: 'pgvector',
          label: 'Pgvector',
        },
        {
          value: 'pinecone',
          label: 'Pinecone',
        },
        {
          value: 'qdrant',
          label: 'Qdrant',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database',
    'ui:order': 97,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 10: rag selection',
      envVar: 'VECTOR_DB',
      persistentConfig: false,
    },
  },
  CHROMA_TENANT: {
    name: 'CHROMA_TENANT',
    type: 'string',
    'ui:title': 'Chroma Tenant',
    'ui:description': 'Sets the tenant for ChromaDB to use for RAG embeddings.',
    'ui:help':
      'feature 11: chroma connection This field has 2 conditional requirements. Environment variable: CHROMA_TENANT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - ChromaDB',
    'ui:order': 98,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 11: chroma connection',
      envVar: 'CHROMA_TENANT',
      persistentConfig: false,
    },
  },
  CHROMA_DATABASE: {
    name: 'CHROMA_DATABASE',
    type: 'string',
    'ui:title': 'Chroma Database',
    'ui:description': 'Sets the database in the ChromaDB tenant to use for RAG embeddings.',
    'ui:help':
      'feature 11: chroma connection This field has 2 conditional requirements. Environment variable: CHROMA_DATABASE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - ChromaDB',
    'ui:order': 99,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 11: chroma connection',
      envVar: 'CHROMA_DATABASE',
      persistentConfig: false,
    },
  },
  CHROMA_HTTP_HOST: {
    name: 'CHROMA_HTTP_HOST',
    type: 'string',
    'ui:title': 'Chroma Http Host',
    'ui:description':
      'Specifies the hostname of a remote ChromaDB Server. Uses a local ChromaDB instance if not set.',
    'ui:help':
      'feature 11: chroma connection This field has 2 conditional requirements. Environment variable: CHROMA_HTTP_HOST',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - ChromaDB',
    'ui:order': 100,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 11: chroma connection',
      envVar: 'CHROMA_HTTP_HOST',
      persistentConfig: false,
    },
  },
} as const;

const fieldConfigurationsPart3 = {
  CHROMA_HTTP_PORT: {
    name: 'CHROMA_HTTP_PORT',
    type: 'integer',
    'ui:title': 'Chroma Http Port',
    'ui:description': 'Specifies the port of a remote ChromaDB Server.',
    'ui:help':
      'feature 11: chroma connection This field has 2 conditional requirements. Environment variable: CHROMA_HTTP_PORT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - ChromaDB',
    'ui:order': 101,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 11: chroma connection',
      envVar: 'CHROMA_HTTP_PORT',
      persistentConfig: false,
    },
  },
  CHROMA_HTTP_HEADERS: {
    name: 'CHROMA_HTTP_HEADERS',
    type: 'string',
    'ui:title': 'Chroma Http Headers',
    'ui:description':
      'A comma-separated list of HTTP headers to include with every ChromaDB request.',
    'ui:help':
      'feature 11: chroma connection This field has 2 conditional requirements. Environment variable: CHROMA_HTTP_HEADERS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - ChromaDB',
    'ui:order': 102,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 11: chroma connection',
      envVar: 'CHROMA_HTTP_HEADERS',
      persistentConfig: false,
    },
  },
  CHROMA_HTTP_SSL: {
    name: 'CHROMA_HTTP_SSL',
    type: 'boolean',
    'ui:title': 'Chroma Http Ssl',
    'ui:description': 'Controls whether or not SSL is used for ChromaDB Server connections.',
    'ui:help':
      'feature 11: chroma connection This field has 2 conditional requirements. Environment variable: CHROMA_HTTP_SSL',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - ChromaDB',
    'ui:order': 103,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 11: chroma connection',
      envVar: 'CHROMA_HTTP_SSL',
      persistentConfig: false,
    },
  },
  CHROMA_CLIENT_AUTH_PROVIDER: {
    name: 'CHROMA_CLIENT_AUTH_PROVIDER',
    type: 'string',
    'ui:title': 'Chroma Client Auth Provider',
    'ui:description': 'Specifies an authentication provider for remote ChromaDB Server.',
    'ui:help':
      'feature 11: chroma connection This field has 2 conditional requirements. Environment variable: CHROMA_CLIENT_AUTH_PROVIDER',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - ChromaDB',
    'ui:order': 104,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 11: chroma connection',
      envVar: 'CHROMA_CLIENT_AUTH_PROVIDER',
      persistentConfig: false,
    },
  },
  CHROMA_CLIENT_AUTH_CREDENTIALS: {
    name: 'CHROMA_CLIENT_AUTH_CREDENTIALS',
    type: 'string',
    'ui:title': 'Chroma Client Auth Credentials',
    'ui:description': 'Specifies auth credentials for remote ChromaDB Server.',
    'ui:help':
      'feature 11: chroma connection This field has 2 conditional requirements. Environment variable: CHROMA_CLIENT_AUTH_CREDENTIALS',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Vector Database - ChromaDB',
    'ui:order': 105,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'chroma',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 11: chroma connection',
      envVar: 'CHROMA_CLIENT_AUTH_CREDENTIALS',
      persistentConfig: false,
    },
  },
  ELASTICSEARCH_API_KEY: {
    name: 'ELASTICSEARCH_API_KEY',
    type: 'string',
    'ui:title': 'Elasticsearch Api Key',
    'ui:description': 'Specifies the Elasticsearch API key.',
    'ui:help':
      'feature 12: elasticsearch connection This field has 2 conditional requirements. Environment variable: ELASTICSEARCH_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Vector Database - Elasticsearch',
    'ui:order': 106,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 12: elasticsearch connection',
      envVar: 'ELASTICSEARCH_API_KEY',
      persistentConfig: true,
    },
  },
  ELASTICSEARCH_CA_CERTS: {
    name: 'ELASTICSEARCH_CA_CERTS',
    type: 'string',
    'ui:title': 'Elasticsearch Ca Certs',
    'ui:description': 'Specifies the path to the CA certificates for Elasticsearch.',
    'ui:help':
      'feature 12: elasticsearch connection This field has 2 conditional requirements. Environment variable: ELASTICSEARCH_CA_CERTS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Elasticsearch',
    'ui:order': 107,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 12: elasticsearch connection',
      envVar: 'ELASTICSEARCH_CA_CERTS',
      persistentConfig: true,
    },
  },
  ELASTICSEARCH_CLOUD_ID: {
    name: 'ELASTICSEARCH_CLOUD_ID',
    type: 'string',
    'ui:title': 'Elasticsearch Cloud Id',
    'ui:description': 'Specifies the Elasticsearch cloud ID.',
    'ui:help':
      'feature 12: elasticsearch connection This field has 2 conditional requirements. Environment variable: ELASTICSEARCH_CLOUD_ID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Elasticsearch',
    'ui:order': 108,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 12: elasticsearch connection',
      envVar: 'ELASTICSEARCH_CLOUD_ID',
      persistentConfig: true,
    },
  },
  ELASTICSEARCH_INDEX_PREFIX: {
    name: 'ELASTICSEARCH_INDEX_PREFIX',
    type: 'string',
    'ui:title': 'Elasticsearch Index Prefix',
    'ui:description': 'Specifies the prefix for the Elasticsearch index.',
    'ui:help':
      'feature 12: elasticsearch connection This field has 2 conditional requirements. Environment variable: ELASTICSEARCH_INDEX_PREFIX',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Elasticsearch',
    'ui:order': 109,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 12: elasticsearch connection',
      envVar: 'ELASTICSEARCH_INDEX_PREFIX',
      persistentConfig: true,
    },
  },
  ELASTICSEARCH_PASSWORD: {
    name: 'ELASTICSEARCH_PASSWORD',
    type: 'string',
    'ui:title': 'Elasticsearch Password',
    'ui:description': 'Specifies the password for Elasticsearch.',
    'ui:help':
      'feature 12: elasticsearch connection This field has 2 conditional requirements. Environment variable: ELASTICSEARCH_PASSWORD',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Vector Database - Elasticsearch',
    'ui:order': 110,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 12: elasticsearch connection',
      envVar: 'ELASTICSEARCH_PASSWORD',
      persistentConfig: true,
    },
  },
  ELASTICSEARCH_URL: {
    name: 'ELASTICSEARCH_URL',
    type: 'string',
    'ui:title': 'Elasticsearch Url',
    'ui:description': 'Specifies the URL for the Elasticsearch instance.',
    'ui:help':
      'feature 12: elasticsearch connection This field has 2 conditional requirements. Environment variable: ELASTICSEARCH_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Elasticsearch',
    'ui:order': 111,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 12: elasticsearch connection',
      envVar: 'ELASTICSEARCH_URL',
      persistentConfig: true,
    },
  },
  ELASTICSEARCH_USERNAME: {
    name: 'ELASTICSEARCH_USERNAME',
    type: 'string',
    'ui:title': 'Elasticsearch Username',
    'ui:description': 'Specifies the username for Elasticsearch.',
    'ui:help':
      'feature 12: elasticsearch connection This field has 2 conditional requirements. Environment variable: ELASTICSEARCH_USERNAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Elasticsearch',
    'ui:order': 112,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'elasticsearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 12: elasticsearch connection',
      envVar: 'ELASTICSEARCH_USERNAME',
      persistentConfig: true,
    },
  },
  MILVUS_URI: {
    name: 'MILVUS_URI',
    type: 'string',
    'ui:title': 'Milvus Uri',
    'ui:description':
      'Specifies the URI for connecting to the Milvus vector database. This can point to a local or remote Milvus server based on the deployment configuration.',
    'ui:help':
      'feature 13: milvus connection This field has 2 conditional requirements. Environment variable: MILVUS_URI',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Milvus',
    'ui:order': 113,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 13: milvus connection',
      envVar: 'MILVUS_URI',
      persistentConfig: false,
    },
  },
  MILVUS_DB: {
    name: 'MILVUS_DB',
    type: 'string',
    'ui:title': 'Milvus Db',
    'ui:description': 'Specifies the database to connect to within a Milvus instance.',
    'ui:help':
      'feature 13: milvus connection This field has 2 conditional requirements. Environment variable: MILVUS_DB',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Milvus',
    'ui:order': 114,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 13: milvus connection',
      envVar: 'MILVUS_DB',
      persistentConfig: false,
    },
  },
  MILVUS_TOKEN: {
    name: 'MILVUS_TOKEN',
    type: 'string',
    'ui:title': 'Milvus Token',
    'ui:description': 'Specifies an optional connection token for Milvus.',
    'ui:help':
      'feature 13: milvus connection This field has 2 conditional requirements. Environment variable: MILVUS_TOKEN',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Vector Database - Milvus',
    'ui:order': 115,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 13: milvus connection',
      envVar: 'MILVUS_TOKEN',
      persistentConfig: false,
    },
  },
  MILVUS_INDEX_TYPE: {
    name: 'MILVUS_INDEX_TYPE',
    type: 'string',
    'ui:title': 'Milvus Index Type',
    'ui:description':
      'Specifies the index type to use when creating a new collection in Milvus. `AUTOINDEX` is generally recommended for Milvus standalone. `HNSW` may offer better performance but typically requires a clustered Milvus setup.',
    'ui:help': 'This field has 2 conditional requirements. Environment variable: MILVUS_INDEX_TYPE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'AUTOINDEX',
          label: 'AUTOINDEX',
        },
        {
          value: 'FLAT',
          label: 'FLAT',
        },
        {
          value: 'HNSW',
          label: 'HNSW',
        },
        {
          value: 'IVF_FLAT',
          label: 'IVF_FLAT',
        },
      ],
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'select-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Milvus',
    'ui:order': 116,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'MILVUS_INDEX_TYPE',
      persistentConfig: true,
    },
  },
  MILVUS_METRIC_TYPE: {
    name: 'MILVUS_METRIC_TYPE',
    type: 'string',
    'ui:title': 'Milvus Metric Type',
    'ui:description': 'Specifies the metric type for vector similarity search in Milvus.',
    'ui:help':
      'This field has 2 conditional requirements. Environment variable: MILVUS_METRIC_TYPE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Milvus',
    'ui:order': 117,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'MILVUS_METRIC_TYPE',
      persistentConfig: true,
    },
  },
  MILVUS_HNSW_M: {
    name: 'MILVUS_HNSW_M',
    type: 'integer',
    'ui:title': 'Milvus Hnsw M',
    'ui:description':
      'Specifies the `M` parameter for the HNSW index type in Milvus. This influences the number of bi-directional links created for each new element during construction. Only applicable if `MILVUS_INDEX_TYPE` is `HNSW`.',
    'ui:help': 'This field has 3 conditional requirements. Environment variable: MILVUS_HNSW_M',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 3,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Milvus',
    'ui:order': 118,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'MILVUS_INDEX_TYPE',
          operator: 'equals',
          value: 'HNSW',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
        {
          field: 'MILVUS_INDEX_TYPE',
          operator: 'equals',
          value: 'HNSW',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'MILVUS_HNSW_M',
      persistentConfig: true,
    },
  },
  MILVUS_HNSW_EFCONSTRUCTION: {
    name: 'MILVUS_HNSW_EFCONSTRUCTION',
    type: 'integer',
    'ui:title': 'Milvus Hnsw Efconstruction',
    'ui:description':
      'Specifies the `efConstruction` parameter for the HNSW index type in Milvus. This influences the size of the dynamic list for the nearest neighbors during index construction. Only applicable if `MILVUS_INDEX_TYPE` is `HNSW`.',
    'ui:help':
      'This field has 3 conditional requirements. Environment variable: MILVUS_HNSW_EFCONSTRUCTION',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 3,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Milvus',
    'ui:order': 119,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'MILVUS_INDEX_TYPE',
          operator: 'equals',
          value: 'HNSW',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
        {
          field: 'MILVUS_INDEX_TYPE',
          operator: 'equals',
          value: 'HNSW',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'MILVUS_HNSW_EFCONSTRUCTION',
      persistentConfig: true,
    },
  },
  MILVUS_IVF_FLAT_NLIST: {
    name: 'MILVUS_IVF_FLAT_NLIST',
    type: 'integer',
    'ui:title': 'Milvus Ivf Flat Nlist',
    'ui:description':
      'Specifies the `nlist` parameter for the IVF_FLAT index type in Milvus. This is the number of cluster units. Only applicable if `MILVUS_INDEX_TYPE` is `IVF_FLAT`.',
    'ui:help':
      'This field has 3 conditional requirements. Environment variable: MILVUS_IVF_FLAT_NLIST',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 3,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Milvus',
    'ui:order': 120,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'MILVUS_INDEX_TYPE',
          operator: 'equals',
          value: 'IVF_FLAT',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'milvus',
        },
        {
          field: 'MILVUS_INDEX_TYPE',
          operator: 'equals',
          value: 'IVF_FLAT',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'MILVUS_IVF_FLAT_NLIST',
      persistentConfig: true,
    },
  },
  OPENSEARCH_CERT_VERIFY: {
    name: 'OPENSEARCH_CERT_VERIFY',
    type: 'boolean',
    'ui:title': 'Opensearch Cert Verify',
    'ui:description': 'Enables or disables OpenSearch certificate verification.',
    'ui:help':
      'feature 14: opensearch connection This field has 2 conditional requirements. Environment variable: OPENSEARCH_CERT_VERIFY',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - OpenSearch',
    'ui:order': 121,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 14: opensearch connection',
      envVar: 'OPENSEARCH_CERT_VERIFY',
      persistentConfig: false,
    },
  },
  OPENSEARCH_PASSWORD: {
    name: 'OPENSEARCH_PASSWORD',
    type: 'string',
    'ui:title': 'Opensearch Password',
    'ui:description': 'Sets the password for OpenSearch.',
    'ui:help':
      'feature 14: opensearch connection This field has 2 conditional requirements. Environment variable: OPENSEARCH_PASSWORD',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Vector Database - OpenSearch',
    'ui:order': 122,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 14: opensearch connection',
      envVar: 'OPENSEARCH_PASSWORD',
      persistentConfig: false,
    },
  },
  OPENSEARCH_SSL: {
    name: 'OPENSEARCH_SSL',
    type: 'boolean',
    'ui:title': 'Opensearch Ssl',
    'ui:description': 'Enables or disables SSL for OpenSearch.',
    'ui:help':
      'feature 14: opensearch connection This field has 2 conditional requirements. Environment variable: OPENSEARCH_SSL',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - OpenSearch',
    'ui:order': 123,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 14: opensearch connection',
      envVar: 'OPENSEARCH_SSL',
      persistentConfig: false,
    },
  },
  OPENSEARCH_URI: {
    name: 'OPENSEARCH_URI',
    type: 'string',
    'ui:title': 'Opensearch Uri',
    'ui:description': 'Sets the URI for OpenSearch.',
    'ui:help':
      'feature 14: opensearch connection This field has 2 conditional requirements. Environment variable: OPENSEARCH_URI',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - OpenSearch',
    'ui:order': 124,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 14: opensearch connection',
      envVar: 'OPENSEARCH_URI',
      persistentConfig: false,
    },
  },
  OPENSEARCH_USERNAME: {
    name: 'OPENSEARCH_USERNAME',
    type: 'string',
    'ui:title': 'Opensearch Username',
    'ui:description': 'Sets the username for OpenSearch.',
    'ui:help':
      'feature 14: opensearch connection This field has 2 conditional requirements. Environment variable: OPENSEARCH_USERNAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - OpenSearch',
    'ui:order': 125,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'opensearch',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 14: opensearch connection',
      envVar: 'OPENSEARCH_USERNAME',
      persistentConfig: false,
    },
  },
  PGVECTOR_DB_URL: {
    name: 'PGVECTOR_DB_URL',
    type: 'string',
    'ui:title': 'Pgvector Db Url',
    'ui:description': 'Sets the database URL for model storage.',
    'ui:help':
      'feature 15: pgvector connection This field has 2 conditional requirements. Environment variable: PGVECTOR_DB_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - PGVector',
    'ui:order': 126,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pgvector',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pgvector',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 15: pgvector connection',
      envVar: 'PGVECTOR_DB_URL',
      persistentConfig: false,
    },
  },
  PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH: {
    name: 'PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH',
    type: 'string',
    'ui:title': 'Pgvector Initialize Max Vector Length',
    'ui:description': 'Specifies the maximum vector length for PGVector initialization.',
    'ui:help':
      'feature 15: pgvector connection This field has 2 conditional requirements. Environment variable: PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - PGVector',
    'ui:order': 127,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pgvector',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pgvector',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 15: pgvector connection',
      envVar: 'PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH',
      persistentConfig: false,
    },
  },
  QDRANT_API_KEY: {
    name: 'QDRANT_API_KEY',
    type: 'string',
    'ui:title': 'Qdrant Api Key',
    'ui:description': 'Sets the API key for Qdrant.',
    'ui:help':
      'feature 16: qdrant connection This field has 2 conditional requirements. Environment variable: QDRANT_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Vector Database - Qdrant',
    'ui:order': 128,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 16: qdrant connection',
      envVar: 'QDRANT_API_KEY',
      persistentConfig: false,
    },
  },
  QDRANT_URI: {
    name: 'QDRANT_URI',
    type: 'string',
    'ui:title': 'Qdrant Uri',
    'ui:description': 'Sets the URI for Qdrant.',
    'ui:help':
      'feature 16: qdrant connection This field has 2 conditional requirements. Environment variable: QDRANT_URI',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Qdrant',
    'ui:order': 129,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 16: qdrant connection',
      envVar: 'QDRANT_URI',
      persistentConfig: false,
    },
  },
  QDRANT_ON_DISK: {
    name: 'QDRANT_ON_DISK',
    type: 'boolean',
    'ui:title': 'Qdrant On Disk',
    'ui:description': 'Enable the usage of memmap(also known as on-disk) storage',
    'ui:help':
      'feature 16: qdrant connection This field has 2 conditional requirements. Environment variable: QDRANT_ON_DISK',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Qdrant',
    'ui:order': 130,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 16: qdrant connection',
      envVar: 'QDRANT_ON_DISK',
      persistentConfig: false,
    },
  },
  QDRANT_PREFER_GRPC: {
    name: 'QDRANT_PREFER_GRPC',
    type: 'boolean',
    'ui:title': 'Qdrant Prefer Grpc',
    'ui:description': 'Use gPRC interface whenever possible',
    'ui:help':
      'feature 16: qdrant connection This field has 2 conditional requirements. Environment variable: QDRANT_PREFER_GRPC',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Qdrant',
    'ui:order': 131,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 16: qdrant connection',
      envVar: 'QDRANT_PREFER_GRPC',
      persistentConfig: false,
    },
  },
  QDRANT_GRPC_PORT: {
    name: 'QDRANT_GRPC_PORT',
    type: 'integer',
    'ui:title': 'Qdrant Grpc Port',
    'ui:description': 'Sets the gRPC port number for Qdrant.',
    'ui:help':
      'feature 16: qdrant connection This field has 2 conditional requirements. Environment variable: QDRANT_GRPC_PORT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Qdrant',
    'ui:order': 132,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 16: qdrant connection',
      envVar: 'QDRANT_GRPC_PORT',
      persistentConfig: false,
    },
  },
  ENABLE_QDRANT_MULTITENANCY_MODE: {
    name: 'ENABLE_QDRANT_MULTITENANCY_MODE',
    type: 'boolean',
    'ui:title': 'Enable Qdrant Multitenancy Mode',
    'ui:description':
      'Enables multitenancy pattern for Qdrant collections management, which significantly reduces RAM usage and computational overhead by consolidating similar vector data structures. Recommend turn on',
    'ui:help':
      'This field has 2 conditional requirements. Environment variable: ENABLE_QDRANT_MULTITENANCY_MODE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Qdrant',
    'ui:order': 133,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'qdrant',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_QDRANT_MULTITENANCY_MODE',
      persistentConfig: false,
    },
  },
  PINECONE_API_KEY: {
    name: 'PINECONE_API_KEY',
    type: 'string',
    'ui:title': 'Pinecone Api Key',
    'ui:description': 'Sets the API key used to authenticate with the Pinecone service.',
    'ui:help':
      'feature 17: pinecone connection This field has 2 conditional requirements. Environment variable: PINECONE_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Vector Database - Pinecone',
    'ui:order': 134,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 17: pinecone connection',
      envVar: 'PINECONE_API_KEY',
      persistentConfig: false,
    },
  },
  PINECONE_ENVIRONMENT: {
    name: 'PINECONE_ENVIRONMENT',
    type: 'string',
    'ui:title': 'Pinecone Environment',
    'ui:description':
      'Specifies the Pinecone environment to connect to (e.g., `us-west1-gcp`, `gcp-starter`, etc.).',
    'ui:help':
      'feature 17: pinecone connection This field has 2 conditional requirements. Environment variable: PINECONE_ENVIRONMENT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Pinecone',
    'ui:order': 135,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 17: pinecone connection',
      envVar: 'PINECONE_ENVIRONMENT',
      persistentConfig: false,
    },
  },
  PINECONE_INDEX_NAME: {
    name: 'PINECONE_INDEX_NAME',
    type: 'string',
    'ui:title': 'Pinecone Index Name',
    'ui:description':
      'Defines the name of the Pinecone index that will be used to store and query vector embeddings.',
    'ui:help':
      'feature 17: pinecone connection This field has 2 conditional requirements. Environment variable: PINECONE_INDEX_NAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Pinecone',
    'ui:order': 136,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 17: pinecone connection',
      envVar: 'PINECONE_INDEX_NAME',
      persistentConfig: false,
    },
  },
  PINECONE_DIMENSION: {
    name: 'PINECONE_DIMENSION',
    type: 'integer',
    'ui:title': 'Pinecone Dimension',
    'ui:description':
      'The dimensionality of the vector embeddings. Must match the dimension expected by the index (commonly 768, 1024, 1536, or 3072 based on model used).',
    'ui:help':
      'feature 17: pinecone connection This field has 2 conditional requirements. Environment variable: PINECONE_DIMENSION',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Pinecone',
    'ui:order': 137,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 17: pinecone connection',
      envVar: 'PINECONE_DIMENSION',
      persistentConfig: false,
    },
  },
  PINECONE_METRIC: {
    name: 'PINECONE_METRIC',
    type: 'string',
    'ui:title': 'Pinecone Metric',
    'ui:description':
      'Specifies the similarity metric to use for vector comparisons within the Pinecone index.',
    'ui:help':
      'feature 17: pinecone connection This field has 2 conditional requirements. Environment variable: PINECONE_METRIC',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Pinecone',
    'ui:order': 138,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 17: pinecone connection',
      envVar: 'PINECONE_METRIC',
      persistentConfig: false,
    },
  },
  PINECONE_CLOUD: {
    name: 'PINECONE_CLOUD',
    type: 'string',
    'ui:title': 'Pinecone Cloud',
    'ui:description': 'Specifies the cloud provider where the Pinecone index is hosted.',
    'ui:help':
      'feature 17: pinecone connection This field has 2 conditional requirements. Environment variable: PINECONE_CLOUD',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Vector Database - Pinecone',
    'ui:order': 139,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
        {
          field: 'VECTOR_DB',
          operator: 'equals',
          value: 'pinecone',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 17: pinecone connection',
      envVar: 'PINECONE_CLOUD',
      persistentConfig: false,
    },
  },
  CONTENT_EXTRACTION_ENGINE: {
    name: 'CONTENT_EXTRACTION_ENGINE',
    type: 'string',
    'ui:title': 'Content Extraction Engine',
    'ui:description':
      'Sets the content extraction engine to use for document ingestion.\n\nOptions:\n  - `external` - Use external loader\n  - `tika` - Use a local Apache Tika server\n  - `docling` - Use Docling engine\n  - `document_intelligence` - Use Document Intelligence engine\n  - `mistral_ocr` - Use Mistral OCR engine\n',
    'ui:help': 'tika is default Environment variable: CONTENT_EXTRACTION_ENGINE',
    'ui:widget': 'SelectWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'external',
          label: 'External',
        },
        {
          value: 'tika',
          label: 'Tika',
        },
        {
          value: 'docling',
          label: 'Docling',
        },
        {
          value: 'document_intelligence',
          label: 'Document_intelligence',
        },
        {
          value: 'mistral_ocr',
          label: 'Mistral_ocr',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'RAG Content Extraction Engine',
    'ui:order': 140,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'tika is default',
      envVar: 'CONTENT_EXTRACTION_ENGINE',
      persistentConfig: true,
    },
  },
  MISTRAL_OCR_API_KEY: {
    name: 'MISTRAL_OCR_API_KEY',
    type: 'string',
    'ui:title': 'Mistral Ocr Api Key',
    'ui:description': 'Specifies the Mistral OCR API key to use.',
    'ui:help':
      'feature 18: mistral ocr connect This field has 2 conditional requirements. Environment variable: MISTRAL_OCR_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'RAG Content Extraction Engine',
    'ui:order': 141,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'mistral_ocr',
        },
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'mistral_ocr',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 18: mistral ocr connect',
      envVar: 'MISTRAL_OCR_API_KEY',
      persistentConfig: true,
    },
  },
  EXTERNAL_DOCUMENT_LOADER_URL: {
    name: 'EXTERNAL_DOCUMENT_LOADER_URL',
    type: 'string',
    'ui:title': 'External Document Loader Url',
    'ui:description': 'Sets the URL for the external document loader service.',
    'ui:help':
      'This field has 2 conditional requirements. Environment variable: EXTERNAL_DOCUMENT_LOADER_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'RAG Content Extraction Engine',
    'ui:order': 142,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'external',
        },
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'external',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      envVar: 'EXTERNAL_DOCUMENT_LOADER_URL',
      persistentConfig: true,
    },
  },
  EXTERNAL_DOCUMENT_LOADER_API_KEY: {
    name: 'EXTERNAL_DOCUMENT_LOADER_API_KEY',
    type: 'string',
    'ui:title': 'External Document Loader Api Key',
    'ui:description':
      'Sets the API key for authenticating with the external document loader service.',
    'ui:help':
      'This field has 2 conditional requirements. Environment variable: EXTERNAL_DOCUMENT_LOADER_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'RAG Content Extraction Engine',
    'ui:order': 143,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'external',
        },
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'external',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      envVar: 'EXTERNAL_DOCUMENT_LOADER_API_KEY',
      persistentConfig: true,
    },
  },
  TIKA_SERVER_URL: {
    name: 'TIKA_SERVER_URL',
    type: 'string',
    'ui:title': 'Tika Server Url',
    'ui:description': 'Sets the URL for the Apache Tika server.',
    'ui:help':
      'feature 19: tika local server This field has 2 conditional requirements. Environment variable: TIKA_SERVER_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'RAG Content Extraction Engine',
    'ui:order': 144,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'tika',
        },
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'tika',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 19: tika local server',
      envVar: 'TIKA_SERVER_URL',
      persistentConfig: true,
    },
  },
  DOCLING_SERVER_URL: {
    name: 'DOCLING_SERVER_URL',
    type: 'string',
    'ui:title': 'Docling Server Url',
    'ui:description': 'Specifies the URL for the Docling server.',
    'ui:help':
      'feature 19: docling local server This field has 2 conditional requirements. Environment variable: DOCLING_SERVER_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'RAG Content Extraction Engine',
    'ui:order': 145,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'docling',
        },
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'docling',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'feature 19: docling local server',
      envVar: 'DOCLING_SERVER_URL',
      persistentConfig: true,
    },
  },
  DOCLING_OCR_ENGINE: {
    name: 'DOCLING_OCR_ENGINE',
    type: 'string',
    'ui:title': 'Docling Ocr Engine',
    'ui:description': 'Specifies the OCR engine used by Docling.',
    'ui:help':
      'This field has 2 conditional requirements. Environment variable: DOCLING_OCR_ENGINE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'RAG Content Extraction Engine',
    'ui:order': 146,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'docling',
        },
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'docling',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'DOCLING_OCR_ENGINE',
      persistentConfig: true,
    },
  },
  DOCLING_OCR_LANG: {
    name: 'DOCLING_OCR_LANG',
    type: 'string',
    'ui:title': 'Docling Ocr Lang',
    'ui:description':
      'Specifies the OCR language(s) to be used with the configured `DOCLING_OCR_ENGINE`.',
    'ui:help': 'This field has 2 conditional requirements. Environment variable: DOCLING_OCR_LANG',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'RAG Content Extraction Engine',
    'ui:order': 147,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'docling',
        },
        {
          field: 'CONTENT_EXTRACTION_ENGINE',
          operator: 'equals',
          value: 'docling',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'DOCLING_OCR_LANG',
      persistentConfig: true,
    },
  },
  RAG_EMBEDDING_ENGINE: {
    name: 'RAG_EMBEDDING_ENGINE',
    type: 'string',
    'ui:title': 'Rag Embedding Engine',
    'ui:description':
      'Selects an embedding engine to use for RAG.\n\nOptions:\n  - `ollama` - Uses the Ollama API for embeddings.\n  - `openai` - Uses the OpenAI API for embeddings.\n',
    'ui:help':
      'feature 20: rag embedding engine on beam Environment variable: RAG_EMBEDDING_ENGINE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'ollama',
          label: 'Ollama',
        },
        {
          value: 'openai',
          label: 'Openai',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 148,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'feature 20: rag embedding engine on beam',
      envVar: 'RAG_EMBEDDING_ENGINE',
      persistentConfig: true,
    },
  },
  RAG_EMBEDDING_MODEL: {
    name: 'RAG_EMBEDDING_MODEL',
    type: 'string',
    'ui:title': 'Rag Embedding Model',
    'ui:description': 'Sets a model for embeddings. Locally, a Sentence-Transformer model is used.',
    'ui:help':
      'feature 20: rag embedding engine on beam This field has 2 conditional requirements. Environment variable: RAG_EMBEDDING_MODEL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 149,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: '',
        },
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: '',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'feature 20: rag embedding engine on beam',
      envVar: 'RAG_EMBEDDING_MODEL',
      persistentConfig: true,
    },
  },
  ENABLE_RAG_HYBRID_SEARCH: {
    name: 'ENABLE_RAG_HYBRID_SEARCH',
    type: 'boolean',
    'ui:title': 'Enable Rag Hybrid Search',
    'ui:description':
      'Enables the use of ensemble search with `BM25` + `ChromaDB`, with reranking using',
    'ui:help':
      'feature 20: rag embedding engine on beam, investigate Environment variable: ENABLE_RAG_HYBRID_SEARCH',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 150,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'feature 20: rag embedding engine on beam, investigate',
      envVar: 'ENABLE_RAG_HYBRID_SEARCH',
      persistentConfig: true,
    },
  },
} as const;

const fieldConfigurationsPart4 = {
  RAG_TOP_K: {
    name: 'RAG_TOP_K',
    type: 'integer',
    'ui:title': 'Rag Top K',
    'ui:description':
      'Sets the default number of results to consider for the embedding when using RAG.',
    'ui:help':
      'This field is shown when ENABLE_RAG_HYBRID_SEARCH is set to "true". Environment variable: RAG_TOP_K',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 151,
    'ui:condition': {
      field: 'ENABLE_RAG_HYBRID_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'RAG_TOP_K',
      persistentConfig: true,
    },
  },
  RAG_TOP_K_RERANKER: {
    name: 'RAG_TOP_K_RERANKER',
    type: 'integer',
    'ui:title': 'Rag Top K Reranker',
    'ui:description':
      'Sets the default number of results to consider for the reranker when using RAG.',
    'ui:help':
      'This field is shown when ENABLE_RAG_HYBRID_SEARCH is set to "true". Environment variable: RAG_TOP_K_RERANKER',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 152,
    'ui:condition': {
      field: 'ENABLE_RAG_HYBRID_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'RAG_TOP_K_RERANKER',
      persistentConfig: true,
    },
  },
  RAG_RELEVANCE_THRESHOLD: {
    name: 'RAG_RELEVANCE_THRESHOLD',
    type: 'number',
    'ui:title': 'Rag Relevance Threshold',
    'ui:description':
      'Sets the relevance threshold to consider for documents when used with reranking.',
    'ui:help':
      'This field is shown when ENABLE_RAG_HYBRID_SEARCH is set to "true". Environment variable: RAG_RELEVANCE_THRESHOLD',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 153,
    'ui:condition': {
      field: 'ENABLE_RAG_HYBRID_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'RAG_RELEVANCE_THRESHOLD',
      persistentConfig: true,
    },
  },
  RAG_TEMPLATE: {
    name: 'RAG_TEMPLATE',
    type: 'string',
    'ui:title': 'Rag Template',
    'ui:description': 'Template to use when injecting RAG documents into chat completion',
    'ui:help': 'left empty to use default prompt Environment variable: RAG_TEMPLATE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 154,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'left empty to use default prompt',
      envVar: 'RAG_TEMPLATE',
      persistentConfig: true,
    },
  },
  RAG_TEXT_SPLITTER: {
    name: 'RAG_TEXT_SPLITTER',
    type: 'string',
    'ui:title': 'Rag Text Splitter',
    'ui:description':
      'Sets the text splitter for RAG models.\n\nOptions:\n  - `character` - `token`\n  - `token`\n',
    'ui:help': 'Environment variable: RAG_TEXT_SPLITTER',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'character',
          label: 'Character',
        },
        {
          value: 'token',
          label: 'Token',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 155,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'RAG_TEXT_SPLITTER',
      persistentConfig: true,
    },
  },
  TIKTOKEN_CACHE_DIR: {
    name: 'TIKTOKEN_CACHE_DIR',
    type: 'string',
    'ui:title': 'Tiktoken Cache Dir',
    'ui:description': 'Sets the directory for TikToken cache.',
    'ui:help':
      'feature 21: tiktoten on beam? This field has 2 conditional requirements. Environment variable: TIKTOKEN_CACHE_DIR',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 156,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'token',
        },
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'token',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'feature 21: tiktoten on beam?',
      envVar: 'TIKTOKEN_CACHE_DIR',
      persistentConfig: false,
    },
  },
  TIKTOKEN_ENCODING_NAME: {
    name: 'TIKTOKEN_ENCODING_NAME',
    type: 'string',
    'ui:title': 'Tiktoken Encoding Name',
    'ui:description': 'Sets the encoding name for TikToken.',
    'ui:help':
      'feature 21: tiktoten on beam? This field has 2 conditional requirements. Environment variable: TIKTOKEN_ENCODING_NAME',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 157,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'token',
        },
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'token',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'feature 21: tiktoten on beam?',
      envVar: 'TIKTOKEN_ENCODING_NAME',
      persistentConfig: true,
    },
  },
  CHUNK_SIZE: {
    name: 'CHUNK_SIZE',
    type: 'integer',
    'ui:title': 'Chunk Size',
    'ui:description': 'Sets the document chunk size for embeddings.',
    'ui:help': 'This field has 3 conditional requirements. Environment variable: CHUNK_SIZE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 3,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 158,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'token',
        },
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'character',
        },
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'token',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'CHUNK_SIZE',
      persistentConfig: true,
    },
  },
  CHUNK_OVERLAP: {
    name: 'CHUNK_OVERLAP',
    type: 'integer',
    'ui:title': 'Chunk Overlap',
    'ui:description': 'Specifies how much overlap there should be between chunks.',
    'ui:help': 'This field has 3 conditional requirements. Environment variable: CHUNK_OVERLAP',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 3,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 159,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'token',
        },
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'character',
        },
        {
          field: 'RAG_TEXT_SPLITTER',
          operator: 'equals',
          value: 'token',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'CHUNK_OVERLAP',
      persistentConfig: true,
    },
  },
  PDF_EXTRACT_IMAGES: {
    name: 'PDF_EXTRACT_IMAGES',
    type: 'boolean',
    'ui:title': 'Pdf Extract Images',
    'ui:description': 'Extracts images from PDFs using OCR when loading documents.',
    'ui:help':
      'more powerful but costlier? should experiment Environment variable: PDF_EXTRACT_IMAGES',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 160,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'more powerful but costlier? should experiment',
      envVar: 'PDF_EXTRACT_IMAGES',
      persistentConfig: true,
    },
  },
  RAG_FILE_MAX_SIZE: {
    name: 'RAG_FILE_MAX_SIZE',
    type: 'integer',
    'ui:title': 'Rag File Max Size',
    'ui:description':
      'Sets the maximum size of a file in megabytes that can be uploaded for document ingestion.',
    'ui:help': 'experiment Environment variable: RAG_FILE_MAX_SIZE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 161,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'experiment',
      envVar: 'RAG_FILE_MAX_SIZE',
      persistentConfig: true,
    },
  },
  RAG_FILE_MAX_COUNT: {
    name: 'RAG_FILE_MAX_COUNT',
    type: 'integer',
    'ui:title': 'Rag File Max Count',
    'ui:description':
      'Sets the maximum number of files that can be uploaded at once for document ingestion.',
    'ui:help': 'experiment Environment variable: RAG_FILE_MAX_COUNT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 162,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'experiment',
      envVar: 'RAG_FILE_MAX_COUNT',
      persistentConfig: true,
    },
  },
  RAG_ALLOWED_FILE_EXTENSIONS: {
    name: 'RAG_ALLOWED_FILE_EXTENSIONS',
    type: 'array',
    'ui:title': 'Rag Allowed File Extensions',
    'ui:description': 'Specifies which file extensions are permitted for upload.',
    'ui:help': 'Environment variable: RAG_ALLOWED_FILE_EXTENSIONS',
    'ui:widget': 'default',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 163,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'RAG_ALLOWED_FILE_EXTENSIONS',
      persistentConfig: true,
    },
  },
  RAG_RERANKING_MODEL: {
    name: 'RAG_RERANKING_MODEL',
    type: 'string',
    'ui:title': 'Rag Reranking Model',
    'ui:description':
      'Sets a model for reranking results. Locally, a Sentence-Transformer model is used.',
    'ui:help':
      'not sure what is default (not in docs) This field is shown when ENABLE_RAG_HYBRID_SEARCH is set to "true". Environment variable: RAG_RERANKING_MODEL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 164,
    'ui:condition': {
      field: 'ENABLE_RAG_HYBRID_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'not sure what is default (not in docs)',
      envVar: 'RAG_RERANKING_MODEL',
      persistentConfig: true,
    },
  },
  RAG_OPENAI_API_BASE_URL: {
    name: 'RAG_OPENAI_API_BASE_URL',
    type: 'string',
    'ui:title': 'Rag Openai Api Base Url',
    'ui:description': 'Sets the OpenAI base API URL to use for RAG embeddings.',
    'ui:help':
      'This field has 2 conditional requirements. Environment variable: RAG_OPENAI_API_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 165,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'RAG_OPENAI_API_BASE_URL',
      persistentConfig: true,
    },
  },
  RAG_OPENAI_API_KEY: {
    name: 'RAG_OPENAI_API_KEY',
    type: 'string',
    'ui:title': 'Rag Openai Api Key',
    'ui:description': 'Sets the OpenAI API key to use for RAG embeddings.',
    'ui:help':
      'This field has 2 conditional requirements. Environment variable: RAG_OPENAI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 166,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      envVar: 'RAG_OPENAI_API_KEY',
      persistentConfig: true,
    },
  },
  RAG_EMBEDDING_OPENAI_BATCH_SIZE: {
    name: 'RAG_EMBEDDING_OPENAI_BATCH_SIZE',
    type: 'integer',
    'ui:title': 'Rag Embedding Openai Batch Size',
    'ui:description': 'Sets the batch size for OpenAI embeddings.',
    'ui:help':
      'This field has 2 conditional requirements. Environment variable: RAG_EMBEDDING_OPENAI_BATCH_SIZE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 167,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      envVar: 'RAG_EMBEDDING_OPENAI_BATCH_SIZE',
      persistentConfig: false,
    },
  },
  RAG_EMBEDDING_BATCH_SIZE: {
    name: 'RAG_EMBEDDING_BATCH_SIZE',
    type: 'integer',
    'ui:title': 'Rag Embedding Batch Size',
    'ui:description':
      'Sets the batch size for embedding in RAG (Retrieval-Augmented Generator) models.',
    'ui:help': 'Environment variable: RAG_EMBEDDING_BATCH_SIZE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 168,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      envVar: 'RAG_EMBEDDING_BATCH_SIZE',
      persistentConfig: true,
    },
  },
  RAG_OLLAMA_API_KEY: {
    name: 'RAG_OLLAMA_API_KEY',
    type: 'string',
    'ui:title': 'Rag Ollama Api Key',
    'ui:description': 'Sets the API key for Ollama API used in RAG models.',
    'ui:help':
      'Feature 24: ollama on beam.cloud provision This field has 2 conditional requirements. Environment variable: RAG_OLLAMA_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 169,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'ollama',
        },
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'ollama',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 24: ollama on beam.cloud provision',
      envVar: 'RAG_OLLAMA_API_KEY',
      persistentConfig: true,
    },
  },
  RAG_OLLAMA_BASE_URL: {
    name: 'RAG_OLLAMA_BASE_URL',
    type: 'string',
    'ui:title': 'Rag Ollama Base Url',
    'ui:description': 'Sets the base URL for Ollama API used in RAG models.',
    'ui:help':
      'Feature 24: ollama on beam.cloud provision This field has 2 conditional requirements. Environment variable: RAG_OLLAMA_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 170,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'ollama',
        },
        {
          field: 'RAG_EMBEDDING_ENGINE',
          operator: 'equals',
          value: 'ollama',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 24: ollama on beam.cloud provision',
      envVar: 'RAG_OLLAMA_BASE_URL',
      persistentConfig: true,
    },
  },
  ENABLE_RETRIEVAL_QUERY_GENERATION: {
    name: 'ENABLE_RETRIEVAL_QUERY_GENERATION',
    type: 'boolean',
    'ui:title': 'Enable Retrieval Query Generation',
    'ui:description': 'Enables or disables retrieval query generation.',
    'ui:help': 'Environment variable: ENABLE_RETRIEVAL_QUERY_GENERATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 171,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      envVar: 'ENABLE_RETRIEVAL_QUERY_GENERATION',
      persistentConfig: true,
    },
  },
  QUERY_GENERATION_PROMPT_TEMPLATE: {
    name: 'QUERY_GENERATION_PROMPT_TEMPLATE',
    type: 'string',
    'ui:title': 'Query Generation Prompt Template',
    'ui:description': 'Sets the prompt template for query generation.',
    'ui:help':
      'left empty to use default This field is shown when ENABLE_RETRIEVAL_QUERY_GENERATION is set to "true". Environment variable: QUERY_GENERATION_PROMPT_TEMPLATE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 172,
    'ui:condition': {
      field: 'ENABLE_RETRIEVAL_QUERY_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'left empty to use default',
      envVar: 'QUERY_GENERATION_PROMPT_TEMPLATE',
      persistentConfig: true,
    },
  },
  BYPASS_EMBEDDING_AND_RETRIEVAL: {
    name: 'BYPASS_EMBEDDING_AND_RETRIEVAL',
    type: 'boolean',
    'ui:title': 'Bypass Embedding And Retrieval',
    'ui:description': 'Bypasses the embedding and retrieval process.',
    'ui:help':
      'This should be a general flow where user can disable RAG in one go Environment variable: BYPASS_EMBEDDING_AND_RETRIEVAL',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 173,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'This should be a general flow where user can disable RAG in one go',
      envVar: 'BYPASS_EMBEDDING_AND_RETRIEVAL',
      persistentConfig: true,
    },
  },
  DOCUMENT_INTELLIGENCE_ENDPOINT: {
    name: 'DOCUMENT_INTELLIGENCE_ENDPOINT',
    type: 'string',
    'ui:title': 'Document Intelligence Endpoint',
    'ui:description': 'Specifies the endpoint for document intelligence.',
    'ui:help':
      'Default as none, not sure that this does Environment variable: DOCUMENT_INTELLIGENCE_ENDPOINT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 174,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Default as none, not sure that this does',
      envVar: 'DOCUMENT_INTELLIGENCE_ENDPOINT',
      persistentConfig: true,
    },
  },
  DOCUMENT_INTELLIGENCE_KEY: {
    name: 'DOCUMENT_INTELLIGENCE_KEY',
    type: 'string',
    'ui:title': 'Document Intelligence Key',
    'ui:description': 'Specifies the key for document intelligence.',
    'ui:help':
      'Default as none, not sure that this does Environment variable: DOCUMENT_INTELLIGENCE_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 175,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Default as none, not sure that this does',
      envVar: 'DOCUMENT_INTELLIGENCE_KEY',
      persistentConfig: true,
    },
  },
  ENABLE_RAG_LOCAL_WEB_FETCH: {
    name: 'ENABLE_RAG_LOCAL_WEB_FETCH',
    type: 'boolean',
    'ui:title': 'Enable Rag Local Web Fetch',
    'ui:description': 'Enables or disables local web fetch for RAG.',
    'ui:help':
      'Default as none, not sure that this does Environment variable: ENABLE_RAG_LOCAL_WEB_FETCH',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 176,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Default as none, not sure that this does',
      envVar: 'ENABLE_RAG_LOCAL_WEB_FETCH',
      persistentConfig: true,
    },
  },
  RAG_EMBEDDING_CONTENT_PREFIX: {
    name: 'RAG_EMBEDDING_CONTENT_PREFIX',
    type: 'string',
    'ui:title': 'Rag Embedding Content Prefix',
    'ui:description': 'Specifies the prefix for the RAG embedding content.',
    'ui:help':
      'Default as none, not sure that this does Environment variable: RAG_EMBEDDING_CONTENT_PREFIX',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 177,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Default as none, not sure that this does',
      envVar: 'RAG_EMBEDDING_CONTENT_PREFIX',
      persistentConfig: true,
    },
  },
  RAG_EMBEDDING_PREFIX_FIELD_NAME: {
    name: 'RAG_EMBEDDING_PREFIX_FIELD_NAME',
    type: 'string',
    'ui:title': 'Rag Embedding Prefix Field Name',
    'ui:description': 'Specifies the field name for the RAG embedding prefix.',
    'ui:help':
      'Default as none, not sure that this does Environment variable: RAG_EMBEDDING_PREFIX_FIELD_NAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 178,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Default as none, not sure that this does',
      envVar: 'RAG_EMBEDDING_PREFIX_FIELD_NAME',
      persistentConfig: true,
    },
  },
  RAG_EMBEDDING_QUERY_PREFIX: {
    name: 'RAG_EMBEDDING_QUERY_PREFIX',
    type: 'string',
    'ui:title': 'Rag Embedding Query Prefix',
    'ui:description': 'Specifies the prefix for the RAG embedding query.',
    'ui:help':
      'Default as none, not sure that this does Environment variable: RAG_EMBEDDING_QUERY_PREFIX',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 179,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Default as none, not sure that this does',
      envVar: 'RAG_EMBEDDING_QUERY_PREFIX',
      persistentConfig: true,
    },
  },
  RAG_FULL_CONTEXT: {
    name: 'RAG_FULL_CONTEXT',
    type: 'boolean',
    'ui:title': 'Rag Full Context',
    'ui:description': 'Specifies whether to use the full context for RAG.',
    'ui:help': 'Not sure Environment variable: RAG_FULL_CONTEXT',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG)',
    'ui:order': 180,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Not sure',
      envVar: 'RAG_FULL_CONTEXT',
      persistentConfig: true,
    },
  },
  ENABLE_GOOGLE_DRIVE_INTEGRATION: {
    name: 'ENABLE_GOOGLE_DRIVE_INTEGRATION',
    type: 'boolean',
    'ui:title': 'Enable Google Drive Integration',
    'ui:description':
      'Enables or disables Google Drive integration. If set to true, and `GOOGLE_DRIVE_CLIENT_ID` & `GOOGLE_DRIVE_API_KEY` are both configured, Google Drive will appear as an upload option in the chat UI.',
    'ui:help':
      'Feature 25: Google Drive integration Environment variable: ENABLE_GOOGLE_DRIVE_INTEGRATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG) - Google Drive',
    'ui:order': 181,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 25: Google Drive integration',
      envVar: 'ENABLE_GOOGLE_DRIVE_INTEGRATION',
      persistentConfig: true,
    },
  },
  GOOGLE_DRIVE_CLIENT_ID: {
    name: 'GOOGLE_DRIVE_CLIENT_ID',
    type: 'string',
    'ui:title': 'Google Drive Client Id',
    'ui:description':
      'Sets the client ID for Google Drive (client must be configured with Drive API and Picker API enabled).',
    'ui:help':
      'Feature 25: Google Drive integration This field is shown when ENABLE_GOOGLE_DRIVE_INTEGRATION is set to "true". Environment variable: GOOGLE_DRIVE_CLIENT_ID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG) - Google Drive',
    'ui:order': 182,
    'ui:condition': {
      field: 'ENABLE_GOOGLE_DRIVE_INTEGRATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 25: Google Drive integration',
      envVar: 'GOOGLE_DRIVE_CLIENT_ID',
      persistentConfig: true,
    },
  },
  GOOGLE_DRIVE_API_KEY: {
    name: 'GOOGLE_DRIVE_API_KEY',
    type: 'string',
    'ui:title': 'Google Drive Api Key',
    'ui:description': 'Sets the API key for Google Drive integration.',
    'ui:help':
      'Feature 25: Google Drive integration This field is shown when ENABLE_GOOGLE_DRIVE_INTEGRATION is set to "true". Environment variable: GOOGLE_DRIVE_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Retrieval Augmented Generation (RAG) - Google Drive',
    'ui:order': 183,
    'ui:condition': {
      field: 'ENABLE_GOOGLE_DRIVE_INTEGRATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 25: Google Drive integration',
      envVar: 'GOOGLE_DRIVE_API_KEY',
      persistentConfig: true,
    },
  },
  ENABLE_ONEDRIVE_INTEGRATION: {
    name: 'ENABLE_ONEDRIVE_INTEGRATION',
    type: 'boolean',
    'ui:title': 'Enable Onedrive Integration',
    'ui:description': 'Enables or disables OneDrive integration.',
    'ui:help': 'Feature 26: OneDrive integration Environment variable: ENABLE_ONEDRIVE_INTEGRATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG) - OneDrive',
    'ui:order': 184,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 26: OneDrive integration',
      envVar: 'ENABLE_ONEDRIVE_INTEGRATION',
      persistentConfig: true,
    },
  },
  ONEDRIVE_CLIENT_ID: {
    name: 'ONEDRIVE_CLIENT_ID',
    type: 'string',
    'ui:title': 'Onedrive Client Id',
    'ui:description': 'Specifies the client ID for OneDrive integration.',
    'ui:help':
      'Feature 26: OneDrive integration This field is shown when ENABLE_ONEDRIVE_INTEGRATION is set to "true". Environment variable: ONEDRIVE_CLIENT_ID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Retrieval Augmented Generation (RAG) - OneDrive',
    'ui:order': 185,
    'ui:condition': {
      field: 'ENABLE_ONEDRIVE_INTEGRATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 26: OneDrive integration',
      envVar: 'ONEDRIVE_CLIENT_ID',
      persistentConfig: true,
    },
  },
  ENABLE_WEB_SEARCH: {
    name: 'ENABLE_WEB_SEARCH',
    type: 'boolean',
    'ui:title': 'Enable Web Search',
    'ui:description': 'Enable web search toggle.',
    'ui:help': 'Feature 27: web search functionality Environment variable: ENABLE_WEB_SEARCH',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 186,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 27: web search functionality',
      envVar: 'ENABLE_WEB_SEARCH',
      persistentConfig: true,
    },
  },
  ENABLE_SEARCH_QUERY_GENERATION: {
    name: 'ENABLE_SEARCH_QUERY_GENERATION',
    type: 'boolean',
    'ui:title': 'Enable Search Query Generation',
    'ui:description': 'Enables or disables search query generation.',
    'ui:help':
      'Feature 27: web search functionality This field is shown when ENABLE_WEB_SEARCH is set to "true". Environment variable: ENABLE_SEARCH_QUERY_GENERATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 187,
    'ui:condition': {
      field: 'ENABLE_WEB_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'ENABLE_SEARCH_QUERY_GENERATION',
      persistentConfig: true,
    },
  },
  WEB_SEARCH_TRUST_ENV: {
    name: 'WEB_SEARCH_TRUST_ENV',
    type: 'boolean',
    'ui:title': 'Web Search Trust Env',
    'ui:description':
      'Enables proxy set by `http_proxy` and `https_proxy` during web search content fetching.',
    'ui:help':
      'Feature 27: web search functionality This field is shown when ENABLE_WEB_SEARCH is set to "true". Environment variable: WEB_SEARCH_TRUST_ENV',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 188,
    'ui:condition': {
      field: 'ENABLE_WEB_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'WEB_SEARCH_TRUST_ENV',
      persistentConfig: true,
    },
  },
  WEB_SEARCH_RESULT_COUNT: {
    name: 'WEB_SEARCH_RESULT_COUNT',
    type: 'integer',
    'ui:title': 'Web Search Result Count',
    'ui:description': 'Maximum number of search results to crawl.',
    'ui:help':
      'default This field is shown when ENABLE_WEB_SEARCH is set to "true". Environment variable: WEB_SEARCH_RESULT_COUNT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 189,
    'ui:condition': {
      field: 'ENABLE_WEB_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'default',
      envVar: 'WEB_SEARCH_RESULT_COUNT',
      persistentConfig: true,
    },
  },
  WEB_SEARCH_CONCURRENT_REQUESTS: {
    name: 'WEB_SEARCH_CONCURRENT_REQUESTS',
    type: 'integer',
    'ui:title': 'Web Search Concurrent Requests',
    'ui:description':
      'Number of concurrent requests to crawl web pages returned from search results.',
    'ui:help':
      'default This field is shown when ENABLE_WEB_SEARCH is set to "true". Environment variable: WEB_SEARCH_CONCURRENT_REQUESTS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 190,
    'ui:condition': {
      field: 'ENABLE_WEB_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'default',
      envVar: 'WEB_SEARCH_CONCURRENT_REQUESTS',
      persistentConfig: true,
    },
  },
  WEB_SEARCH_ENGINE: {
    name: 'WEB_SEARCH_ENGINE',
    type: 'string',
    'ui:title': 'Web Search Engine',
    'ui:description': '',
    'ui:help':
      'Feature 27: web search functionality This field is shown when ENABLE_WEB_SEARCH is set to "true". Environment variable: WEB_SEARCH_ENGINE',
    'ui:widget': 'SelectWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'searxng',
          label: 'Searxng',
        },
        {
          value: 'google_pse',
          label: 'Google_pse',
        },
        {
          value: 'brave',
          label: 'Brave',
        },
        {
          value: 'kagi',
          label: 'Kagi',
        },
        {
          value: 'mojeek',
          label: 'Mojeek',
        },
        {
          value: 'bocha',
          label: 'Bocha',
        },
        {
          value: 'serpstack',
          label: 'Serpstack',
        },
        {
          value: 'serper',
          label: 'Serper',
        },
        {
          value: 'serply',
          label: 'Serply',
        },
        {
          value: 'searchapi',
          label: 'Searchapi',
        },
        {
          value: 'serpapi',
          label: 'Serpapi',
        },
        {
          value: 'duckduckgo',
          label: 'Duckduckgo',
        },
        {
          value: 'tavily',
          label: 'Tavily',
        },
        {
          value: 'jina',
          label: 'Jina',
        },
        {
          value: 'bing',
          label: 'Bing',
        },
        {
          value: 'exa',
          label: 'Exa',
        },
        {
          value: 'perplexity',
          label: 'Perplexity',
        },
        {
          value: 'sougou',
          label: 'Sougou',
        },
      ],
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'select-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 191,
    'ui:condition': {
      field: 'ENABLE_WEB_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'WEB_SEARCH_ENGINE',
      persistentConfig: true,
    },
  },
  BYPASS_WEB_SEARCH_EMBEDDING_AND_RETRIEVAL: {
    name: 'BYPASS_WEB_SEARCH_EMBEDDING_AND_RETRIEVAL',
    type: 'boolean',
    'ui:title': 'Bypass Web Search Embedding And Retrieval',
    'ui:description': 'Bypasses the web search embedding and retrieval process.',
    'ui:help':
      'Feature 27: web search functionality This field is shown when ENABLE_WEB_SEARCH is set to "true". Environment variable: BYPASS_WEB_SEARCH_EMBEDDING_AND_RETRIEVAL',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 192,
    'ui:condition': {
      field: 'ENABLE_WEB_SEARCH',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'BYPASS_WEB_SEARCH_EMBEDDING_AND_RETRIEVAL',
      persistentConfig: true,
    },
  },
  SEARXNG_QUERY_URL: {
    name: 'SEARXNG_QUERY_URL',
    type: 'string',
    'ui:title': 'Searxng Query Url',
    'ui:description':
      'The [SearXNG search API](https://docs.searxng.org/dev/search_api.html) URL supporting JSON output. `<query>` is replaced with',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SEARXNG_QUERY_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 193,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'searxng',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'searxng',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SEARXNG_QUERY_URL',
      persistentConfig: true,
    },
  },
  GOOGLE_PSE_API_KEY: {
    name: 'GOOGLE_PSE_API_KEY',
    type: 'string',
    'ui:title': 'Google Pse Api Key',
    'ui:description': 'Sets the API key for the Google Programmable Search Engine (PSE) service.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: GOOGLE_PSE_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 194,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'google_pse',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'google_pse',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'GOOGLE_PSE_API_KEY',
      persistentConfig: true,
    },
  },
  GOOGLE_PSE_ENGINE_ID: {
    name: 'GOOGLE_PSE_ENGINE_ID',
    type: 'string',
    'ui:title': 'Google Pse Engine Id',
    'ui:description': 'The engine ID for the Google Programmable Search Engine (PSE) service.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: GOOGLE_PSE_ENGINE_ID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 195,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'google_pse',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'google_pse',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'GOOGLE_PSE_ENGINE_ID',
      persistentConfig: true,
    },
  },
  BRAVE_SEARCH_API_KEY: {
    name: 'BRAVE_SEARCH_API_KEY',
    type: 'string',
    'ui:title': 'Brave Search Api Key',
    'ui:description': 'Sets the API key for the Brave Search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: BRAVE_SEARCH_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 196,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'brave',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'brave',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'BRAVE_SEARCH_API_KEY',
      persistentConfig: true,
    },
  },
  KAGI_SEARCH_API_KEY: {
    name: 'KAGI_SEARCH_API_KEY',
    type: 'string',
    'ui:title': 'Kagi Search Api Key',
    'ui:description': 'Sets the API key for Kagi Search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: KAGI_SEARCH_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 197,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'kagi',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'kagi',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'KAGI_SEARCH_API_KEY',
      persistentConfig: true,
    },
  },
  MOJEEK_SEARCH_API_KEY: {
    name: 'MOJEEK_SEARCH_API_KEY',
    type: 'string',
    'ui:title': 'Mojeek Search Api Key',
    'ui:description': 'Sets the API key for Mojeek Search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: MOJEEK_SEARCH_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 198,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'mojeek',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'mojeek',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'MOJEEK_SEARCH_API_KEY',
      persistentConfig: true,
    },
  },
  SERPSTACK_API_KEY: {
    name: 'SERPSTACK_API_KEY',
    type: 'string',
    'ui:title': 'Serpstack Api Key',
    'ui:description': 'Sets the API key for Serpstack search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SERPSTACK_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 199,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serpstack',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serpstack',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SERPSTACK_API_KEY',
      persistentConfig: true,
    },
  },
  SERPSTACK_HTTPS: {
    name: 'SERPSTACK_HTTPS',
    type: 'boolean',
    'ui:title': 'Serpstack Https',
    'ui:description':
      'Configures the use of HTTPS for Serpstack requests. Free tier requests are restricted to HTTP only.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SERPSTACK_HTTPS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 200,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serpstack',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serpstack',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SERPSTACK_HTTPS',
      persistentConfig: true,
    },
  },
} as const;

const fieldConfigurationsPart5 = {
  SERPER_API_KEY: {
    name: 'SERPER_API_KEY',
    type: 'string',
    'ui:title': 'Serper Api Key',
    'ui:description': 'Sets the API key for Serper search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SERPER_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 201,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serper',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serper',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SERPER_API_KEY',
      persistentConfig: true,
    },
  },
  SERPLY_API_KEY: {
    name: 'SERPLY_API_KEY',
    type: 'string',
    'ui:title': 'Serply Api Key',
    'ui:description': 'Sets the API key for Serply search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SERPLY_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 202,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serply',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serply',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SERPLY_API_KEY',
      persistentConfig: true,
    },
  },
  SEARCHAPI_API_KEY: {
    name: 'SEARCHAPI_API_KEY',
    type: 'string',
    'ui:title': 'Searchapi Api Key',
    'ui:description': 'Sets the API key for SearchAPI.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SEARCHAPI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 203,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'searchapi',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'searchapi',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SEARCHAPI_API_KEY',
      persistentConfig: true,
    },
  },
  SEARCHAPI_ENGINE: {
    name: 'SEARCHAPI_ENGINE',
    type: 'string',
    'ui:title': 'Searchapi Engine',
    'ui:description': 'Sets the SearchAPI engine.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SEARCHAPI_ENGINE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 204,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'searchapi',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'searchapi',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SEARCHAPI_ENGINE',
      persistentConfig: true,
    },
  },
  TAVILY_API_KEY: {
    name: 'TAVILY_API_KEY',
    type: 'string',
    'ui:title': 'Tavily Api Key',
    'ui:description': 'Sets the API key for Tavily search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: TAVILY_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 205,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'tavily',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'tavily',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'TAVILY_API_KEY',
      persistentConfig: true,
    },
  },
  JINA_API_KEY: {
    name: 'JINA_API_KEY',
    type: 'string',
    'ui:title': 'Jina Api Key',
    'ui:description': 'Sets the API key for Jina.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: JINA_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 206,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'jina',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'jina',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'JINA_API_KEY',
      persistentConfig: true,
    },
  },
  BING_SEARCH_V7_ENDPOINT: {
    name: 'BING_SEARCH_V7_ENDPOINT',
    type: 'string',
    'ui:title': 'Bing Search V7 Endpoint',
    'ui:description': 'Sets the endpoint for Bing Search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: BING_SEARCH_V7_ENDPOINT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 207,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'bing',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'bing',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'BING_SEARCH_V7_ENDPOINT',
      persistentConfig: true,
    },
  },
  BING_SEARCH_V7_SUBSCRIPTION_KEY: {
    name: 'BING_SEARCH_V7_SUBSCRIPTION_KEY',
    type: 'string',
    'ui:title': 'Bing Search V7 Subscription Key',
    'ui:description': 'Sets the subscription key for Bing Search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: BING_SEARCH_V7_SUBSCRIPTION_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 208,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'bing',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'bing',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'BING_SEARCH_V7_SUBSCRIPTION_KEY',
      persistentConfig: true,
    },
  },
  BOCHA_SEARCH_API_KEY: {
    name: 'BOCHA_SEARCH_API_KEY',
    type: 'string',
    'ui:title': 'Bocha Search Api Key',
    'ui:description': 'Sets the API key for Bocha Search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: BOCHA_SEARCH_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 209,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'bocha',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'bocha',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'BOCHA_SEARCH_API_KEY',
      persistentConfig: true,
    },
  },
  EXA_API_KEY: {
    name: 'EXA_API_KEY',
    type: 'string',
    'ui:title': 'Exa Api Key',
    'ui:description': 'Sets the API key for Exa search API.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: EXA_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 210,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'exa',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'exa',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'EXA_API_KEY',
      persistentConfig: true,
    },
  },
  SERPAPI_API_KEY: {
    name: 'SERPAPI_API_KEY',
    type: 'string',
    'ui:title': 'Serpapi Api Key',
    'ui:description': 'Sets the API key for SerpAPI.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SERPAPI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search',
    'ui:order': 211,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serpapi',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serpapi',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SERPAPI_API_KEY',
      persistentConfig: true,
    },
  },
  SERPAPI_ENGINE: {
    name: 'SERPAPI_ENGINE',
    type: 'string',
    'ui:title': 'Serpapi Engine',
    'ui:description': 'Specifies the search engine to use for SerpAPI.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SERPAPI_ENGINE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 212,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serpapi',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'serpapi',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SERPAPI_ENGINE',
      persistentConfig: true,
    },
  },
  SOUGOU_API_SID: {
    name: 'SOUGOU_API_SID',
    type: 'string',
    'ui:title': 'Sougou Api Sid',
    'ui:description': 'Sets the Sogou API SID.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SOUGOU_API_SID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 213,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'sougou',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'sougou',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SOUGOU_API_SID',
      persistentConfig: true,
    },
  },
  SOUGOU_API_SK: {
    name: 'SOUGOU_API_SK',
    type: 'string',
    'ui:title': 'Sougou Api Sk',
    'ui:description': 'Sets the Sogou API SK.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: SOUGOU_API_SK',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 214,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'sougou',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'sougou',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'SOUGOU_API_SK',
      persistentConfig: true,
    },
  },
  TAVILY_EXTRACT_DEPTH: {
    name: 'TAVILY_EXTRACT_DEPTH',
    type: 'string',
    'ui:title': 'Tavily Extract Depth',
    'ui:description': 'Specifies the extract depth for Tavily search results.',
    'ui:help':
      'Feature 27: web search functionality This field has 2 conditional requirements. Environment variable: TAVILY_EXTRACT_DEPTH',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search',
    'ui:order': 215,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'tavily',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'tavily',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 27: web search functionality',
      envVar: 'TAVILY_EXTRACT_DEPTH',
      persistentConfig: true,
    },
  },
  WEB_LOADER_ENGINE: {
    name: 'WEB_LOADER_ENGINE',
    type: 'string',
    'ui:title': 'Web Loader Engine',
    'ui:description':
      'Specifies the loader to use for retrieving and processing web content.\n\nOptions:\n  - `requests` - Uses the Requests module with enhanced error handling.\n  - `playwright` - Uses Playwright for more advanced web page rendering and interaction.\n',
    'ui:help': 'Feature 28: Web Loader integration Environment variable: WEB_LOADER_ENGINE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'requests',
          label: 'Requests',
        },
        {
          value: 'playwright',
          label: 'Playwright',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search - Web Loader Configuration',
    'ui:order': 216,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 28: Web Loader integration',
      envVar: 'WEB_LOADER_ENGINE',
      persistentConfig: true,
    },
  },
  PLAYWRIGHT_WS_URL: {
    name: 'PLAYWRIGHT_WS_URL',
    type: 'string',
    'ui:title': 'Playwright Ws Url',
    'ui:description':
      'Specifies the WebSocket URI of a remote Playwright browser instance. When set, Open WebUI will use this remote browser instead of installing browser dependencies locally. This is particularly useful in containerized environments where you want to keep the Open WebUI container lightweight and separate browser concerns. Example: `ws://playwright:3000`',
    'ui:help':
      'Feature 28: Web Loader integration\nUsing remote browser (not on beam) This field has 2 conditional requirements. Environment variable: PLAYWRIGHT_WS_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search - Web Loader Configuration',
    'ui:order': 217,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_LOADER_ENGINE',
          operator: 'equals',
          value: 'playwright',
        },
        {
          field: 'WEB_LOADER_ENGINE',
          operator: 'equals',
          value: 'playwright',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 28: Web Loader integration\nUsing remote browser (not on beam)',
      envVar: 'PLAYWRIGHT_WS_URL',
      persistentConfig: true,
    },
  },
  FIRECRAWL_API_BASE_URL: {
    name: 'FIRECRAWL_API_BASE_URL',
    type: 'string',
    'ui:title': 'Firecrawl Api Base Url',
    'ui:description': 'Sets the base URL for Firecrawl API.',
    'ui:help': 'Feature 28: Web Loader integration Environment variable: FIRECRAWL_API_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search - Web Loader Configuration',
    'ui:order': 218,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 28: Web Loader integration',
      envVar: 'FIRECRAWL_API_BASE_URL',
      persistentConfig: true,
    },
  },
  FIRECRAWL_API_KEY: {
    name: 'FIRECRAWL_API_KEY',
    type: 'string',
    'ui:title': 'Firecrawl Api Key',
    'ui:description': 'Sets the API key for Firecrawl API.',
    'ui:help': 'Feature 28: Web Loader integration Environment variable: FIRECRAWL_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search - Web Loader Configuration',
    'ui:order': 219,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 28: Web Loader integration',
      envVar: 'FIRECRAWL_API_KEY',
      persistentConfig: true,
    },
  },
  PERPLEXITY_API_KEY: {
    name: 'PERPLEXITY_API_KEY',
    type: 'string',
    'ui:title': 'Perplexity Api Key',
    'ui:description': 'Sets the API key for Perplexity API.',
    'ui:help':
      'Feature 28: Web Loader integration This field has 2 conditional requirements. Environment variable: PERPLEXITY_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Web Search - Web Loader Configuration',
    'ui:order': 220,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'perplexity',
        },
        {
          field: 'WEB_SEARCH_ENGINE',
          operator: 'equals',
          value: 'perplexity',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 28: Web Loader integration',
      envVar: 'PERPLEXITY_API_KEY',
      persistentConfig: true,
    },
  },
  PLAYWRIGHT_TIMEOUT: {
    name: 'PLAYWRIGHT_TIMEOUT',
    type: 'integer',
    'ui:title': 'Playwright Timeout',
    'ui:description': 'Specifies the timeout for Playwright requests.',
    'ui:help':
      'Feature 28: Web Loader integration This field has 2 conditional requirements. Environment variable: PLAYWRIGHT_TIMEOUT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search - Web Loader Configuration',
    'ui:order': 221,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'WEB_LOADER_ENGINE',
          operator: 'equals',
          value: 'playwright',
        },
        {
          field: 'WEB_LOADER_ENGINE',
          operator: 'equals',
          value: 'playwright',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 28: Web Loader integration',
      envVar: 'PLAYWRIGHT_TIMEOUT',
      persistentConfig: true,
    },
  },
  YOUTUBE_LOADER_PROXY_URL: {
    name: 'YOUTUBE_LOADER_PROXY_URL',
    type: 'string',
    'ui:title': 'Youtube Loader Proxy Url',
    'ui:description': 'Sets the proxy URL for YouTube loader.',
    'ui:help':
      'Feature 29: Youtube Loader integration Environment variable: YOUTUBE_LOADER_PROXY_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search - YouTube Loader',
    'ui:order': 222,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 29: Youtube Loader integration',
      envVar: 'YOUTUBE_LOADER_PROXY_URL',
      persistentConfig: true,
    },
  },
  YOUTUBE_LOADER_LANGUAGE: {
    name: 'YOUTUBE_LOADER_LANGUAGE',
    type: 'string',
    'ui:title': 'Youtube Loader Language',
    'ui:description':
      'Comma-separated list of language codes to try when fetching YouTube video transcriptions, in priority order.',
    'ui:help':
      'Feature 29: Youtube Loader integration Environment variable: YOUTUBE_LOADER_LANGUAGE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Web Search - YouTube Loader',
    'ui:order': 223,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 29: Youtube Loader integration',
      envVar: 'YOUTUBE_LOADER_LANGUAGE',
      persistentConfig: true,
    },
  },
  WHISPER_MODEL: {
    name: 'WHISPER_MODEL',
    type: 'string',
    'ui:title': 'Whisper Model',
    'ui:description':
      'Sets the Whisper model to use for Speech-to-Text. The backend used is faster_whisper with quantization to `int8`.',
    'ui:help':
      'Feature 30: Whisper SST hosted on beam This field has 2 conditional requirements. Environment variable: WHISPER_MODEL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Whisper Speech-to-Text (Local)',
    'ui:order': 224,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 30: Whisper SST hosted on beam',
      envVar: 'WHISPER_MODEL',
      persistentConfig: true,
    },
  },
  WHISPER_MODEL_DIR: {
    name: 'WHISPER_MODEL_DIR',
    type: 'string',
    'ui:title': 'Whisper Model Dir',
    'ui:description': 'Specifies the directory to store Whisper model files.',
    'ui:help':
      'Feature 30: Whisper SST hosted on beam This field has 2 conditional requirements. Environment variable: WHISPER_MODEL_DIR',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Whisper Speech-to-Text (Local)',
    'ui:order': 225,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 30: Whisper SST hosted on beam',
      envVar: 'WHISPER_MODEL_DIR',
      persistentConfig: false,
    },
  },
  WHISPER_VAD_FILTER: {
    name: 'WHISPER_VAD_FILTER',
    type: 'boolean',
    'ui:title': 'Whisper Vad Filter',
    'ui:description':
      'Specifies whether to apply a Voice Activity Detection (VAD) filter to Whisper Speech-to-Text.',
    'ui:help':
      'Feature 30: Whisper SST hosted on beam This field has 2 conditional requirements. Environment variable: WHISPER_VAD_FILTER',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Whisper Speech-to-Text (Local)',
    'ui:order': 226,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 30: Whisper SST hosted on beam',
      envVar: 'WHISPER_VAD_FILTER',
      persistentConfig: true,
    },
  },
  WHISPER_MODEL_AUTO_UPDATE: {
    name: 'WHISPER_MODEL_AUTO_UPDATE',
    type: 'boolean',
    'ui:title': 'Whisper Model Auto Update',
    'ui:description': 'Toggles automatic update of the Whisper model.',
    'ui:help':
      'Feature 30: Whisper SST hosted on beam This field has 2 conditional requirements. Environment variable: WHISPER_MODEL_AUTO_UPDATE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Whisper Speech-to-Text (Local)',
    'ui:order': 227,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 30: Whisper SST hosted on beam',
      envVar: 'WHISPER_MODEL_AUTO_UPDATE',
      persistentConfig: false,
    },
  },
  WHISPER_LANGUAGE: {
    name: 'WHISPER_LANGUAGE',
    type: 'string',
    'ui:title': 'Whisper Language',
    'ui:description':
      'Specifies the ISO 639-1 language Whisper uses for STT (ISO 639-2 for Hawaiian and Cantonese). Whisper predicts the language by default.',
    'ui:help': 'This field has 2 conditional requirements. Environment variable: WHISPER_LANGUAGE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Whisper Speech-to-Text (Local)',
    'ui:order': 228,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: '',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'WHISPER_LANGUAGE',
      persistentConfig: false,
    },
  },
  AUDIO_STT_ENGINE: {
    name: 'AUDIO_STT_ENGINE',
    type: 'string',
    'ui:title': 'Audio Stt Engine',
    'ui:description':
      'Specifies the Speech-to-Text engine to use.\n\nOptions:\n  - `openai` - Uses OpenAI engine for Speech-to-Text.\n  - `deepgram` - Uses Deepgram engine for Speech-to-Text.\n',
    'ui:help': 'Feature 31: OpenAI hosted whisper Environment variable: AUDIO_STT_ENGINE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'openai',
          label: 'Openai',
        },
        {
          value: 'deepgram',
          label: 'Deepgram',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Speech-to-Text (OpenAI)',
    'ui:order': 229,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 31: OpenAI hosted whisper',
      envVar: 'AUDIO_STT_ENGINE',
      persistentConfig: true,
    },
  },
  AUDIO_STT_MODEL: {
    name: 'AUDIO_STT_MODEL',
    type: 'string',
    'ui:title': 'Audio Stt Model',
    'ui:description': 'Specifies the Speech-to-Text model to use for OpenAI-compatible endpoints.',
    'ui:help':
      'Feature 31: OpenAI hosted whisper This field has 2 conditional requirements. Environment variable: AUDIO_STT_MODEL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Speech-to-Text (OpenAI)',
    'ui:order': 230,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 31: OpenAI hosted whisper',
      envVar: 'AUDIO_STT_MODEL',
      persistentConfig: true,
    },
  },
  AUDIO_STT_OPENAI_API_BASE_URL: {
    name: 'AUDIO_STT_OPENAI_API_BASE_URL',
    type: 'string',
    'ui:title': 'Audio Stt Openai Api Base Url',
    'ui:description': 'Sets the OpenAI-compatible base URL to use for Speech-to-Text.',
    'ui:help':
      'Feature 31: OpenAI hosted whisper This field has 2 conditional requirements. Environment variable: AUDIO_STT_OPENAI_API_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Speech-to-Text (OpenAI)',
    'ui:order': 231,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 31: OpenAI hosted whisper',
      envVar: 'AUDIO_STT_OPENAI_API_BASE_URL',
      persistentConfig: true,
    },
  },
  AUDIO_STT_OPENAI_API_KEY: {
    name: 'AUDIO_STT_OPENAI_API_KEY',
    type: 'string',
    'ui:title': 'Audio Stt Openai Api Key',
    'ui:description': 'Sets the OpenAI API key to use for Speech-to-Text.',
    'ui:help':
      'Feature 31: OpenAI hosted whisper This field has 2 conditional requirements. Environment variable: AUDIO_STT_OPENAI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Audio - Speech-to-Text (OpenAI)',
    'ui:order': 232,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 31: OpenAI hosted whisper',
      envVar: 'AUDIO_STT_OPENAI_API_KEY',
      persistentConfig: true,
    },
  },
  AUDIO_STT_AZURE_API_KEY: {
    name: 'AUDIO_STT_AZURE_API_KEY',
    type: 'string',
    'ui:title': 'Audio Stt Azure Api Key',
    'ui:description': 'Specifies the Azure API key to use for Speech-to-Text.',
    'ui:help':
      'Feature 32: Azure hosted SST This field has 2 conditional requirements. Environment variable: AUDIO_STT_AZURE_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Audio - Speech-to-Text (Azure)',
    'ui:order': 233,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 32: Azure hosted SST',
      envVar: 'AUDIO_STT_AZURE_API_KEY',
      persistentConfig: true,
    },
  },
  AUDIO_STT_AZURE_REGION: {
    name: 'AUDIO_STT_AZURE_REGION',
    type: 'string',
    'ui:title': 'Audio Stt Azure Region',
    'ui:description': 'Specifies the Azure region to use for Speech-to-Text.',
    'ui:help':
      'Feature 32: Azure hosted SST This field has 2 conditional requirements. Environment variable: AUDIO_STT_AZURE_REGION',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Speech-to-Text (Azure)',
    'ui:order': 234,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 32: Azure hosted SST',
      envVar: 'AUDIO_STT_AZURE_REGION',
      persistentConfig: true,
    },
  },
  AUDIO_STT_AZURE_LOCALES: {
    name: 'AUDIO_STT_AZURE_LOCALES',
    type: 'string',
    'ui:title': 'Audio Stt Azure Locales',
    'ui:description': 'Specifies the locales to use for Azure Speech-to-Text.',
    'ui:help':
      'Feature 32: Azure hosted SST This field has 2 conditional requirements. Environment variable: AUDIO_STT_AZURE_LOCALES',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Speech-to-Text (Azure)',
    'ui:order': 235,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 32: Azure hosted SST',
      envVar: 'AUDIO_STT_AZURE_LOCALES',
      persistentConfig: true,
    },
  },
  DEEPGRAM_API_KEY: {
    name: 'DEEPGRAM_API_KEY',
    type: 'string',
    'ui:title': 'Deepgram Api Key',
    'ui:description': 'Specifies the Deepgram API key to use for Speech-to-Text.',
    'ui:help':
      'Feature 33: Deepgram SST This field has 2 conditional requirements. Environment variable: DEEPGRAM_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Audio - Speech-to-Text (Deepgram)',
    'ui:order': 236,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'deepgram',
        },
        {
          field: 'AUDIO_STT_ENGINE',
          operator: 'equals',
          value: 'deepgram',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 33: Deepgram SST',
      envVar: 'DEEPGRAM_API_KEY',
      persistentConfig: true,
    },
  },
  AUDIO_TTS_API_KEY: {
    name: 'AUDIO_TTS_API_KEY',
    type: 'string',
    'ui:title': 'Audio Tts Api Key',
    'ui:description': 'Sets the API key for Text-to-Speech.',
    'ui:help':
      'Feature 34: Text-to-speech This field has 4 conditional requirements. Environment variable: AUDIO_TTS_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 4,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Audio - Text-to-Speech',
    'ui:order': 237,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'transformers',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'elevenlabs',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'transformers',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 34: Text-to-speech',
      envVar: 'AUDIO_TTS_API_KEY',
      persistentConfig: true,
    },
  },
  AUDIO_TTS_ENGINE: {
    name: 'AUDIO_TTS_ENGINE',
    type: 'string',
    'ui:title': 'Audio Tts Engine',
    'ui:description':
      'Specifies the Text-to-Speech engine to use.\n\nOptions:\n  - `azure` - Uses Azure engine for Text-to-Speech.\n  - `elevenlabs` - Uses ElevenLabs engine for Text-to-Speech\n  - `openai` - Uses OpenAI engine for Text-to-Speech.\n  - `transformers` - Uses SentenceTransformers for Text-to-Speech.\n',
    'ui:help': 'Feature 34: Text-to-speech Environment variable: AUDIO_TTS_ENGINE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'azure',
          label: 'Azure',
        },
        {
          value: 'elevenlabs',
          label: 'Elevenlabs',
        },
        {
          value: 'openai',
          label: 'Openai',
        },
        {
          value: 'transformers',
          label: 'Transformers',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Text-to-Speech',
    'ui:order': 238,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 34: Text-to-speech',
      envVar: 'AUDIO_TTS_ENGINE',
      persistentConfig: true,
    },
  },
  AUDIO_TTS_MODEL: {
    name: 'AUDIO_TTS_MODEL',
    type: 'string',
    'ui:title': 'Audio Tts Model',
    'ui:description': 'Specifies the OpenAI text-to-speech model to use.',
    'ui:help':
      'Feature 34: Text-to-speech This field has 2 conditional requirements. Environment variable: AUDIO_TTS_MODEL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Text-to-Speech',
    'ui:order': 239,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 34: Text-to-speech',
      envVar: 'AUDIO_TTS_MODEL',
      persistentConfig: true,
    },
  },
  AUDIO_TTS_VOICE: {
    name: 'AUDIO_TTS_VOICE',
    type: 'string',
    'ui:title': 'Audio Tts Voice',
    'ui:description': 'Sets the OpenAI text-to-speech voice to use.',
    'ui:help':
      'Feature 34: Text-to-speech This field has 2 conditional requirements. Environment variable: AUDIO_TTS_VOICE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Text-to-Speech',
    'ui:order': 240,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 34: Text-to-speech',
      envVar: 'AUDIO_TTS_VOICE',
      persistentConfig: true,
    },
  },
  AUDIO_TTS_SPLIT_ON: {
    name: 'AUDIO_TTS_SPLIT_ON',
    type: 'string',
    'ui:title': 'Audio Tts Split On',
    'ui:description': 'Sets the OpenAI text-to-speech split on to use.',
    'ui:help':
      'Feature 34: Text-to-speech This field has 2 conditional requirements. Environment variable: AUDIO_TTS_SPLIT_ON',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Text-to-Speech',
    'ui:order': 241,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 34: Text-to-speech',
      envVar: 'AUDIO_TTS_SPLIT_ON',
      persistentConfig: true,
    },
  },
  AUDIO_TTS_AZURE_SPEECH_REGION: {
    name: 'AUDIO_TTS_AZURE_SPEECH_REGION',
    type: 'string',
    'ui:title': 'Audio Tts Azure Speech Region',
    'ui:description': 'Sets the region for Azure Text to Speech.',
    'ui:help':
      'Feature 35: Azure Text-to-speech This field has 2 conditional requirements. Environment variable: AUDIO_TTS_AZURE_SPEECH_REGION',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Azure Text-to-Speech',
    'ui:order': 242,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 35: Azure Text-to-speech',
      envVar: 'AUDIO_TTS_AZURE_SPEECH_REGION',
      persistentConfig: true,
    },
  },
  AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT: {
    name: 'AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT',
    type: 'string',
    'ui:title': 'Audio Tts Azure Speech Output Format',
    'ui:description': 'Sets the output format for Azure Text to Speech.',
    'ui:help':
      'Feature 35: Azure Text-to-speech This field has 2 conditional requirements. Environment variable: AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - Azure Text-to-Speech',
    'ui:order': 243,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'azure',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 35: Azure Text-to-speech',
      envVar: 'AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT',
      persistentConfig: true,
    },
  },
  AUDIO_TTS_OPENAI_API_BASE_URL: {
    name: 'AUDIO_TTS_OPENAI_API_BASE_URL',
    type: 'string',
    'ui:title': 'Audio Tts Openai Api Base Url',
    'ui:description': 'Sets the OpenAI-compatible base URL to use for text-to-speech.',
    'ui:help':
      'Feature 35: OpenAI Text-to-speech This field has 2 conditional requirements. Environment variable: AUDIO_TTS_OPENAI_API_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Audio - OpenAI Text-to-Speech',
    'ui:order': 244,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 35: OpenAI Text-to-speech',
      envVar: 'AUDIO_TTS_OPENAI_API_BASE_URL',
      persistentConfig: true,
    },
  },
  AUDIO_TTS_OPENAI_API_KEY: {
    name: 'AUDIO_TTS_OPENAI_API_KEY',
    type: 'string',
    'ui:title': 'Audio Tts Openai Api Key',
    'ui:description': 'Sets the API key to use for text-to-speech.',
    'ui:help':
      'Feature 35: OpenAI Text-to-speech This field has 2 conditional requirements. Environment variable: AUDIO_TTS_OPENAI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Audio - OpenAI Text-to-Speech',
    'ui:order': 245,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'AUDIO_TTS_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 35: OpenAI Text-to-speech',
      envVar: 'AUDIO_TTS_OPENAI_API_KEY',
      persistentConfig: true,
    },
  },
  IMAGE_GENERATION_ENGINE: {
    name: 'IMAGE_GENERATION_ENGINE',
    type: 'string',
    'ui:title': 'Image Generation Engine',
    'ui:description':
      'Specifies the engine to use for image generation.\n\nOptions:\n  - `openai` - Uses OpenAI DALL-E for image generation.\n  - `comfyui` - Uses ComfyUI engine for image generation.\n  - `automatic1111` - Uses AUTOMATIC1111 engine for image generation.\n  - `gemini` - Uses Gemini for image generation.\n',
    'ui:help':
      'Feature 36: Image Generation This field is shown when ENABLE_IMAGE_GENERATION is set to "true". Environment variable: IMAGE_GENERATION_ENGINE',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 'openai',
          label: 'Openai',
        },
        {
          value: 'comfyui',
          label: 'Comfyui',
        },
        {
          value: 'automatic1111',
          label: 'Automatic1111',
        },
        {
          value: 'gemini',
          label: 'Gemini',
        },
      ],
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'select-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation',
    'ui:order': 246,
    'ui:condition': {
      field: 'ENABLE_IMAGE_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 36: Image Generation',
      envVar: 'IMAGE_GENERATION_ENGINE',
      persistentConfig: true,
    },
  },
  ENABLE_IMAGE_GENERATION: {
    name: 'ENABLE_IMAGE_GENERATION',
    type: 'boolean',
    'ui:title': 'Enable Image Generation',
    'ui:description': 'Enables or disables image generation features.',
    'ui:help': 'Feature 36: Image Generation Environment variable: ENABLE_IMAGE_GENERATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation',
    'ui:order': 247,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 36: Image Generation',
      envVar: 'ENABLE_IMAGE_GENERATION',
      persistentConfig: true,
    },
  },
  ENABLE_IMAGE_PROMPT_GENERATION: {
    name: 'ENABLE_IMAGE_PROMPT_GENERATION',
    type: 'boolean',
    'ui:title': 'Enable Image Prompt Generation',
    'ui:description': 'Enables or disables image prompt generation.',
    'ui:help':
      'Feature 36: Image Generation This field is shown when ENABLE_IMAGE_GENERATION is set to "true". Environment variable: ENABLE_IMAGE_PROMPT_GENERATION',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation',
    'ui:order': 248,
    'ui:condition': {
      field: 'ENABLE_IMAGE_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 36: Image Generation',
      envVar: 'ENABLE_IMAGE_PROMPT_GENERATION',
      persistentConfig: true,
    },
  },
  IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE: {
    name: 'IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE',
    type: 'string',
    'ui:title': 'Image Prompt Generation Prompt Template',
    'ui:description': 'Specifies the template to use for generating image prompts.',
    'ui:help':
      'Feature 36: Image Generation This field is shown when ENABLE_IMAGE_GENERATION is set to "true". Environment variable: IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation',
    'ui:order': 249,
    'ui:condition': {
      field: 'ENABLE_IMAGE_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 36: Image Generation',
      envVar: 'IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE',
      persistentConfig: true,
    },
  },
  IMAGE_SIZE: {
    name: 'IMAGE_SIZE',
    type: 'string',
    'ui:title': 'Image Size',
    'ui:description': 'Sets the default image size to generate.',
    'ui:help':
      'Feature 36: Image Generation This field is shown when ENABLE_IMAGE_GENERATION is set to "true". Environment variable: IMAGE_SIZE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation',
    'ui:order': 250,
    'ui:condition': {
      field: 'ENABLE_IMAGE_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 36: Image Generation',
      envVar: 'IMAGE_SIZE',
      persistentConfig: true,
    },
  },
} as const;

const fieldConfigurationsPart6 = {
  IMAGE_STEPS: {
    name: 'IMAGE_STEPS',
    type: 'integer',
    'ui:title': 'Image Steps',
    'ui:description':
      'Sets the default iteration steps for image generation. Used for ComfyUI and AUTOMATIC1111.',
    'ui:help':
      'Feature 36: Image Generation This field has 3 conditional requirements. Environment variable: IMAGE_STEPS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 3,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation',
    'ui:order': 251,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'ENABLE_IMAGE_GENERATION',
          operator: 'equals',
          value: true,
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'comfyui',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 36: Image Generation',
      envVar: 'IMAGE_STEPS',
      persistentConfig: true,
    },
  },
  IMAGE_GENERATION_MODEL: {
    name: 'IMAGE_GENERATION_MODEL',
    type: 'string',
    'ui:title': 'Image Generation Model',
    'ui:description': 'Default model to use for image generation',
    'ui:help':
      'Feature 36: Image Generation This field is shown when ENABLE_IMAGE_GENERATION is set to "true". Environment variable: IMAGE_GENERATION_MODEL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation',
    'ui:order': 252,
    'ui:condition': {
      field: 'ENABLE_IMAGE_GENERATION',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 36: Image Generation',
      envVar: 'IMAGE_GENERATION_MODEL',
      persistentConfig: true,
    },
  },
  AUTOMATIC1111_BASE_URL: {
    name: 'AUTOMATIC1111_BASE_URL',
    type: 'string',
    'ui:title': 'Automatic1111 Base Url',
    'ui:description': "Specifies the URL to AUTOMATIC1111's Stable Diffusion API.",
    'ui:help':
      'Feature 37: Image Generation with automatic1111 This field has 2 conditional requirements. Environment variable: AUTOMATIC1111_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - AUTOMATIC1111',
    'ui:order': 253,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 37: Image Generation with automatic1111',
      envVar: 'AUTOMATIC1111_BASE_URL',
      persistentConfig: true,
    },
  },
  AUTOMATIC1111_API_AUTH: {
    name: 'AUTOMATIC1111_API_AUTH',
    type: 'string',
    'ui:title': 'Automatic1111 Api Auth',
    'ui:description': 'Sets the AUTOMATIC1111 API authentication.',
    'ui:help':
      'Feature 37: Image Generation with automatic1111 This field has 2 conditional requirements. Environment variable: AUTOMATIC1111_API_AUTH',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - AUTOMATIC1111',
    'ui:order': 254,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 37: Image Generation with automatic1111',
      envVar: 'AUTOMATIC1111_API_AUTH',
      persistentConfig: true,
    },
  },
  AUTOMATIC1111_CFG_SCALE: {
    name: 'AUTOMATIC1111_CFG_SCALE',
    type: 'number',
    'ui:title': 'Automatic1111 Cfg Scale',
    'ui:description': 'Sets the scale for AUTOMATIC1111 inference.',
    'ui:help':
      'Feature 37: Image Generation with automatic1111 This field has 2 conditional requirements. Environment variable: AUTOMATIC1111_CFG_SCALE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - AUTOMATIC1111',
    'ui:order': 255,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 37: Image Generation with automatic1111',
      envVar: 'AUTOMATIC1111_CFG_SCALE',
      persistentConfig: true,
    },
  },
  AUTOMATIC1111_SAMPLER: {
    name: 'AUTOMATIC1111_SAMPLER',
    type: 'string',
    'ui:title': 'Automatic1111 Sampler',
    'ui:description': 'Sets the sampler for AUTOMATIC1111 inference.',
    'ui:help':
      'Feature 37: Image Generation with automatic1111 This field has 2 conditional requirements. Environment variable: AUTOMATIC1111_SAMPLER',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - AUTOMATIC1111',
    'ui:order': 256,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 37: Image Generation with automatic1111',
      envVar: 'AUTOMATIC1111_SAMPLER',
      persistentConfig: true,
    },
  },
  AUTOMATIC1111_SCHEDULER: {
    name: 'AUTOMATIC1111_SCHEDULER',
    type: 'string',
    'ui:title': 'Automatic1111 Scheduler',
    'ui:description': 'Sets the scheduler for AUTOMATIC1111 inference.',
    'ui:help':
      'Feature 37: Image Generation with automatic1111 This field has 2 conditional requirements. Environment variable: AUTOMATIC1111_SCHEDULER',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - AUTOMATIC1111',
    'ui:order': 257,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'automatic1111',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 37: Image Generation with automatic1111',
      envVar: 'AUTOMATIC1111_SCHEDULER',
      persistentConfig: true,
    },
  },
  COMFYUI_BASE_URL: {
    name: 'COMFYUI_BASE_URL',
    type: 'string',
    'ui:title': 'Comfyui Base Url',
    'ui:description': 'Specifies the URL to the ComfyUI image generation API.',
    'ui:help':
      'Feature 38: Image Generation with comfyui This field has 2 conditional requirements. Environment variable: COMFYUI_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - ComfyUI',
    'ui:order': 258,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'comfyui',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'comfyui',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 38: Image Generation with comfyui',
      envVar: 'COMFYUI_BASE_URL',
      persistentConfig: true,
    },
  },
  COMFYUI_API_KEY: {
    name: 'COMFYUI_API_KEY',
    type: 'string',
    'ui:title': 'Comfyui Api Key',
    'ui:description': 'Sets the API key for ComfyUI.',
    'ui:help':
      'Feature 38: Image Generation with comfyui This field has 2 conditional requirements. Environment variable: COMFYUI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Image Generation - ComfyUI',
    'ui:order': 259,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'comfyui',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'comfyui',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 38: Image Generation with comfyui',
      envVar: 'COMFYUI_API_KEY',
      persistentConfig: true,
    },
  },
  COMFYUI_WORKFLOW: {
    name: 'COMFYUI_WORKFLOW',
    type: 'string',
    'ui:title': 'Comfyui Workflow',
    'ui:description': 'Sets the ComfyUI workflow.',
    'ui:help':
      'Feature 38: Image Generation with comfyui This field has 2 conditional requirements. Environment variable: COMFYUI_WORKFLOW',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - ComfyUI',
    'ui:order': 260,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'comfyui',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'comfyui',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 38: Image Generation with comfyui',
      envVar: 'COMFYUI_WORKFLOW',
      persistentConfig: true,
    },
  },
  GEMINI_API_BASE_URL: {
    name: 'GEMINI_API_BASE_URL',
    type: 'string',
    'ui:title': 'Gemini Api Base Url',
    'ui:description': "Specifies the URL to Gemini's API.",
    'ui:help':
      'Feature 39: Image Generation with gemini This field has 2 conditional requirements. Environment variable: GEMINI_API_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - Gemini',
    'ui:order': 261,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'gemini',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'gemini',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 39: Image Generation with gemini',
      envVar: 'GEMINI_API_BASE_URL',
      persistentConfig: true,
    },
  },
  GEMINI_API_KEY: {
    name: 'GEMINI_API_KEY',
    type: 'string',
    'ui:title': 'Gemini Api Key',
    'ui:description': 'Sets the Gemini API key.',
    'ui:help':
      'Feature 39: Image Generation with gemini This field has 2 conditional requirements. Environment variable: GEMINI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Image Generation - Gemini',
    'ui:order': 262,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'gemini',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'gemini',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 39: Image Generation with gemini',
      envVar: 'GEMINI_API_KEY',
      persistentConfig: true,
    },
  },
  IMAGES_GEMINI_API_BASE_URL: {
    name: 'IMAGES_GEMINI_API_BASE_URL',
    type: 'string',
    'ui:title': 'Images Gemini Api Base Url',
    'ui:description': "Specifies the URL to Gemini's image generation API.",
    'ui:help':
      'Feature 39: Image Generation with gemini This field has 2 conditional requirements. Environment variable: IMAGES_GEMINI_API_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - Gemini',
    'ui:order': 263,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'gemini',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'gemini',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 39: Image Generation with gemini',
      envVar: 'IMAGES_GEMINI_API_BASE_URL',
      persistentConfig: true,
    },
  },
  IMAGES_GEMINI_API_KEY: {
    name: 'IMAGES_GEMINI_API_KEY',
    type: 'string',
    'ui:title': 'Images Gemini Api Key',
    'ui:description': 'Sets the Gemini API key for image generation.',
    'ui:help':
      'Feature 39: Image Generation with gemini This field has 2 conditional requirements. Environment variable: IMAGES_GEMINI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Image Generation - Gemini',
    'ui:order': 264,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'gemini',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'gemini',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 39: Image Generation with gemini',
      envVar: 'IMAGES_GEMINI_API_KEY',
      persistentConfig: true,
    },
  },
  IMAGES_OPENAI_API_BASE_URL: {
    name: 'IMAGES_OPENAI_API_BASE_URL',
    type: 'string',
    'ui:title': 'Images Openai Api Base Url',
    'ui:description': 'Sets the OpenAI-compatible base URL to use for DALL-E image generation.',
    'ui:help':
      'Feature 40: Image Generation with openai dalle This field has 2 conditional requirements. Environment variable: IMAGES_OPENAI_API_BASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Image Generation - OpenAI DALL-E',
    'ui:order': 265,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 40: Image Generation with openai dalle',
      envVar: 'IMAGES_OPENAI_API_BASE_URL',
      persistentConfig: true,
    },
  },
  IMAGES_OPENAI_API_KEY: {
    name: 'IMAGES_OPENAI_API_KEY',
    type: 'string',
    'ui:title': 'Images Openai Api Key',
    'ui:description': 'Sets the API key to use for DALL-E image generation.',
    'ui:help':
      'Feature 40: Image Generation with openai dalle This field has 2 conditional requirements. Environment variable: IMAGES_OPENAI_API_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Image Generation - OpenAI DALL-E',
    'ui:order': 266,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
        {
          field: 'IMAGE_GENERATION_ENGINE',
          operator: 'equals',
          value: 'openai',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 40: Image Generation with openai dalle',
      envVar: 'IMAGES_OPENAI_API_KEY',
      persistentConfig: true,
    },
  },
  ENABLE_OAUTH_SIGNUP: {
    name: 'ENABLE_OAUTH_SIGNUP',
    type: 'boolean',
    'ui:title': 'Enable Oauth Signup',
    'ui:description':
      'Enables account creation when signing up via OAuth. Distinct from `ENABLE_SIGNUP`.',
    'ui:help': 'Environment variable: ENABLE_OAUTH_SIGNUP',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth',
    'ui:order': 267,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'ENABLE_OAUTH_SIGNUP',
      persistentConfig: true,
    },
  },
  OAUTH_MERGE_ACCOUNTS_BY_EMAIL: {
    name: 'OAUTH_MERGE_ACCOUNTS_BY_EMAIL',
    type: 'boolean',
    'ui:title': 'Oauth Merge Accounts By Email',
    'ui:description':
      'If enabled, merges OAuth accounts with existing accounts using the same email',
    'ui:help':
      'This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_MERGE_ACCOUNTS_BY_EMAIL',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth',
    'ui:order': 268,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'OAUTH_MERGE_ACCOUNTS_BY_EMAIL',
      persistentConfig: true,
    },
  },
  OAUTH_UPDATE_PICTURE_ON_LOGIN: {
    name: 'OAUTH_UPDATE_PICTURE_ON_LOGIN',
    type: 'boolean',
    'ui:title': 'Oauth Update Picture On Login',
    'ui:description':
      'If enabled, updates the local user profile picture with the OAuth-provided picture on login.',
    'ui:help':
      'This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_UPDATE_PICTURE_ON_LOGIN',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth',
    'ui:order': 269,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'OAUTH_UPDATE_PICTURE_ON_LOGIN',
      persistentConfig: true,
    },
  },
  WEBUI_AUTH_TRUSTED_EMAIL_HEADER: {
    name: 'WEBUI_AUTH_TRUSTED_EMAIL_HEADER',
    type: 'string',
    'ui:title': 'Webui Auth Trusted Email Header',
    'ui:description':
      'Defines the trusted request header for authentication. See [SSO docs](/features/sso).',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: WEBUI_AUTH_TRUSTED_EMAIL_HEADER',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth',
    'ui:order': 270,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'WEBUI_AUTH_TRUSTED_EMAIL_HEADER',
      persistentConfig: false,
    },
  },
  WEBUI_AUTH_TRUSTED_NAME_HEADER: {
    name: 'WEBUI_AUTH_TRUSTED_NAME_HEADER',
    type: 'string',
    'ui:title': 'Webui Auth Trusted Name Header',
    'ui:description':
      'Defines the trusted request header for the username of anyone registering with the',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: WEBUI_AUTH_TRUSTED_NAME_HEADER',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth',
    'ui:order': 271,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'WEBUI_AUTH_TRUSTED_NAME_HEADER',
      persistentConfig: false,
    },
  },
  GOOGLE_CLIENT_ID: {
    name: 'GOOGLE_CLIENT_ID',
    type: 'string',
    'ui:title': 'Google Client Id',
    'ui:description': 'Sets the client ID for Google OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: GOOGLE_CLIENT_ID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - Google',
    'ui:order': 272,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'GOOGLE_CLIENT_ID',
      persistentConfig: true,
    },
  },
  GOOGLE_CLIENT_SECRET: {
    name: 'GOOGLE_CLIENT_SECRET',
    type: 'string',
    'ui:title': 'Google Client Secret',
    'ui:description': 'Sets the client secret for Google OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: GOOGLE_CLIENT_SECRET',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'OAuth - Google',
    'ui:order': 273,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'GOOGLE_CLIENT_SECRET',
      persistentConfig: true,
    },
  },
  GOOGLE_OAUTH_SCOPE: {
    name: 'GOOGLE_OAUTH_SCOPE',
    type: 'string',
    'ui:title': 'Google Oauth Scope',
    'ui:description': 'Sets the scope for Google OAuth authentication.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: GOOGLE_OAUTH_SCOPE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - Google',
    'ui:order': 274,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'GOOGLE_OAUTH_SCOPE',
      persistentConfig: true,
    },
  },
  GOOGLE_REDIRECT_URI: {
    name: 'GOOGLE_REDIRECT_URI',
    type: 'string',
    'ui:title': 'Google Redirect Uri',
    'ui:description': 'Sets the redirect URI for Google OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: GOOGLE_REDIRECT_URI',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - Google',
    'ui:order': 275,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'GOOGLE_REDIRECT_URI',
      persistentConfig: true,
    },
  },
  MICROSOFT_CLIENT_ID: {
    name: 'MICROSOFT_CLIENT_ID',
    type: 'string',
    'ui:title': 'Microsoft Client Id',
    'ui:description': 'Sets the client ID for Microsoft OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: MICROSOFT_CLIENT_ID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - Microsoft',
    'ui:order': 276,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'MICROSOFT_CLIENT_ID',
      persistentConfig: true,
    },
  },
  MICROSOFT_CLIENT_SECRET: {
    name: 'MICROSOFT_CLIENT_SECRET',
    type: 'string',
    'ui:title': 'Microsoft Client Secret',
    'ui:description': 'Sets the client secret for Microsoft OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: MICROSOFT_CLIENT_SECRET',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'OAuth - Microsoft',
    'ui:order': 277,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'MICROSOFT_CLIENT_SECRET',
      persistentConfig: true,
    },
  },
  MICROSOFT_CLIENT_TENANT_ID: {
    name: 'MICROSOFT_CLIENT_TENANT_ID',
    type: 'string',
    'ui:title': 'Microsoft Client Tenant Id',
    'ui:description': 'Sets the tenant ID for Microsoft OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: MICROSOFT_CLIENT_TENANT_ID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - Microsoft',
    'ui:order': 278,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'MICROSOFT_CLIENT_TENANT_ID',
      persistentConfig: true,
    },
  },
  MICROSOFT_OAUTH_SCOPE: {
    name: 'MICROSOFT_OAUTH_SCOPE',
    type: 'string',
    'ui:title': 'Microsoft Oauth Scope',
    'ui:description': 'Sets the scope for Microsoft OAuth authentication.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: MICROSOFT_OAUTH_SCOPE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - Microsoft',
    'ui:order': 279,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'MICROSOFT_OAUTH_SCOPE',
      persistentConfig: true,
    },
  },
  MICROSOFT_REDIRECT_URI: {
    name: 'MICROSOFT_REDIRECT_URI',
    type: 'string',
    'ui:title': 'Microsoft Redirect Uri',
    'ui:description': 'Sets the redirect URI for Microsoft OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: MICROSOFT_REDIRECT_URI',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - Microsoft',
    'ui:order': 280,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'MICROSOFT_REDIRECT_URI',
      persistentConfig: true,
    },
  },
  GITHUB_CLIENT_ID: {
    name: 'GITHUB_CLIENT_ID',
    type: 'string',
    'ui:title': 'Github Client Id',
    'ui:description': 'Sets the client ID for GitHub OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: GITHUB_CLIENT_ID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - GitHub',
    'ui:order': 281,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'GITHUB_CLIENT_ID',
      persistentConfig: true,
    },
  },
  GITHUB_CLIENT_SECRET: {
    name: 'GITHUB_CLIENT_SECRET',
    type: 'string',
    'ui:title': 'Github Client Secret',
    'ui:description': 'Sets the client secret for GitHub OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: GITHUB_CLIENT_SECRET',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'OAuth - GitHub',
    'ui:order': 282,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'GITHUB_CLIENT_SECRET',
      persistentConfig: true,
    },
  },
  GITHUB_CLIENT_SCOPE: {
    name: 'GITHUB_CLIENT_SCOPE',
    type: 'string',
    'ui:title': 'Github Client Scope',
    'ui:description': 'Specifies the scope for GitHub OAuth authentication.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: GITHUB_CLIENT_SCOPE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - GitHub',
    'ui:order': 283,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'GITHUB_CLIENT_SCOPE',
      persistentConfig: true,
    },
  },
  GITHUB_CLIENT_REDIRECT_URI: {
    name: 'GITHUB_CLIENT_REDIRECT_URI',
    type: 'string',
    'ui:title': 'Github Client Redirect Uri',
    'ui:description': 'Sets the redirect URI for GitHub OAuth.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: GITHUB_CLIENT_REDIRECT_URI',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - GitHub',
    'ui:order': 284,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'GITHUB_CLIENT_REDIRECT_URI',
      persistentConfig: true,
    },
  },
  OAUTH_CLIENT_ID: {
    name: 'OAUTH_CLIENT_ID',
    type: 'string',
    'ui:title': 'Oauth Client Id',
    'ui:description': 'Sets the client ID for OIDC.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_CLIENT_ID',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 285,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_CLIENT_ID',
      persistentConfig: true,
    },
  },
  OAUTH_CLIENT_SECRET: {
    name: 'OAUTH_CLIENT_SECRET',
    type: 'string',
    'ui:title': 'Oauth Client Secret',
    'ui:description': 'Sets the client secret for OIDC.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_CLIENT_SECRET',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 286,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_CLIENT_SECRET',
      persistentConfig: true,
    },
  },
  OPENID_PROVIDER_URL: {
    name: 'OPENID_PROVIDER_URL',
    type: 'string',
    'ui:title': 'Openid Provider Url',
    'ui:description': 'Path to the `.well-known/openid-configuration` endpoint',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OPENID_PROVIDER_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 287,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OPENID_PROVIDER_URL',
      persistentConfig: true,
    },
  },
  OPENID_REDIRECT_URI: {
    name: 'OPENID_REDIRECT_URI',
    type: 'string',
    'ui:title': 'Openid Redirect Uri',
    'ui:description': 'Sets the redirect URI for OIDC',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OPENID_REDIRECT_URI',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 288,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OPENID_REDIRECT_URI',
      persistentConfig: true,
    },
  },
  OAUTH_SCOPES: {
    name: 'OAUTH_SCOPES',
    type: 'string',
    'ui:title': 'Oauth Scopes',
    'ui:description': 'Sets the scope for OIDC authentication. `openid` and `email` are required.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_SCOPES',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 289,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_SCOPES',
      persistentConfig: true,
    },
  },
  OAUTH_CODE_CHALLENGE_METHOD: {
    name: 'OAUTH_CODE_CHALLENGE_METHOD',
    type: 'string',
    'ui:title': 'Oauth Code Challenge Method',
    'ui:description': 'Specifies the code challenge method for OAuth authentication.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_CODE_CHALLENGE_METHOD',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 290,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_CODE_CHALLENGE_METHOD',
      persistentConfig: true,
    },
  },
  OAUTH_PROVIDER_NAME: {
    name: 'OAUTH_PROVIDER_NAME',
    type: 'string',
    'ui:title': 'Oauth Provider Name',
    'ui:description': 'Sets the name for the OIDC provider.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_PROVIDER_NAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 291,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_PROVIDER_NAME',
      persistentConfig: true,
    },
  },
  OAUTH_USERNAME_CLAIM: {
    name: 'OAUTH_USERNAME_CLAIM',
    type: 'string',
    'ui:title': 'Oauth Username Claim',
    'ui:description': 'Set username claim for OpenID.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_USERNAME_CLAIM',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 292,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_USERNAME_CLAIM',
      persistentConfig: true,
    },
  },
  OAUTH_EMAIL_CLAIM: {
    name: 'OAUTH_EMAIL_CLAIM',
    type: 'string',
    'ui:title': 'Oauth Email Claim',
    'ui:description': 'Set email claim for OpenID.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_EMAIL_CLAIM',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 293,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_EMAIL_CLAIM',
      persistentConfig: true,
    },
  },
  OAUTH_PICTURE_CLAIM: {
    name: 'OAUTH_PICTURE_CLAIM',
    type: 'string',
    'ui:title': 'Oauth Picture Claim',
    'ui:description': 'Set picture (avatar) claim for OpenID.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_SIGNUP is set to "true". Environment variable: OAUTH_PICTURE_CLAIM',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 294,
    'ui:condition': {
      field: 'ENABLE_OAUTH_SIGNUP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_PICTURE_CLAIM',
      persistentConfig: true,
    },
  },
  OAUTH_GROUP_CLAIM: {
    name: 'OAUTH_GROUP_CLAIM',
    type: 'string',
    'ui:title': 'Oauth Group Claim',
    'ui:description': 'Specifies the group claim for OAuth authentication.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_GROUP_MANAGEMENT is set to "true". Environment variable: OAUTH_GROUP_CLAIM',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 295,
    'ui:condition': {
      field: 'ENABLE_OAUTH_GROUP_MANAGEMENT',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_GROUP_CLAIM',
      persistentConfig: true,
    },
  },
  ENABLE_OAUTH_ROLE_MANAGEMENT: {
    name: 'ENABLE_OAUTH_ROLE_MANAGEMENT',
    type: 'boolean',
    'ui:title': 'Enable Oauth Role Management',
    'ui:description': 'Enables role management for OAuth delegation.',
    'ui:help': 'empty, disabled Environment variable: ENABLE_OAUTH_ROLE_MANAGEMENT',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 296,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'ENABLE_OAUTH_ROLE_MANAGEMENT',
      persistentConfig: true,
    },
  },
  ENABLE_OAUTH_GROUP_MANAGEMENT: {
    name: 'ENABLE_OAUTH_GROUP_MANAGEMENT',
    type: 'boolean',
    'ui:title': 'Enable Oauth Group Management',
    'ui:description': 'Enables or disables OAuth group management.',
    'ui:help': 'empty, disabled Environment variable: ENABLE_OAUTH_GROUP_MANAGEMENT',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 297,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'ENABLE_OAUTH_GROUP_MANAGEMENT',
      persistentConfig: true,
    },
  },
  OAUTH_ROLES_CLAIM: {
    name: 'OAUTH_ROLES_CLAIM',
    type: 'string',
    'ui:title': 'Oauth Roles Claim',
    'ui:description': 'Sets the roles claim to look for in the OIDC token.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_ROLE_MANAGEMENT is set to "true". Environment variable: OAUTH_ROLES_CLAIM',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 298,
    'ui:condition': {
      field: 'ENABLE_OAUTH_ROLE_MANAGEMENT',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_ROLES_CLAIM',
      persistentConfig: true,
    },
  },
  OAUTH_ALLOWED_ROLES: {
    name: 'OAUTH_ALLOWED_ROLES',
    type: 'string',
    'ui:title': 'Oauth Allowed Roles',
    'ui:description': 'Sets the roles that are allowed access to the platform.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_ROLE_MANAGEMENT is set to "true". Environment variable: OAUTH_ALLOWED_ROLES',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 299,
    'ui:condition': {
      field: 'ENABLE_OAUTH_ROLE_MANAGEMENT',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_ALLOWED_ROLES',
      persistentConfig: true,
    },
  },
  OAUTH_ADMIN_ROLES: {
    name: 'OAUTH_ADMIN_ROLES',
    type: 'string',
    'ui:title': 'Oauth Admin Roles',
    'ui:description': 'Sets the roles that are considered administrators.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_ROLE_MANAGEMENT is set to "true". Environment variable: OAUTH_ADMIN_ROLES',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 300,
    'ui:condition': {
      field: 'ENABLE_OAUTH_ROLE_MANAGEMENT',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_ADMIN_ROLES',
      persistentConfig: true,
    },
  },
} as const;

const fieldConfigurationsPart7 = {
  OAUTH_ALLOWED_DOMAINS: {
    name: 'OAUTH_ALLOWED_DOMAINS',
    type: 'string',
    'ui:title': 'Oauth Allowed Domains',
    'ui:description':
      'Specifies the allowed domains for OAuth authentication. (e.g. "example1.com,example2.com").',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_OAUTH_GROUP_MANAGEMENT is set to "true". Environment variable: OAUTH_ALLOWED_DOMAINS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'OAuth - OpenID (OIDC)',
    'ui:order': 301,
    'ui:condition': {
      field: 'ENABLE_OAUTH_GROUP_MANAGEMENT',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'OAUTH_ALLOWED_DOMAINS',
      persistentConfig: true,
    },
  },
  ENABLE_LDAP: {
    name: 'ENABLE_LDAP',
    type: 'boolean',
    'ui:title': 'Enable Ldap',
    'ui:description': 'Enables or disables LDAP authentication.',
    'ui:help': 'empty, disabled Environment variable: ENABLE_LDAP',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 302,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'ENABLE_LDAP',
      persistentConfig: true,
    },
  },
  LDAP_SERVER_LABEL: {
    name: 'LDAP_SERVER_LABEL',
    type: 'string',
    'ui:title': 'Ldap Server Label',
    'ui:description': 'Sets the label of the LDAP server.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_SERVER_LABEL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 303,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_SERVER_LABEL',
      persistentConfig: true,
    },
  },
  LDAP_SERVER_HOST: {
    name: 'LDAP_SERVER_HOST',
    type: 'string',
    'ui:title': 'Ldap Server Host',
    'ui:description': 'Sets the hostname of the LDAP server.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_SERVER_HOST',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 304,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_SERVER_HOST',
      persistentConfig: true,
    },
  },
  LDAP_SERVER_PORT: {
    name: 'LDAP_SERVER_PORT',
    type: 'integer',
    'ui:title': 'Ldap Server Port',
    'ui:description': 'Sets the port number of the LDAP server.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_SERVER_PORT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 305,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_SERVER_PORT',
      persistentConfig: true,
    },
  },
  LDAP_ATTRIBUTE_FOR_MAIL: {
    name: 'LDAP_ATTRIBUTE_FOR_MAIL',
    type: 'string',
    'ui:title': 'Ldap Attribute For Mail',
    'ui:description': 'Sets the attribute to use as mail for LDAP authentication.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_ATTRIBUTE_FOR_MAIL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 306,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_ATTRIBUTE_FOR_MAIL',
      persistentConfig: true,
    },
  },
  LDAP_ATTRIBUTE_FOR_USERNAME: {
    name: 'LDAP_ATTRIBUTE_FOR_USERNAME',
    type: 'string',
    'ui:title': 'Ldap Attribute For Username',
    'ui:description': 'Sets the attribute to use as a username for LDAP authentication.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_ATTRIBUTE_FOR_USERNAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 307,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_ATTRIBUTE_FOR_USERNAME',
      persistentConfig: true,
    },
  },
  LDAP_APP_DN: {
    name: 'LDAP_APP_DN',
    type: 'string',
    'ui:title': 'Ldap App Dn',
    'ui:description': 'Sets the distinguished name for the LDAP application.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_APP_DN',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 308,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_APP_DN',
      persistentConfig: true,
    },
  },
  LDAP_APP_PASSWORD: {
    name: 'LDAP_APP_PASSWORD',
    type: 'string',
    'ui:title': 'Ldap App Password',
    'ui:description': 'Sets the password for the LDAP application.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_APP_PASSWORD',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'LDAP',
    'ui:order': 309,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_APP_PASSWORD',
      persistentConfig: true,
    },
  },
  LDAP_SEARCH_BASE: {
    name: 'LDAP_SEARCH_BASE',
    type: 'string',
    'ui:title': 'Ldap Search Base',
    'ui:description': 'Sets the base to search for LDAP authentication.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_SEARCH_BASE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 310,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_SEARCH_BASE',
      persistentConfig: true,
    },
  },
  LDAP_SEARCH_FILTER: {
    name: 'LDAP_SEARCH_FILTER',
    type: 'string',
    'ui:title': 'Ldap Search Filter',
    'ui:description':
      'Sets a single filter to use for LDAP search. Alternative to `LDAP_SEARCH_FILTERS`.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_SEARCH_FILTER',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 311,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_SEARCH_FILTER',
      persistentConfig: true,
    },
  },
  LDAP_SEARCH_FILTERS: {
    name: 'LDAP_SEARCH_FILTERS',
    type: 'string',
    'ui:title': 'Ldap Search Filters',
    'ui:description': 'Sets the filter to use for LDAP search.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_SEARCH_FILTERS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 312,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_SEARCH_FILTERS',
      persistentConfig: true,
    },
  },
  LDAP_USE_TLS: {
    name: 'LDAP_USE_TLS',
    type: 'boolean',
    'ui:title': 'Ldap Use Tls',
    'ui:description': 'Enables or disables TLS for LDAP connection.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_USE_TLS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 313,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_USE_TLS',
      persistentConfig: true,
    },
  },
  LDAP_CA_CERT_FILE: {
    name: 'LDAP_CA_CERT_FILE',
    type: 'string',
    'ui:title': 'Ldap Ca Cert File',
    'ui:description': 'Sets the path to the LDAP CA certificate file.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_CA_CERT_FILE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 314,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_CA_CERT_FILE',
      persistentConfig: true,
    },
  },
  LDAP_VALIDATE_CERT: {
    name: 'LDAP_VALIDATE_CERT',
    type: 'boolean',
    'ui:title': 'Ldap Validate Cert',
    'ui:description': 'Sets whether to validate the LDAP CA certificate.',
    'ui:help':
      'This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_VALIDATE_CERT',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'toggle-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 315,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'LDAP_VALIDATE_CERT',
      persistentConfig: true,
    },
  },
  LDAP_CIPHERS: {
    name: 'LDAP_CIPHERS',
    type: 'string',
    'ui:title': 'Ldap Ciphers',
    'ui:description': 'Sets the ciphers to use for LDAP connection.',
    'ui:help':
      'empty, disabled This field is shown when ENABLE_LDAP is set to "true". Environment variable: LDAP_CIPHERS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'LDAP',
    'ui:order': 316,
    'ui:condition': {
      field: 'ENABLE_LDAP',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'empty, disabled',
      envVar: 'LDAP_CIPHERS',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_CONTROLS: {
    name: 'USER_PERMISSIONS_CHAT_CONTROLS',
    type: 'boolean',
    'ui:title': 'User Permissions Chat Controls',
    'ui:description': 'Enables or disables user permission to access chat controls.',
    'ui:help': 'Environment variable: USER_PERMISSIONS_CHAT_CONTROLS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 317,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_CHAT_CONTROLS',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_FILE_UPLOAD: {
    name: 'USER_PERMISSIONS_CHAT_FILE_UPLOAD',
    type: 'boolean',
    'ui:title': 'User Permissions Chat File Upload',
    'ui:description': 'Enables or disables user permission to upload files to chats.',
    'ui:help':
      'feature 3: S3 storage provision Environment variable: USER_PERMISSIONS_CHAT_FILE_UPLOAD',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 318,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'feature 3: S3 storage provision',
      envVar: 'USER_PERMISSIONS_CHAT_FILE_UPLOAD',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_DELETE: {
    name: 'USER_PERMISSIONS_CHAT_DELETE',
    type: 'boolean',
    'ui:title': 'User Permissions Chat Delete',
    'ui:description': 'Enables or disables user permission to delete chats.',
    'ui:help': 'Environment variable: USER_PERMISSIONS_CHAT_DELETE',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 319,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_CHAT_DELETE',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_EDIT: {
    name: 'USER_PERMISSIONS_CHAT_EDIT',
    type: 'boolean',
    'ui:title': 'User Permissions Chat Edit',
    'ui:description': 'Enables or disables user permission to edit chats.',
    'ui:help': 'Environment variable: USER_PERMISSIONS_CHAT_EDIT',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 320,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_CHAT_EDIT',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_STT: {
    name: 'USER_PERMISSIONS_CHAT_STT',
    type: 'boolean',
    'ui:title': 'User Permissions Chat Stt',
    'ui:description': 'Enables or disables user permission to use Speech-to-Text in chats.',
    'ui:help': 'feature SST Environment variable: USER_PERMISSIONS_CHAT_STT',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 321,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'feature SST',
      envVar: 'USER_PERMISSIONS_CHAT_STT',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_TTS: {
    name: 'USER_PERMISSIONS_CHAT_TTS',
    type: 'boolean',
    'ui:title': 'User Permissions Chat Tts',
    'ui:description': 'Enables or disables user permission to use Text-to-Speech in chats.',
    'ui:help': 'feature TTS Environment variable: USER_PERMISSIONS_CHAT_TTS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 322,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'feature TTS',
      envVar: 'USER_PERMISSIONS_CHAT_TTS',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_CALL: {
    name: 'USER_PERMISSIONS_CHAT_CALL',
    type: 'string',
    'ui:title': 'User Permissions Chat Call',
    'ui:description': 'Enables or disables user permission to make calls in chats.',
    'ui:help': 'what do they mean by chat? Environment variable: USER_PERMISSIONS_CHAT_CALL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 323,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'what do they mean by chat?',
      envVar: 'USER_PERMISSIONS_CHAT_CALL',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_MULTIPLE_MODELS: {
    name: 'USER_PERMISSIONS_CHAT_MULTIPLE_MODELS',
    type: 'string',
    'ui:title': 'User Permissions Chat Multiple Models',
    'ui:description': 'Enables or disables user permission to use multiple models in chats.',
    'ui:help': 'Environment variable: USER_PERMISSIONS_CHAT_MULTIPLE_MODELS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 324,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_CHAT_MULTIPLE_MODELS',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_TEMPORARY: {
    name: 'USER_PERMISSIONS_CHAT_TEMPORARY',
    type: 'boolean',
    'ui:title': 'User Permissions Chat Temporary',
    'ui:description': 'Enables or disables user permission to create temporary chats.',
    'ui:help':
      'admin may want to disable this? Environment variable: USER_PERMISSIONS_CHAT_TEMPORARY',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 325,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'admin may want to disable this?',
      envVar: 'USER_PERMISSIONS_CHAT_TEMPORARY',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED: {
    name: 'USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED',
    type: 'string',
    'ui:title': 'User Permissions Chat Temporary Enforced',
    'ui:description': 'Enables or disables enforced temporary chats for users.',
    'ui:help':
      'This field is shown when USER_PERMISSIONS_CHAT_TEMPORARY is set to "true". Environment variable: USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Chat Permissions',
    'ui:order': 326,
    'ui:condition': {
      field: 'USER_PERMISSIONS_CHAT_TEMPORARY',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS: {
    name: 'USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS',
    type: 'string',
    'ui:title': 'User Permissions Features Direct Tool Servers',
    'ui:description': 'Enables or disables user permission to access direct tool servers.',
    'ui:help':
      'will change when we add tools Environment variable: USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Feature Permissions',
    'ui:order': 327,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'will change when we add tools',
      envVar: 'USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_FEATURES_WEB_SEARCH: {
    name: 'USER_PERMISSIONS_FEATURES_WEB_SEARCH',
    type: 'string',
    'ui:title': 'User Permissions Features Web Search',
    'ui:description': 'Enables or disables user permission to use the web search feature.',
    'ui:help':
      'change when adding websearch Environment variable: USER_PERMISSIONS_FEATURES_WEB_SEARCH',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Feature Permissions',
    'ui:order': 328,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'change when adding websearch',
      envVar: 'USER_PERMISSIONS_FEATURES_WEB_SEARCH',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_FEATURES_IMAGE_GENERATION: {
    name: 'USER_PERMISSIONS_FEATURES_IMAGE_GENERATION',
    type: 'string',
    'ui:title': 'User Permissions Features Image Generation',
    'ui:description': 'Enables or disables user permission to use the image generation feature.',
    'ui:help':
      'change when adding image gen Environment variable: USER_PERMISSIONS_FEATURES_IMAGE_GENERATION',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Feature Permissions',
    'ui:order': 329,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'change when adding image gen',
      envVar: 'USER_PERMISSIONS_FEATURES_IMAGE_GENERATION',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_FEATURES_CODE_INTERPRETER: {
    name: 'USER_PERMISSIONS_FEATURES_CODE_INTERPRETER',
    type: 'string',
    'ui:title': 'User Permissions Features Code Interpreter',
    'ui:description': 'Enables or disables user permission to use code interpreter feature.',
    'ui:help':
      'enabled by default because seemingly built in Environment variable: USER_PERMISSIONS_FEATURES_CODE_INTERPRETER',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Feature Permissions',
    'ui:order': 330,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'enabled by default because seemingly built in',
      envVar: 'USER_PERMISSIONS_FEATURES_CODE_INTERPRETER',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS: {
    name: 'USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS',
    type: 'boolean',
    'ui:title': 'User Permissions Workspace Models Access',
    'ui:description': 'Enables or disables user permission to access workspace models.',
    'ui:help': 'Environment variable: USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Workspace Permissions',
    'ui:order': 331,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS: {
    name: 'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS',
    type: 'boolean',
    'ui:title': 'User Permissions Workspace Knowledge Access',
    'ui:description': 'Enables or disables user permission to access workspace knowledge.',
    'ui:help': 'Environment variable: USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Workspace Permissions',
    'ui:order': 332,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS: {
    name: 'USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS',
    type: 'boolean',
    'ui:title': 'User Permissions Workspace Prompts Access',
    'ui:description': 'Enables or disables user permission to access workspace prompts.',
    'ui:help': 'Environment variable: USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Workspace Permissions',
    'ui:order': 333,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS: {
    name: 'USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS',
    type: 'boolean',
    'ui:title': 'User Permissions Workspace Tools Access',
    'ui:description': 'Enables or disables user permission to access workspace tools.',
    'ui:help': 'Environment variable: USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Workspace Permissions',
    'ui:order': 334,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING: {
    name: 'USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING',
    type: 'string',
    'ui:title': 'User Permissions Workspace Models Allow Public Sharing',
    'ui:description': 'Enables or disables public sharing of workspace models.',
    'ui:help':
      'This field is shown when USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS is set to "false". Environment variable: USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Workspace Permissions',
    'ui:order': 335,
    'ui:condition': {
      field: 'USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS',
      operator: 'equals',
      value: false,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING: {
    name: 'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING',
    type: 'string',
    'ui:title': 'User Permissions Workspace Knowledge Allow Public Sharing',
    'ui:description': 'Enables or disables public sharing of workspace knowledge.',
    'ui:help':
      'This field is shown when USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS is set to "false". Environment variable: USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Workspace Permissions',
    'ui:order': 336,
    'ui:condition': {
      field: 'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS',
      operator: 'equals',
      value: false,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING: {
    name: 'USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING',
    type: 'string',
    'ui:title': 'User Permissions Workspace Prompts Allow Public Sharing',
    'ui:description': 'Enables or disables public sharing of workspace prompts.',
    'ui:help':
      'This field is shown when USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS is set to "false". Environment variable: USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Workspace Permissions',
    'ui:order': 337,
    'ui:condition': {
      field: 'USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS',
      operator: 'equals',
      value: false,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING',
      persistentConfig: true,
    },
  },
  USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING: {
    name: 'USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING',
    type: 'string',
    'ui:title': 'User Permissions Workspace Tools Allow Public Sharing',
    'ui:description': 'Enables or disables public sharing of workspace tools.',
    'ui:help':
      'This field is shown when USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS is set to "false". Environment variable: USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'User Permissions - Workspace Permissions',
    'ui:order': 338,
    'ui:condition': {
      field: 'USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS',
      operator: 'equals',
      value: false,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      envVar: 'USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING',
      persistentConfig: true,
    },
  },
  STORAGE_PROVIDER: {
    name: 'STORAGE_PROVIDER',
    type: 'string',
    'ui:title': 'Storage Provider',
    'ui:description':
      'Sets the storage provider.\n\nOptions:\n  - `s3` - uses the S3 client library and related environment variables mentioned in [Amazon S3 Storage](#amazon-s3-storage)\n  - `gcs` - uses the GCS client library and related environment variables mentioned in [Google Cloud Storage](#google-cloud-storage)\n  - `azure` - uses the Azure client library and related environment variables mentioned in [Microsoft Azure Storage](#microsoft-azure-storage)\n',
    'ui:help': 'Feature 3: S3 buckets storage Environment variable: STORAGE_PROVIDER',
    'ui:widget': 'RadioWidget',
    'ui:options': {
      enumOptions: [
        {
          value: 's3',
          label: 'S3',
        },
        {
          value: 'gcs',
          label: 'Gcs',
        },
        {
          value: 'azure',
          label: 'Azure',
        },
      ],
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 339,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 3: S3 buckets storage',
      envVar: 'STORAGE_PROVIDER',
      persistentConfig: false,
    },
  },
  S3_ACCESS_KEY_ID: {
    name: 'S3_ACCESS_KEY_ID',
    type: 'string',
    'ui:title': 'S3 Access Key Id',
    'ui:description': 'Sets the access key ID for S3 storage.',
    'ui:help':
      'Feature 3: S3 buckets storage This field has 2 conditional requirements. Environment variable: S3_ACCESS_KEY_ID',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 340,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 3: S3 buckets storage',
      envVar: 'S3_ACCESS_KEY_ID',
      persistentConfig: false,
    },
  },
  S3_ADDRESSING_STYLE: {
    name: 'S3_ADDRESSING_STYLE',
    type: 'string',
    'ui:title': 'S3 Addressing Style',
    'ui:description':
      "Specifies the addressing style to use for S3 storage (e.g., 'path', 'virtual').",
    'ui:help':
      'Feature 3: S3 buckets storage This field has 2 conditional requirements. Environment variable: S3_ADDRESSING_STYLE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 341,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 3: S3 buckets storage',
      envVar: 'S3_ADDRESSING_STYLE',
      persistentConfig: false,
    },
  },
  S3_BUCKET_NAME: {
    name: 'S3_BUCKET_NAME',
    type: 'string',
    'ui:title': 'S3 Bucket Name',
    'ui:description': 'Sets the bucket name for S3 storage.',
    'ui:help':
      'Feature 3: S3 buckets storage This field has 2 conditional requirements. Environment variable: S3_BUCKET_NAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 342,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 3: S3 buckets storage',
      envVar: 'S3_BUCKET_NAME',
      persistentConfig: false,
    },
  },
  S3_ENDPOINT_URL: {
    name: 'S3_ENDPOINT_URL',
    type: 'string',
    'ui:title': 'S3 Endpoint Url',
    'ui:description': 'Sets the endpoint URL for S3 storage.',
    'ui:help':
      'Feature 3: S3 buckets storage This field has 2 conditional requirements. Environment variable: S3_ENDPOINT_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 343,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 3: S3 buckets storage',
      envVar: 'S3_ENDPOINT_URL',
      persistentConfig: false,
    },
  },
  S3_KEY_PREFIX: {
    name: 'S3_KEY_PREFIX',
    type: 'string',
    'ui:title': 'S3 Key Prefix',
    'ui:description': 'Sets the key prefix for a S3 object.',
    'ui:help':
      'Feature 3: S3 buckets storage This field has 2 conditional requirements. Environment variable: S3_KEY_PREFIX',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 344,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 3: S3 buckets storage',
      envVar: 'S3_KEY_PREFIX',
      persistentConfig: false,
    },
  },
  S3_REGION_NAME: {
    name: 'S3_REGION_NAME',
    type: 'string',
    'ui:title': 'S3 Region Name',
    'ui:description': 'Sets the region name for S3 storage.',
    'ui:help':
      'Feature 3: S3 buckets storage This field has 2 conditional requirements. Environment variable: S3_REGION_NAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 345,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 3: S3 buckets storage',
      envVar: 'S3_REGION_NAME',
      persistentConfig: false,
    },
  },
  S3_SECRET_ACCESS_KEY: {
    name: 'S3_SECRET_ACCESS_KEY',
    type: 'string',
    'ui:title': 'S3 Secret Access Key',
    'ui:description': 'Sets the secret access key for S3 storage.',
    'ui:help':
      'Feature 3: S3 buckets storage This field has 2 conditional requirements. Environment variable: S3_SECRET_ACCESS_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 346,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 3: S3 buckets storage',
      envVar: 'S3_SECRET_ACCESS_KEY',
      persistentConfig: false,
    },
  },
  S3_USE_ACCELERATE_ENDPOINT: {
    name: 'S3_USE_ACCELERATE_ENDPOINT',
    type: 'string',
    'ui:title': 'S3 Use Accelerate Endpoint',
    'ui:description': 'Specifies whether to use the accelerated endpoint for S3 storage.',
    'ui:help':
      'Feature 3: S3 buckets storage This field has 2 conditional requirements. Environment variable: S3_USE_ACCELERATE_ENDPOINT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 347,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 3: S3 buckets storage',
      envVar: 'S3_USE_ACCELERATE_ENDPOINT',
      persistentConfig: false,
    },
  },
  S3_ENABLE_TAGGING: {
    name: 'S3_ENABLE_TAGGING',
    type: 'string',
    'ui:title': 'S3 Enable Tagging',
    'ui:description':
      'Enables S3 object tagging after uploads for better organization, searching, and integration with file management policies. Always set to `False` when using Cloudflare R2, as R2 does not support object tagging.',
    'ui:help': 'This field has 2 conditional requirements. Environment variable: S3_ENABLE_TAGGING',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 348,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 's3',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      envVar: 'S3_ENABLE_TAGGING',
      persistentConfig: false,
    },
  },
  GOOGLE_APPLICATION_CREDENTIALS_JSON: {
    name: 'GOOGLE_APPLICATION_CREDENTIALS_JSON',
    type: 'string',
    'ui:title': 'Google Application Credentials Json',
    'ui:description': 'Contents of Google Application Credentials JSON file.',
    'ui:help':
      'Feature 4: google storage buckets This field has 2 conditional requirements. Environment variable: GOOGLE_APPLICATION_CREDENTIALS_JSON',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 349,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'gcs',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'gcs',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 4: google storage buckets',
      envVar: 'GOOGLE_APPLICATION_CREDENTIALS_JSON',
      persistentConfig: false,
    },
  },
  GCS_BUCKET_NAME: {
    name: 'GCS_BUCKET_NAME',
    type: 'string',
    'ui:title': 'Gcs Bucket Name',
    'ui:description': 'Sets the bucket name for Google Cloud Storage. Bucket must already exist.',
    'ui:help':
      'Feature 4: google storage buckets This field has 2 conditional requirements. Environment variable: GCS_BUCKET_NAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 350,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'gcs',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'gcs',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 4: google storage buckets',
      envVar: 'GCS_BUCKET_NAME',
      persistentConfig: false,
    },
  },
} as const;

const fieldConfigurationsPart8 = {
  AZURE_STORAGE_ENDPOINT: {
    name: 'AZURE_STORAGE_ENDPOINT',
    type: 'string',
    'ui:title': 'Azure Storage Endpoint',
    'ui:description': 'Sets the endpoint URL for Azure Storage.',
    'ui:help':
      'Feature 5: azure storage  This field has 2 conditional requirements. Environment variable: AZURE_STORAGE_ENDPOINT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 351,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'azure',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'azure',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 5: azure storage ',
      envVar: 'AZURE_STORAGE_ENDPOINT',
      persistentConfig: false,
    },
  },
  AZURE_STORAGE_CONTAINER_NAME: {
    name: 'AZURE_STORAGE_CONTAINER_NAME',
    type: 'string',
    'ui:title': 'Azure Storage Container Name',
    'ui:description': 'Sets the container name for Azure Storage.',
    'ui:help':
      'Feature 5: azure storage  This field has 2 conditional requirements. Environment variable: AZURE_STORAGE_CONTAINER_NAME',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 352,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'azure',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'azure',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 5: azure storage ',
      envVar: 'AZURE_STORAGE_CONTAINER_NAME',
      persistentConfig: false,
    },
  },
  AZURE_STORAGE_KEY: {
    name: 'AZURE_STORAGE_KEY',
    type: 'string',
    'ui:title': 'Azure Storage Key',
    'ui:description': 'Set the access key for Azure Storage.',
    'ui:help':
      'Feature 5: azure storage This field has 2 conditional requirements. Environment variable: AZURE_STORAGE_KEY',
    'ui:widget': 'PasswordWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 2,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: true,
        isProviderDependent: false,
      },
      inputType: 'password',
      autoComplete: 'off',
      sensitive: true,
    },
    'ui:category': 'Misc Environment Variables - Cloud Storage',
    'ui:order': 353,
    'ui:condition': {
      operator: 'and',
      conditions: [
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'azure',
        },
        {
          field: 'STORAGE_PROVIDER',
          operator: 'equals',
          value: 'azure',
        },
      ],
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'unset',
      rationale: 'Feature 5: azure storage',
      envVar: 'AZURE_STORAGE_KEY',
      persistentConfig: false,
    },
  },
  DATABASE_URL: {
    name: 'DATABASE_URL',
    type: 'string',
    'ui:title': 'Database Url',
    'ui:description': 'Specifies the database URL to connect to.',
    'ui:help': 'Feature 6: SQLite storage (cloudflare) Environment variable: DATABASE_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Database Pool',
    'ui:order': 354,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 6: SQLite storage (cloudflare)',
      envVar: 'DATABASE_URL',
      persistentConfig: false,
    },
  },
  DATABASE_SCHEMA: {
    name: 'DATABASE_SCHEMA',
    type: 'string',
    'ui:title': 'Database Schema',
    'ui:description': 'Specifies the database schema to connect to.',
    'ui:help': 'NOT IN DOCS?! Environment variable: DATABASE_SCHEMA',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Database Pool',
    'ui:order': 355,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'NOT IN DOCS?!',
      envVar: 'DATABASE_SCHEMA',
      persistentConfig: false,
    },
  },
  DATABASE_POOL_SIZE: {
    name: 'DATABASE_POOL_SIZE',
    type: 'integer',
    'ui:title': 'Database Pool Size',
    'ui:description': 'Specifies the size of the database pool. A value of `0` disables pooling.',
    'ui:help': 'Feature 6: SQLite storage (cloudflare) Environment variable: DATABASE_POOL_SIZE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Database Pool',
    'ui:order': 356,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 6: SQLite storage (cloudflare)',
      envVar: 'DATABASE_POOL_SIZE',
      persistentConfig: false,
    },
  },
  DATABASE_POOL_MAX_OVERFLOW: {
    name: 'DATABASE_POOL_MAX_OVERFLOW',
    type: 'integer',
    'ui:title': 'Database Pool Max Overflow',
    'ui:description': 'Specifies the database pool max overflow.',
    'ui:help':
      'Feature 6: SQLite storage (cloudflare) Environment variable: DATABASE_POOL_MAX_OVERFLOW',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Database Pool',
    'ui:order': 357,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 6: SQLite storage (cloudflare)',
      envVar: 'DATABASE_POOL_MAX_OVERFLOW',
      persistentConfig: false,
    },
  },
  DATABASE_POOL_TIMEOUT: {
    name: 'DATABASE_POOL_TIMEOUT',
    type: 'integer',
    'ui:title': 'Database Pool Timeout',
    'ui:description': 'Specifies the database pool timeout in seconds to get a connection.',
    'ui:help': 'Feature 6: SQLite storage (cloudflare) Environment variable: DATABASE_POOL_TIMEOUT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Database Pool',
    'ui:order': 358,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 6: SQLite storage (cloudflare)',
      envVar: 'DATABASE_POOL_TIMEOUT',
      persistentConfig: false,
    },
  },
  DATABASE_POOL_RECYCLE: {
    name: 'DATABASE_POOL_RECYCLE',
    type: 'integer',
    'ui:title': 'Database Pool Recycle',
    'ui:description': 'Specifies the database pool recycle time in seconds.',
    'ui:help': 'Feature 6: SQLite storage (cloudflare) Environment variable: DATABASE_POOL_RECYCLE',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Database Pool',
    'ui:order': 359,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 6: SQLite storage (cloudflare)',
      envVar: 'DATABASE_POOL_RECYCLE',
      persistentConfig: false,
    },
  },
  REDIS_URL: {
    name: 'REDIS_URL',
    type: 'string',
    'ui:title': 'Redis Url',
    'ui:description': 'Specifies the URL of the Redis instance for the app-state.',
    'ui:help': 'Feature 2: Redis Upstash cloudflare Environment variable: REDIS_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Redis',
    'ui:order': 360,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 2: Redis Upstash cloudflare',
      envVar: 'REDIS_URL',
      persistentConfig: false,
    },
  },
  REDIS_SENTINEL_HOSTS: {
    name: 'REDIS_SENTINEL_HOSTS',
    type: 'string',
    'ui:title': 'Redis Sentinel Hosts',
    'ui:description':
      'Comma-separated list of Redis Sentinels for app state. If specified, the "hostname" in `REDIS_URL` will be interpreted as the Sentinel service name.',
    'ui:help': 'Feature 2: Redis Upstash cloudflare Environment variable: REDIS_SENTINEL_HOSTS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Redis',
    'ui:order': 361,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 2: Redis Upstash cloudflare',
      envVar: 'REDIS_SENTINEL_HOSTS',
      persistentConfig: false,
    },
  },
  REDIS_SENTINEL_PORT: {
    name: 'REDIS_SENTINEL_PORT',
    type: 'integer',
    'ui:title': 'Redis Sentinel Port',
    'ui:description': 'Sentinel port for app state Redis.',
    'ui:help': 'Feature 2: Redis Upstash cloudflare Environment variable: REDIS_SENTINEL_PORT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Redis',
    'ui:order': 362,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 2: Redis Upstash cloudflare',
      envVar: 'REDIS_SENTINEL_PORT',
      persistentConfig: false,
    },
  },
  ENABLE_WEBSOCKET_SUPPORT: {
    name: 'ENABLE_WEBSOCKET_SUPPORT',
    type: 'boolean',
    'ui:title': 'Enable Websocket Support',
    'ui:description': 'Enables websocket support in Open WebUI.',
    'ui:help': 'Feature 2: Redis Upstash cloudflare Environment variable: ENABLE_WEBSOCKET_SUPPORT',
    'ui:widget': 'CheckboxWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Redis',
    'ui:order': 363,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 2: Redis Upstash cloudflare',
      envVar: 'ENABLE_WEBSOCKET_SUPPORT',
      persistentConfig: false,
    },
  },
  WEBSOCKET_MANAGER: {
    name: 'WEBSOCKET_MANAGER',
    type: 'string',
    'ui:title': 'Websocket Manager',
    'ui:description': 'Specifies the websocket manager to use (in this case, Redis).',
    'ui:help':
      'Feature 2: Redis Upstash cloudflare This field is shown when ENABLE_WEBSOCKET_SUPPORT is set to "true". Environment variable: WEBSOCKET_MANAGER',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Redis',
    'ui:order': 364,
    'ui:condition': {
      field: 'ENABLE_WEBSOCKET_SUPPORT',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 2: Redis Upstash cloudflare',
      envVar: 'WEBSOCKET_MANAGER',
      persistentConfig: false,
    },
  },
  WEBSOCKET_REDIS_URL: {
    name: 'WEBSOCKET_REDIS_URL',
    type: 'string',
    'ui:title': 'Websocket Redis Url',
    'ui:description':
      'Specifies the URL of the Redis instance for websocket communication. It is distinct from `REDIS_URL` and in practice, it is recommended to set both.',
    'ui:help':
      'Feature 2: Redis Upstash cloudflare This field is shown when ENABLE_WEBSOCKET_SUPPORT is set to "true". Environment variable: WEBSOCKET_REDIS_URL',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Redis',
    'ui:order': 365,
    'ui:condition': {
      field: 'ENABLE_WEBSOCKET_SUPPORT',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 2: Redis Upstash cloudflare',
      envVar: 'WEBSOCKET_REDIS_URL',
      persistentConfig: false,
    },
  },
  WEBSOCKET_SENTINEL_HOSTS: {
    name: 'WEBSOCKET_SENTINEL_HOSTS',
    type: 'string',
    'ui:title': 'Websocket Sentinel Hosts',
    'ui:description':
      'Comma-separated list of Redis Sentinels for websocket. If specified, the "hostname" in `WEBSOCKET_REDIS_URL` will be interpreted as the Sentinel service name.',
    'ui:help':
      'Feature 2: Redis Upstash cloudflare This field is shown when ENABLE_WEBSOCKET_SUPPORT is set to "true". Environment variable: WEBSOCKET_SENTINEL_HOSTS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Redis',
    'ui:order': 366,
    'ui:condition': {
      field: 'ENABLE_WEBSOCKET_SUPPORT',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 2: Redis Upstash cloudflare',
      envVar: 'WEBSOCKET_SENTINEL_HOSTS',
      persistentConfig: false,
    },
  },
  WEBSOCKET_SENTINEL_PORT: {
    name: 'WEBSOCKET_SENTINEL_PORT',
    type: 'integer',
    'ui:title': 'Websocket Sentinel Port',
    'ui:description': 'Sentinel port for websocket Redis.',
    'ui:help':
      'Feature 2: Redis Upstash cloudflare This field is shown when ENABLE_WEBSOCKET_SUPPORT is set to "true". Environment variable: WEBSOCKET_SENTINEL_PORT',
    'ui:widget': 'TextWidget',
    'ui:options': {
      conditional: true,
      conditionCount: 1,
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Redis',
    'ui:order': 367,
    'ui:condition': {
      field: 'ENABLE_WEBSOCKET_SUPPORT',
      operator: 'equals',
      value: true,
    },
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'exposed',
      defaultHandling: 'preloaded',
      rationale: 'Feature 2: Redis Upstash cloudflare',
      envVar: 'WEBSOCKET_SENTINEL_PORT',
      persistentConfig: false,
    },
  },
  UVICORN_WORKERS: {
    name: 'UVICORN_WORKERS',
    type: 'integer',
    'ui:title': 'Uvicorn Workers',
    'ui:description':
      'Controls the number of worker processes that Uvicorn spawns to handle requests. Each worker runs its own instance of the application in a separate process.',
    'ui:help': 'Not sure Environment variable: UVICORN_WORKERS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Uvicorn Settings',
    'ui:order': 368,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'Not sure',
      envVar: 'UVICORN_WORKERS',
      persistentConfig: false,
    },
  },
  PIP_OPTIONS: {
    name: 'PIP_OPTIONS',
    type: 'string',
    'ui:title': 'Pip Options',
    'ui:description':
      'Specifies additional command-line options that pip should use when installing packages. For example, you can include flags such as `--upgrade`, `--user`, or `--no-cache-dir` to control the installation process.',
    'ui:help': 'look into options, unlikely needed Environment variable: PIP_OPTIONS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Install Required Python Packages',
    'ui:order': 369,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'look into options, unlikely needed',
      envVar: 'PIP_OPTIONS',
      persistentConfig: false,
    },
  },
  PIP_PACKAGE_INDEX_OPTIONS: {
    name: 'PIP_PACKAGE_INDEX_OPTIONS',
    type: 'string',
    'ui:title': 'Pip Package Index Options',
    'ui:description':
      'Defines custom package index behavior for pip. This can include specifying additional or alternate index URLs (e.g., `--extra-index-url`), authentication credentials, or other parameters to manage how packages are retrieved from different locations.',
    'ui:help': 'look into options, unlikely needed Environment variable: PIP_PACKAGE_INDEX_OPTIONS',
    'ui:widget': 'TextWidget',
    'ui:options': {
      reactTsForm: {
        suggestedComponent: 'text-field',
        hasComplexLogic: false,
        isProviderDependent: false,
      },
    },
    'ui:category': 'Misc Environment Variables - Install Required Python Packages',
    'ui:order': 370,
    'ui:validation': {
      required: false,
      constraints: [],
    },
    'ui:extensions': {
      visibility: 'hidden',
      defaultHandling: 'preloaded',
      rationale: 'look into options, unlikely needed',
      envVar: 'PIP_PACKAGE_INDEX_OPTIONS',
      persistentConfig: false,
    },
  },
} as const;

// Combined field configurations
export const fieldConfigurations: Record<string, FieldConfiguration> = {
  ...fieldConfigurationsPart1,
  ...fieldConfigurationsPart2,
  ...fieldConfigurationsPart3,
  ...fieldConfigurationsPart4,
  ...fieldConfigurationsPart5,
  ...fieldConfigurationsPart6,
  ...fieldConfigurationsPart7,
  ...fieldConfigurationsPart8,
} as const;

// Conditional Rules - Defines when fields should be shown/hidden
export const conditionalRules: Record<string, ConditionalRule> = {
  WEBHOOK_URL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_USER_WEBHOOKS',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  ADMIN_EMAIL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'SHOW_ADMIN_DETAILS',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OLLAMA_BASE_URLS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OLLAMA_API',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OPENAI_API_BASE_URL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OPENAI_API',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OPENAI_API_BASE_URLS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OPENAI_API',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OPENAI_API_KEY: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OPENAI_API',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OPENAI_API_KEYS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OPENAI_API',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  TITLE_GENERATION_PROMPT_TEMPLATE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_TITLE_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  CODE_EXECUTION_ENGINE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_EXECUTION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  CODE_EXECUTION_JUPYTER_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_EXECUTION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_EXECUTION_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  CODE_EXECUTION_JUPYTER_AUTH: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_EXECUTION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_EXECUTION_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  CODE_EXECUTION_JUPYTER_AUTH_TOKEN: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_EXECUTION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_EXECUTION_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  CODE_EXECUTION_JUPYTER_AUTH_PASSWORD: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_EXECUTION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_EXECUTION_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  CODE_EXECUTION_JUPYTER_TIMEOUT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_EXECUTION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_EXECUTION_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  CODE_INTERPRETER_ENGINE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_INTERPRETER',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  CODE_INTERPRETER_PROMPT_TEMPLATE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_INTERPRETER',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  CODE_INTERPRETER_JUPYTER_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_INTERPRETER',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_INTERPRETER_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  CODE_INTERPRETER_JUPYTER_AUTH: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_INTERPRETER',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_INTERPRETER_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  CODE_INTERPRETER_JUPYTER_AUTH_TOKEN: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_INTERPRETER',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_INTERPRETER_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_INTERPRETER',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_INTERPRETER_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  CODE_INTERPRETER_JUPYTER_TIMEOUT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_CODE_INTERPRETER',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'CODE_INTERPRETER_ENGINE',
        operator: 'equals',
        value: 'jupyter',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_AUTOCOMPLETE_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_AUTOCOMPLETE_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  TAGS_GENERATION_PROMPT_TEMPLATE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_TAGS_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  API_KEY_ALLOWED_ENDPOINTS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_API_KEY_ENDPOINT_RESTRICTIONS',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBUI_SESSION_COOKIE_SAME_SITE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'WEBUI_AUTH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBUI_SESSION_COOKIE_SECURE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'WEBUI_AUTH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBUI_AUTH_COOKIE_SAME_SITE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'WEBUI_AUTH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBUI_AUTH_COOKIE_SECURE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'WEBUI_AUTH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBUI_SECRET_KEY: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'WEBUI_AUTH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'RAG_EMBEDDING_MODEL_AUTO_UPDATE',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  RAG_RERANKING_MODEL_TRUST_REMOTE_CODE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'RAG_RERANKING_MODEL_AUTO_UPDATE',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  CHROMA_TENANT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  CHROMA_DATABASE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  CHROMA_HTTP_HOST: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  CHROMA_HTTP_PORT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  CHROMA_HTTP_HEADERS: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  CHROMA_HTTP_SSL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  CHROMA_CLIENT_AUTH_PROVIDER: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  CHROMA_CLIENT_AUTH_CREDENTIALS: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'chroma',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  ELASTICSEARCH_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  ELASTICSEARCH_CA_CERTS: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  ELASTICSEARCH_CLOUD_ID: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  ELASTICSEARCH_INDEX_PREFIX: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  ELASTICSEARCH_PASSWORD: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  ELASTICSEARCH_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  ELASTICSEARCH_USERNAME: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'elasticsearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  MILVUS_URI: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  MILVUS_DB: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  MILVUS_TOKEN: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  MILVUS_INDEX_TYPE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  MILVUS_METRIC_TYPE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  MILVUS_HNSW_M: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'MILVUS_INDEX_TYPE',
        operator: 'equals',
        value: 'HNSW',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
      {
        field: 'MILVUS_INDEX_TYPE',
        operator: 'equals',
        value: 'HNSW',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 3,
      chainDepth: 3,
    },
  },
  MILVUS_HNSW_EFCONSTRUCTION: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'MILVUS_INDEX_TYPE',
        operator: 'equals',
        value: 'HNSW',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
      {
        field: 'MILVUS_INDEX_TYPE',
        operator: 'equals',
        value: 'HNSW',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 3,
      chainDepth: 3,
    },
  },
  MILVUS_IVF_FLAT_NLIST: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'MILVUS_INDEX_TYPE',
        operator: 'equals',
        value: 'IVF_FLAT',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'milvus',
        type: 'simple',
      },
      {
        field: 'MILVUS_INDEX_TYPE',
        operator: 'equals',
        value: 'IVF_FLAT',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 3,
      chainDepth: 3,
    },
  },
  OPENSEARCH_CERT_VERIFY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  OPENSEARCH_PASSWORD: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  OPENSEARCH_SSL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  OPENSEARCH_URI: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  OPENSEARCH_USERNAME: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'opensearch',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  PGVECTOR_DB_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pgvector',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pgvector',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pgvector',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pgvector',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  QDRANT_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  QDRANT_URI: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  QDRANT_ON_DISK: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  QDRANT_PREFER_GRPC: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  QDRANT_GRPC_PORT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  ENABLE_QDRANT_MULTITENANCY_MODE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'qdrant',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  PINECONE_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  PINECONE_ENVIRONMENT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  PINECONE_INDEX_NAME: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  PINECONE_DIMENSION: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  PINECONE_METRIC: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  PINECONE_CLOUD: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
      {
        field: 'VECTOR_DB',
        operator: 'equals',
        value: 'pinecone',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  MISTRAL_OCR_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'mistral_ocr',
        type: 'simple',
      },
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'mistral_ocr',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  EXTERNAL_DOCUMENT_LOADER_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'external',
        type: 'simple',
      },
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'external',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  EXTERNAL_DOCUMENT_LOADER_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'external',
        type: 'simple',
      },
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'external',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  TIKA_SERVER_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'tika',
        type: 'simple',
      },
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'tika',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  DOCLING_SERVER_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'docling',
        type: 'simple',
      },
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'docling',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  DOCLING_OCR_ENGINE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'docling',
        type: 'simple',
      },
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'docling',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  DOCLING_OCR_LANG: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'docling',
        type: 'simple',
      },
      {
        field: 'CONTENT_EXTRACTION_ENGINE',
        operator: 'equals',
        value: 'docling',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  RAG_EMBEDDING_MODEL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  RAG_TOP_K: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_RAG_HYBRID_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  RAG_TOP_K_RERANKER: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_RAG_HYBRID_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  RAG_RELEVANCE_THRESHOLD: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_RAG_HYBRID_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  TIKTOKEN_CACHE_DIR: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'token',
        type: 'simple',
      },
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'token',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  TIKTOKEN_ENCODING_NAME: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'token',
        type: 'simple',
      },
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'token',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  CHUNK_SIZE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'token',
        type: 'simple',
      },
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'character',
        type: 'simple',
      },
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'token',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 3,
      chainDepth: 2,
    },
  },
  CHUNK_OVERLAP: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'token',
        type: 'simple',
      },
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'character',
        type: 'simple',
      },
      {
        field: 'RAG_TEXT_SPLITTER',
        operator: 'equals',
        value: 'token',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 3,
      chainDepth: 2,
    },
  },
  RAG_RERANKING_MODEL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_RAG_HYBRID_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  RAG_OPENAI_API_BASE_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  RAG_OPENAI_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  RAG_EMBEDDING_OPENAI_BATCH_SIZE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  RAG_OLLAMA_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'ollama',
        type: 'simple',
      },
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'ollama',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  RAG_OLLAMA_BASE_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'ollama',
        type: 'simple',
      },
      {
        field: 'RAG_EMBEDDING_ENGINE',
        operator: 'equals',
        value: 'ollama',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  QUERY_GENERATION_PROMPT_TEMPLATE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_RETRIEVAL_QUERY_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GOOGLE_DRIVE_CLIENT_ID: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_GOOGLE_DRIVE_INTEGRATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GOOGLE_DRIVE_API_KEY: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_GOOGLE_DRIVE_INTEGRATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  ONEDRIVE_CLIENT_ID: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_ONEDRIVE_INTEGRATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  ENABLE_SEARCH_QUERY_GENERATION: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEB_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEB_SEARCH_TRUST_ENV: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEB_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEB_SEARCH_RESULT_COUNT: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEB_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEB_SEARCH_CONCURRENT_REQUESTS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEB_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEB_SEARCH_ENGINE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEB_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  BYPASS_WEB_SEARCH_EMBEDDING_AND_RETRIEVAL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEB_SEARCH',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  SEARXNG_QUERY_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'searxng',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'searxng',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  GOOGLE_PSE_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'google_pse',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'google_pse',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  GOOGLE_PSE_ENGINE_ID: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'google_pse',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'google_pse',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  BRAVE_SEARCH_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'brave',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'brave',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  KAGI_SEARCH_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'kagi',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'kagi',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  MOJEEK_SEARCH_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'mojeek',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'mojeek',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SERPSTACK_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serpstack',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serpstack',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SERPSTACK_HTTPS: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serpstack',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serpstack',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SERPER_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serper',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serper',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SERPLY_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serply',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serply',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SEARCHAPI_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'searchapi',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'searchapi',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SEARCHAPI_ENGINE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'searchapi',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'searchapi',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  TAVILY_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'tavily',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'tavily',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  JINA_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'jina',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'jina',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  BING_SEARCH_V7_ENDPOINT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'bing',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'bing',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  BING_SEARCH_V7_SUBSCRIPTION_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'bing',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'bing',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  BOCHA_SEARCH_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'bocha',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'bocha',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  EXA_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'exa',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'exa',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SERPAPI_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serpapi',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serpapi',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SERPAPI_ENGINE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serpapi',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'serpapi',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SOUGOU_API_SID: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'sougou',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'sougou',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  SOUGOU_API_SK: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'sougou',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'sougou',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  TAVILY_EXTRACT_DEPTH: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'tavily',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'tavily',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  PLAYWRIGHT_WS_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_LOADER_ENGINE',
        operator: 'equals',
        value: 'playwright',
        type: 'simple',
      },
      {
        field: 'WEB_LOADER_ENGINE',
        operator: 'equals',
        value: 'playwright',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  PERPLEXITY_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'perplexity',
        type: 'simple',
      },
      {
        field: 'WEB_SEARCH_ENGINE',
        operator: 'equals',
        value: 'perplexity',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  PLAYWRIGHT_TIMEOUT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'WEB_LOADER_ENGINE',
        operator: 'equals',
        value: 'playwright',
        type: 'simple',
      },
      {
        field: 'WEB_LOADER_ENGINE',
        operator: 'equals',
        value: 'playwright',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  WHISPER_MODEL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  WHISPER_MODEL_DIR: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  WHISPER_VAD_FILTER: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  WHISPER_MODEL_AUTO_UPDATE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  WHISPER_LANGUAGE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: '',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_STT_MODEL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_STT_OPENAI_API_BASE_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_STT_OPENAI_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_STT_AZURE_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_STT_AZURE_REGION: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_STT_AZURE_LOCALES: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  DEEPGRAM_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'deepgram',
        type: 'simple',
      },
      {
        field: 'AUDIO_STT_ENGINE',
        operator: 'equals',
        value: 'deepgram',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_TTS_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'transformers',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'elevenlabs',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'transformers',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 4,
      chainDepth: 2,
    },
  },
  AUDIO_TTS_MODEL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_TTS_VOICE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_TTS_SPLIT_ON: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_TTS_AZURE_SPEECH_REGION: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_TTS_OPENAI_API_BASE_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AUDIO_TTS_OPENAI_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'AUDIO_TTS_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  IMAGE_GENERATION_ENGINE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_IMAGE_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  ENABLE_IMAGE_PROMPT_GENERATION: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_IMAGE_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_IMAGE_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  IMAGE_SIZE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_IMAGE_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  IMAGE_STEPS: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_IMAGE_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'comfyui',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 3,
      chainDepth: 3,
    },
  },
  IMAGE_GENERATION_MODEL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_IMAGE_GENERATION',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  AUTOMATIC1111_BASE_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  AUTOMATIC1111_API_AUTH: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  AUTOMATIC1111_CFG_SCALE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  AUTOMATIC1111_SAMPLER: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  AUTOMATIC1111_SCHEDULER: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'automatic1111',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  COMFYUI_BASE_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'comfyui',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'comfyui',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  COMFYUI_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'comfyui',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'comfyui',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  COMFYUI_WORKFLOW: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'comfyui',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'comfyui',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  GEMINI_API_BASE_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'gemini',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'gemini',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  GEMINI_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'gemini',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'gemini',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  IMAGES_GEMINI_API_BASE_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'gemini',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'gemini',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  IMAGES_GEMINI_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'gemini',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'gemini',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  IMAGES_OPENAI_API_BASE_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  IMAGES_OPENAI_API_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
      {
        field: 'IMAGE_GENERATION_ENGINE',
        operator: 'equals',
        value: 'openai',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 3,
    },
  },
  OAUTH_MERGE_ACCOUNTS_BY_EMAIL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_UPDATE_PICTURE_ON_LOGIN: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBUI_AUTH_TRUSTED_EMAIL_HEADER: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBUI_AUTH_TRUSTED_NAME_HEADER: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GOOGLE_CLIENT_ID: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GOOGLE_CLIENT_SECRET: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GOOGLE_OAUTH_SCOPE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GOOGLE_REDIRECT_URI: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  MICROSOFT_CLIENT_ID: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  MICROSOFT_CLIENT_SECRET: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  MICROSOFT_CLIENT_TENANT_ID: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  MICROSOFT_OAUTH_SCOPE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  MICROSOFT_REDIRECT_URI: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GITHUB_CLIENT_ID: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GITHUB_CLIENT_SECRET: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GITHUB_CLIENT_SCOPE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  GITHUB_CLIENT_REDIRECT_URI: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_CLIENT_ID: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_CLIENT_SECRET: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OPENID_PROVIDER_URL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OPENID_REDIRECT_URI: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_SCOPES: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_CODE_CHALLENGE_METHOD: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_PROVIDER_NAME: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_USERNAME_CLAIM: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_EMAIL_CLAIM: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_PICTURE_CLAIM: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_SIGNUP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_GROUP_CLAIM: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_GROUP_MANAGEMENT',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_ROLES_CLAIM: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_ROLE_MANAGEMENT',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_ALLOWED_ROLES: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_ROLE_MANAGEMENT',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_ADMIN_ROLES: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_ROLE_MANAGEMENT',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  OAUTH_ALLOWED_DOMAINS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_OAUTH_GROUP_MANAGEMENT',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_SERVER_LABEL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_SERVER_HOST: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_SERVER_PORT: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_ATTRIBUTE_FOR_MAIL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_ATTRIBUTE_FOR_USERNAME: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_APP_DN: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_APP_PASSWORD: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_SEARCH_BASE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_SEARCH_FILTER: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_SEARCH_FILTERS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_USE_TLS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_CA_CERT_FILE: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_VALIDATE_CERT: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  LDAP_CIPHERS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_LDAP',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'USER_PERMISSIONS_CHAT_TEMPORARY',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS',
        operator: 'equals',
        value: false,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS',
        operator: 'equals',
        value: false,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS',
        operator: 'equals',
        value: false,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS',
        operator: 'equals',
        value: false,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  S3_ACCESS_KEY_ID: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  S3_ADDRESSING_STYLE: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  S3_BUCKET_NAME: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  S3_ENDPOINT_URL: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  S3_KEY_PREFIX: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  S3_REGION_NAME: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  S3_SECRET_ACCESS_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  S3_USE_ACCELERATE_ENDPOINT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  S3_ENABLE_TAGGING: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 's3',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  GOOGLE_APPLICATION_CREDENTIALS_JSON: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'gcs',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'gcs',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  GCS_BUCKET_NAME: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'gcs',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'gcs',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AZURE_STORAGE_ENDPOINT: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AZURE_STORAGE_CONTAINER_NAME: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  AZURE_STORAGE_KEY: {
    type: 'complex',
    operator: 'and',
    rules: [
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
      {
        field: 'STORAGE_PROVIDER',
        operator: 'equals',
        value: 'azure',
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'complex',
      conditionCount: 2,
      chainDepth: 2,
    },
  },
  WEBSOCKET_MANAGER: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEBSOCKET_SUPPORT',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBSOCKET_REDIS_URL: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEBSOCKET_SUPPORT',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBSOCKET_SENTINEL_HOSTS: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEBSOCKET_SUPPORT',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
  WEBSOCKET_SENTINEL_PORT: {
    type: 'conditional',
    operator: 'and',
    rules: [
      {
        field: 'ENABLE_WEBSOCKET_SUPPORT',
        operator: 'equals',
        value: true,
        type: 'simple',
      },
    ],
    metadata: {
      complexity: 'simple',
      conditionCount: 1,
      chainDepth: 2,
    },
  },
} as const;

// Helper function to get conditional rule for a field
export function getConditionalRule(fieldName: string): ConditionalRule | null {
  return conditionalRules[fieldName] || null;
}

// Check if a field has conditional logic
export function isConditionalField(fieldName: string): boolean {
  return Boolean(conditionalRules[fieldName]);
}

// Component Mappings - Suggests React components for each field
export const componentMappings: Record<string, ComponentMapping> = {
  WEBUI_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  ENABLE_SIGNUP: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_LOGIN_FORM: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  DEFAULT_LOCALE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  DEFAULT_MODELS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  DEFAULT_USER_ROLE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {},
    wrappers: [],
  },
  PENDING_USER_OVERLAY_TITLE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  PENDING_USER_OVERLAY_CONTENT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  ENABLE_CHANNELS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  WEBHOOK_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_USER_WEBHOOKS'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_ADMIN_EXPORT: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_ADMIN_CHAT_ACCESS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_USER_WEBHOOKS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  RESPONSE_WATERMARK: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  THREAD_POOL_SIZE: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  SHOW_ADMIN_DETAILS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ADMIN_EMAIL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['SHOW_ADMIN_DETAILS'],
    },
    wrappers: ['conditional-field'],
  },
  ENV: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {},
    wrappers: [],
  },
  ENABLE_PERSISTENT_CONFIG: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  CUSTOM_NAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  WEBUI_NAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  PORT: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  ENABLE_REALTIME_CHAT_SAVE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  BYPASS_MODEL_ACCESS_CONTROL: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  WEBUI_BUILD_HASH: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  WEBUI_BANNERS: {
    component: 'array-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  USE_CUDA_DOCKER: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  EXTERNAL_PWA_MANIFEST_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  ENABLE_TITLE_GENERATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  LICENSE_KEY: {
    component: 'secret-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
    },
    wrappers: ['plan-restricted-feature'],
  },
  SSL_ASSERT_FINGERPRINT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  DEFAULT_PROMPT_SUGGESTIONS: {
    component: 'array-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  AIOHTTP_CLIENT_TIMEOUT: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  DATA_DIR: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  FONTS_DIR: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  FRONTEND_BUILD_DIR: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  STATIC_DIR: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  ENABLE_OLLAMA_API: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  OLLAMA_BASE_URLS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OLLAMA_API'],
    },
    wrappers: ['conditional-field'],
  },
  USE_OLLAMA_DOCKER: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  K8S_FLAG: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_OPENAI_API: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  OPENAI_API_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OPENAI_API'],
    },
    wrappers: ['conditional-field'],
  },
  OPENAI_API_BASE_URLS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OPENAI_API'],
    },
    wrappers: ['conditional-field'],
  },
  OPENAI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_OPENAI_API'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  OPENAI_API_KEYS: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_OPENAI_API'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  TASK_MODEL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  TASK_MODEL_EXTERNAL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  TITLE_GENERATION_PROMPT_TEMPLATE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_TITLE_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  ENABLE_CODE_EXECUTION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  CODE_EXECUTION_ENGINE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_CODE_EXECUTION'],
    },
    wrappers: ['conditional-field'],
  },
  CODE_EXECUTION_JUPYTER_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_CODE_EXECUTION', 'CODE_EXECUTION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  CODE_EXECUTION_JUPYTER_AUTH: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_CODE_EXECUTION', 'CODE_EXECUTION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  CODE_EXECUTION_JUPYTER_AUTH_TOKEN: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_CODE_EXECUTION', 'CODE_EXECUTION_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  CODE_EXECUTION_JUPYTER_AUTH_PASSWORD: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_CODE_EXECUTION', 'CODE_EXECUTION_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  CODE_EXECUTION_JUPYTER_TIMEOUT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_CODE_EXECUTION', 'CODE_EXECUTION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_CODE_INTERPRETER: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  CODE_INTERPRETER_ENGINE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_CODE_INTERPRETER'],
    },
    wrappers: ['conditional-field'],
  },
  CODE_INTERPRETER_PROMPT_TEMPLATE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_CODE_INTERPRETER'],
    },
    wrappers: ['conditional-field'],
  },
  CODE_INTERPRETER_JUPYTER_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_CODE_INTERPRETER', 'CODE_INTERPRETER_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  CODE_INTERPRETER_JUPYTER_AUTH: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_CODE_INTERPRETER', 'CODE_INTERPRETER_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  CODE_INTERPRETER_JUPYTER_AUTH_TOKEN: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_CODE_INTERPRETER', 'CODE_INTERPRETER_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_CODE_INTERPRETER', 'CODE_INTERPRETER_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  CODE_INTERPRETER_JUPYTER_TIMEOUT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_CODE_INTERPRETER', 'CODE_INTERPRETER_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_DIRECT_CONNECTIONS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_AUTOCOMPLETE_GENERATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['ENABLE_AUTOCOMPLETE_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_AUTOCOMPLETE_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_EVALUATION_ARENA_MODELS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_MESSAGE_RATING: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_COMMUNITY_SHARING: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_TAGS_GENERATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  TAGS_GENERATION_PROMPT_TEMPLATE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_TAGS_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_API_KEY: {
    component: 'secret-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      type: 'password',
      autoComplete: 'new-password',
    },
    wrappers: ['plan-restricted-feature'],
  },
  ENABLE_API_KEY_ENDPOINT_RESTRICTIONS: {
    component: 'secret-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      type: 'password',
      autoComplete: 'new-password',
    },
    wrappers: ['plan-restricted-feature'],
  },
  API_KEY_ALLOWED_ENDPOINTS: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_API_KEY_ENDPOINT_RESTRICTIONS'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  JWT_EXPIRES_IN: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  ENABLE_FORWARD_USER_INFO_HEADERS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  ENABLE_WEB_LOADER_SSL_VERIFICATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  WEBUI_SESSION_COOKIE_SAME_SITE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {
      conditional: true,
      dependencies: ['WEBUI_AUTH'],
    },
    wrappers: ['conditional-field'],
  },
  WEBUI_SESSION_COOKIE_SECURE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['WEBUI_AUTH'],
    },
    wrappers: ['conditional-field'],
  },
  WEBUI_AUTH_COOKIE_SAME_SITE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {
      conditional: true,
      dependencies: ['WEBUI_AUTH'],
    },
    wrappers: ['conditional-field'],
  },
  WEBUI_AUTH_COOKIE_SECURE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['WEBUI_AUTH'],
    },
    wrappers: ['conditional-field'],
  },
  WEBUI_AUTH: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  WEBUI_SECRET_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEBUI_AUTH'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  OFFLINE_MODE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  RESET_CONFIG_ON_START: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  SAFE_MODE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  CORS_ALLOW_ORIGIN: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['RAG_EMBEDDING_MODEL_AUTO_UPDATE'],
    },
    wrappers: ['conditional-field'],
  },
  RAG_RERANKING_MODEL_TRUST_REMOTE_CODE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['RAG_RERANKING_MODEL_AUTO_UPDATE'],
    },
    wrappers: ['conditional-field'],
  },
  RAG_EMBEDDING_MODEL_AUTO_UPDATE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  RAG_RERANKING_MODEL_AUTO_UPDATE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  VECTOR_DB: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  CHROMA_TENANT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  CHROMA_DATABASE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  CHROMA_HTTP_HOST: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  CHROMA_HTTP_PORT: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  CHROMA_HTTP_HEADERS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  CHROMA_HTTP_SSL: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  CHROMA_CLIENT_AUTH_PROVIDER: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  CHROMA_CLIENT_AUTH_CREDENTIALS: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  ELASTICSEARCH_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  ELASTICSEARCH_CA_CERTS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  ELASTICSEARCH_CLOUD_ID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  ELASTICSEARCH_INDEX_PREFIX: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  ELASTICSEARCH_PASSWORD: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  ELASTICSEARCH_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  ELASTICSEARCH_USERNAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  MILVUS_URI: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  MILVUS_DB: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  MILVUS_TOKEN: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  MILVUS_INDEX_TYPE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  MILVUS_METRIC_TYPE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  MILVUS_HNSW_M: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['MILVUS_INDEX_TYPE', 'VECTOR_DB', 'MILVUS_INDEX_TYPE'],
    },
    wrappers: ['conditional-field'],
  },
  MILVUS_HNSW_EFCONSTRUCTION: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['MILVUS_INDEX_TYPE', 'VECTOR_DB', 'MILVUS_INDEX_TYPE'],
    },
    wrappers: ['conditional-field'],
  },
  MILVUS_IVF_FLAT_NLIST: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['MILVUS_INDEX_TYPE', 'VECTOR_DB', 'MILVUS_INDEX_TYPE'],
    },
    wrappers: ['conditional-field'],
  },
  OPENSEARCH_CERT_VERIFY: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  OPENSEARCH_PASSWORD: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  OPENSEARCH_SSL: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  OPENSEARCH_URI: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  OPENSEARCH_USERNAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  PGVECTOR_DB_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  QDRANT_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  QDRANT_URI: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  QDRANT_ON_DISK: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  QDRANT_PREFER_GRPC: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  QDRANT_GRPC_PORT: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_QDRANT_MULTITENANCY_MODE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  PINECONE_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  PINECONE_ENVIRONMENT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  PINECONE_INDEX_NAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  PINECONE_DIMENSION: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  PINECONE_METRIC: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  PINECONE_CLOUD: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['VECTOR_DB', 'VECTOR_DB'],
    },
    wrappers: ['conditional-field'],
  },
  CONTENT_EXTRACTION_ENGINE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  MISTRAL_OCR_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['CONTENT_EXTRACTION_ENGINE', 'CONTENT_EXTRACTION_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  EXTERNAL_DOCUMENT_LOADER_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['CONTENT_EXTRACTION_ENGINE', 'CONTENT_EXTRACTION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  EXTERNAL_DOCUMENT_LOADER_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['CONTENT_EXTRACTION_ENGINE', 'CONTENT_EXTRACTION_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  TIKA_SERVER_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['CONTENT_EXTRACTION_ENGINE', 'CONTENT_EXTRACTION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  DOCLING_SERVER_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['CONTENT_EXTRACTION_ENGINE', 'CONTENT_EXTRACTION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  DOCLING_OCR_ENGINE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['CONTENT_EXTRACTION_ENGINE', 'CONTENT_EXTRACTION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  DOCLING_OCR_LANG: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['CONTENT_EXTRACTION_ENGINE', 'CONTENT_EXTRACTION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  RAG_EMBEDDING_ENGINE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {},
    wrappers: [],
  },
  RAG_EMBEDDING_MODEL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['RAG_EMBEDDING_ENGINE', 'RAG_EMBEDDING_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_RAG_HYBRID_SEARCH: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  RAG_TOP_K: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['ENABLE_RAG_HYBRID_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  RAG_TOP_K_RERANKER: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['ENABLE_RAG_HYBRID_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  RAG_RELEVANCE_THRESHOLD: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['ENABLE_RAG_HYBRID_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  RAG_TEMPLATE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  RAG_TEXT_SPLITTER: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {},
    wrappers: [],
  },
  TIKTOKEN_CACHE_DIR: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['RAG_TEXT_SPLITTER', 'RAG_TEXT_SPLITTER'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  TIKTOKEN_ENCODING_NAME: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['RAG_TEXT_SPLITTER', 'RAG_TEXT_SPLITTER'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  CHUNK_SIZE: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['RAG_TEXT_SPLITTER', 'RAG_TEXT_SPLITTER', 'RAG_TEXT_SPLITTER'],
    },
    wrappers: ['conditional-field'],
  },
  CHUNK_OVERLAP: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['RAG_TEXT_SPLITTER', 'RAG_TEXT_SPLITTER', 'RAG_TEXT_SPLITTER'],
    },
    wrappers: ['conditional-field'],
  },
  PDF_EXTRACT_IMAGES: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  RAG_FILE_MAX_SIZE: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  RAG_FILE_MAX_COUNT: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  RAG_ALLOWED_FILE_EXTENSIONS: {
    component: 'array-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  RAG_RERANKING_MODEL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_RAG_HYBRID_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  RAG_OPENAI_API_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['RAG_EMBEDDING_ENGINE', 'RAG_EMBEDDING_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  RAG_OPENAI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['RAG_EMBEDDING_ENGINE', 'RAG_EMBEDDING_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  RAG_EMBEDDING_OPENAI_BATCH_SIZE: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['RAG_EMBEDDING_ENGINE', 'RAG_EMBEDDING_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  RAG_EMBEDDING_BATCH_SIZE: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  RAG_OLLAMA_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['RAG_EMBEDDING_ENGINE', 'RAG_EMBEDDING_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  RAG_OLLAMA_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['RAG_EMBEDDING_ENGINE', 'RAG_EMBEDDING_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_RETRIEVAL_QUERY_GENERATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  QUERY_GENERATION_PROMPT_TEMPLATE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_RETRIEVAL_QUERY_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  BYPASS_EMBEDDING_AND_RETRIEVAL: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  DOCUMENT_INTELLIGENCE_ENDPOINT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  DOCUMENT_INTELLIGENCE_KEY: {
    component: 'secret-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
    },
    wrappers: ['plan-restricted-feature'],
  },
  ENABLE_RAG_LOCAL_WEB_FETCH: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  RAG_EMBEDDING_CONTENT_PREFIX: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  RAG_EMBEDDING_PREFIX_FIELD_NAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  RAG_EMBEDDING_QUERY_PREFIX: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  RAG_FULL_CONTEXT: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_GOOGLE_DRIVE_INTEGRATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  GOOGLE_DRIVE_CLIENT_ID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_GOOGLE_DRIVE_INTEGRATION'],
    },
    wrappers: ['conditional-field'],
  },
  GOOGLE_DRIVE_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_GOOGLE_DRIVE_INTEGRATION'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  ENABLE_ONEDRIVE_INTEGRATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ONEDRIVE_CLIENT_ID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_ONEDRIVE_INTEGRATION'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_WEB_SEARCH: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_SEARCH_QUERY_GENERATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEB_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  WEB_SEARCH_TRUST_ENV: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEB_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  WEB_SEARCH_RESULT_COUNT: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEB_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  WEB_SEARCH_CONCURRENT_REQUESTS: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEB_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  WEB_SEARCH_ENGINE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEB_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  BYPASS_WEB_SEARCH_EMBEDDING_AND_RETRIEVAL: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEB_SEARCH'],
    },
    wrappers: ['conditional-field'],
  },
  SEARXNG_QUERY_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  GOOGLE_PSE_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  GOOGLE_PSE_ENGINE_ID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  BRAVE_SEARCH_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  KAGI_SEARCH_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  MOJEEK_SEARCH_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  SERPSTACK_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  SERPSTACK_HTTPS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  SERPER_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  SERPLY_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  SEARCHAPI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  SEARCHAPI_ENGINE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  TAVILY_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  JINA_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  BING_SEARCH_V7_ENDPOINT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  BING_SEARCH_V7_SUBSCRIPTION_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  BOCHA_SEARCH_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  EXA_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  SERPAPI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  SERPAPI_ENGINE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  SOUGOU_API_SID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  SOUGOU_API_SK: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  TAVILY_EXTRACT_DEPTH: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  WEB_LOADER_ENGINE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {},
    wrappers: [],
  },
  PLAYWRIGHT_WS_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['WEB_LOADER_ENGINE', 'WEB_LOADER_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  FIRECRAWL_API_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  FIRECRAWL_API_KEY: {
    component: 'secret-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
    },
    wrappers: ['plan-restricted-feature'],
  },
  PERPLEXITY_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['WEB_SEARCH_ENGINE', 'WEB_SEARCH_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  PLAYWRIGHT_TIMEOUT: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['WEB_LOADER_ENGINE', 'WEB_LOADER_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  YOUTUBE_LOADER_PROXY_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  YOUTUBE_LOADER_LANGUAGE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  WHISPER_MODEL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  WHISPER_MODEL_DIR: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  WHISPER_VAD_FILTER: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  WHISPER_MODEL_AUTO_UPDATE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  WHISPER_LANGUAGE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_STT_ENGINE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {},
    wrappers: [],
  },
  AUDIO_STT_MODEL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_STT_OPENAI_API_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_STT_OPENAI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  AUDIO_STT_AZURE_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  AUDIO_STT_AZURE_REGION: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_STT_AZURE_LOCALES: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  DEEPGRAM_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['AUDIO_STT_ENGINE', 'AUDIO_STT_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  AUDIO_TTS_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: [
        'AUDIO_TTS_ENGINE',
        'AUDIO_TTS_ENGINE',
        'AUDIO_TTS_ENGINE',
        'AUDIO_TTS_ENGINE',
      ],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  AUDIO_TTS_ENGINE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {},
    wrappers: [],
  },
  AUDIO_TTS_MODEL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_TTS_ENGINE', 'AUDIO_TTS_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_TTS_VOICE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_TTS_ENGINE', 'AUDIO_TTS_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_TTS_SPLIT_ON: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_TTS_ENGINE', 'AUDIO_TTS_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_TTS_AZURE_SPEECH_REGION: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_TTS_ENGINE', 'AUDIO_TTS_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_TTS_ENGINE', 'AUDIO_TTS_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_TTS_OPENAI_API_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['AUDIO_TTS_ENGINE', 'AUDIO_TTS_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUDIO_TTS_OPENAI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['AUDIO_TTS_ENGINE', 'AUDIO_TTS_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  IMAGE_GENERATION_ENGINE: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_IMAGE_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_IMAGE_GENERATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_IMAGE_PROMPT_GENERATION: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_IMAGE_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_IMAGE_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  IMAGE_SIZE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_IMAGE_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  IMAGE_STEPS: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: [
        'ENABLE_IMAGE_GENERATION',
        'IMAGE_GENERATION_ENGINE',
        'IMAGE_GENERATION_ENGINE',
      ],
    },
    wrappers: ['conditional-field'],
  },
  IMAGE_GENERATION_MODEL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_IMAGE_GENERATION'],
    },
    wrappers: ['conditional-field'],
  },
  AUTOMATIC1111_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUTOMATIC1111_API_AUTH: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUTOMATIC1111_CFG_SCALE: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUTOMATIC1111_SAMPLER: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  AUTOMATIC1111_SCHEDULER: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  COMFYUI_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  COMFYUI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  COMFYUI_WORKFLOW: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  GEMINI_API_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  GEMINI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  IMAGES_GEMINI_API_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  IMAGES_GEMINI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  IMAGES_OPENAI_API_BASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field'],
  },
  IMAGES_OPENAI_API_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['IMAGE_GENERATION_ENGINE', 'IMAGE_GENERATION_ENGINE'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  ENABLE_OAUTH_SIGNUP: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  OAUTH_MERGE_ACCOUNTS_BY_EMAIL: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_UPDATE_PICTURE_ON_LOGIN: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  WEBUI_AUTH_TRUSTED_EMAIL_HEADER: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  WEBUI_AUTH_TRUSTED_NAME_HEADER: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  GOOGLE_CLIENT_ID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  GOOGLE_CLIENT_SECRET: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  GOOGLE_OAUTH_SCOPE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  GOOGLE_REDIRECT_URI: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  MICROSOFT_CLIENT_ID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  MICROSOFT_CLIENT_SECRET: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  MICROSOFT_CLIENT_TENANT_ID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  MICROSOFT_OAUTH_SCOPE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  MICROSOFT_REDIRECT_URI: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  GITHUB_CLIENT_ID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  GITHUB_CLIENT_SECRET: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  GITHUB_CLIENT_SCOPE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  GITHUB_CLIENT_REDIRECT_URI: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_CLIENT_ID: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_CLIENT_SECRET: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  OPENID_PROVIDER_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OPENID_REDIRECT_URI: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_SCOPES: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_CODE_CHALLENGE_METHOD: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_PROVIDER_NAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_USERNAME_CLAIM: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_EMAIL_CLAIM: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_PICTURE_CLAIM: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_SIGNUP'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_GROUP_CLAIM: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_GROUP_MANAGEMENT'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_OAUTH_ROLE_MANAGEMENT: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  ENABLE_OAUTH_GROUP_MANAGEMENT: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  OAUTH_ROLES_CLAIM: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_ROLE_MANAGEMENT'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_ALLOWED_ROLES: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_ROLE_MANAGEMENT'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_ADMIN_ROLES: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_ROLE_MANAGEMENT'],
    },
    wrappers: ['conditional-field'],
  },
  OAUTH_ALLOWED_DOMAINS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_OAUTH_GROUP_MANAGEMENT'],
    },
    wrappers: ['conditional-field'],
  },
  ENABLE_LDAP: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  LDAP_SERVER_LABEL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_SERVER_HOST: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_SERVER_PORT: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_ATTRIBUTE_FOR_MAIL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_ATTRIBUTE_FOR_USERNAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_APP_DN: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_APP_PASSWORD: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  LDAP_SEARCH_BASE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_SEARCH_FILTER: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_SEARCH_FILTERS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_USE_TLS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_CA_CERT_FILE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_VALIDATE_CERT: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  LDAP_CIPHERS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_LDAP'],
    },
    wrappers: ['conditional-field'],
  },
  USER_PERMISSIONS_CHAT_CONTROLS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_CHAT_FILE_UPLOAD: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_CHAT_DELETE: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_CHAT_EDIT: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_CHAT_STT: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_CHAT_TTS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_CHAT_CALL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_CHAT_MULTIPLE_MODELS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_CHAT_TEMPORARY: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['USER_PERMISSIONS_CHAT_TEMPORARY'],
    },
    wrappers: ['conditional-field'],
  },
  USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_FEATURES_WEB_SEARCH: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_FEATURES_IMAGE_GENERATION: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_FEATURES_CODE_INTERPRETER: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS'],
    },
    wrappers: ['conditional-field'],
  },
  USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS'],
    },
    wrappers: ['conditional-field'],
  },
  USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS'],
    },
    wrappers: ['conditional-field'],
  },
  USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS'],
    },
    wrappers: ['conditional-field'],
  },
  STORAGE_PROVIDER: {
    component: 'select-field',
    alternatives: ['textarea', 'markdown-text-area', 'radio-group', 'toggle-group'],
    props: {},
    wrappers: [],
  },
  S3_ACCESS_KEY_ID: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  S3_ADDRESSING_STYLE: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field'],
  },
  S3_BUCKET_NAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field'],
  },
  S3_ENDPOINT_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field'],
  },
  S3_KEY_PREFIX: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  S3_REGION_NAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field'],
  },
  S3_SECRET_ACCESS_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  S3_USE_ACCELERATE_ENDPOINT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field'],
  },
  S3_ENABLE_TAGGING: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field'],
  },
  GOOGLE_APPLICATION_CREDENTIALS_JSON: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  GCS_BUCKET_NAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field'],
  },
  AZURE_STORAGE_ENDPOINT: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field'],
  },
  AZURE_STORAGE_CONTAINER_NAME: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field'],
  },
  AZURE_STORAGE_KEY: {
    component: 'text-field',
    alternatives: [],
    props: {
      type: 'password',
      autoComplete: 'new-password',
      conditional: true,
      dependencies: ['STORAGE_PROVIDER', 'STORAGE_PROVIDER'],
    },
    wrappers: ['conditional-field', 'plan-restricted-feature'],
  },
  DATABASE_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  DATABASE_SCHEMA: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  DATABASE_POOL_SIZE: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  DATABASE_POOL_MAX_OVERFLOW: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  DATABASE_POOL_TIMEOUT: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  DATABASE_POOL_RECYCLE: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  REDIS_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  REDIS_SENTINEL_HOSTS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  REDIS_SENTINEL_PORT: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  ENABLE_WEBSOCKET_SUPPORT: {
    component: 'toggle-field',
    alternatives: ['checkbox', 'switch'],
    props: {},
    wrappers: [],
  },
  WEBSOCKET_MANAGER: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEBSOCKET_SUPPORT'],
    },
    wrappers: ['conditional-field'],
  },
  WEBSOCKET_REDIS_URL: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEBSOCKET_SUPPORT'],
    },
    wrappers: ['conditional-field'],
  },
  WEBSOCKET_SENTINEL_HOSTS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEBSOCKET_SUPPORT'],
    },
    wrappers: ['conditional-field'],
  },
  WEBSOCKET_SENTINEL_PORT: {
    component: 'text-field',
    alternatives: [],
    props: {
      conditional: true,
      dependencies: ['ENABLE_WEBSOCKET_SUPPORT'],
    },
    wrappers: ['conditional-field'],
  },
  UVICORN_WORKERS: {
    component: 'text-field',
    alternatives: [],
    props: {},
    wrappers: [],
  },
  PIP_OPTIONS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
  PIP_PACKAGE_INDEX_OPTIONS: {
    component: 'text-field',
    alternatives: ['textarea', 'markdown-text-area'],
    props: {},
    wrappers: [],
  },
} as const;

// Helper function to get component mapping for a field
export function getComponentMapping(fieldName: string): ComponentMapping | null {
  return componentMappings[fieldName] || null;
}

// Get suggested component for a field
export function getSuggestedComponent(fieldName: string): string {
  const mapping = componentMappings[fieldName];
  return mapping?.component || 'text-field';
}

// Get component props for a field
export function getComponentProps(fieldName: string): Record<string, any> {
  const mapping = componentMappings[fieldName];
  return mapping?.props || {};
}

// Integration Metadata - Information for framework integration
export const integrationMetadata = {
  validation: {
    zodIntegration: {
      schemaName: 'OpenWebUIConfigSchema',
      individualSchemas: [
        'WEBUI_URL_Schema',
        'ENABLE_SIGNUP_Schema',
        'ENABLE_LOGIN_FORM_Schema',
        'DEFAULT_LOCALE_Schema',
        'DEFAULT_MODELS_Schema',
        'DEFAULT_USER_ROLE_Schema',
        'PENDING_USER_OVERLAY_TITLE_Schema',
        'PENDING_USER_OVERLAY_CONTENT_Schema',
        'ENABLE_CHANNELS_Schema',
        'WEBHOOK_URL_Schema',
        'ENABLE_ADMIN_EXPORT_Schema',
        'ENABLE_ADMIN_CHAT_ACCESS_Schema',
        'ENABLE_USER_WEBHOOKS_Schema',
        'RESPONSE_WATERMARK_Schema',
        'THREAD_POOL_SIZE_Schema',
        'SHOW_ADMIN_DETAILS_Schema',
        'ADMIN_EMAIL_Schema',
        'ENV_Schema',
        'ENABLE_PERSISTENT_CONFIG_Schema',
        'CUSTOM_NAME_Schema',
        'WEBUI_NAME_Schema',
        'PORT_Schema',
        'ENABLE_REALTIME_CHAT_SAVE_Schema',
        'BYPASS_MODEL_ACCESS_CONTROL_Schema',
        'WEBUI_BUILD_HASH_Schema',
        'WEBUI_BANNERS_Schema',
        'USE_CUDA_DOCKER_Schema',
        'EXTERNAL_PWA_MANIFEST_URL_Schema',
        'ENABLE_TITLE_GENERATION_Schema',
        'LICENSE_KEY_Schema',
        'SSL_ASSERT_FINGERPRINT_Schema',
        'DEFAULT_PROMPT_SUGGESTIONS_Schema',
        'AIOHTTP_CLIENT_TIMEOUT_Schema',
        'AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST_Schema',
        'AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST_Schema',
        'DATA_DIR_Schema',
        'FONTS_DIR_Schema',
        'FRONTEND_BUILD_DIR_Schema',
        'STATIC_DIR_Schema',
        'ENABLE_OLLAMA_API_Schema',
        'OLLAMA_BASE_URLS_Schema',
        'USE_OLLAMA_DOCKER_Schema',
        'K8S_FLAG_Schema',
        'ENABLE_OPENAI_API_Schema',
        'OPENAI_API_BASE_URL_Schema',
        'OPENAI_API_BASE_URLS_Schema',
        'OPENAI_API_KEY_Schema',
        'OPENAI_API_KEYS_Schema',
        'TASK_MODEL_Schema',
        'TASK_MODEL_EXTERNAL_Schema',
        'TITLE_GENERATION_PROMPT_TEMPLATE_Schema',
        'TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE_Schema',
        'ENABLE_CODE_EXECUTION_Schema',
        'CODE_EXECUTION_ENGINE_Schema',
        'CODE_EXECUTION_JUPYTER_URL_Schema',
        'CODE_EXECUTION_JUPYTER_AUTH_Schema',
        'CODE_EXECUTION_JUPYTER_AUTH_TOKEN_Schema',
        'CODE_EXECUTION_JUPYTER_AUTH_PASSWORD_Schema',
        'CODE_EXECUTION_JUPYTER_TIMEOUT_Schema',
        'ENABLE_CODE_INTERPRETER_Schema',
        'CODE_INTERPRETER_ENGINE_Schema',
        'CODE_INTERPRETER_PROMPT_TEMPLATE_Schema',
        'CODE_INTERPRETER_JUPYTER_URL_Schema',
        'CODE_INTERPRETER_JUPYTER_AUTH_Schema',
        'CODE_INTERPRETER_JUPYTER_AUTH_TOKEN_Schema',
        'CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD_Schema',
        'CODE_INTERPRETER_JUPYTER_TIMEOUT_Schema',
        'ENABLE_DIRECT_CONNECTIONS_Schema',
        'ENABLE_AUTOCOMPLETE_GENERATION_Schema',
        'AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH_Schema',
        'AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE_Schema',
        'ENABLE_EVALUATION_ARENA_MODELS_Schema',
        'ENABLE_MESSAGE_RATING_Schema',
        'ENABLE_COMMUNITY_SHARING_Schema',
        'ENABLE_TAGS_GENERATION_Schema',
        'TAGS_GENERATION_PROMPT_TEMPLATE_Schema',
        'ENABLE_API_KEY_Schema',
        'ENABLE_API_KEY_ENDPOINT_RESTRICTIONS_Schema',
        'API_KEY_ALLOWED_ENDPOINTS_Schema',
        'JWT_EXPIRES_IN_Schema',
        'ENABLE_FORWARD_USER_INFO_HEADERS_Schema',
        'ENABLE_WEB_LOADER_SSL_VERIFICATION_Schema',
        'WEBUI_SESSION_COOKIE_SAME_SITE_Schema',
        'WEBUI_SESSION_COOKIE_SECURE_Schema',
        'WEBUI_AUTH_COOKIE_SAME_SITE_Schema',
        'WEBUI_AUTH_COOKIE_SECURE_Schema',
        'WEBUI_AUTH_Schema',
        'WEBUI_SECRET_KEY_Schema',
        'OFFLINE_MODE_Schema',
        'RESET_CONFIG_ON_START_Schema',
        'SAFE_MODE_Schema',
        'CORS_ALLOW_ORIGIN_Schema',
        'RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE_Schema',
        'RAG_RERANKING_MODEL_TRUST_REMOTE_CODE_Schema',
        'RAG_EMBEDDING_MODEL_AUTO_UPDATE_Schema',
        'RAG_RERANKING_MODEL_AUTO_UPDATE_Schema',
        'VECTOR_DB_Schema',
        'CHROMA_TENANT_Schema',
        'CHROMA_DATABASE_Schema',
        'CHROMA_HTTP_HOST_Schema',
        'CHROMA_HTTP_PORT_Schema',
        'CHROMA_HTTP_HEADERS_Schema',
        'CHROMA_HTTP_SSL_Schema',
        'CHROMA_CLIENT_AUTH_PROVIDER_Schema',
        'CHROMA_CLIENT_AUTH_CREDENTIALS_Schema',
        'ELASTICSEARCH_API_KEY_Schema',
        'ELASTICSEARCH_CA_CERTS_Schema',
        'ELASTICSEARCH_CLOUD_ID_Schema',
        'ELASTICSEARCH_INDEX_PREFIX_Schema',
        'ELASTICSEARCH_PASSWORD_Schema',
        'ELASTICSEARCH_URL_Schema',
        'ELASTICSEARCH_USERNAME_Schema',
        'MILVUS_URI_Schema',
        'MILVUS_DB_Schema',
        'MILVUS_TOKEN_Schema',
        'MILVUS_INDEX_TYPE_Schema',
        'MILVUS_METRIC_TYPE_Schema',
        'MILVUS_HNSW_M_Schema',
        'MILVUS_HNSW_EFCONSTRUCTION_Schema',
        'MILVUS_IVF_FLAT_NLIST_Schema',
        'OPENSEARCH_CERT_VERIFY_Schema',
        'OPENSEARCH_PASSWORD_Schema',
        'OPENSEARCH_SSL_Schema',
        'OPENSEARCH_URI_Schema',
        'OPENSEARCH_USERNAME_Schema',
        'PGVECTOR_DB_URL_Schema',
        'PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH_Schema',
        'QDRANT_API_KEY_Schema',
        'QDRANT_URI_Schema',
        'QDRANT_ON_DISK_Schema',
        'QDRANT_PREFER_GRPC_Schema',
        'QDRANT_GRPC_PORT_Schema',
        'ENABLE_QDRANT_MULTITENANCY_MODE_Schema',
        'PINECONE_API_KEY_Schema',
        'PINECONE_ENVIRONMENT_Schema',
        'PINECONE_INDEX_NAME_Schema',
        'PINECONE_DIMENSION_Schema',
        'PINECONE_METRIC_Schema',
        'PINECONE_CLOUD_Schema',
        'CONTENT_EXTRACTION_ENGINE_Schema',
        'MISTRAL_OCR_API_KEY_Schema',
        'EXTERNAL_DOCUMENT_LOADER_URL_Schema',
        'EXTERNAL_DOCUMENT_LOADER_API_KEY_Schema',
        'TIKA_SERVER_URL_Schema',
        'DOCLING_SERVER_URL_Schema',
        'DOCLING_OCR_ENGINE_Schema',
        'DOCLING_OCR_LANG_Schema',
        'RAG_EMBEDDING_ENGINE_Schema',
        'RAG_EMBEDDING_MODEL_Schema',
        'ENABLE_RAG_HYBRID_SEARCH_Schema',
        'RAG_TOP_K_Schema',
        'RAG_TOP_K_RERANKER_Schema',
        'RAG_RELEVANCE_THRESHOLD_Schema',
        'RAG_TEMPLATE_Schema',
        'RAG_TEXT_SPLITTER_Schema',
        'TIKTOKEN_CACHE_DIR_Schema',
        'TIKTOKEN_ENCODING_NAME_Schema',
        'CHUNK_SIZE_Schema',
        'CHUNK_OVERLAP_Schema',
        'PDF_EXTRACT_IMAGES_Schema',
        'RAG_FILE_MAX_SIZE_Schema',
        'RAG_FILE_MAX_COUNT_Schema',
        'RAG_ALLOWED_FILE_EXTENSIONS_Schema',
        'RAG_RERANKING_MODEL_Schema',
        'RAG_OPENAI_API_BASE_URL_Schema',
        'RAG_OPENAI_API_KEY_Schema',
        'RAG_EMBEDDING_OPENAI_BATCH_SIZE_Schema',
        'RAG_EMBEDDING_BATCH_SIZE_Schema',
        'RAG_OLLAMA_API_KEY_Schema',
        'RAG_OLLAMA_BASE_URL_Schema',
        'ENABLE_RETRIEVAL_QUERY_GENERATION_Schema',
        'QUERY_GENERATION_PROMPT_TEMPLATE_Schema',
        'BYPASS_EMBEDDING_AND_RETRIEVAL_Schema',
        'DOCUMENT_INTELLIGENCE_ENDPOINT_Schema',
        'DOCUMENT_INTELLIGENCE_KEY_Schema',
        'ENABLE_RAG_LOCAL_WEB_FETCH_Schema',
        'RAG_EMBEDDING_CONTENT_PREFIX_Schema',
        'RAG_EMBEDDING_PREFIX_FIELD_NAME_Schema',
        'RAG_EMBEDDING_QUERY_PREFIX_Schema',
        'RAG_FULL_CONTEXT_Schema',
        'ENABLE_GOOGLE_DRIVE_INTEGRATION_Schema',
        'GOOGLE_DRIVE_CLIENT_ID_Schema',
        'GOOGLE_DRIVE_API_KEY_Schema',
        'ENABLE_ONEDRIVE_INTEGRATION_Schema',
        'ONEDRIVE_CLIENT_ID_Schema',
        'ENABLE_WEB_SEARCH_Schema',
        'ENABLE_SEARCH_QUERY_GENERATION_Schema',
        'WEB_SEARCH_TRUST_ENV_Schema',
        'WEB_SEARCH_RESULT_COUNT_Schema',
        'WEB_SEARCH_CONCURRENT_REQUESTS_Schema',
        'WEB_SEARCH_ENGINE_Schema',
        'BYPASS_WEB_SEARCH_EMBEDDING_AND_RETRIEVAL_Schema',
        'SEARXNG_QUERY_URL_Schema',
        'GOOGLE_PSE_API_KEY_Schema',
        'GOOGLE_PSE_ENGINE_ID_Schema',
        'BRAVE_SEARCH_API_KEY_Schema',
        'KAGI_SEARCH_API_KEY_Schema',
        'MOJEEK_SEARCH_API_KEY_Schema',
        'SERPSTACK_API_KEY_Schema',
        'SERPSTACK_HTTPS_Schema',
        'SERPER_API_KEY_Schema',
        'SERPLY_API_KEY_Schema',
        'SEARCHAPI_API_KEY_Schema',
        'SEARCHAPI_ENGINE_Schema',
        'TAVILY_API_KEY_Schema',
        'JINA_API_KEY_Schema',
        'BING_SEARCH_V7_ENDPOINT_Schema',
        'BING_SEARCH_V7_SUBSCRIPTION_KEY_Schema',
        'BOCHA_SEARCH_API_KEY_Schema',
        'EXA_API_KEY_Schema',
        'SERPAPI_API_KEY_Schema',
        'SERPAPI_ENGINE_Schema',
        'SOUGOU_API_SID_Schema',
        'SOUGOU_API_SK_Schema',
        'TAVILY_EXTRACT_DEPTH_Schema',
        'WEB_LOADER_ENGINE_Schema',
        'PLAYWRIGHT_WS_URL_Schema',
        'FIRECRAWL_API_BASE_URL_Schema',
        'FIRECRAWL_API_KEY_Schema',
        'PERPLEXITY_API_KEY_Schema',
        'PLAYWRIGHT_TIMEOUT_Schema',
        'YOUTUBE_LOADER_PROXY_URL_Schema',
        'YOUTUBE_LOADER_LANGUAGE_Schema',
        'WHISPER_MODEL_Schema',
        'WHISPER_MODEL_DIR_Schema',
        'WHISPER_VAD_FILTER_Schema',
        'WHISPER_MODEL_AUTO_UPDATE_Schema',
        'WHISPER_LANGUAGE_Schema',
        'AUDIO_STT_ENGINE_Schema',
        'AUDIO_STT_MODEL_Schema',
        'AUDIO_STT_OPENAI_API_BASE_URL_Schema',
        'AUDIO_STT_OPENAI_API_KEY_Schema',
        'AUDIO_STT_AZURE_API_KEY_Schema',
        'AUDIO_STT_AZURE_REGION_Schema',
        'AUDIO_STT_AZURE_LOCALES_Schema',
        'DEEPGRAM_API_KEY_Schema',
        'AUDIO_TTS_API_KEY_Schema',
        'AUDIO_TTS_ENGINE_Schema',
        'AUDIO_TTS_MODEL_Schema',
        'AUDIO_TTS_VOICE_Schema',
        'AUDIO_TTS_SPLIT_ON_Schema',
        'AUDIO_TTS_AZURE_SPEECH_REGION_Schema',
        'AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT_Schema',
        'AUDIO_TTS_OPENAI_API_BASE_URL_Schema',
        'AUDIO_TTS_OPENAI_API_KEY_Schema',
        'IMAGE_GENERATION_ENGINE_Schema',
        'ENABLE_IMAGE_GENERATION_Schema',
        'ENABLE_IMAGE_PROMPT_GENERATION_Schema',
        'IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE_Schema',
        'IMAGE_SIZE_Schema',
        'IMAGE_STEPS_Schema',
        'IMAGE_GENERATION_MODEL_Schema',
        'AUTOMATIC1111_BASE_URL_Schema',
        'AUTOMATIC1111_API_AUTH_Schema',
        'AUTOMATIC1111_CFG_SCALE_Schema',
        'AUTOMATIC1111_SAMPLER_Schema',
        'AUTOMATIC1111_SCHEDULER_Schema',
        'COMFYUI_BASE_URL_Schema',
        'COMFYUI_API_KEY_Schema',
        'COMFYUI_WORKFLOW_Schema',
        'GEMINI_API_BASE_URL_Schema',
        'GEMINI_API_KEY_Schema',
        'IMAGES_GEMINI_API_BASE_URL_Schema',
        'IMAGES_GEMINI_API_KEY_Schema',
        'IMAGES_OPENAI_API_BASE_URL_Schema',
        'IMAGES_OPENAI_API_KEY_Schema',
        'ENABLE_OAUTH_SIGNUP_Schema',
        'OAUTH_MERGE_ACCOUNTS_BY_EMAIL_Schema',
        'OAUTH_UPDATE_PICTURE_ON_LOGIN_Schema',
        'WEBUI_AUTH_TRUSTED_EMAIL_HEADER_Schema',
        'WEBUI_AUTH_TRUSTED_NAME_HEADER_Schema',
        'GOOGLE_CLIENT_ID_Schema',
        'GOOGLE_CLIENT_SECRET_Schema',
        'GOOGLE_OAUTH_SCOPE_Schema',
        'GOOGLE_REDIRECT_URI_Schema',
        'MICROSOFT_CLIENT_ID_Schema',
        'MICROSOFT_CLIENT_SECRET_Schema',
        'MICROSOFT_CLIENT_TENANT_ID_Schema',
        'MICROSOFT_OAUTH_SCOPE_Schema',
        'MICROSOFT_REDIRECT_URI_Schema',
        'GITHUB_CLIENT_ID_Schema',
        'GITHUB_CLIENT_SECRET_Schema',
        'GITHUB_CLIENT_SCOPE_Schema',
        'GITHUB_CLIENT_REDIRECT_URI_Schema',
        'OAUTH_CLIENT_ID_Schema',
        'OAUTH_CLIENT_SECRET_Schema',
        'OPENID_PROVIDER_URL_Schema',
        'OPENID_REDIRECT_URI_Schema',
        'OAUTH_SCOPES_Schema',
        'OAUTH_CODE_CHALLENGE_METHOD_Schema',
        'OAUTH_PROVIDER_NAME_Schema',
        'OAUTH_USERNAME_CLAIM_Schema',
        'OAUTH_EMAIL_CLAIM_Schema',
        'OAUTH_PICTURE_CLAIM_Schema',
        'OAUTH_GROUP_CLAIM_Schema',
        'ENABLE_OAUTH_ROLE_MANAGEMENT_Schema',
        'ENABLE_OAUTH_GROUP_MANAGEMENT_Schema',
        'OAUTH_ROLES_CLAIM_Schema',
        'OAUTH_ALLOWED_ROLES_Schema',
        'OAUTH_ADMIN_ROLES_Schema',
        'OAUTH_ALLOWED_DOMAINS_Schema',
        'ENABLE_LDAP_Schema',
        'LDAP_SERVER_LABEL_Schema',
        'LDAP_SERVER_HOST_Schema',
        'LDAP_SERVER_PORT_Schema',
        'LDAP_ATTRIBUTE_FOR_MAIL_Schema',
        'LDAP_ATTRIBUTE_FOR_USERNAME_Schema',
        'LDAP_APP_DN_Schema',
        'LDAP_APP_PASSWORD_Schema',
        'LDAP_SEARCH_BASE_Schema',
        'LDAP_SEARCH_FILTER_Schema',
        'LDAP_SEARCH_FILTERS_Schema',
        'LDAP_USE_TLS_Schema',
        'LDAP_CA_CERT_FILE_Schema',
        'LDAP_VALIDATE_CERT_Schema',
        'LDAP_CIPHERS_Schema',
        'USER_PERMISSIONS_CHAT_CONTROLS_Schema',
        'USER_PERMISSIONS_CHAT_FILE_UPLOAD_Schema',
        'USER_PERMISSIONS_CHAT_DELETE_Schema',
        'USER_PERMISSIONS_CHAT_EDIT_Schema',
        'USER_PERMISSIONS_CHAT_STT_Schema',
        'USER_PERMISSIONS_CHAT_TTS_Schema',
        'USER_PERMISSIONS_CHAT_CALL_Schema',
        'USER_PERMISSIONS_CHAT_MULTIPLE_MODELS_Schema',
        'USER_PERMISSIONS_CHAT_TEMPORARY_Schema',
        'USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED_Schema',
        'USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS_Schema',
        'USER_PERMISSIONS_FEATURES_WEB_SEARCH_Schema',
        'USER_PERMISSIONS_FEATURES_IMAGE_GENERATION_Schema',
        'USER_PERMISSIONS_FEATURES_CODE_INTERPRETER_Schema',
        'USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS_Schema',
        'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS_Schema',
        'USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS_Schema',
        'USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS_Schema',
        'USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING_Schema',
        'USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING_Schema',
        'USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING_Schema',
        'USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING_Schema',
        'STORAGE_PROVIDER_Schema',
        'S3_ACCESS_KEY_ID_Schema',
        'S3_ADDRESSING_STYLE_Schema',
        'S3_BUCKET_NAME_Schema',
        'S3_ENDPOINT_URL_Schema',
        'S3_KEY_PREFIX_Schema',
        'S3_REGION_NAME_Schema',
        'S3_SECRET_ACCESS_KEY_Schema',
        'S3_USE_ACCELERATE_ENDPOINT_Schema',
        'S3_ENABLE_TAGGING_Schema',
        'GOOGLE_APPLICATION_CREDENTIALS_JSON_Schema',
        'GCS_BUCKET_NAME_Schema',
        'AZURE_STORAGE_ENDPOINT_Schema',
        'AZURE_STORAGE_CONTAINER_NAME_Schema',
        'AZURE_STORAGE_KEY_Schema',
        'DATABASE_URL_Schema',
        'DATABASE_SCHEMA_Schema',
        'DATABASE_POOL_SIZE_Schema',
        'DATABASE_POOL_MAX_OVERFLOW_Schema',
        'DATABASE_POOL_TIMEOUT_Schema',
        'DATABASE_POOL_RECYCLE_Schema',
        'REDIS_URL_Schema',
        'REDIS_SENTINEL_HOSTS_Schema',
        'REDIS_SENTINEL_PORT_Schema',
        'ENABLE_WEBSOCKET_SUPPORT_Schema',
        'WEBSOCKET_MANAGER_Schema',
        'WEBSOCKET_REDIS_URL_Schema',
        'WEBSOCKET_SENTINEL_HOSTS_Schema',
        'WEBSOCKET_SENTINEL_PORT_Schema',
        'UVICORN_WORKERS_Schema',
        'PIP_OPTIONS_Schema',
        'PIP_PACKAGE_INDEX_OPTIONS_Schema',
      ],
      validationReady: true,
    },
    characteristics: {
      requiredFields: [],
      fieldsWithConstraints: [],
      sensitiveFields: [
        'LICENSE_KEY',
        'OPENAI_API_KEY',
        'OPENAI_API_KEYS',
        'CODE_EXECUTION_JUPYTER_AUTH_TOKEN',
        'CODE_EXECUTION_JUPYTER_AUTH_PASSWORD',
        'CODE_INTERPRETER_JUPYTER_AUTH_TOKEN',
        'CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD',
        'ENABLE_API_KEY',
        'ENABLE_API_KEY_ENDPOINT_RESTRICTIONS',
        'API_KEY_ALLOWED_ENDPOINTS',
        'WEBUI_SECRET_KEY',
        'CHROMA_CLIENT_AUTH_CREDENTIALS',
        'ELASTICSEARCH_API_KEY',
        'ELASTICSEARCH_PASSWORD',
        'MILVUS_TOKEN',
        'OPENSEARCH_PASSWORD',
        'QDRANT_API_KEY',
        'PINECONE_API_KEY',
        'MISTRAL_OCR_API_KEY',
        'EXTERNAL_DOCUMENT_LOADER_API_KEY',
        'TIKTOKEN_CACHE_DIR',
        'TIKTOKEN_ENCODING_NAME',
        'RAG_OPENAI_API_KEY',
        'RAG_OLLAMA_API_KEY',
        'DOCUMENT_INTELLIGENCE_KEY',
        'GOOGLE_DRIVE_API_KEY',
        'GOOGLE_PSE_API_KEY',
        'BRAVE_SEARCH_API_KEY',
        'KAGI_SEARCH_API_KEY',
        'MOJEEK_SEARCH_API_KEY',
        'SERPSTACK_API_KEY',
        'SERPER_API_KEY',
        'SERPLY_API_KEY',
        'SEARCHAPI_API_KEY',
        'TAVILY_API_KEY',
        'JINA_API_KEY',
        'BING_SEARCH_V7_SUBSCRIPTION_KEY',
        'BOCHA_SEARCH_API_KEY',
        'EXA_API_KEY',
        'SERPAPI_API_KEY',
        'FIRECRAWL_API_KEY',
        'PERPLEXITY_API_KEY',
        'AUDIO_STT_OPENAI_API_KEY',
        'AUDIO_STT_AZURE_API_KEY',
        'DEEPGRAM_API_KEY',
        'AUDIO_TTS_API_KEY',
        'AUDIO_TTS_OPENAI_API_KEY',
        'COMFYUI_API_KEY',
        'GEMINI_API_KEY',
        'IMAGES_GEMINI_API_KEY',
        'IMAGES_OPENAI_API_KEY',
        'GOOGLE_CLIENT_SECRET',
        'MICROSOFT_CLIENT_SECRET',
        'GITHUB_CLIENT_SECRET',
        'OAUTH_CLIENT_SECRET',
        'LDAP_APP_PASSWORD',
        'S3_ACCESS_KEY_ID',
        'S3_KEY_PREFIX',
        'S3_SECRET_ACCESS_KEY',
        'GOOGLE_APPLICATION_CREDENTIALS_JSON',
        'AZURE_STORAGE_KEY',
      ],
    },
  },
  reactTsForm: {
    ready: true,
    totalFields: 370,
    conditionalFields: 240,
    componentMappings: 370,
  },
} as const;

// Validation integration info
export const validationIntegration = integrationMetadata.validation;

// react-ts-form integration status
export const reactTsFormIntegration = integrationMetadata.reactTsForm;

// Main uiSchema Export - Complete UI schema structure
export const openWebUiUiSchema: OpenWebUIUiSchema = {
  $schema: 'https://rjsf-team.github.io/react-jsonschema-form/docs/',
  $generated: {
    generatedAt: '2025-05-25T09:27:23.150Z',
    sourceSchema: 'OpenWebUI OpenAPI Configuration',
    totalFields: 370,
    totalCategories: 55,
    conditionalFields: 240,
  },
  categoryOrganization,
  fieldConfigurations,
  conditionalRules,
  componentMappings,
  integration: integrationMetadata,
} as const;

// Default export for convenience
export default openWebUiUiSchema;

// Utility Functions - Helper functions for working with the uiSchema

/**
 * Get all fields in a specific category
 */
export function getFieldsInCategory(categoryName: string): string[] {
  const category = categories.find(cat => cat.name === categoryName);
  return category ? category.fields.map(field => field.name) : [];
}

/**
 * Get category information for a field
 */
export function getFieldCategory(fieldName: string): CategoryInfo | null {
  const fieldConfig = fieldConfigurations[fieldName];
  if (!fieldConfig || !fieldConfig['ui:category']) return null;

  return categories.find(cat => cat.name === fieldConfig['ui:category']) || null;
}

/**
 * Get all fields that depend on a specific field
 */
export function getDependentFields(targetField: string): string[] {
  const dependents: string[] = [];

  Object.keys(conditionalRules).forEach(fieldName => {
    const rule = conditionalRules[fieldName];
    const dependsOnTarget = rule.rules.some(r => r.field === targetField);
    if (dependsOnTarget) {
      dependents.push(fieldName);
    }
  });

  return dependents;
}

/**
 * Get fields by characteristics
 */
export function getFieldsByCharacteristic(
  characteristic: 'sensitive' | 'conditional' | 'required',
): string[] {
  const fields: string[] = [];

  Object.keys(fieldConfigurations).forEach(fieldName => {
    const config = fieldConfigurations[fieldName];

    switch (characteristic) {
      case 'sensitive':
        if (config['ui:extensions'].envVar || config['ui:options']?.sensitive) {
          fields.push(fieldName);
        }
        break;
      case 'conditional':
        if (conditionalRules[fieldName]) {
          fields.push(fieldName);
        }
        break;
      case 'required':
        if (config['ui:validation'].required) {
          fields.push(fieldName);
        }
        break;
    }
  });

  return fields;
}

/**
 * Get categories by characteristics
 */
export function getCategoriesByCharacteristic(
  characteristic: 'hierarchical' | 'sensitive' | 'conditional',
): CategoryInfo[] {
  return categories.filter(category => {
    switch (characteristic) {
      case 'hierarchical':
        return category.characteristics.isHierarchical;
      case 'sensitive':
        return category.characteristics.hasSensitiveFields;
      case 'conditional':
        return category.characteristics.hasConditionalFields;
      default:
        return false;
    }
  });
}

/**
 * Validate uiSchema structure integrity
 */
export function validateUiSchemaIntegrity(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check that all field configurations reference valid categories
  Object.keys(fieldConfigurations).forEach(fieldName => {
    const config = fieldConfigurations[fieldName];
    if (config['ui:category']) {
      const categoryExists = categories.some(cat => cat.name === config['ui:category']);
      if (!categoryExists) {
        errors.push(
          `Field '${fieldName}' references non-existent category '${config['ui:category']}'`,
        );
      }
    }
  });

  // Check that all conditional rules reference valid fields
  Object.keys(conditionalRules).forEach(fieldName => {
    const rule = conditionalRules[fieldName];
    rule.rules.forEach(r => {
      if (!fieldConfigurations[r.field]) {
        errors.push(
          `Conditional rule for '${fieldName}' references non-existent field '${r.field}'`,
        );
      }
    });
  });

  // Check that all component mappings have valid field references
  Object.keys(componentMappings).forEach(fieldName => {
    if (!fieldConfigurations[fieldName]) {
      errors.push(`Component mapping exists for non-existent field '${fieldName}'`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get summary statistics about the uiSchema
 */
export function getUiSchemaSummary() {
  const integrity = validateUiSchemaIntegrity();

  return {
    totalFields: Object.keys(fieldConfigurations).length,
    totalCategories: categories.length,
    conditionalFields: Object.keys(conditionalRules).length,
    hierarchicalCategories: getCategoriesByCharacteristic('hierarchical').length,
    sensitiveFields: getFieldsByCharacteristic('sensitive').length,
    componentMappings: Object.keys(componentMappings).length,
    integrity: integrity.valid,
    integrityErrors: integrity.errors.length,
    generatedAt: openWebUiUiSchema.$generated.generatedAt,
  };
}
