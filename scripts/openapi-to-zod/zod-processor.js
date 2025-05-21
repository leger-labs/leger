/**
 * Process and transform the Zod schemas generated from typed-openapi
 */

/**
 * Process Zod schema content from typed-openapi
 * @param {string} generatedContent - Raw generated content from typed-openapi
 * @returns {object} Object with schemasContent and indexContent
 */
export async function processZodSchema(generatedContent) {
  try {
    // Extract schemas section
    const schemaContent = extractSchemaSection(generatedContent);
    
    // Process the schemas to match our formatting requirements
    const processedSchemas = processSchemas(schemaContent);
    
    // Create the final schema file content
    const schemasContent = createSchemasFileContent(processedSchemas);
    
    // Create the index file content
    const indexContent = createIndexFileContent();
    
    return {
      schemasContent,
      indexContent
    };
  } catch (error) {
    console.error('Error processing Zod schema:', error);
    throw error;
  }
}

/**
 * Extract the schemas section from the generated content
 * @param {string} content - Raw generated content
 * @returns {string} Extracted schema section
 */
function extractSchemaSection(content) {
  // Look for content between // <Schemas> and // </Schemas>
  const schemasRegex = /\/\/ <Schemas>([\s\S]*?)\/\/ <\/Schemas>/;
  const match = content.match(schemasRegex);
  
  if (!match) {
    console.warn('Warning: Could not find schemas section in generated content');
    // Attempt to extract anything that looks like a schema definition as fallback
    const fallbackRegex = /export (type|const) \w+(_Schema)? = z\.[^;]+(;|}\))/g;
    const fallbackMatches = [...content.matchAll(fallbackRegex)];
    
    if (fallbackMatches.length > 0) {
      return fallbackMatches.map(m => m[0]).join('\n\n');
    }
    
    return '';
  }
  
  return match[1].trim();
}

/**
 * Process schemas to match our formatting standards
 * @param {string} schemasContent - Raw schemas content
 * @returns {object} Object with processed schemas and schema names
 */
function processSchemas(schemasContent) {
  try {
    // First, let's identify if we have a main OpenWebUIConfig schema or need to build it
    const hasMainSchema = schemasContent.includes('export const OpenWebUIConfig =') || 
                         schemasContent.includes('export type OpenWebUIConfig =');
    
    // Identify the component schemas from the OpenAPI spec
    const schemaRegex = /export (type|const) (\w+) =/g;
    let match;
    const schemaNames = [];
    
    // Extract existing schema names
    while ((match = schemaRegex.exec(schemasContent)) !== null) {
      if (match[2] !== 'OpenWebUIConfig' && match[2] !== 'OpenWebUIConfigSchema') {
        schemaNames.push(match[2]);
      }
    }
    
    // Fix order and names: const schema definition must come before type definition
    let processedContent = schemasContent;
    
    // First, fix type definitions that appear before their schema definitions
    const typeBeforeSchemaRegex = /export type (\w+)_Schema = z\.infer<typeof (\w+)>;([\s\S]*?)export const \1_Schema = /g;
    processedContent = processedContent.replace(typeBeforeSchemaRegex, (match, typeName, refName, betweenContent) => {
      // Move the type definition after the const definition
      return `export const ${typeName}_Schema = `;
    });
    
    // Now, ensure schema names end with _Schema
    processedContent = processedContent.replace(
      /export (type|const) (\w+)(?!_Schema)(\s+)=/g,
      (match, exportType, name, spacing) => {
        // Skip certain special schemas
        if (name === 'OpenWebUIConfig' || name === 'OpenWebUIConfigSchema') {
          return match;
        }
        // Add _Schema suffix
        return `export ${exportType} ${name}_Schema${spacing}=`;
      }
    );
    
    // Fix z.nativeEnum to use z.enum for better TypeScript compatibility
    processedContent = processedContent.replace(/z\.nativeEnum/g, 'z.enum');
    
    // Fix schema definitions whose type definitions were moved
    processedContent = processedContent.replace(
      /export const (\w+)_Schema = ([\s\S]*?)(;|},\s*\{.*?\}\))/g,
      (match, name, definition, ending) => {
        // Add inferred type after schema definition
        if (!match.includes(`export type ${name}_Schema =`)) {
          return `export const ${name}_Schema = ${definition}${ending}\nexport type ${name} = z.infer<typeof ${name}_Schema>;`;
        }
        return match;
      }
    );
    
    // Add descriptions from comments as .describe() calls
    processedContent = processedContent.replace(
      /\/\*\s*(.*?)\s*\*\/\s*z\./g, 
      (match, description) => {
        // Escape quotes in description
        const safeDescription = description.replace(/"/g, '\\"');
        return `z.`.concat('').concat(` /* ${safeDescription} */`);
      }
    );
    
    // Get final list of unique schema names with _Schema suffix
    const finalSchemaRegex = /export const (\w+)_Schema =/g;
    const finalSchemaNames = [];
    let finalMatch;
    
    while ((finalMatch = finalSchemaRegex.exec(processedContent)) !== null) {
      finalSchemaNames.push(`${finalMatch[1]}_Schema`);
    }
    
    return {
      content: processedContent,
      schemaNames: [...new Set(finalSchemaNames)] // Remove duplicates
    };
  } catch (error) {
    console.error('Error processing schemas:', error);
    throw error;
  }
}

/**
 * Create the final schemas file content
 * @param {object} processed - Object with processed content and schema names
 * @returns {string} Final schemas file content
 */
function createSchemasFileContent(processed) {
  const { content, schemaNames } = processed;
  
  // Extract property names from schema names (remove _Schema suffix)
  const propertyNames = schemaNames.map(name => 
    name.endsWith('_Schema') ? name.slice(0, -7) : name
  );
  
  // Create the final content with proper schema structure
  return `/**
 * Generated Zod schemas from OpenWebUI OpenAPI configuration
 * DO NOT EDIT DIRECTLY - Changes will be overwritten
 */
import { z } from 'zod';

// Individual schemas for each configuration property
${content}

// Combined schema for all configuration properties
export const OpenWebUIConfigSchema = z.object({
  ${propertyNames.map(name => `${name}: ${name}_Schema`).join(',\n  ')}
});

// TypeScript type for complete configuration
export type OpenWebUIConfig = z.infer<typeof OpenWebUIConfigSchema>;
`;
}

/**
 * Create index file content
 * @returns {string} Index file content
 */
function createIndexFileContent() {
  return `/**
 * OpenWebUI Configuration Schemas
 * DO NOT EDIT DIRECTLY - Changes will be overwritten
 * 
 * This file exports Zod schemas generated from the OpenAPI configuration.
 */
export * from './generated-schemas';
`;
}
