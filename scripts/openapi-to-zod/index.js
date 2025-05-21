#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const SwaggerParser = require('@apidevtools/swagger-parser');
const { generateFile } = require('typed-openapi');
const { processZodSchema } = require('./zod-processor');

// We'll determine paths relative to the repo root, not this script's location
const REPO_ROOT = process.cwd();  // This will be the directory where the script is run from
const SCRIPT_DIR = __dirname;

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
      console.log('Make sure you run this script from the repository root or specify the correct path.');
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
    
    // Generate Zod schemas using typed-openapi
    console.log('Generating Zod schemas...');
    // The API might have changed in v1.4.2, let's try both approaches
    let generatedContent;
    try {
      // Try the new API first
      generatedContent = generateFile({
        doc: openApiDoc,
        runtime: 'zod',
        schemasOnly: true,
      });
    } catch (error) {
      console.log('Trying alternative API approach...');
      // Fall back to using the mapOpenApiEndpoints function if available
      const { mapOpenApiEndpoints } = require('typed-openapi');
      const ctx = mapOpenApiEndpoints(openApiDoc);
      generatedContent = generateFile({
        ...ctx,
        runtime: 'zod',
        schemasOnly: true,
      });
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
      const prettier = require('prettier');
      const options = {
        parser: 'typescript',
        printWidth: 100,
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
      };
      
      formattedSchemasContent = await prettier.format(schemasContent, options);
      formattedIndexContent = await prettier.format(indexContent, options);
      console.log('Formatted schemas with prettier.');
    } catch (error) {
      console.warn('Warning: Could not format with prettier. Using unformatted output.');
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
