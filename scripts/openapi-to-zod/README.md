# OpenAPI to Zod Schema Converter

This tool automatically converts the OpenWebUI OpenAPI configuration schema into type-safe Zod validation schemas.

## What It Does

The converter:

1. Reads the OpenAPI schema from `schemas/openwebui-config-schema.json`
2. Generates Zod validation schemas for each property defined in the schema
3. Creates TypeScript type definitions derived from the schemas
4. Outputs a combined schema that includes all properties
5. Writes the generated code to:
   - `src/schemas/generated-schemas.ts`
   - `src/schemas/index.ts`

## Requirements

- Node.js 14 or later

## Installation

From the repository root, run:

```bash
cd scripts/openapi-to-zod
npm install
```

## Usage

### Manual Execution

From the repository root, run:

```bash
cd scripts/openapi-to-zod
npm run convert
```

Or directly:

```bash
node scripts/openapi-to-zod/index.js
```

### GitHub Actions Integration

The tool can be integrated with GitHub Actions to automatically update the schemas whenever the OpenAPI schema changes.

To set this up, create a file at `.github/workflows/openapi-to-zod.yml` with the following content:

```yaml
name: OpenAPI to Zod Schema Conversion

on:
  push:
    paths:
      - 'schemas/openwebui-config-schema.json'
  workflow_dispatch:  # Allow manual trigger

jobs:
  convert:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd scripts/openapi-to-zod
          npm install
          npm install -g zod

      - name: Run conversion script
        run: node scripts/openapi-to-zod/index.js

      - name: Commit generated files
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "chore: update generated Zod schemas from OpenAPI"
          file_pattern: "src/schemas/*.ts"
```

## Generated Schema Structure

The tool generates two files:

### 1. src/schemas/generated-schemas.ts

Contains:
- Individual Zod schemas for each configuration property
- A combined schema (`OpenWebUIConfigSchema`) that includes all properties
- TypeScript types derived from the schemas

### 2. src/schemas/index.ts

A simple file that re-exports everything from generated-schemas.ts for easier imports.

## Using the Generated Schemas

In your application code, you can import and use the schemas:

```typescript
import { OpenWebUIConfigSchema, OpenWebUIConfig } from './src/schemas';

// Validate configuration
function validateConfig(config: unknown): OpenWebUIConfig {
  return OpenWebUIConfigSchema.parse(config);
}

// You can also import individual property schemas
import { PORT_Schema, ENABLE_SIGNUP_Schema } from './src/schemas';
```

The schemas are compatible with react-ts-form and shadcn/ui components as specified in the requirements.

## How It Works

The tool uses the typed-openapi library to generate the initial schemas, then applies custom processing to format the output according to the project requirements.

## Troubleshooting

If you encounter issues:

1. Make sure the OpenAPI schema is valid JSON
2. Ensure you're running the script from the repository root
3. Check that the output directory (`src/schemas/`) is writable
4. If the script fails to parse the schema, try validating it with a tool like [Swagger Editor](https://editor.swagger.io/)

## Future Considerations

As this OpenAPI to Zod schema conversion tool evolves, there are several enhancements and improvements to consider:

### Schema Improvements

1. **Required Field Handling**: The current implementation marks all fields as optional. A future enhancement would be to respect the `required` array in the OpenAPI schema to properly mark fields as required or optional in the generated Zod schemas.

2. **Custom Extensions Support**: The OpenWebUI OpenAPI schema uses several custom `x-` extensions (like `x-category`, `x-visibility`, etc.). These could be captured and integrated into the Zod schemas as metadata through custom methods or through Zod's `.describe()` and `.meta()` methods.

3. **Type Refinements**: Add more specific type refinements based on OpenAPI constraints. For example:
   - Add `.min()` and `.max()` for string length constraints
   - Add `.regex()` for pattern constraints
   - Implement `.refine()` for more complex validation logic

4. **Array Type Improvements**: Currently, array schemas are generated as `z.array(z.any())`. A better approach would be to analyze the `items` property in the OpenAPI schema to determine the appropriate array element type.

5. **Schema Documentation**: Add more comprehensive JSDoc comments and descriptions from the OpenAPI schema to make the generated types and schemas more self-documenting.

### Integration Enhancements

1. **React Form Generation**: Create additional utilities to generate form components from the Zod schemas using react-ts-form and shadcn/ui.

2. **Schema Transformation**: Implement transformations to make the schemas more compatible with specific form UI frameworks or validation libraries.

3. **Versioning Support**: Add support for tracking schema versions and generating migration utilities when the OpenAPI schema changes.

4. **Schema Tests**: Auto-generate test cases for each schema to verify validation behavior and provide examples of valid/invalid data.

### Tooling Improvements

1. **Validation Reports**: Generate human-readable validation error reports that map OpenAPI field descriptions to validation errors.

2. **Schema Visualization**: Create visual representations of the schema relationships and validation rules for documentation purposes.

3. **Incremental Updates**: Optimize the tool to only update schemas that have changed in the OpenAPI specification rather than regenerating everything.

4. **Interactive CLI**: Add an interactive CLI mode that allows users to select specific parts of the OpenAPI schema to convert, with options for customization.

5. **Dependency Reduction**: Minimize external dependencies to make the tool more portable and reduce potential compatibility issues.

### Performance Optimizations

1. **Caching**: Implement caching mechanisms to speed up repeated conversions of the same schemas.

2. **Parallelization**: Process multiple schemas in parallel for faster conversion of large OpenAPI documents.

3. **Memory Efficiency**: Optimize memory usage when dealing with very large OpenAPI schemas.

### Maintenance Considerations

1. **OpenAPI Evolution**: Stay compatible with future versions of the OpenAPI specification.

2. **Zod Evolution**: Adapt to changes in the Zod library API to ensure long-term compatibility.

3. **Testing Strategy**: Implement comprehensive unit and integration tests to ensure reliable schema conversion over time.

4. **Documentation**: Maintain thorough documentation as the tool evolves, including examples and best practices.

By addressing these considerations in future updates, this tool can become even more powerful and flexible for managing configuration validation in the OpenWebUI ecosystem.
