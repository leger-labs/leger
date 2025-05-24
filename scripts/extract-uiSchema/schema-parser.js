/**
 * OpenAPI Schema Parser Module
 * Handles parsing, validation, and extraction of the OpenAPI schema
 */

import SwaggerParser from '@apidevtools/swagger-parser';

/**
 * Parse and validate the OpenAPI schema file
 * @param {string} schemaPath - Path to the OpenAPI schema file
 * @returns {Promise<{openApiDoc: object, configSchema: object}>} Parsed schema data
 * @throws {Error} If schema is invalid or missing required structure
 */
export async function parseOpenApiSchema(schemaPath) {
  try {
    // Parse and bundle the OpenAPI schema to resolve all $refs
    const openApiDoc = await SwaggerParser.bundle(schemaPath);
    
    // Validate that we have the expected structure
    if (!openApiDoc.components || !openApiDoc.components.schemas) {
      throw new Error('The OpenAPI schema does not contain the expected components.schemas structure');
    }
    
    if (!openApiDoc.components.schemas.OpenWebUIConfig) {
      throw new Error('The OpenAPI schema does not contain the expected OpenWebUIConfig component');
    }
    
    // Extract the main configuration schema
    const configSchema = openApiDoc.components.schemas.OpenWebUIConfig;
    
    // Validate that the config schema has properties
    if (!configSchema.properties || typeof configSchema.properties !== 'object') {
      throw new Error('The OpenWebUIConfig schema does not contain valid properties');
    }
    
    // Log some basic information about what we found
    const propertyCount = Object.keys(configSchema.properties).length;
    console.log(`✓ Successfully parsed OpenAPI schema with ${propertyCount} configuration properties`);
    
    // Validate schema structure integrity
    validateSchemaStructure(configSchema);
    
    return {
      openApiDoc,
      configSchema
    };
    
  } catch (error) {
    // Enhance error messages for common issues
    if (error.message.includes('ENOENT')) {
      throw new Error(`OpenAPI schema file not found at path: ${schemaPath}`);
    } else if (error.message.includes('JSON')) {
      throw new Error(`Invalid JSON in OpenAPI schema file: ${error.message}`);
    } else if (error.message.includes('YAML')) {
      throw new Error(`Invalid YAML in OpenAPI schema file: ${error.message}`);
    }
    
    // Re-throw with enhanced context
    throw new Error(`Failed to parse OpenAPI schema: ${error.message}`);
  }
}

/**
 * Validate the internal structure of the configuration schema
 * This ensures we have the data we need for uiSchema generation
 * @param {object} configSchema - The OpenWebUIConfig schema to validate
 * @throws {Error} If the schema structure is invalid
 */
function validateSchemaStructure(configSchema) {
  // Check that we have an object type schema
  if (configSchema.type !== 'object') {
    throw new Error(`Expected OpenWebUIConfig to be of type 'object', got '${configSchema.type}'`);
  }
  
  // Validate each property has a basic structure
  const properties = configSchema.properties;
  const invalidProperties = [];
  
  Object.keys(properties).forEach(propertyName => {
    const property = properties[propertyName];
    
    // Each property should have at least a type or be a reference
    if (!property.type && !property.$ref && !property.oneOf && !property.anyOf && !property.allOf) {
      invalidProperties.push(propertyName);
    }
  });
  
  if (invalidProperties.length > 0) {
    console.warn(`⚠️  Warning: Found ${invalidProperties.length} properties without clear type definitions: ${invalidProperties.slice(0, 5).join(', ')}${invalidProperties.length > 5 ? '...' : ''}`);
  }
  
  console.log(`✓ Schema structure validation completed`);
}

/**
 * Get metadata about the parsed schema for logging and debugging
 * @param {object} configSchema - The parsed configuration schema
 * @returns {object} Metadata about the schema
 */
export function getSchemaMetadata(configSchema) {
  const properties = configSchema.properties || {};
  const propertyNames = Object.keys(properties);
  
  // Count properties by type
  const typeCount = {};
  const extensionCount = {};
  
  propertyNames.forEach(name => {
    const property = properties[name];
    
    // Count by type
    const type = property.type || 'unknown';
    typeCount[type] = (typeCount[type] || 0) + 1;
    
    // Count custom extensions
    Object.keys(property).forEach(key => {
      if (key.startsWith('x-')) {
        extensionCount[key] = (extensionCount[key] || 0) + 1;
      }
    });
  });
  
  return {
    totalProperties: propertyNames.length,
    typeDistribution: typeCount,
    extensionDistribution: extensionCount,
    hasDescription: Boolean(configSchema.description),
    hasRequired: Boolean(configSchema.required && configSchema.required.length > 0)
  };
}
