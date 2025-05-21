/**
 * Process and transform the Zod schemas generated from typed-openapi
 */

/**
 * Process Zod schema content from typed-openapi
 * @param {string} generatedContent - Raw generated content from typed-openapi
 * @returns {object} Object with schemasContent and indexContent
 */
export async function processZodSchema(generatedContent) {
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
  // Get all schema definitions
  const schemaRegex = /export (type|const) (\w+) =/g;
  let match;
  const schemaNames = [];
  
  while ((match = schemaRegex.exec(schemasContent)) !== null) {
    schemaNames.push(match[2]);
  }
  
  // Normalize schema names to ensure they end with _Schema
  const normalizedContent = schemasContent.replace(
    /export (type|const) (\w+) =/g,
    (match, exportType, name) => {
      // Only add _Schema suffix if it doesn't already have it
      const normalizedName = name.endsWith('_Schema') ? name : `${name}_Schema`;
      schemaNames.push(normalizedName);
      return `export ${exportType} ${normalizedName} =`;
    }
  );
  
  // Handle Zod patterns and specific schema tweaks
  let processedContent = normalizedContent
    // Fix z.nativeEnum to use z.enum for better TypeScript compatibility
    .replace(/z\.nativeEnum/g, 'z.enum')
    // Add .describe() for properties with descriptions
    .replace(/\/\/ (.*?)\nz\./g, (_, description) => 
      `z.`.concat(`/* ${description} */`)
    );
  
  return {
    content: processedContent,
    schemaNames: [...new Set(schemaNames)] // Remove duplicates
  };
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
