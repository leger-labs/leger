#!/usr/bin/env node

// Use ES modules for compatibility and modern JavaScript features
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { parseOpenApiSchema } from './schema-parser.js';
import { extractExtensions } from './extension-extractor.js';
import { buildCategories } from './category-builder.js';
import { processDependencies } from './dependency-processor.js';
import { buildUiSchema } from './uiSchema-builder.js';
import { formatOutput } from './output-formatter.js';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The script should find files relative to the repository root
// When run from scripts/extract-uiSchema, we need to go up two levels
const REPO_ROOT = path.resolve(__dirname, '../..');
console.log('Repository root directory:', REPO_ROOT);

// Configuration with paths relative to repo root
const INPUT_SCHEMA_PATH = path.join(REPO_ROOT, 'schemas/openwebui-config-schema.json');
const OUTPUT_DIR = path.join(REPO_ROOT, 'src/schemas');
const UISCHEMA_FILE_PATH = path.join(OUTPUT_DIR, 'generated-uiSchema.ts');

/**
 * Main uiSchema extraction function
 * This orchestrates the entire extraction pipeline from OpenAPI to uiSchema
 */
async function main() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '=== OpenAPI to uiSchema Extraction ===');
    console.log('Starting extraction process...');
    
    // Step 1: Verify input file exists and prepare output directory
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
    
    // Step 2: Parse and validate the OpenAPI schema
    console.log(`Parsing OpenAPI schema from ${INPUT_SCHEMA_PATH}...`);
    const { openApiDoc, configSchema } = await parseOpenApiSchema(INPUT_SCHEMA_PATH);
    console.log(`Found OpenWebUIConfig with ${Object.keys(configSchema.properties || {}).length} properties`);
    
    // Step 3: Extract all custom extensions from each property
    console.log('Extracting custom extensions from schema properties...');
    const extensionsMap = extractExtensions(configSchema.properties || {});
    console.log(`Processed ${Object.keys(extensionsMap).length} properties with custom extensions`);
    
    // Step 4: Build category structures (both flat and hierarchical)
    console.log('Building category organization structures...');
    const categoryStructure = buildCategories(extensionsMap);
    console.log(`Organized into ${categoryStructure.categories.length} categories`);
    
    // Step 5: Process dependency relationships and conditional logic
    console.log('Processing dependency relationships and conditional logic...');
    const dependencyMap = processDependencies(extensionsMap);
    console.log(`Processed ${Object.keys(dependencyMap).length} fields with dependencies`);
    
    // Step 6: Build the comprehensive uiSchema structure
    console.log('Building uiSchema structure...');
    const uiSchemaStructure = buildUiSchema({
      extensionsMap,
      categoryStructure,
      dependencyMap,
      originalSchema: configSchema
    });
    
    // Step 7: Format and generate the TypeScript output file
    console.log('Generating TypeScript output...');
    const formattedOutput = await formatOutput(uiSchemaStructure);
    
    // Step 8: Write the output file
    console.log(`Writing uiSchema file to: ${UISCHEMA_FILE_PATH}`);
    fs.writeFileSync(UISCHEMA_FILE_PATH, formattedOutput, 'utf8');
    
    console.log('\x1b[32m%s\x1b[0m', 'uiSchema extraction completed successfully!');
    console.log('\x1b[36m%s\x1b[0m', 'Generated file:');
    console.log(`- ${UISCHEMA_FILE_PATH}`);
    
    // Provide some statistics about what was extracted
    console.log('\n\x1b[36m%s\x1b[0m', 'Extraction Summary:');
    console.log(`- Total properties processed: ${Object.keys(extensionsMap).length}`);
    console.log(`- Categories created: ${categoryStructure.categories.length}`);
    console.log(`- Fields with dependencies: ${Object.keys(dependencyMap).length}`);
    console.log(`- Hierarchical category levels: ${categoryStructure.hierarchy ? Object.keys(categoryStructure.hierarchy).length : 0}`);
    
  } catch (error) {
    console.error('\x1b[31mError during uiSchema extraction:\x1b[0m', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the extraction process
main();
