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
