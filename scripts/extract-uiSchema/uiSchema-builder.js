/**
 * uiSchema Builder Module
 * Assembles the comprehensive uiSchema structure from all processed data
 * Creates RJSF-compatible organization while preparing for react-ts-form integration
 */

/**
 * Build the comprehensive uiSchema structure
 * This is the core assembly function that brings together all processed metadata
 * @param {object} input - Object containing all processed data
 * @param {object} input.extensionsMap - Extracted extension data
 * @param {object} input.categoryStructure - Category organization  
 * @param {object} input.dependencyMap - Processed dependencies
 * @param {object} input.originalSchema - Original OpenAPI schema
 * @returns {object} Complete uiSchema structure
 */
export function buildUiSchema({ extensionsMap, categoryStructure, dependencyMap, originalSchema }) {
  console.log('Building comprehensive uiSchema structure...');
  
  // Step 1: Build the category-based organization structure
  const categoryOrganization = buildCategoryOrganization(categoryStructure);
  
  // Step 2: Build field-level configurations
  const fieldConfigurations = buildFieldConfigurations(extensionsMap, dependencyMap, originalSchema);
  
  // Step 3: Build conditional rendering rules
  const conditionalRules = buildConditionalRules(dependencyMap);
  
  // Step 4: Generate component mapping hints for react-ts-form
  const componentMappings = buildComponentMappings(extensionsMap, dependencyMap);
  
  // Step 5: Create validation integration metadata
  const validationIntegration = buildValidationIntegration(originalSchema, extensionsMap);
  
  // Step 6: Assemble the final uiSchema structure
  const uiSchema = assembleUiSchema({
    categoryOrganization,
    fieldConfigurations, 
    conditionalRules,
    componentMappings,
    validationIntegration,
    metadata: {
      generatedAt: new Date().toISOString(),
      sourceSchema: 'OpenWebUI OpenAPI Configuration',
      totalFields: Object.keys(extensionsMap).length,
      totalCategories: categoryStructure.categories.length,
      conditionalFields: Object.keys(dependencyMap).length
    }
  });
  
  console.log(`✓ Built uiSchema with ${Object.keys(fieldConfigurations).length} field configurations`);
  console.log(`  - Categories: ${categoryOrganization.categories.length}`);
  console.log(`  - Conditional fields: ${Object.keys(conditionalRules).length}`);
  console.log(`  - Component mappings: ${Object.keys(componentMappings).length}`);
  
  return uiSchema;
}

/**
 * Build category-based organization structure for the uiSchema
 * This creates both flat and hierarchical organization patterns
 * @param {object} categoryStructure - Processed category data
 * @returns {object} Category organization for uiSchema
 */
function buildCategoryOrganization(categoryStructure) {
  const { categories, hierarchy, metadata } = categoryStructure;
  
  // Create flat category list with RJSF-compatible structure
  const flatCategories = categories.map(category => ({
    // Basic category information
    name: category.name,
    displayName: category.displayName,
    description: category.description,
    order: category.displayOrder,
    
    // Field organization within category
    fields: category.fields.map(field => ({
      name: field.name,
      order: field.displayOrder,
      category: category.name
    })).sort((a, b) => a.order - b.order),
    
    // Category characteristics for UI rendering hints
    characteristics: {
      fieldCount: category.fieldCount,
      hasConditionalFields: category.hasConditionalFields,
      hasSensitiveFields: category.hasSensitiveFields,
      isHierarchical: category.isHierarchical,
      parent: category.parent,
      child: category.child
    },
    
    // Suggested UI rendering approach
    renderingHints: {
      expandable: category.fieldCount > 10,
      collapsible: category.fieldCount > 5,
      inline: category.fieldCount <= 3,
      requiresSpecialHandling: category.hasSensitiveFields || category.hasConditionalFields
    }
  }));
  
  // Create hierarchical category structure for nested UI rendering
  const hierarchicalCategories = Object.keys(hierarchy).map(parentName => {
    const parent = hierarchy[parentName];
    
    return {
      name: parentName,
      displayName: parent.displayName,
      description: parent.description,
      isParent: parent.isParent,
      totalFields: parent.totalFields,
      
      // Child categories if this is a parent
      children: parent.children ? parent.children.map(child => ({
        name: child.name,
        displayName: child.displayName,
        fieldCount: child.fieldCount,
        fields: child.fields.map(f => f.name).sort(),
        order: child.displayOrder
      })).sort((a, b) => a.order - b.order) : [],
      
      // Combined characteristics from all children
      characteristics: {
        hasConditionalFields: parent.hasConditionalFields,
        hasSensitiveFields: parent.hasSensitiveFields,
        totalFieldCount: parent.totalFields
      }
    };
  });
  
  return {
    categories: flatCategories,
    hierarchy: hierarchicalCategories,
    metadata: {
      totalCategories: flatCategories.length,
      hierarchicalGroups: hierarchicalCategories.length,
      avgFieldsPerCategory: Math.round(metadata.totalFields / flatCategories.length),
      categoryDistribution: metadata.fieldDistribution
    }
  };
}

/**
 * Build field-level configurations for each property
 * This creates the per-field uiSchema configuration that RJSF expects
 * @param {object} extensionsMap - Extracted extension data
 * @param {object} dependencyMap - Processed dependency information
 * @param {object} originalSchema - Original OpenAPI schema for validation context
 * @returns {object} Field configurations object
 */
function buildFieldConfigurations(extensionsMap, dependencyMap, originalSchema) {
  const fieldConfigurations = {};
  
  Object.keys(extensionsMap).forEach(fieldName => {
    const fieldData = extensionsMap[fieldName];
    const dependencyInfo = dependencyMap[fieldName];
    const schemaProperty = originalSchema.properties?.[fieldName] || {};
    
    // Build comprehensive field configuration
    fieldConfigurations[fieldName] = {
      // Basic field information
      name: fieldName,
      type: fieldData.standardMetadata.type,
      format: fieldData.standardMetadata.format,
      
      // UI presentation configuration  
      'ui:title': deriveFieldTitle(fieldName, fieldData, schemaProperty),
      'ui:description': fieldData.standardMetadata.description || schemaProperty.description,
      'ui:help': buildFieldHelp(fieldData, dependencyInfo),
      
      // Widget and component configuration
      'ui:widget': suggestWidget(fieldData, dependencyInfo),
      'ui:options': buildFieldOptions(fieldData, dependencyInfo, schemaProperty),
      
      // Category and ordering information
      'ui:category': fieldData.customExtensions.category?.name,
      'ui:order': fieldData.customExtensions['display-order'] || 999,
      
      // Conditional rendering (if field has dependencies)
      ...(dependencyInfo && {
        'ui:condition': buildFieldCondition(dependencyInfo)
      }),
      
      // Sensitivity and security handling
      ...(fieldData.customExtensions.sensitive && {
        'ui:options': {
          ...buildFieldOptions(fieldData, dependencyInfo, schemaProperty),
          inputType: 'password',
          autoComplete: 'off',
          sensitive: true
        }
      }),
      
      // Validation integration hints
      'ui:validation': buildValidationHints(fieldData, schemaProperty),
      
      // Custom extension metadata preserved for future use
      'ui:extensions': {
        visibility: fieldData.customExtensions.visibility,
        defaultHandling: fieldData.customExtensions['default-handling'],
        rationale: fieldData.customExtensions.rationale,
        envVar: fieldData.customExtensions['env-var'],
        persistentConfig: fieldData.customExtensions['persistent-config']
      }
    };
  });
  
  return fieldConfigurations;
}

/**
 * Derive an appropriate title for a field based on its name and metadata
 * @param {string} fieldName - The field name
 * @param {object} fieldData - Field extension data  
 * @param {object} schemaProperty - Original schema property
 * @returns {string} Derived field title
 */
function deriveFieldTitle(fieldName, fieldData, schemaProperty) {
  // Use existing title if available
  if (schemaProperty.title) {
    return schemaProperty.title;
  }
  
  // Convert field name to human-readable format
  // Handle common patterns: SCREAMING_CASE, camelCase, kebab-case
  let title = fieldName;
  
  // Convert SCREAMING_CASE to Title Case
  if (fieldName === fieldName.toUpperCase() && fieldName.includes('_')) {
    title = fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  // Convert camelCase to Title Case  
  else if (fieldName !== fieldName.toLowerCase()) {
    title = fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
  // Convert kebab-case to Title Case
  else if (fieldName.includes('-')) {
    title = fieldName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return title;
}

/**
 * Build help text for a field based on its metadata and dependencies
 * @param {object} fieldData - Field extension data
 * @param {object} dependencyInfo - Dependency information
 * @returns {string} Field help text
 */
function buildFieldHelp(fieldData, dependencyInfo) {
  const helpParts = [];
  
  // Add rationale if available
  if (fieldData.customExtensions.rationale) {
    helpParts.push(fieldData.customExtensions.rationale);
  }
  
  // Add dependency information
  if (dependencyInfo) {
    const conditionCount = dependencyInfo.conditions.rules.length;
    if (conditionCount === 1) {
      const rule = dependencyInfo.conditions.rules[0];
      helpParts.push(`This field is shown when ${rule.field} is set to "${rule.value}".`);
    } else if (conditionCount > 1) {
      helpParts.push(`This field has ${conditionCount} conditional requirements.`);
    }
  }
  
  // Add environment variable information
  if (fieldData.customExtensions['env-var']) {
    helpParts.push(`Environment variable: ${fieldData.customExtensions['env-var']}`);
  }
  
  return helpParts.join(' ');
}

/**
 * Suggest appropriate widget for a field based on its characteristics
 * @param {object} fieldData - Field extension data
 * @param {object} dependencyInfo - Dependency information
 * @returns {string} Suggested widget name  
 */
function suggestWidget(fieldData, dependencyInfo) {
  const { type, format, enum: enumValues } = fieldData.standardMetadata;
  const isSensitive = fieldData.customExtensions.sensitive;
  
  // Handle sensitive fields
  if (isSensitive) {
    return 'PasswordWidget';
  }
  
  // Handle enumerated values
  if (enumValues && enumValues.length > 0) {
    return enumValues.length <= 4 ? 'RadioWidget' : 'SelectWidget';
  }
  
  // Handle by type and format
  switch (type) {
    case 'boolean':
      return 'CheckboxWidget';
      
    case 'string':
      if (format === 'password') return 'PasswordWidget';
      if (format === 'email') return 'EmailWidget';
      if (format === 'uri') return 'URLWidget';
      if (format === 'data-url') return 'FileWidget';
      return 'TextWidget';
      
    case 'number':
    case 'integer':
      return 'TextWidget'; // Could be UpDownWidget for certain ranges
      
    case 'array':
      return 'default'; // Let RJSF handle array rendering
      
    default:
      return 'TextWidget';
  }
}

/**
 * Build field options for UI configuration
 * @param {object} fieldData - Field extension data
 * @param {object} dependencyInfo - Dependency information
 * @param {object} schemaProperty - Original schema property
 * @returns {object} UI options object
 */
function buildFieldOptions(fieldData, dependencyInfo, schemaProperty) {
  const options = {};
  
  // Add placeholder text
  if (fieldData.standardMetadata.examples && fieldData.standardMetadata.examples.length > 0) {
    options.placeholder = `e.g., ${fieldData.standardMetadata.examples[0]}`;
  }
  
  // Add input constraints
  if (fieldData.standardMetadata.minLength) options.minLength = fieldData.standardMetadata.minLength;
  if (fieldData.standardMetadata.maxLength) options.maxLength = fieldData.standardMetadata.maxLength;
  if (fieldData.standardMetadata.minimum) options.min = fieldData.standardMetadata.minimum;
  if (fieldData.standardMetadata.maximum) options.max = fieldData.standardMetadata.maximum;
  if (fieldData.standardMetadata.pattern) options.pattern = fieldData.standardMetadata.pattern;
  
  // Add enum-specific options
  if (fieldData.standardMetadata.enum) {
    options.enumOptions = fieldData.standardMetadata.enum.map(value => ({
      value: value,
      label: String(value).charAt(0).toUpperCase() + String(value).slice(1)
    }));
  }
  
  // Add conditional field options
  if (dependencyInfo) {
    options.conditional = true;
    options.conditionCount = dependencyInfo.conditions.rules.length;
  }
  
  // Add react-ts-form integration hints
  options.reactTsForm = {
    suggestedComponent: dependencyInfo?.metadata?.suggestedComponent || 'text-field',
    hasComplexLogic: dependencyInfo?.metadata?.hasComplexLogic || false,
    isProviderDependent: dependencyInfo?.metadata?.isProviderDependent || false
  };
  
  return options;
}

/**
 * Build conditional rendering rules for dependent fields
 * @param {object} dependencyMap - Processed dependency information
 * @returns {object} Conditional rules for uiSchema
 */
function buildConditionalRules(dependencyMap) {
  const conditionalRules = {};
  
  Object.keys(dependencyMap).forEach(fieldName => {
    const dependency = dependencyMap[fieldName];
    
    conditionalRules[fieldName] = {
      type: dependency.type,
      operator: dependency.conditions.operator,
      rules: dependency.conditions.rules.map(rule => ({
        field: rule.field,
        operator: rule.operator,
        value: rule.value,
        type: rule.type
      })),
      
      // Metadata for UI rendering
      metadata: {
        complexity: dependency.metadata.hasComplexLogic ? 'complex' : 'simple',
        conditionCount: dependency.metadata.conditionCount,
        chainDepth: dependency.chainDepth || 1
      }
    };
  });
  
  return conditionalRules;
}

/**
 * Build field condition object for RJSF conditional rendering
 * @param {object} dependencyInfo - Dependency information for a field
 * @returns {object} RJSF-compatible condition object
 */
function buildFieldCondition(dependencyInfo) {
  const { conditions } = dependencyInfo;
  
  if (conditions.rules.length === 1) {
    // Simple condition
    const rule = conditions.rules[0];
    return {
      field: rule.field,
      operator: rule.operator,
      value: rule.value
    };
  } else {
    // Complex condition with multiple rules
    return {
      operator: conditions.operator,
      conditions: conditions.rules.map(rule => ({
        field: rule.field,
        operator: rule.operator,
        value: rule.value
      }))
    };
  }
}

/**
 * Build component mappings for react-ts-form integration
 * @param {object} extensionsMap - Extracted extension data
 * @param {object} dependencyMap - Processed dependency information
 * @returns {object} Component mapping hints
 */
function buildComponentMappings(extensionsMap, dependencyMap) {
  const componentMappings = {};
  
  Object.keys(extensionsMap).forEach(fieldName => {
    const fieldData = extensionsMap[fieldName];
    const dependencyInfo = dependencyMap[fieldName];
    
    componentMappings[fieldName] = {
      // Primary component suggestion
      component: dependencyInfo?.metadata?.suggestedComponent || inferComponentFromType(fieldData),
      
      // Alternative components
      alternatives: suggestAlternativeComponents(fieldData),
      
      // Component props hints
      props: buildComponentProps(fieldData, dependencyInfo),
      
      // Wrapper components needed
      wrappers: buildWrapperComponents(fieldData, dependencyInfo)
    };
  });
  
  return componentMappings;
}

/**
 * Infer component type from field data
 * @param {object} fieldData - Field extension data
 * @returns {string} Suggested component name
 */
function inferComponentFromType(fieldData) {
  const { type, format, enum: enumValues } = fieldData.standardMetadata;
  const isSensitive = fieldData.customExtensions.sensitive;
  
  if (isSensitive) return 'secret-field';
  if (enumValues) return 'select-field';
  
  switch (type) {
    case 'boolean': return 'toggle-field';
    case 'string': 
      if (format === 'uri') return 'url-input';
      return 'text-field';
    case 'number':
    case 'integer': return 'text-field';
    case 'array': return 'array-field';
    default: return 'text-field';
  }
}

/**
 * Suggest alternative components for a field
 * @param {object} fieldData - Field extension data
 * @returns {Array} Array of alternative component names
 */
function suggestAlternativeComponents(fieldData) {
  const alternatives = [];
  const { type, enum: enumValues } = fieldData.standardMetadata;
  
  if (type === 'string' && !fieldData.customExtensions.sensitive) {
    alternatives.push('textarea', 'markdown-text-area');
  }
  
  if (enumValues && enumValues.length <= 4) {
    alternatives.push('radio-group', 'toggle-group');
  }
  
  if (type === 'boolean') {
    alternatives.push('checkbox', 'switch');
  }
  
  return alternatives;
}

/**
 * Build component props hints
 * @param {object} fieldData - Field extension data
 * @param {object} dependencyInfo - Dependency information
 * @returns {object} Component props object
 */
function buildComponentProps(fieldData, dependencyInfo) {
  const props = {};
  
  // Add validation props
  if (fieldData.standardMetadata.minLength) props.minLength = fieldData.standardMetadata.minLength;
  if (fieldData.standardMetadata.maxLength) props.maxLength = fieldData.standardMetadata.maxLength;
  if (fieldData.standardMetadata.pattern) props.pattern = fieldData.standardMetadata.pattern;
  
  // Add sensitive field props
  if (fieldData.customExtensions.sensitive) {
    props.type = 'password';
    props.autoComplete = 'new-password';
  }
  
  // Add conditional props
  if (dependencyInfo) {
    props.conditional = true;
    props.dependencies = dependencyInfo.conditions.rules.map(rule => rule.field);
  }
  
  return props;
}

/**
 * Build wrapper components needed for a field
 * @param {object} fieldData - Field extension data
 * @param {object} dependencyInfo - Dependency information  
 * @returns {Array} Array of wrapper component names
 */
function buildWrapperComponents(fieldData, dependencyInfo) {
  const wrappers = [];
  
  if (dependencyInfo) {
    wrappers.push('conditional-field');
  }
  
  if (fieldData.customExtensions.sensitive) {
    wrappers.push('plan-restricted-feature'); // Assuming sensitive fields need special access
  }
  
  return wrappers;
}

/**
 * Build validation integration hints
 * @param {object} originalSchema - Original OpenAPI schema
 * @param {object} extensionsMap - Extracted extension data
 * @returns {object} Validation integration metadata
 */
function buildValidationIntegration(originalSchema, extensionsMap) {
  return {
    // Zod schema integration hints
    zodIntegration: {
      schemaName: 'OpenWebUIConfigSchema',
      individualSchemas: Object.keys(extensionsMap).map(fieldName => `${fieldName}_Schema`),
      validationReady: true
    },
    
    // Validation characteristics
    characteristics: {
      requiredFields: originalSchema.required || [],
      fieldsWithConstraints: Object.keys(extensionsMap).filter(fieldName => {
        const field = extensionsMap[fieldName];
        return field.standardMetadata.minLength || 
               field.standardMetadata.maxLength ||
               field.standardMetadata.minimum ||
               field.standardMetadata.maximum ||
               field.standardMetadata.pattern;
      }),
      sensitiveFields: Object.keys(extensionsMap).filter(fieldName => 
        extensionsMap[fieldName].customExtensions.sensitive
      )
    }
  };
}

/**
 * Build validation hints for a specific field
 * @param {object} fieldData - Field extension data
 * @param {object} schemaProperty - Original schema property
 * @returns {object} Validation hints object
 */
function buildValidationHints(fieldData, schemaProperty) {
  const hints = {
    required: false, // Will be set based on schema.required array
    constraints: []
  };
  
  // Add constraint information
  if (fieldData.standardMetadata.minLength) {
    hints.constraints.push({ type: 'minLength', value: fieldData.standardMetadata.minLength });
  }
  if (fieldData.standardMetadata.maxLength) {
    hints.constraints.push({ type: 'maxLength', value: fieldData.standardMetadata.maxLength });
  }
  if (fieldData.standardMetadata.minimum) {
    hints.constraints.push({ type: 'min', value: fieldData.standardMetadata.minimum });
  }
  if (fieldData.standardMetadata.maximum) {
    hints.constraints.push({ type: 'max', value: fieldData.standardMetadata.maximum });
  }
  if (fieldData.standardMetadata.pattern) {
    hints.constraints.push({ type: 'pattern', value: fieldData.standardMetadata.pattern });
  }
  
  return hints;
}

/**
 * Assemble the final uiSchema structure
 * @param {object} components - All built components of the uiSchema
 * @returns {object} Final assembled uiSchema
 */
function assembleUiSchema(components) {
  const {
    categoryOrganization,
    fieldConfigurations,
    conditionalRules,
    componentMappings,
    validationIntegration,
    metadata
  } = components;
  
  return {
    // Metadata about this uiSchema
    $schema: 'https://rjsf-team.github.io/react-jsonschema-form/docs/',
    $generated: metadata,
    
    // Category-based organization for UI rendering
    categoryOrganization,
    
    // Field-by-field configuration (RJSF-compatible)
    fieldConfigurations,
    
    // Conditional rendering rules
    conditionalRules,
    
    // Component mapping hints for react-ts-form
    componentMappings,
    
    // Integration metadata
    integration: {
      validation: validationIntegration,
      reactTsForm: {
        ready: true,
        totalFields: Object.keys(fieldConfigurations).length,
        conditionalFields: Object.keys(conditionalRules).length,
        componentMappings: Object.keys(componentMappings).length
      }
    }
  };
}
