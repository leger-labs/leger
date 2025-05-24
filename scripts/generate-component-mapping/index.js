#!/usr/bin/env node

/**
 * Component Mapping Generator - Main Orchestrator
 * 
 * This is the third and final step in the OpenWebUI form generation pipeline.
 * It applies declarative design rules to generate component mappings from the
 * existing uiSchema and Zod schema information.
 * 
 * Pipeline Context:
 * 1. openapi-to-zod → Generated Zod validation schemas
 * 2. extract-uiSchema → Generated UI organization metadata  
 * 3. generate-component-mapping → Component mappings (this script)
 * 
 * Philosophy:
 * This tool treats component selection as a design decision, not a technical
 * inference problem. It applies explicit design rules in a predictable,
 * debuggable manner rather than trying to "intelligently" guess components.
 * 
 * The system leverages existing suggestions from the uiSchema while allowing
 * focused design overrides for special cases. This approach scales well because
 * you only need to specify rules for fields that need special treatment.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readAllSchemas } from './schema-reader.js';
import { generateComponentMappings } from './mapping-generator.js';
import { formatOutput } from './output-formatter.js';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repository root calculation - when run from scripts/generate-component-mapping
const REPO_ROOT = path.resolve(__dirname, '../..');
console.log('Repository root directory:', REPO_ROOT);

// Configuration with paths relative to repo root
const OUTPUT_DIR = path.join(REPO_ROOT, 'src/schemas');
const OUTPUT_FILE_PATH = path.join(OUTPUT_DIR, 'generated-component-mapping.ts');

// Input files (these should exist from previous pipeline steps)
const REQUIRED_INPUT_FILES = [
  path.join(REPO_ROOT, 'src/schemas/generated-schemas.ts'),
  path.join(REPO_ROOT, 'src/schemas/generated-uiSchema.ts'),
  path.join(REPO_ROOT, 'schemas/openwebui-config-schema.json')
];

/**
 * Main component mapping generation function
 * This orchestrates the entire process from reading schemas to generating output
 */
async function main() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '=== Component Mapping Generation ===');
    console.log('Applying declarative design rules to generate component mappings...');
    console.log('');
    
    // Step 1: Validate that all required input files exist
    console.log('🔍 Validating pipeline dependencies...');
    validateInputFiles();
    console.log('✓ All required input files found');
    
    // Step 2: Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      console.log(`Creating output directory: ${OUTPUT_DIR}`);
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Step 3: Read and parse all schema sources
    console.log('📖 Reading schema information...');
    const schemaData = await readAllSchemas(REPO_ROOT);
    console.log(`✓ Successfully read schema data for ${Object.keys(schemaData.fields).length} fields`);
    
    // Log schema reading statistics
    logSchemaReadingStats(schemaData);
    
    // Step 4: Generate component mappings using declarative rules
    console.log('🎯 Generating component mappings...');
    const mappingResults = generateComponentMappings(schemaData);
    console.log(`✓ Generated mappings for ${Object.keys(mappingResults.mappings).length} fields`);
    
    // Log mapping generation statistics
    logMappingGenerationStats(mappingResults);
    
    // Step 5: Format the output into production-ready TypeScript
    console.log('📝 Formatting TypeScript output...');
    const formattedOutput = await formatOutput(mappingResults, schemaData);
    console.log('✓ Generated TypeScript file with types and utilities');
    
    // Step 6: Write the output file
    console.log(`💾 Writing output file: ${OUTPUT_FILE_PATH}`);
    fs.writeFileSync(OUTPUT_FILE_PATH, formattedOutput, 'utf8');
    
    // Step 7: Validate the generated output
    console.log('✅ Validating generated output...');
    validateGeneratedOutput(OUTPUT_FILE_PATH);
    
    // Success summary
    console.log('\n\x1b[32m%s\x1b[0m', '🎉 Component mapping generation completed successfully!');
    console.log('\x1b[36m%s\x1b[0m', 'Generated file:');
    console.log(`- ${OUTPUT_FILE_PATH}`);
    
    // Final statistics summary
    console.log('\n\x1b[36m%s\x1b[0m', '📊 Generation Summary:');
    printFinalSummary(schemaData, mappingResults);
    
    // Design insights for developers
    console.log('\n\x1b[36m%s\x1b[0m', '💡 Design Insights:');
    printDesignInsights(mappingResults);
    
  } catch (error) {
    console.error('\n\x1b[31mError during component mapping generation:\x1b[0m');
    console.error(error.message);
    
    if (error.stack && process.env.NODE_ENV === 'development') {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    // Provide helpful guidance for common errors
    printErrorGuidance(error);
    
    process.exit(1);
  }
}

/**
 * Validate that all required input files exist
 * This prevents the system from proceeding with incomplete pipeline dependencies
 * 
 * @throws {Error} If any required file is missing
 */
function validateInputFiles() {
  const missingFiles = [];
  
  REQUIRED_INPUT_FILES.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      missingFiles.push(filePath.replace(REPO_ROOT, '.'));
    }
  });
  
  if (missingFiles.length > 0) {
    throw new Error(
      `Missing required input files from previous pipeline steps:\n` +
      missingFiles.map(file => `  - ${file}`).join('\n') + '\n\n' +
      'Please run the previous pipeline steps first:\n' +
      '  1. npm run convert (in scripts/openapi-to-zod)\n' +
      '  2. npm run extract (in scripts/extract-uiSchema)\n' +
      '  3. Then run this script'
    );
  }
}

/**
 * Log statistics from the schema reading process
 * This helps developers understand what data was available for processing
 * 
 * @param {object} schemaData - Schema data with metadata
 */
function logSchemaReadingStats(schemaData) {
  const { metadata } = schemaData;
  
  console.log('  📊 Schema Reading Statistics:');
  console.log(`    - Zod schema fields: ${metadata.zodFields}`);
  console.log(`    - uiSchema fields: ${metadata.uiSchemaFields}`);
  console.log(`    - Original schema fields: ${metadata.originalSchemaFields}`);
  console.log(`    - Combined field data: ${metadata.combinedFields}`);
  
  // Analyze field characteristics
  const fields = Object.values(schemaData.fields);
  const fieldStats = {
    withEnums: fields.filter(f => f.enumValues?.length > 0).length,
    withConstraints: fields.filter(f => Object.keys(f.constraints || {}).length > 0).length,
    withExistingSuggestions: fields.filter(f => f.existingComponentSuggestion).length,
    withConditionalLogic: fields.filter(f => f.hasConditionalLogic).length,
    withCustomExtensions: fields.filter(f => Object.keys(f.customExtensions || {}).length > 0).length
  };
  
  console.log('  🔍 Field Characteristics:');
  console.log(`    - Fields with enum values: ${fieldStats.withEnums}`);
  console.log(`    - Fields with constraints: ${fieldStats.withConstraints}`);
  console.log(`    - Fields with existing suggestions: ${fieldStats.withExistingSuggestions}`);
  console.log(`    - Fields with conditional logic: ${fieldStats.withConditionalLogic}`);
  console.log(`    - Fields with custom extensions: ${fieldStats.withCustomExtensions}`);
}

/**
 * Log statistics from the mapping generation process
 * This shows how effective the different rule types were
 * 
 * @param {object} mappingResults - Results from mapping generation
 */
function logMappingGenerationStats(mappingResults) {
  const { statistics } = mappingResults;
  
  console.log('  📊 Rule Effectiveness:');
  console.log(`    - Explicit overrides: ${statistics.ruleEffectiveness.explicitOverrides} fields`);
  console.log(`    - Pattern matches: ${statistics.ruleEffectiveness.patternMatches} fields`);
  console.log(`    - uiSchema suggestions: ${statistics.ruleEffectiveness.uiSchemaSuggestions} fields`);
  console.log(`    - Validation influences: ${statistics.ruleEffectiveness.validationInfluences} fields`);
  console.log(`    - Type defaults: ${statistics.ruleEffectiveness.typeDefaults} fields`);
  console.log(`    - Fallbacks: ${statistics.ruleEffectiveness.fallbacks} fields`);
  
  if (statistics.ruleEffectiveness.fallbacks > 0) {
    console.log(`  ⚠️  ${statistics.ruleEffectiveness.fallbacks} fields used fallback components - consider adding rules`);
  }
}

/**
 * Validate the generated output file
 * Basic validation to ensure the file was generated correctly
 * 
 * @param {string} outputPath - Path to the generated file
 */
function validateGeneratedOutput(outputPath) {
  try {
    const content = fs.readFileSync(outputPath, 'utf8');
    
    // Basic validations
    const validations = [
      { check: content.includes('export const componentMappings'), message: 'Missing componentMappings export' },
      { check: content.includes('export const componentProps'), message: 'Missing componentProps export' },
      { check: content.includes('export function getComponentForField'), message: 'Missing utility functions' },
      { check: content.includes('ComponentMapping'), message: 'Missing TypeScript types' },
      { check: content.length > 1000, message: 'Generated file suspiciously small' }
    ];
    
    const failures = validations.filter(v => !v.check);
    
    if (failures.length > 0) {
      throw new Error(`Generated file validation failed:\n${failures.map(f => `  - ${f.message}`).join('\n')}`);
    }
    
    console.log(`✓ Generated file validated (${Math.round(content.length / 1024)}KB)`);
    
  } catch (error) {
    throw new Error(`Failed to validate generated output: ${error.message}`);
  }
}

/**
 * Print final summary of the generation process
 * This gives developers a complete overview of what was accomplished
 * 
 * @param {object} schemaData - Original schema data
 * @param {object} mappingResults - Mapping generation results
 */
function printFinalSummary(schemaData, mappingResults) {
  const { statistics } = mappingResults;
  
  console.log(`- Total configuration fields: ${statistics.totalFields}`);
  console.log(`- Successfully mapped: ${Object.keys(mappingResults.mappings).length}`);
  console.log(`- Unique components used: ${statistics.uniqueComponents}`);
  console.log(`- Fields with wrapper components: ${statistics.fieldsWithWrappers}`);
  console.log(`- Fields with alternative components: ${statistics.fieldsWithAlternatives}`);
  
  // Component usage breakdown
  console.log('\n  🧩 Component Usage:');
  const sortedUsage = Object.entries(statistics.componentUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8); // Show top 8 most used components
  
  sortedUsage.forEach(([component, count]) => {
    const percentage = Math.round((count / statistics.totalFields) * 100);
    console.log(`    - ${component}: ${count} fields (${percentage}%)`);
  });
  
  if (Object.keys(statistics.componentUsage).length > 8) {
    const remaining = Object.keys(statistics.componentUsage).length - 8;
    console.log(`    - ... and ${remaining} other components`);
  }
}

/**
 * Print design insights for developers
 * This helps developers understand the patterns in their configuration schema
 * 
 * @param {object} mappingResults - Mapping generation results
 */
function printDesignInsights(mappingResults) {
  const { statistics, metadata } = mappingResults;
  
  // Calculate rule effectiveness ratio
  const totalRuleBasedAssignments = statistics.ruleBasedAssignments;
  const ruleEffectiveness = Math.round((totalRuleBasedAssignments / statistics.totalFields) * 100);
  
  console.log(`- Rule-based assignment rate: ${ruleEffectiveness}% (${totalRuleBasedAssignments}/${statistics.totalFields})`);
  
  if (ruleEffectiveness >= 90) {
    console.log('  ✨ Excellent! Rules cover almost all fields effectively');
  } else if (ruleEffectiveness >= 75) {
    console.log('  👍 Good rule coverage, consider adding patterns for remaining fields');
  } else {
    console.log('  🤔 Rule coverage could be improved - consider adding more pattern rules');
  }
  
  // Pattern usage insights
  if (metadata.ruleUsageStats?.patternUsage) {
    const patternCount = Object.keys(metadata.ruleUsageStats.patternUsage).length;
    const mostUsedPattern = Object.entries(metadata.ruleUsageStats.patternUsage)
      .sort(([,a], [,b]) => b - a)[0];
    
    console.log(`- Active patterns: ${patternCount} patterns matched fields`);
    if (mostUsedPattern) {
      console.log(`- Most effective pattern: "${mostUsedPattern[0]}" (${mostUsedPattern[1]} fields)`);
    }
  }
  
  // Suggest improvements
  if (statistics.ruleEffectiveness.fallbacks > 0) {
    console.log(`- Improvement opportunity: ${statistics.ruleEffectiveness.fallbacks} fields using fallback components`);
    console.log('  Consider adding explicit overrides or patterns for these fields');
  }
  
  if (statistics.fieldsWithWrappers > 0) {
    console.log(`- Fields requiring special handling: ${statistics.fieldsWithWrappers} have wrapper components`);
    console.log('  These likely represent premium features or conditional logic');
  }
}

/**
 * Print helpful error guidance for common issues
 * This helps developers quickly resolve problems
 * 
 * @param {Error} error - The error that occurred
 */
function printErrorGuidance(error) {
  console.log('\n\x1b[33m%s\x1b[0m', '💡 Troubleshooting Guidance:');
  
  if (error.message.includes('Missing required input files')) {
    console.log('- Run the previous pipeline steps in order:');
    console.log('  1. cd scripts/openapi-to-zod && npm run convert');
    console.log('  2. cd scripts/extract-uiSchema && npm run extract');
    console.log('  3. cd scripts/generate-component-mapping && npm run generate');
  } else if (error.message.includes('Cannot read') || error.message.includes('ENOENT')) {
    console.log('- Check that the OpenAPI schema file exists at schemas/openwebui-config-schema.json');
    console.log('- Verify that previous pipeline steps completed successfully');
    console.log('- Check file permissions in the src/schemas directory');
  } else if (error.message.includes('JSON') || error.message.includes('parse')) {
    console.log('- One of the input files may be corrupted or invalid');
    console.log('- Try re-running the previous pipeline steps');
    console.log('- Check the OpenAPI schema for JSON syntax errors');
  } else if (error.message.includes('component') || error.message.includes('mapping')) {
    console.log('- Check the component-mapping-config.js file for typos');
    console.log('- Verify that all referenced components exist in the shadcn component library');
    console.log('- Review the AVAILABLE_COMPONENTS list in the config file');
  } else {
    console.log('- Check that Node.js version is 14 or higher');
    console.log('- Try deleting node_modules and running npm install');
    console.log('- Verify that all required dependencies are installed');
  }
}

/**
 * Handle process signals gracefully
 */
process.on('SIGINT', () => {
  console.log('\n\x1b[33m%s\x1b[0m', '⚠️  Generation interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n\x1b[33m%s\x1b[0m', '⚠️  Generation terminated');
  process.exit(1);
});

// Run the component mapping generation process
main();
