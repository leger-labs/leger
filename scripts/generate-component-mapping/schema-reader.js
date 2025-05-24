/**
 * Schema Reader Module
 * 
 * This module handles reading and parsing the generated Zod schemas and uiSchema files.
 * It extracts field information, constraints, and existing component suggestions to provide
 * a complete picture of each field for the component mapping process.
 * 
 * The philosophy here is to treat these generated files as the authoritative source of truth
 * about field characteristics, then use that information to make informed component decisions.
 */

import fs from 'fs';
import path from 'path';

/**
 * Read and parse all schema sources needed for component mapping
 * This function orchestrates reading from multiple schema files and combines
 * the information into a unified field information map.
 * 
 * @param {string} repoRoot - Repository root path
 * @returns {Promise<object>} Combined schema information
 */
export async function readAllSchemas(repoRoot) {
  console.log('Reading schema files for component mapping...');
  
  // Define paths to the schema files
  const paths = {
    zodSchemas: path.join(repoRoot, 'src/schemas/generated-schemas.ts'),
    uiSchema: path.join(repoRoot, 'src/schemas/generated-uiSchema.ts'),
    originalSchema: path.join(repoRoot, 'schemas/openwebui-config-schema.json')
  };
  
  // Verify all required files exist
  validateSchemaFiles(paths);
  
  // Read each schema file
  console.log('  - Reading Zod schemas...');
  const zodSchemaInfo = await readZodSchemas(paths.zodSchemas);
  
  console.log('  - Reading uiSchema...');
  const uiSchemaInfo = await readUiSchema(paths.uiSchema);
  
  console.log('  - Reading original OpenAPI schema...');
  const originalSchemaInfo = await readOriginalSchema(paths.originalSchema);
  
  // Combine all information into unified field map
  console.log('  - Combining schema information...');
  const combinedFieldInfo = combineSchemaInformation(zodSchemaInfo, uiSchemaInfo, originalSchemaInfo);
  
  console.log(`✓ Successfully read schema information for ${Object.keys(combinedFieldInfo).length} fields`);
  
  return {
    fields: combinedFieldInfo,
    metadata: {
      zodFields: Object.keys(zodSchemaInfo).length,
      uiSchemaFields: Object.keys(uiSchemaInfo).length,
      originalSchemaFields: Object.keys(originalSchemaInfo).length,
      combinedFields: Object.keys(combinedFieldInfo).length
    }
  };
}

/**
 * Validate that all required schema files exist
 * This prevents the system from proceeding with missing dependencies.
 * 
 * @param {object} paths - Object containing paths to schema files
 * @throws {Error} If any required file is missing
 */
function validateSchemaFiles(paths) {
  const missingFiles = [];
  
  Object.entries(paths).forEach(([name, filePath]) => {
    if (!fs.existsSync(filePath)) {
      missingFiles.push(`${name}: ${filePath}`);
    }
  });
  
  if (missingFiles.length > 0) {
    throw new Error(`Missing required schema files:\n${missingFiles.map(f => `  - ${f}`).join('\n')}`);
  }
}

/**
 * Read and parse the generated Zod schemas file
 * Extracts field types, validation constraints, and enum values from the Zod schema definitions.
 * 
 * @param {string} zodSchemaPath - Path to generated-schemas.ts
 * @returns {Promise<object>} Map of field names to their Zod schema information
 */
async function readZodSchemas(zodSchemaPath) {
  const content = fs.readFileSync(zodSchemaPath, 'utf8');
  const fieldInfo = {};
  
  try {
    // Parse the OpenWebUIConfigSchema object definition
    // This contains the field definitions with their Zod schema types
    const schemaObjectMatch = content.match(/export const OpenWebUIConfigSchema = z\.object\(\{([\s\S]*?)\}\);/);
    
    if (!schemaObjectMatch) {
      console.warn('⚠️  Could not find OpenWebUIConfigSchema definition in Zod schemas');
      return fieldInfo;
    }
    
    const schemaDefinition = schemaObjectMatch[1];
    
    // Extract individual field definitions
    // Pattern matches: FIELD_NAME: z.type().optional(),
    const fieldMatches = [...schemaDefinition.matchAll(/(\w+):\s*(z\.[^,]+),?/g)];
    
    fieldMatches.forEach(match => {
      const [, fieldName, zodDefinition] = match;
      
      fieldInfo[fieldName] = {
        fieldName,
        zodDefinition: zodDefinition.trim(),
        type: extractZodType(zodDefinition),
        constraints: extractZodConstraints(zodDefinition),
        isOptional: zodDefinition.includes('.optional()'),
        enumValues: extractEnumValues(zodDefinition),
        validation: {
          required: !zodDefinition.includes('.optional()'),
          hasConstraints: hasValidationConstraints(zodDefinition)
        }
      };
    });
    
    console.log(`  ✓ Parsed ${Object.keys(fieldInfo).length} field definitions from Zod schemas`);
    
  } catch (error) {
    console.error('Error parsing Zod schemas:', error);
    throw new Error(`Failed to parse Zod schemas: ${error.message}`);
  }
  
  return fieldInfo;
}

/**
 * Extract the basic Zod type from a schema definition
 * This helps us understand the fundamental data type of each field.
 * 
 * @param {string} zodDefinition - The Zod schema definition string
 * @returns {string} The basic type (string, number, boolean, array, etc.)
 */
function extractZodType(zodDefinition) {
  // Handle union types (enums)
  if (zodDefinition.includes('z.union')) {
    return 'enum';
  }
  
  // Handle array types
  if (zodDefinition.includes('z.array')) {
    return 'array';
  }
  
  // Handle basic types
  const typeMatch = zodDefinition.match(/z\.(\w+)/);
  if (typeMatch) {
    return typeMatch[1];
  }
  
  return 'unknown';
}

/**
 * Extract validation constraints from a Zod definition
 * This includes min/max values, length constraints, patterns, etc.
 * 
 * @param {string} zodDefinition - The Zod schema definition string
 * @returns {object} Object containing constraint information
 */
function extractZodConstraints(zodDefinition) {
  const constraints = {};
  
  // Extract min/max for numbers
  const minMatch = zodDefinition.match(/\.min\((\d+)\)/);
  if (minMatch) constraints.min = parseInt(minMatch[1]);
  
  const maxMatch = zodDefinition.match(/\.max\((\d+)\)/);
  if (maxMatch) constraints.max = parseInt(maxMatch[1]);
  
  // Extract length constraints for strings
  const minLengthMatch = zodDefinition.match(/\.minLength\((\d+)\)/);
  if (minLengthMatch) constraints.minLength = parseInt(minLengthMatch[1]);
  
  const maxLengthMatch = zodDefinition.match(/\.maxLength\((\d+)\)/);
  if (maxLengthMatch) constraints.maxLength = parseInt(maxLengthMatch[1]);
  
  // Extract regex patterns
  const regexMatch = zodDefinition.match(/\.regex\(([^)]+)\)/);
  if (regexMatch) constraints.pattern = regexMatch[1];
  
  return constraints;
}

/**
 * Extract enum values from union type definitions
 * This is particularly important for select field component assignment.
 * 
 * @param {string} zodDefinition - The Zod schema definition string
 * @returns {Array|null} Array of enum values or null if not an enum
 */
function extractEnumValues(zodDefinition) {
  if (!zodDefinition.includes('z.union')) {
    return null;
  }
  
  // Extract literal values from union
  const literalMatches = [...zodDefinition.matchAll(/z\.literal\(['"]([^'"]+)['"]\)/g)];
  
  if (literalMatches.length > 0) {
    return literalMatches.map(match => match[1]);
  }
  
  return null;
}

/**
 * Check if a Zod definition has validation constraints
 * This helps identify fields that might need special UI treatment.
 * 
 * @param {string} zodDefinition - The Zod schema definition string
 * @returns {boolean} True if the field has validation constraints
 */
function hasValidationConstraints(zodDefinition) {
  return zodDefinition.includes('.min(') ||
         zodDefinition.includes('.max(') ||
         zodDefinition.includes('.minLength(') ||
         zodDefinition.includes('.maxLength(') ||
         zodDefinition.includes('.regex(') ||
         zodDefinition.includes('.email(') ||
         zodDefinition.includes('.url(');
}

/**
 * Read and parse the generated uiSchema file
 * Extracts existing component suggestions, category information, and conditional rules.
 * 
 * This is a complex operation because we're parsing TypeScript exports without executing code.
 * We use sophisticated string parsing techniques to extract structured data from the generated file.
 * 
 * @param {string} uiSchemaPath - Path to generated-uiSchema.ts
 * @returns {Promise<object>} Map of field names to their uiSchema information
 */
async function readUiSchema(uiSchemaPath) {
  const content = fs.readFileSync(uiSchemaPath, 'utf8');
  const fieldInfo = {};
  
  try {
    console.log('  📖 Parsing TypeScript exports from uiSchema file...');
    
    // Extract field configurations using robust TypeScript parsing
    const fieldConfigurations = await extractFieldConfigurationsRobustly(content);
    
    // Extract component mappings (existing suggestions) with fallback handling
    const componentMappings = await extractComponentMappingsRobustly(content);
    
    // Extract conditional rules with graceful error handling
    const conditionalRules = await extractConditionalRulesRobustly(content);
    
    // Extract category information
    const categoryInfo = extractCategoryInfo(content);
    
    // Combine all uiSchema information per field with comprehensive merging
    const allFields = new Set([
      ...Object.keys(fieldConfigurations),
      ...Object.keys(componentMappings),
      ...Object.keys(conditionalRules)
    ]);
    
    console.log(`  🔍 Found ${allFields.size} unique fields across all uiSchema sections`);
    
    // Build comprehensive field information with graceful handling of missing data
    allFields.forEach(fieldName => {
      fieldInfo[fieldName] = {
        fieldName,
        fieldConfiguration: fieldConfigurations[fieldName] || null,
        existingComponentSuggestion: componentMappings[fieldName]?.component || null,
        componentAlternatives: componentMappings[fieldName]?.alternatives || [],
        hasConditionalLogic: Boolean(conditionalRules[fieldName]),
        conditionalRule: conditionalRules[fieldName] || null,
        category: fieldConfigurations[fieldName]?.['ui:category'] || null,
        order: fieldConfigurations[fieldName]?.['ui:order'] || 999,
        uiOptions: fieldConfigurations[fieldName]?.['ui:options'] || {},
        // Add metadata about data availability for debugging
        dataAvailability: {
          hasFieldConfig: Boolean(fieldConfigurations[fieldName]),
          hasComponentMapping: Boolean(componentMappings[fieldName]),
          hasConditionalRule: Boolean(conditionalRules[fieldName])
        }
      };
    });
    
    console.log(`  ✓ Successfully parsed ${Object.keys(fieldInfo).length} fields from uiSchema`);
    
    // Log parsing quality statistics
    logUiSchemaParsingQuality(fieldInfo);
    
  } catch (error) {
    console.error('Error parsing uiSchema:', error);
    
    // Provide helpful debugging information
    console.error('This error occurred while parsing the generated uiSchema TypeScript file.');
    console.error('The file may be corrupted or have an unexpected structure.');
    console.error('Try re-running the extract-uiSchema step to regenerate the file.');
    
    throw new Error(`Failed to parse uiSchema: ${error.message}`);
  }
  
  return fieldInfo;
}

/**
 * Extract field configurations from uiSchema content using robust TypeScript parsing
 * This handles the complexity of parsing TypeScript exports without code execution.
 * 
 * @param {string} content - The uiSchema file content
 * @returns {Promise<object>} Map of field names to their configurations
 */
async function extractFieldConfigurationsRobustly(content) {
  const configurations = {};
  
  try {
    console.log('    🔍 Extracting field configurations...');
    
    // Strategy 1: Look for fieldConfigurationsPart patterns (chunked exports)
    const configPartMatches = [...content.matchAll(/const fieldConfigurationsPart\d+[^=]*=\s*({[\s\S]*?})\s*as const;/g)];
    
    if (configPartMatches.length > 0) {
      console.log(`    📊 Found ${configPartMatches.length} field configuration chunks`);
      
      for (const match of configPartMatches) {
        try {
          // Parse the configuration chunk - this is the complex part
          const configStr = match[1];
          const parsedConfig = await parseTypeScriptObjectLiteral(configStr, 'fieldConfiguration');
          Object.assign(configurations, parsedConfig);
        } catch (parseError) {
          console.warn(`    ⚠️  Could not parse field configuration chunk: ${parseError.message}`);
          // Continue with other chunks - don't fail completely
        }
      }
    }
    
    // Strategy 2: Look for direct fieldConfigurations export (fallback)
    if (Object.keys(configurations).length === 0) {
      console.log('    🔄 Trying direct fieldConfigurations export pattern...');
      
      const directMatch = content.match(/export const fieldConfigurations[^=]*=\s*({[\s\S]*?})\s*as const;/);
      if (directMatch) {
        const parsedConfig = await parseTypeScriptObjectLiteral(directMatch[1], 'fieldConfiguration');
        Object.assign(configurations, parsedConfig);
      }
    }
    
    // Strategy 3: Extract field information using regex patterns (most robust fallback)
    if (Object.keys(configurations).length === 0) {
      console.log('    🚨 Using regex fallback for field configuration extraction...');
      configurations = await extractFieldConfigurationsWithRegex(content);
    }
    
    console.log(`    ✅ Extracted ${Object.keys(configurations).length} field configurations`);
    
  } catch (error) {
    console.warn(`    ⚠️  Field configuration extraction partially failed: ${error.message}`);
    console.warn('    This may affect component suggestion quality but won\'t prevent generation');
  }
  
  return configurations;
}

/**
 * Extract component mappings from uiSchema content with robust error handling
 * This extracts existing component suggestions that we want to leverage.
 * 
 * @param {string} content - The uiSchema file content
 * @returns {Promise<object>} Map of field names to their component mappings
 */
async function extractComponentMappingsRobustly(content) {
  const mappings = {};
  
  try {
    console.log('    🔍 Extracting component mappings...');
    
    // Look for componentMappings export
    const mappingMatch = content.match(/export const componentMappings[^=]*=\s*({[\s\S]*?})\s*as const;/);
    
    if (mappingMatch) {
      console.log('    📊 Found componentMappings export');
      
      try {
        const parsedMappings = await parseTypeScriptObjectLiteral(mappingMatch[1], 'componentMapping');
        Object.assign(mappings, parsedMappings);
      } catch (parseError) {
        console.warn(`    ⚠️  Could not parse component mappings object: ${parseError.message}`);
        
        // Fallback to regex extraction
        const regexMappings = await extractComponentMappingsWithRegex(content);
        Object.assign(mappings, regexMappings);
      }
    } else {
      console.log('    🔄 No componentMappings export found, checking for alternative patterns...');
      
      // Alternative patterns from different uiSchema structures
      const alternativeMappings = await extractComponentMappingsWithRegex(content);
      Object.assign(mappings, alternativeMappings);
    }
    
    console.log(`    ✅ Extracted ${Object.keys(mappings).length} component mappings`);
    
  } catch (error) {
    console.warn(`    ⚠️  Component mapping extraction failed: ${error.message}`);
    console.warn('    Will rely more heavily on explicit overrides and pattern rules');
  }
  
  return mappings;
}

/**
 * Extract conditional rules with graceful error handling
 * This identifies fields with dependency logic affecting their visibility.
 * 
 * @param {string} content - The uiSchema file content
 * @returns {Promise<object>} Map of field names to their conditional rules
 */
async function extractConditionalRulesRobustly(content) {
  const rules = {};
  
  try {
    console.log('    🔍 Extracting conditional rules...');
    
    // Look for conditionalRules export
    const rulesMatch = content.match(/export const conditionalRules[^=]*=\s*({[\s\S]*?})\s*as const;/);
    
    if (rulesMatch) {
      console.log('    📊 Found conditionalRules export');
      
      try {
        const parsedRules = await parseTypeScriptObjectLiteral(rulesMatch[1], 'conditionalRule');
        Object.assign(rules, parsedRules);
      } catch (parseError) {
        console.warn(`    ⚠️  Could not parse conditional rules object: ${parseError.message}`);
        
        // Fallback to regex extraction for conditional rules
        const regexRules = await extractConditionalRulesWithRegex(content);
        Object.assign(rules, regexRules);
      }
    } else {
      console.log('    ℹ️  No conditionalRules export found - fields may not have conditional logic');
    }
    
    console.log(`    ✅ Extracted ${Object.keys(rules).length} conditional rules`);
    
  } catch (error) {
    console.warn(`    ⚠️  Conditional rules extraction failed: ${error.message}`);
    console.warn('    Conditional field handling may be reduced');
  }
  
  return rules;
}

/**
 * Parse a TypeScript object literal string into a JavaScript object
 * This is the core complex function that handles TypeScript-to-object conversion.
 * 
 * @param {string} objectLiteralStr - String containing TypeScript object literal
 * @param {string} context - Context description for error messages
 * @returns {Promise<object>} Parsed object
 */
async function parseTypeScriptObjectLiteral(objectLiteralStr, context) {
  try {
    // Step 1: Clean up the string - remove TypeScript-specific syntax
    let cleanedStr = objectLiteralStr
      .replace(/as const/g, '') // Remove 'as const' assertions
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .trim();
    
    // Step 2: Handle nested object structures carefully
    // This is where the real complexity lies - we need to parse nested objects without eval()
    
    // For now, use a safer approach with regex patterns to extract field information
    // This is more reliable than trying to parse the entire object structure
    return await extractFieldInfoWithRegexPatterns(cleanedStr, context);
    
  } catch (error) {
    throw new Error(`Failed to parse TypeScript object literal for ${context}: ${error.message}`);
  }
}

/**
 * Extract field information using regex patterns as a robust fallback
 * This method is more reliable when dealing with complex TypeScript structures.
 * 
 * @param {string} content - Content to parse
 * @param {string} context - Context for error messages
 * @returns {Promise<object>} Extracted field information
 */
async function extractFieldInfoWithRegexPatterns(content, context) {
  const fieldInfo = {};
  
  try {
    // Pattern to match field definitions: "FIELD_NAME": { ... }
    const fieldPattern = /['"](\w+)['"]:\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g;
    let match;
    
    while ((match = fieldPattern.exec(content)) !== null) {
      const [, fieldName, fieldContent] = match;
      
      try {
        // Extract specific properties we care about
        const fieldProperties = {};
        
        // Extract ui:category
        const categoryMatch = fieldContent.match(/['"]ui:category['"]:\s*['"]([^'"]+)['"]/);
        if (categoryMatch) fieldProperties['ui:category'] = categoryMatch[1];
        
        // Extract ui:order
        const orderMatch = fieldContent.match(/['"]ui:order['"]:\s*(\d+)/);
        if (orderMatch) fieldProperties['ui:order'] = parseInt(orderMatch[1]);
        
        // Extract component (for component mappings)
        const componentMatch = fieldContent.match(/['"]component['"]:\s*['"]([^'"]+)['"]/);
        if (componentMatch) fieldProperties.component = componentMatch[1];
        
        // Extract alternatives (for component mappings)
        const alternativesMatch = fieldContent.match(/['"]alternatives['"]:\s*\[([^\]]*)\]/);
        if (alternativesMatch) {
          const alternativesStr = alternativesMatch[1];
          fieldProperties.alternatives = alternativesStr
            .split(',')
            .map(alt => alt.trim().replace(/['"]/g, ''))
            .filter(alt => alt.length > 0);
        }
        
        // Extract type (for conditional rules)
        const typeMatch = fieldContent.match(/['"]type['"]:\s*['"]([^'"]+)['"]/);
        if (typeMatch) fieldProperties.type = typeMatch[1];
        
        if (Object.keys(fieldProperties).length > 0) {
          fieldInfo[fieldName] = fieldProperties;
        }
        
      } catch (fieldError) {
        console.warn(`    ⚠️  Could not parse field '${fieldName}' in ${context}: ${fieldError.message}`);
        // Continue with other fields
      }
    }
    
  } catch (error) {
    throw new Error(`Regex pattern extraction failed for ${context}: ${error.message}`);
  }
  
  return fieldInfo;
}

/**
 * Extract field configurations using regex patterns (fallback method)
 * This is used when object parsing fails.
 * 
 * @param {string} content - The uiSchema file content
 * @returns {Promise<object>} Extracted field configurations
 */
async function extractFieldConfigurationsWithRegex(content) {
  console.log('    🎯 Using regex fallback for field configurations...');
  
  // Look for field configuration patterns in the content
  // This extracts basic field information that we can work with
  const configs = {};
  
  // Pattern for finding field names with ui:category assignments
  const categoryPattern = /['"](\w+)['"]:\s*{[^}]*['"]ui:category['"]:\s*['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = categoryPattern.exec(content)) !== null) {
    const [, fieldName, category] = match;
    if (!configs[fieldName]) configs[fieldName] = {};
    configs[fieldName]['ui:category'] = category;
  }
  
  // Pattern for ui:order
  const orderPattern = /['"](\w+)['"]:\s*{[^}]*['"]ui:order['"]:\s*(\d+)/g;
  while ((match = orderPattern.exec(content)) !== null) {
    const [, fieldName, order] = match;
    if (!configs[fieldName]) configs[fieldName] = {};
    configs[fieldName]['ui:order'] = parseInt(order);
  }
  
  console.log(`    📊 Regex extraction found ${Object.keys(configs).length} field configurations`);
  return configs;
}

/**
 * Extract component mappings using regex patterns (fallback method)
 * 
 * @param {string} content - The uiSchema file content
 * @returns {Promise<object>} Extracted component mappings
 */
async function extractComponentMappingsWithRegex(content) {
  console.log('    🎯 Using regex fallback for component mappings...');
  
  const mappings = {};
  
  // Look for component assignments in field configurations
  const componentPattern = /['"](\w+)['"]:\s*{[^}]*['"]component['"]:\s*['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = componentPattern.exec(content)) !== null) {
    const [, fieldName, component] = match;
    if (!mappings[fieldName]) mappings[fieldName] = {};
    mappings[fieldName].component = component;
  }
  
  console.log(`    📊 Regex extraction found ${Object.keys(mappings).length} component mappings`);
  return mappings;
}

/**
 * Extract conditional rules using regex patterns (fallback method)
 * 
 * @param {string} content - The uiSchema file content
 * @returns {Promise<object>} Extracted conditional rules
 */
async function extractConditionalRulesWithRegex(content) {
  console.log('    🎯 Using regex fallback for conditional rules...');
  
  const rules = {};
  
  // Look for conditional rule patterns
  const conditionalPattern = /['"](\w+)['"]:\s*{[^}]*['"]type['"]:\s*['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = conditionalPattern.exec(content)) !== null) {
    const [, fieldName, type] = match;
    rules[fieldName] = { type, hasConditionalLogic: true };
  }
  
  console.log(`    📊 Regex extraction found ${Object.keys(rules).length} conditional rules`);
  return rules;
}

/**
 * Log parsing quality statistics to help with debugging
 * 
 * @param {object} fieldInfo - Parsed field information
 */
function logUiSchemaParsingQuality(fieldInfo) {
  const fields = Object.values(fieldInfo);
  
  const qualityStats = {
    totalFields: fields.length,
    withFieldConfig: fields.filter(f => f.dataAvailability.hasFieldConfig).length,
    withComponentMapping: fields.filter(f => f.dataAvailability.hasComponentMapping).length,
    withConditionalRule: fields.filter(f => f.dataAvailability.hasConditionalRule).length,
    withExistingSuggestion: fields.filter(f => f.existingComponentSuggestion).length
  };
  
  console.log('  📊 uiSchema Parsing Quality:');
  console.log(`    - Fields with configuration data: ${qualityStats.withFieldConfig}/${qualityStats.totalFields} (${Math.round(qualityStats.withFieldConfig/qualityStats.totalFields*100)}%)`);
  console.log(`    - Fields with component mappings: ${qualityStats.withComponentMapping}/${qualityStats.totalFields} (${Math.round(qualityStats.withComponentMapping/qualityStats.totalFields*100)}%)`);
  console.log(`    - Fields with conditional rules: ${qualityStats.withConditionalRule}/${qualityStats.totalFields} (${Math.round(qualityStats.withConditionalRule/qualityStats.totalFields*100)}%)`);
  console.log(`    - Fields with existing suggestions: ${qualityStats.withExistingSuggestion}/${qualityStats.totalFields} (${Math.round(qualityStats.withExistingSuggestion/qualityStats.totalFields*100)}%)`);
  
  // Warn about low parsing quality
  if (qualityStats.withExistingSuggestion / qualityStats.totalFields < 0.5) {
    console.log('    ⚠️  Low component suggestion extraction rate - will rely more on explicit overrides');
  }
  
  return qualityStats;
}

/**
 * Extract category information from uiSchema content
 * This provides organizational context for fields.
 * 
 * @param {string} content - The uiSchema file content
 * @returns {object} Category information
 */
function extractCategoryInfo(content) {
  const categoryInfo = {};
  
  try {
    // Extract categories information
    const categoriesMatch = content.match(/export const categories[^=]*=\s*categoryOrganization\.categories;/);
    
    if (categoriesMatch) {
      // We have category information available
      categoryInfo.hasCategories = true;
    }
    
  } catch (error) {
    console.warn('Warning: Could not extract category information from uiSchema');
  }
  
  return categoryInfo;
}

/**
 * Read and parse the original OpenAPI schema
 * This provides the source definitions and custom extensions.
 * 
 * @param {string} originalSchemaPath - Path to openwebui-config-schema.json
 * @returns {Promise<object>} Map of field names to their original schema information
 */
async function readOriginalSchema(originalSchemaPath) {
  const content = fs.readFileSync(originalSchemaPath, 'utf8');
  const fieldInfo = {};
  
  try {
    const schema = JSON.parse(content);
    
    // Navigate to the OpenWebUIConfig component
    const configSchema = schema.components?.schemas?.OpenWebUIConfig;
    
    if (!configSchema || !configSchema.properties) {
      console.warn('⚠️  Could not find OpenWebUIConfig properties in original schema');
      return fieldInfo;
    }
    
    // Extract information from each property
    Object.entries(configSchema.properties).forEach(([fieldName, property]) => {
      fieldInfo[fieldName] = {
        fieldName,
        type: property.type,
        format: property.format,
        description: property.description,
        enum: property.enum,
        default: property.default,
        examples: property.examples,
        
        // Extract custom x- extensions
        customExtensions: extractCustomExtensions(property),
        
        // Standard constraints
        constraints: {
          minimum: property.minimum,
          maximum: property.maximum,
          minLength: property.minLength,
          maxLength: property.maxLength,
          pattern: property.pattern
        }
      };
    });
    
    console.log(`  ✓ Parsed ${Object.keys(fieldInfo).length} fields from original OpenAPI schema`);
    
  } catch (error) {
    console.error('Error parsing original schema:', error);
    throw new Error(`Failed to parse original schema: ${error.message}`);
  }
  
  return fieldInfo;
}

/**
 * Extract custom x- extensions from a property definition
 * These extensions contain important metadata for component selection.
 * 
 * @param {object} property - The property definition from OpenAPI schema
 * @returns {object} Map of extension names to their values
 */
function extractCustomExtensions(property) {
  const extensions = {};
  
  Object.keys(property).forEach(key => {
    if (key.startsWith('x-')) {
      const extensionName = key.substring(2); // Remove 'x-' prefix
      extensions[extensionName] = property[key];
    }
  });
  
  return extensions;
}

/**
 * Combine information from all schema sources into unified field information
 * This creates a comprehensive view of each field's characteristics.
 * 
 * @param {object} zodSchemaInfo - Information from Zod schemas
 * @param {object} uiSchemaInfo - Information from uiSchema
 * @param {object} originalSchemaInfo - Information from original OpenAPI schema
 * @returns {object} Combined field information map
 */
function combineSchemaInformation(zodSchemaInfo, uiSchemaInfo, originalSchemaInfo) {
  const combinedInfo = {};
  
  // Get all unique field names from all sources
  const allFields = new Set([
    ...Object.keys(zodSchemaInfo),
    ...Object.keys(uiSchemaInfo),
    ...Object.keys(originalSchemaInfo)
  ]);
  
  allFields.forEach(fieldName => {
    const zodInfo = zodSchemaInfo[fieldName] || {};
    const uiInfo = uiSchemaInfo[fieldName] || {};
    const originalInfo = originalSchemaInfo[fieldName] || {};
    
    combinedInfo[fieldName] = {
      fieldName,
      
      // Type and validation information
      type: zodInfo.type || originalInfo.type || 'string',
      format: originalInfo.format,
      isOptional: zodInfo.isOptional !== false,
      enumValues: zodInfo.enumValues || originalInfo.enum,
      constraints: {
        ...zodInfo.constraints,
        ...originalInfo.constraints
      },
      
      // UI and component information
      existingComponentSuggestion: uiInfo.existingComponentSuggestion,
      componentAlternatives: uiInfo.componentAlternatives || [],
      hasConditionalLogic: uiInfo.hasConditionalLogic || false,
      
      // Organization information
      category: uiInfo.category,
      order: uiInfo.order || 999,
      
      // Custom extensions and metadata
      customExtensions: originalInfo.customExtensions || {},
      description: originalInfo.description,
      examples: originalInfo.examples,
      
      // Source information for debugging
      sources: {
        hasZodInfo: Boolean(zodSchemaInfo[fieldName]),
        hasUiInfo: Boolean(uiSchemaInfo[fieldName]),
        hasOriginalInfo: Boolean(originalSchemaInfo[fieldName])
      }
    };
  });
  
  return combinedInfo;
}

/**
 * Get field information for a specific field
 * Utility function for other modules to access field data.
 * 
 * @param {object} schemaData - The combined schema data
 * @param {string} fieldName - Name of the field to get info for
 * @returns {object|null} Field information or null if not found
 */
export function getFieldInfo(schemaData, fieldName) {
  return schemaData.fields[fieldName] || null;
}

/**
 * Get all fields matching certain criteria
 * Helper function for filtering fields based on characteristics.
 * 
 * @param {object} schemaData - The combined schema data
 * @param {function} predicate - Function to test each field
 * @returns {Array} Array of field names matching the criteria
 */
export function getFieldsWhere(schemaData, predicate) {
  return Object.keys(schemaData.fields).filter(fieldName => {
    const field = schemaData.fields[fieldName];
    return predicate(field);
  });
}

/**
 * Get statistics about the schema data
 * Provides insight into the characteristics of the field set.
 * 
 * @param {object} schemaData - The combined schema data
 * @returns {object} Statistics about the field set
 */
export function getSchemaStatistics(schemaData) {
  const fields = Object.values(schemaData.fields);
  
  return {
    totalFields: fields.length,
    fieldsByType: fields.reduce((acc, field) => {
      acc[field.type] = (acc[field.type] || 0) + 1;
      return acc;
    }, {}),
    fieldsWithEnums: fields.filter(f => f.enumValues).length,
    fieldsWithConstraints: fields.filter(f => Object.keys(f.constraints).length > 0).length,
    fieldsWithConditionalLogic: fields.filter(f => f.hasConditionalLogic).length,
    fieldsWithExistingSuggestions: fields.filter(f => f.existingComponentSuggestion).length,
    fieldsWithCustomExtensions: fields.filter(f => Object.keys(f.customExtensions).length > 0).length
  };
}
