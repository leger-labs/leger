/**
 * Extension Extractor Module
 * Processes custom x- extensions from OpenAPI schema properties
 * This module is designed to handle complex scenarios and be future-proof
 */

/**
 * Extract all custom extensions from schema properties
 * @param {object} properties - The properties object from the OpenAPI schema
 * @returns {object} Map of field names to their extracted extension metadata
 */
export function extractExtensions(properties) {
  const extensionsMap = {};
  const allFieldNames = Object.keys(properties);
  
  console.log(`Processing ${allFieldNames.length} properties for custom extensions...`);
  
  // Process each property to extract its extensions
  allFieldNames.forEach(fieldName => {
    const property = properties[fieldName];
    const extensions = extractPropertyExtensions(fieldName, property);
    
    if (Object.keys(extensions.customExtensions).length > 0 || extensions.standardMetadata) {
      extensionsMap[fieldName] = extensions;
    }
  });
  
  // Validate dependency references after all fields are processed
  validateDependencyReferences(extensionsMap, allFieldNames);
  
  // Log extraction summary
  const extensionStats = getExtractionStatistics(extensionsMap);
  console.log(`✓ Extracted extensions for ${Object.keys(extensionsMap).length} fields`);
  console.log(`  - Categories found: ${extensionStats.categoriesCount}`);
  console.log(`  - Fields with dependencies: ${extensionStats.dependenciesCount}`);
  console.log(`  - Provider mappings: ${extensionStats.providerMappingsCount}`);
  
  return extensionsMap;
}

/**
 * Extract extensions from a single property
 * @param {string} fieldName - Name of the field being processed
 * @param {object} property - The property definition from the schema
 * @returns {object} Extracted and normalized extension data
 */
function extractPropertyExtensions(fieldName, property) {
  const customExtensions = {};
  const standardMetadata = {};
  
  // Extract all x- prefixed extensions
  Object.keys(property).forEach(key => {
    if (key.startsWith('x-')) {
      const extensionName = key.substring(2); // Remove 'x-' prefix
      const extensionValue = property[key];
      
      // Process different types of extensions with specialized handling
      customExtensions[extensionName] = processExtensionValue(extensionName, extensionValue, fieldName);
    }
  });
  
  // Extract relevant standard OpenAPI metadata that affects UI rendering
  standardMetadata.type = property.type;
  standardMetadata.format = property.format;
  standardMetadata.description = property.description;
  standardMetadata.default = property.default;
  standardMetadata.enum = property.enum;
  standardMetadata.examples = property.examples;
  
  // Handle constraints that affect UI rendering
  if (property.minimum !== undefined) standardMetadata.minimum = property.minimum;
  if (property.maximum !== undefined) standardMetadata.maximum = property.maximum;
  if (property.minLength !== undefined) standardMetadata.minLength = property.minLength;
  if (property.maxLength !== undefined) standardMetadata.maxLength = property.maxLength;
  if (property.pattern) standardMetadata.pattern = property.pattern;
  
  // Handle array-specific metadata
  if (property.type === 'array' && property.items) {
    standardMetadata.items = property.items;
  }
  
  // Handle oneOf/anyOf/allOf for enum-like behaviors
  if (property.oneOf) standardMetadata.oneOf = property.oneOf;
  if (property.anyOf) standardMetadata.anyOf = property.anyOf;
  if (property.allOf) standardMetadata.allOf = property.allOf;
  
  return {
    fieldName,
    customExtensions,
    standardMetadata
  };
}

/**
 * Process and normalize extension values based on their type and purpose
 * This handles the various patterns seen in OpenWebUI extensions
 * @param {string} extensionName - Name of the extension (without x- prefix)
 * @param {any} extensionValue - Raw value of the extension
 * @param {string} fieldName - Name of the field for context
 * @returns {any} Processed and normalized extension value
 */
function processExtensionValue(extensionName, extensionValue, fieldName) {
  switch (extensionName) {
    case 'category':
      // Normalize category names and prepare for hierarchical organization
      return normalizeCategoryName(extensionValue);
      
    case 'display-order':
      // Ensure display order is a valid number
      return normalizeDisplayOrder(extensionValue, fieldName);
      
    case 'depends-on':
      // Process dependency conditions - can be simple or complex
      return normalizeDependencyCondition(extensionValue, fieldName);
      
    case 'provider-fields':
      // Handle provider-to-fields mappings
      return normalizeProviderFields(extensionValue, fieldName);
      
    case 'visibility':
      // Normalize visibility settings
      return normalizeVisibility(extensionValue);
      
    case 'sensitive':
      // Ensure sensitive flag is boolean
      return Boolean(extensionValue);
      
    case 'default-handling':
      // Normalize default handling strategy
      return normalizeDefaultHandling(extensionValue);
      
    default:
      // For unknown extensions, preserve the value but log for future enhancement
      if (extensionValue !== null && extensionValue !== undefined) {
        console.log(`  ℹ️  Unknown extension 'x-${extensionName}' found on field '${fieldName}' with value:`, extensionValue);
      }
      return extensionValue;
  }
}

/**
 * Normalize category names for consistent processing
 * @param {string} categoryName - Raw category name
 * @returns {object} Normalized category information
 */
function normalizeCategoryName(categoryName) {
  if (typeof categoryName !== 'string') {
    console.warn(`⚠️  Category name should be string, got ${typeof categoryName}: ${categoryName}`);
    return { name: String(categoryName), displayName: String(categoryName) };
  }
  
  // Parse hierarchical category names (e.g., "Vector Database - ChromaDB")
  const parts = categoryName.split(' - ').map(part => part.trim());
  const isHierarchical = parts.length > 1;
  
  return {
    name: categoryName,
    displayName: categoryName,
    parts: parts,
    isHierarchical: isHierarchical,
    parent: isHierarchical ? parts[0] : null,
    child: isHierarchical ? parts.slice(1).join(' - ') : null
  };
}

/**
 * Normalize display order values
 * @param {any} orderValue - Raw display order value
 * @param {string} fieldName - Field name for error context
 * @returns {number} Normalized display order
 */
function normalizeDisplayOrder(orderValue, fieldName) {
  const parsed = parseInt(orderValue, 10);
  if (isNaN(parsed)) {
    console.warn(`⚠️  Invalid display order '${orderValue}' for field '${fieldName}', using 999`);
    return 999;
  }
  return parsed;
}

/**
 * Normalize dependency conditions to support both simple and complex scenarios
 * @param {any} dependencyValue - Raw dependency condition
 * @param {string} fieldName - Field name for error context
 * @returns {object} Normalized dependency condition
 */
function normalizeDependencyCondition(dependencyValue, fieldName) {
  if (!dependencyValue || typeof dependencyValue !== 'object') {
    console.warn(`⚠️  Invalid dependency condition for field '${fieldName}':`, dependencyValue);
    return null;
  }
  
  // Handle simple equality conditions like { "VECTOR_DB": "chroma" }
  const conditions = [];
  
  Object.keys(dependencyValue).forEach(dependentField => {
    const expectedValue = dependencyValue[dependentField];
    
    conditions.push({
      field: dependentField,
      operator: Array.isArray(expectedValue) ? 'in' : 'equals',
      value: expectedValue,
      type: 'simple'
    });
  });
  
  return {
    type: conditions.length === 1 ? 'simple' : 'complex',
    operator: 'and', // Default to AND for multiple conditions
    conditions: conditions
  };
}

/**
 * Normalize provider field mappings
 * @param {object} providerFields - Raw provider fields mapping
 * @param {string} fieldName - Field name for error context
 * @returns {object} Normalized provider fields mapping
 */
function normalizeProviderFields(providerFields, fieldName) {
  if (!providerFields || typeof providerFields !== 'object') {
    console.warn(`⚠️  Invalid provider fields mapping for field '${fieldName}':`, providerFields);
    return {};
  }
  
  const normalized = {};
  
  Object.keys(providerFields).forEach(provider => {
    const fields = providerFields[provider];
    
    if (Array.isArray(fields)) {
      normalized[provider] = fields;
    } else {
      console.warn(`⚠️  Provider '${provider}' fields should be an array, got:`, fields);
      normalized[provider] = [];
    }
  });
  
  return normalized;
}

/**
 * Normalize visibility settings
 * @param {any} visibilityValue - Raw visibility value
 * @returns {string} Normalized visibility setting
 */
function normalizeVisibility(visibilityValue) {
  const validValues = ['exposed', 'hidden', 'conditional'];
  const normalized = String(visibilityValue).toLowerCase();
  
  if (validValues.includes(normalized)) {
    return normalized;
  }
  
  console.warn(`⚠️  Unknown visibility value '${visibilityValue}', defaulting to 'exposed'`);
  return 'exposed';
}

/**
 * Normalize default handling strategies
 * @param {any} handlingValue - Raw default handling value
 * @returns {string} Normalized default handling strategy
 */
function normalizeDefaultHandling(handlingValue) {
  const validValues = ['preloaded', 'unset', 'computed', 'inherited'];
  const normalized = String(handlingValue).toLowerCase();
  
  if (validValues.includes(normalized)) {
    return normalized;
  }
  
  console.warn(`⚠️  Unknown default handling '${handlingValue}', defaulting to 'unset'`);
  return 'unset';
}

/**
 * Validate that dependency references point to valid fields
 * This prevents broken conditional logic in the generated uiSchema
 * @param {object} extensionsMap - The complete extensions map
 * @param {string[]} allFieldNames - List of all valid field names
 */
function validateDependencyReferences(extensionsMap, allFieldNames) {
  const invalidReferences = [];
  
  Object.keys(extensionsMap).forEach(fieldName => {
    const extensions = extensionsMap[fieldName];
    const dependsOn = extensions.customExtensions['depends-on'];
    
    if (dependsOn && dependsOn.conditions) {
      dependsOn.conditions.forEach(condition => {
        if (!allFieldNames.includes(condition.field)) {
          invalidReferences.push({
            field: fieldName,
            references: condition.field
          });
        }
      });
    }
  });
  
  if (invalidReferences.length > 0) {
    console.warn(`⚠️  Found ${invalidReferences.length} invalid dependency references:`);
    invalidReferences.slice(0, 5).forEach(ref => {
      console.warn(`   - Field '${ref.field}' depends on non-existent field '${ref.references}'`);
    });
    if (invalidReferences.length > 5) {
      console.warn(`   ... and ${invalidReferences.length - 5} more`);
    }
  }
}

/**
 * Get statistics about the extraction process
 * @param {object} extensionsMap - The extracted extensions map
 * @returns {object} Statistics about what was extracted
 */
function getExtractionStatistics(extensionsMap) {
  let categoriesCount = 0;
  let dependenciesCount = 0;
  let providerMappingsCount = 0;
  const categoryNames = new Set();
  
  Object.values(extensionsMap).forEach(fieldData => {
    const { customExtensions } = fieldData;
    
    if (customExtensions.category) {
      categoryNames.add(customExtensions.category.name);
      categoriesCount++;
    }
    
    if (customExtensions['depends-on']) {
      dependenciesCount++;
    }
    
    if (customExtensions['provider-fields']) {
      providerMappingsCount++;
    }
  });
  
  return {
    categoriesCount: categoryNames.size,
    dependenciesCount,
    providerMappingsCount
  };
}
