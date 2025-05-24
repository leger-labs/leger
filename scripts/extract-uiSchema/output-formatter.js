/**
 * Output Formatter Module
 * Formats the processed uiSchema structure into high-quality TypeScript output
 * Generates well-documented, type-safe code ready for react-ts-form integration
 */

/**
 * Format the uiSchema structure into TypeScript output
 * @param {object} uiSchemaStructure - The complete processed uiSchema structure
 * @returns {Promise<string>} Formatted TypeScript file content
 */
export async function formatOutput(uiSchemaStructure) {
  console.log('Formatting uiSchema output for TypeScript...');
  
  // Generate the TypeScript content
  const content = generateTypeScriptContent(uiSchemaStructure);
  
  // Format with prettier if available
  let formattedContent = content;
  
  try {
    const prettier = await import('prettier');
    const options = {
      parser: 'typescript',
      printWidth: 100,
      tabWidth: 2,
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
      arrowParens: 'avoid'
    };
    
    formattedContent = await prettier.default.format(content, options);
    console.log('✓ Formatted output with prettier');
  } catch (error) {
    console.warn('⚠️  Could not format with prettier, using unformatted output:', error.message);
  }
  
  return formattedContent;
}

/**
 * Generate the complete TypeScript file content
 * @param {object} uiSchema - The processed uiSchema structure
 * @returns {string} Complete TypeScript file content
 */
function generateTypeScriptContent(uiSchema) {
  const {
    categoryOrganization,
    fieldConfigurations,
    conditionalRules,
    componentMappings,
    integration,
    $generated: metadata
  } = uiSchema;
  
  const sections = [];
  
  // File header with documentation
  sections.push(generateFileHeader(metadata));
  
  // Type definitions
  sections.push(generateTypeDefinitions());
  
  // Category organization exports
  sections.push(generateCategoryOrganization(categoryOrganization));
  
  // Field configurations export
  sections.push(generateFieldConfigurations(fieldConfigurations));
  
  // Conditional rules export
  sections.push(generateConditionalRules(conditionalRules));
  
  // Component mappings export
  sections.push(generateComponentMappings(componentMappings));
  
  // Integration metadata export
  sections.push(generateIntegrationMetadata(integration));
  
  // Main uiSchema export
  sections.push(generateMainExport(uiSchema));
  
  // Utility functions
  sections.push(generateUtilityFunctions());
  
  return sections.join('\n\n');
}

/**
 * Generate the file header with documentation
 * @param {object} metadata - Generation metadata
 * @returns {string} File header content
 */
function generateFileHeader(metadata) {
  return `/**
 * Generated uiSchema from OpenWebUI OpenAPI Configuration
 * DO NOT EDIT DIRECTLY - Changes will be overwritten
 * 
 * This file contains UI organization metadata extracted from the OpenAPI schema
 * for use with RJSF-compatible form generation and react-ts-form integration.
 * 
 * Generated at: ${metadata.generatedAt}
 * Source: ${metadata.sourceSchema}
 * 
 * Statistics:
 * - Total fields: ${metadata.totalFields}
 * - Categories: ${metadata.totalCategories}
 * - Conditional fields: ${metadata.conditionalFields}
 */`;
}

/**
 * Generate TypeScript type definitions
 * @returns {string} Type definitions section
 */
function generateTypeDefinitions() {
  return `// Core type definitions for uiSchema structure
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
}`;
}

/**
 * Generate category organization section
 * @param {object} categoryOrganization - Category organization data
 * @returns {string} Category organization code
 */
function generateCategoryOrganization(categoryOrganization) {
  const { categories, hierarchy, metadata } = categoryOrganization;
  
  return `// Category Organization - Defines how fields are grouped and organized
export const categoryOrganization: CategoryOrganization = ${JSON.stringify({
    categories,
    hierarchy,
    metadata
  }, null, 2)} as const;

// Flat array of categories for easy iteration
export const categories = categoryOrganization.categories;

// Hierarchical category structure for nested UI rendering
export const hierarchicalCategories = categoryOrganization.hierarchy;

// Category metadata and statistics
export const categoryMetadata = categoryOrganization.metadata;`;
}

/**
 * Generate field configurations section
 * @param {object} fieldConfigurations - Field configuration data
 * @returns {string} Field configurations code
 */
function generateFieldConfigurations(fieldConfigurations) {
  const fieldNames = Object.keys(fieldConfigurations);
  const configsPerChunk = 50; // Split large configs into manageable chunks
  const chunks = [];
  
  for (let i = 0; i < fieldNames.length; i += configsPerChunk) {
    const chunkFields = fieldNames.slice(i, i + configsPerChunk);
    const chunkConfig = {};
    chunkFields.forEach(fieldName => {
      chunkConfig[fieldName] = fieldConfigurations[fieldName];
    });
    chunks.push(chunkConfig);
  }
  
  let code = '// Field Configurations - Individual field UI configuration\n';
  
  chunks.forEach((chunk, index) => {
    code += `const fieldConfigurationsPart${index + 1} = ${JSON.stringify(chunk, null, 2)} as const;\n\n`;
  });
  
  code += `// Combined field configurations
export const fieldConfigurations: Record<string, FieldConfiguration> = {
  ${chunks.map((_, index) => `...fieldConfigurationsPart${index + 1}`).join(',\n  ')}
} as const;`;
  
  return code;
}

/**
 * Generate conditional rules section
 * @param {object} conditionalRules - Conditional rules data
 * @returns {string} Conditional rules code
 */
function generateConditionalRules(conditionalRules) {
  return `// Conditional Rules - Defines when fields should be shown/hidden
export const conditionalRules: Record<string, ConditionalRule> = ${JSON.stringify(conditionalRules, null, 2)} as const;

// Helper function to get conditional rule for a field
export function getConditionalRule(fieldName: string): ConditionalRule | null {
  return conditionalRules[fieldName] || null;
}

// Check if a field has conditional logic
export function isConditionalField(fieldName: string): boolean {
  return Boolean(conditionalRules[fieldName]);
}`;
}

/**
 * Generate component mappings section
 * @param {object} componentMappings - Component mapping data
 * @returns {string} Component mappings code
 */
function generateComponentMappings(componentMappings) {
  return `// Component Mappings - Suggests React components for each field
export const componentMappings: Record<string, ComponentMapping> = ${JSON.stringify(componentMappings, null, 2)} as const;

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
}`;
}

/**
 * Generate integration metadata section
 * @param {object} integration - Integration metadata
 * @returns {string} Integration metadata code
 */
function generateIntegrationMetadata(integration) {
  return `// Integration Metadata - Information for framework integration
export const integrationMetadata = ${JSON.stringify(integration, null, 2)} as const;

// Validation integration info
export const validationIntegration = integrationMetadata.validation;

// react-ts-form integration status
export const reactTsFormIntegration = integrationMetadata.reactTsForm;`;
}

/**
 * Generate main uiSchema export
 * @param {object} uiSchema - Complete uiSchema structure
 * @returns {string} Main export code
 */
function generateMainExport(uiSchema) {
  return `// Main uiSchema Export - Complete UI schema structure
export const openWebUiUiSchema: OpenWebUIUiSchema = {
  $schema: '${uiSchema.$schema}',
  $generated: ${JSON.stringify(uiSchema.$generated, null, 2)},
  categoryOrganization,
  fieldConfigurations,
  conditionalRules,
  componentMappings,
  integration: integrationMetadata
} as const;

// Default export for convenience
export default openWebUiUiSchema;`;
}

/**
 * Generate utility functions
 * @returns {string} Utility functions code
 */
function generateUtilityFunctions() {
  return `// Utility Functions - Helper functions for working with the uiSchema

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
export function getFieldsByCharacteristic(characteristic: 'sensitive' | 'conditional' | 'required'): string[] {
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
export function getCategoriesByCharacteristic(characteristic: 'hierarchical' | 'sensitive' | 'conditional'): CategoryInfo[] {
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
        errors.push(\`Field '\${fieldName}' references non-existent category '\${config['ui:category']}'\`);
      }
    }
  });
  
  // Check that all conditional rules reference valid fields
  Object.keys(conditionalRules).forEach(fieldName => {
    const rule = conditionalRules[fieldName];
    rule.rules.forEach(r => {
      if (!fieldConfigurations[r.field]) {
        errors.push(\`Conditional rule for '\${fieldName}' references non-existent field '\${r.field}'\`);
      }
    });
  });
  
  // Check that all component mappings have valid field references
  Object.keys(componentMappings).forEach(fieldName => {
    if (!fieldConfigurations[fieldName]) {
      errors.push(\`Component mapping exists for non-existent field '\${fieldName}'\`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
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
    generatedAt: openWebUiUiSchema.$generated.generatedAt
  };
}`;
}

/**
 * Generate JSDoc comments for complex objects
 * @param {string} objectName - Name of the object
 * @param {string} description - Description of the object
 * @returns {string} JSDoc comment
 */
function generateJSDoc(objectName, description) {
  return `/**
 * ${description}
 * @generated This object was automatically generated from OpenAPI schema
 * @readonly Do not modify this object directly
 */`;
}
