/**
 * Component Mapping Configuration
 * 
 * This configuration file defines the declarative design rules for component mapping.
 * It follows the principle that component selection is a design decision, not a technical
 * inference problem. The rules here override the default component suggestions from the
 * uiSchema when specific design intent is needed.
 * 
 * Architecture Philosophy:
 * - Explicit overrides for fields requiring special treatment
 * - Pattern-based rules for consistency across similar fields
 * - Type-based defaults as the final fallback
 * - Focused and maintainable - only specify what needs special handling
 */

/**
 * Explicit field overrides for specific design decisions
 * Use this for individual fields that need special component treatment
 * regardless of their type or characteristics.
 */
export const EXPLICIT_FIELD_OVERRIDES = {
  // API Keys and secrets should always use secret-field component
  'OPENAI_API_KEY': 'secret-field',
  'OPENAI_API_KEYS': 'secret-field',
  'RAG_OPENAI_API_KEY': 'secret-field',
  'RAG_OLLAMA_API_KEY': 'secret-field',
  'GOOGLE_CLIENT_SECRET': 'secret-field',
  'MICROSOFT_CLIENT_SECRET': 'secret-field',
  'GITHUB_CLIENT_SECRET': 'secret-field',
  'OAUTH_CLIENT_SECRET': 'secret-field',
  'WEBUI_SECRET_KEY': 'secret-field',
  
  // Vector database selection is critical - use select for clear options
  'VECTOR_DB': 'select-field',
  'WEB_SEARCH_ENGINE': 'select-field',
  'CONTENT_EXTRACTION_ENGINE': 'select-field',
  'IMAGE_GENERATION_ENGINE': 'select-field',
  'AUDIO_TTS_ENGINE': 'select-field',
  'AUDIO_STT_ENGINE': 'select-field',
  
  // URLs should use URL input for validation
  'WEBUI_URL': 'url-input',
  'OPENAI_API_BASE_URL': 'url-input',
  'OLLAMA_BASE_URLS': 'url-input',
  'WEBHOOK_URL': 'url-input',
  
  // Complex text content should use markdown editor
  'RAG_TEMPLATE': 'markdown-text-area',
  'QUERY_GENERATION_PROMPT_TEMPLATE': 'markdown-text-area',
  'TITLE_GENERATION_PROMPT_TEMPLATE': 'markdown-text-area',
  'TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE': 'markdown-text-area',
  'CODE_INTERPRETER_PROMPT_TEMPLATE': 'markdown-text-area',
  'AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE': 'markdown-text-area',
  'TAGS_GENERATION_PROMPT_TEMPLATE': 'markdown-text-area',
  'IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE': 'markdown-text-area',
  
  // Arrays should use array management component
  'DEFAULT_MODELS': 'array-field',
  'WEBUI_BANNERS': 'array-field',
  'DEFAULT_PROMPT_SUGGESTIONS': 'array-field',
  'RAG_ALLOWED_FILE_EXTENSIONS': 'array-field',
};

/**
 * Pattern-based rules for consistency
 * These rules apply to fields matching specific naming patterns.
 * Patterns are checked in order, first match wins.
 */
export const PATTERN_RULES = [
  // API Keys pattern - any field ending with _API_KEY should be secret
  { 
    pattern: '*_API_KEY', 
    component: 'secret-field',
    wrappers: ['plan-restricted-feature'], // API keys often require premium access
    rationale: 'API keys contain sensitive authentication data'
  },
  
  // Password and secret patterns
  { 
    pattern: '*_PASSWORD', 
    component: 'secret-field',
    rationale: 'Password fields require masking for security'
  },
  { 
    pattern: '*_SECRET*', 
    component: 'secret-field',
    rationale: 'Fields containing "secret" handle sensitive data'
  },
  { 
    pattern: '*_TOKEN*', 
    component: 'secret-field',
    rationale: 'Tokens are authentication secrets'
  },
  { 
    pattern: '*_KEY*', 
    component: 'secret-field',
    rationale: 'Keys are typically sensitive authentication data'
  },
  
  // Enable toggles - boolean fields starting with ENABLE_
  { 
    pattern: 'ENABLE_*', 
    component: 'toggle-field',
    rationale: 'Enable flags are boolean toggles'
  },
  
  // URL patterns
  { 
    pattern: '*_URL', 
    component: 'url-input',
    rationale: 'URL fields benefit from URL-specific validation'
  },
  { 
    pattern: '*_BASE_URL*', 
    component: 'url-input',
    rationale: 'Base URL fields need URL validation'
  },
  { 
    pattern: '*_ENDPOINT*', 
    component: 'url-input',
    rationale: 'Endpoint fields are URLs'
  },
  
  // Template patterns - use markdown for rich text editing
  { 
    pattern: '*_TEMPLATE*', 
    component: 'markdown-text-area',
    rationale: 'Templates often contain complex formatting and placeholders'
  },
  { 
    pattern: '*_PROMPT*', 
    component: 'markdown-text-area',
    rationale: 'Prompt templates benefit from rich text editing'
  },
  
  // Port numbers
  { 
    pattern: '*_PORT', 
    component: 'text-field',
    rationale: 'Port numbers are numeric inputs'
  },
  
  // Directory and file paths
  { 
    pattern: '*_DIR', 
    component: 'text-field',
    rationale: 'Directory paths are text input fields'
  },
  { 
    pattern: '*_PATH', 
    component: 'text-field',
    rationale: 'File paths are text input fields'
  },
];

/**
 * Type-based defaults for unmapped fields
 * These are the final fallback rules when no explicit override or pattern matches.
 * Used to ensure every field gets a reasonable component assignment.
 */
export const TYPE_DEFAULTS = {
  'boolean': 'toggle-field',
  'string': 'text-field',
  'number': 'text-field',
  'integer': 'text-field',
  'array': 'array-field',
  'object': 'text-field', // Fallback for complex objects
};

/**
 * Component-specific wrapper requirements
 * Defines which wrapper components should be applied to specific field components
 * based on characteristics like conditional visibility or premium features.
 */
export const COMPONENT_WRAPPER_RULES = {
  // Secret fields often require premium access
  'secret-field': ['plan-restricted-feature'],
  
  // Array fields might need special handling for large datasets
  'array-field': [], // No default wrappers, but can be added per field
  
  // Markdown areas might be premium features
  'markdown-text-area': [], // No default wrappers
};

/**
 * Default component props based on field characteristics
 * These props are applied to components based on the field's metadata and constraints.
 */
export const DEFAULT_COMPONENT_PROPS = {
  'secret-field': {
    autoComplete: 'new-password',
    type: 'password',
  },
  
  'url-input': {
    type: 'url',
    placeholder: 'https://example.com',
  },
  
  'text-field': {
    autoComplete: 'off',
  },
  
  'toggle-field': {
    // No default props for toggles
  },
  
  'select-field': {
    // Props will be derived from enum values
  },
  
  'array-field': {
    // Props will be derived from array schema
  },
  
  'markdown-text-area': {
    rows: 4,
    placeholder: 'Enter template content with placeholders...',
  },
};

/**
 * Special handling rules for conditional fields
 * Defines how fields with dependencies should be wrapped and handled.
 */
export const CONDITIONAL_FIELD_RULES = {
  // Fields that depend on provider selection need conditional wrapper
  wrapWithConditional: true,
  
  // Add help text for conditional fields
  addConditionalHelpText: true,
  
  // Group related conditional fields when possible
  groupRelatedConditionals: true,
};

/**
 * Validation integration rules
 * Defines how validation constraints from Zod schemas should influence component selection.
 */
export const VALIDATION_INFLUENCE_RULES = {
  // Fields with enum constraints should prefer select components
  enumFieldsUseSelect: true,
  
  // Fields with string length constraints get appropriate input props
  stringConstraintsToProps: true,
  
  // Number fields with min/max get appropriate input props
  numberConstraintsToProps: true,
  
  // Pattern constraints add validation hints
  patternConstraintsToValidation: true,
};

/**
 * Component alternatives for progressive enhancement
 * Defines alternative components that could be used for specific fields,
 * enabling future UI flexibility without changing the core mapping logic.
 */
export const COMPONENT_ALTERNATIVES = {
  'text-field': ['textarea', 'input'],
  'select-field': ['radio-group', 'combobox'],
  'toggle-field': ['checkbox', 'switch'],
  'array-field': ['tags-input', 'multi-select'],
  'secret-field': ['password-input'],
  'url-input': ['text-field'],
  'markdown-text-area': ['textarea', 'code-editor'],
};

/**
 * Configuration validation rules
 * These rules help validate that the configuration makes sense and catch common mistakes.
 */
export const CONFIG_VALIDATION_RULES = {
  // Ensure all referenced components exist in the available component library
  validateComponentExists: true,
  
  // Warn about fields that might need special handling but don't have overrides
  warnUnhandledSpecialFields: true,
  
  // Check for conflicting rules
  detectConflictingRules: true,
  
  // Validate wrapper component compatibility
  validateWrapperCompatibility: true,
};

/**
 * Priority order for rule application
 * Defines the order in which different types of rules are applied.
 * Earlier rules have higher priority.
 */
export const RULE_PRIORITY_ORDER = [
  'EXPLICIT_FIELD_OVERRIDES',
  'PATTERN_RULES',
  'CONDITIONAL_FIELD_RULES', 
  'VALIDATION_INFLUENCE_RULES',
  'TYPE_DEFAULTS'
];

/**
 * Available shadcn components from the form component library
 * This serves as the source of truth for what components are available
 * and helps validate that all mappings use real components.
 */
export const AVAILABLE_COMPONENTS = [
  'text-field',
  'secret-field', 
  'select-field',
  'toggle-field',
  'url-input',
  'array-field',
  'markdown-text-area',
];

/**
 * Available wrapper components
 * Components that can wrap other components to add functionality.
 */
export const AVAILABLE_WRAPPERS = [
  'conditional-field',
  'overrideable-field', 
  'plan-restricted-feature',
];

/**
 * Debug and development helpers
 * Configuration options for debugging and development of the mapping system.
 */
export const DEBUG_CONFIG = {
  // Log component assignment decisions
  logAssignmentDecisions: false,
  
  // Show statistics about rule usage
  showRuleUsageStats: true,
  
  // Validate all assignments against available components
  validateAllAssignments: true,
  
  // Generate mapping coverage report
  generateCoverageReport: true,
};
