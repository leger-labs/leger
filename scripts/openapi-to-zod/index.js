#!/usr/bin/env node

// Use ES modules for typed-openapi compatibility
import path from 'path';
import fs from 'fs';
import SwaggerParser from '@apidevtools/swagger-parser';
import { generateFile, mapOpenApiEndpoints } from 'typed-openapi';
import { processZodSchema } from './zod-processor.js';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The script should find files relative to the repository root
// When run from scripts/openapi-to-zod, we need to go up one level
const REPO_ROOT = path.resolve(__dirname, '../..');
console.log('Repository root directory:', REPO_ROOT);

// Configuration with paths relative to repo root
const INPUT_SCHEMA_PATH = path.join(REPO_ROOT, 'schemas/openwebui-config-schema.json');
const OUTPUT_DIR = path.join(REPO_ROOT, 'src/schemas');
const SCHEMAS_FILE_PATH = path.join(OUTPUT_DIR, 'generated-schemas.ts');
const INDEX_FILE_PATH = path.join(OUTPUT_DIR, 'index.ts');

/**
 * Main conversion function
 */
async function main() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '=== OpenAPI to Zod Schema Conversion ===');
    console.log('Starting conversion process...');
    
    // Verify the OpenAPI schema file exists
    if (!fs.existsSync(INPUT_SCHEMA_PATH)) {
      console.error(`\x1b[31mError: OpenAPI schema file not found at ${INPUT_SCHEMA_PATH}\x1b[0m`);
      console.log('Files in schemas directory:', fs.existsSync(path.join(REPO_ROOT, 'schemas')) 
        ? fs.readdirSync(path.join(REPO_ROOT, 'schemas')).join(', ') 
        : 'schemas directory not found');
      process.exit(1);
    }
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      console.log(`Creating output directory: ${OUTPUT_DIR}`);
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Parse the OpenAPI schema
    console.log(`Parsing OpenAPI schema from ${INPUT_SCHEMA_PATH}...`);
    const openApiDoc = await SwaggerParser.bundle(INPUT_SCHEMA_PATH);
    
    // Ensure we have the necessary structure
    if (!openApiDoc.components || !openApiDoc.components.schemas || !openApiDoc.components.schemas.OpenWebUIConfig) {
      console.error('\x1b[31mError: The OpenAPI schema does not contain the expected OpenWebUIConfig component\x1b[0m');
      process.exit(1);
    }
    
    // Extract the main config schema to provide better context for generation
    const configSchema = openApiDoc.components.schemas.OpenWebUIConfig;
    console.log(`Found OpenWebUIConfig with ${Object.keys(configSchema.properties || {}).length} properties`);
    
    // Generate Zod schemas using typed-openapi
    console.log('Generating Zod schemas...');
    let generatedContent;
    
    try {
      // First try using mapOpenApiEndpoints with just the relevant schema
      const ctx = mapOpenApiEndpoints({
        ...openApiDoc,
        // Focus just on the components part to avoid endpoint generation
        paths: {}
      });
      
      generatedContent = generateFile({
        ...ctx,
        runtime: 'zod',
        schemasOnly: true,
      });
    } catch (error) {
      console.log('First approach failed, trying alternative:', error.message);
      
      // Try direct approach as fallback
      try {
        generatedContent = generateFile({
          doc: openApiDoc,
          runtime: 'zod',
          schemasOnly: true,
        });
      } catch (innerError) {
        console.error('Both approaches failed:', innerError.message);
        throw new Error('Failed to generate schemas using typed-openapi');
      }
    }
    
    if (!generatedContent) {
      throw new Error('Failed to generate schemas using typed-openapi');
    }
    
    // Process the generated content
    console.log('Processing and formatting the generated Zod schemas...');
    const { schemasContent, indexContent } = await processZodSchema(generatedContent);
    
    // Format with prettier if available
    let formattedSchemasContent = schemasContent;
    let formattedIndexContent = indexContent;
    
    try {
      // Dynamic import for prettier (ESM compatibility)
      const prettier = await import('prettier');
      const options = {
        parser: 'typescript',
        printWidth: 100,
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
      };
      
      formattedSchemasContent = await prettier.default.format(schemasContent, options);
      formattedIndexContent = await prettier.default.format(indexContent, options);
      console.log('Formatted schemas with prettier.');
    } catch (error) {
      console.warn('Warning: Could not format with prettier. Using unformatted output.');
      console.warn(error.message);
    }
    
    // Write the output files
    console.log(`Writing schema file to: ${SCHEMAS_FILE_PATH}`);
    fs.writeFileSync(SCHEMAS_FILE_PATH, formattedSchemasContent, 'utf8');
    
    console.log(`Writing index file to: ${INDEX_FILE_PATH}`);
    fs.writeFileSync(INDEX_FILE_PATH, formattedIndexContent, 'utf8');
    
    console.log('\x1b[32m%s\x1b[0m', 'Conversion completed successfully!');
    console.log('\x1b[36m%s\x1b[0m', 'Generated files:');
    console.log(`- ${SCHEMAS_FILE_PATH}`);
    console.log(`- ${INDEX_FILE_PATH}`);
  } catch (error) {
    console.error('\x1b[31mError during conversion:\x1b[0m', error);
    process.exit(1);
  }
}

// Run the conversion
main();
