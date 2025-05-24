# OpenAPI to uiSchema Extraction Tool

This tool automatically extracts UI organization metadata from the OpenWebUI OpenAPI configuration schema, transforming custom `x-` extensions into structured uiSchema data for form generation.

## What It Does

The extraction pipeline:

1. **Parses** the OpenAPI schema from `schemas/openwebui-config-schema.json`
2. **Extracts** custom `x-` extensions (category, display-order, depends-on, provider-fields, etc.)
3. **Organizes** fields into both flat and hierarchical category structures
4. **Processes** complex conditional logic and dependency relationships
5. **Maps** field characteristics to appropriate shadcn UI components
6. **Generates** a comprehensive TypeScript uiSchema file ready for react-ts-form integration

## Architecture Overview

The extraction system follows a modular pipeline architecture, with each module handling a specific aspect of the transformation process:

```
OpenAPI Schema Input
        ↓
    Schema Parser ──────────→ Validates structure & extracts core schema
        ↓
    Extension Extractor ─────→ Processes all x- extensions & normalizes data
        ↓
    Category Builder ────────→ Creates flat & hierarchical category structures
        ↓
    Dependency Processor ────→ Handles conditional logic & provider mappings  
        ↓
    uiSchema Builder ────────→ Assembles comprehensive uiSchema structure
        ↓
    Output Formatter ────────→ Generates well-formatted TypeScript file
        ↓
    Generated uiSchema Output
```

## Module Structure

### Core Pipeline Modules

#### `index.js` - Main Orchestrator
**Purpose**: Coordinates the entire extraction pipeline
**Key Functions**:
- Validates input/output paths
- Orchestrates module execution sequence
- Provides extraction statistics and error handling
- Manages the complete transformation flow

#### `schema-parser.js` - OpenAPI Schema Parser
**Purpose**: Parses and validates the OpenAPI schema structure
**Key Functions**:
- `parseOpenApiSchema()` - Loads and validates the OpenAPI document
- `validateSchemaStructure()` - Ensures required components exist
- `getSchemaMetadata()` - Extracts schema statistics for analysis

**Input**: Raw OpenAPI JSON schema
**Output**: Validated schema object with metadata

#### `extension-extractor.js` - Custom Extension Processor  
**Purpose**: Extracts and normalizes all custom `x-` extensions
**Key Functions**:
- `extractExtensions()` - Main extraction coordinator
- `processExtensionValue()` - Handles different extension types
- `normalizeDependencyCondition()` - Standardizes dependency syntax
- `validateDependencyReferences()` - Ensures referential integrity

**Processing Logic**:
- **x-category** → Hierarchical category organization with parent/child relationships
- **x-display-order** → Numeric ordering within categories
- **x-depends-on** → Conditional field visibility rules
- **x-provider-fields** → Dynamic field revelation based on provider selection
- **x-visibility** → Field visibility control (exposed/hidden/conditional)
- **x-sensitive** → Security marking for credential fields
- **x-default-handling** → Default value strategy specification

**Input**: Schema properties object
**Output**: Normalized extensions map with validation

#### `category-builder.js` - Category Organization Builder
**Purpose**: Creates both flat and hierarchical category structures
**Key Functions**:
- `buildCategories()` - Main category structure builder
- `buildFlatCategories()` - Creates processing-optimized flat structure
- `buildHierarchicalCategories()` - Creates display-optimized nested structure
- `suggestDisplayGrouping()` - Provides UI rendering recommendations

**Organization Strategy**:
- **Flat Structure**: Optimized for react-ts-form processing and iteration
- **Hierarchical Structure**: Optimized for nested UI rendering (e.g., "Vector Database" → "Vector Database - ChromaDB")
- **Display Hints**: Suggests expandable/collapsible/inline rendering based on field count

**Input**: Extracted extensions with category assignments
**Output**: Dual-structure category organization with metadata

#### `dependency-processor.js` - Conditional Logic Handler
**Purpose**: Processes complex dependency relationships and conditional rendering
**Key Functions**:
- `processDependencies()` - Main dependency processing coordinator
- `extractDependencyRelationships()` - Handles x-depends-on conditions
- `processProviderFieldMappings()` - Converts x-provider-fields to dependencies
- `analyzeDependencyChains()` - Detects circular dependencies and complex chains
- `mergeDependencies()` - Combines multiple dependency sources for single fields

**Dependency Types Supported**:
- **Simple Equality**: `{ "VECTOR_DB": "chroma" }`
- **Multiple Conditions**: Combined with AND/OR operators
- **Provider Mappings**: Automatic field revelation based on provider selection
- **Complex Chains**: Multi-level dependency relationships

**Analysis Features**:
- Circular dependency detection
- Chain depth analysis  
- Reference validation
- Performance optimization suggestions

**Input**: Extensions map with dependency information
**Output**: Structured dependency map with analysis metadata

#### `uiSchema-builder.js` - Core uiSchema Assembly
**Purpose**: Assembles the comprehensive uiSchema structure from all processed data
**Key Functions**:
- `buildUiSchema()` - Main assembly coordinator
- `buildFieldConfigurations()` - Creates RJSF-compatible field configs
- `buildComponentMappings()` - Maps fields to shadcn components
- `buildConditionalRules()` - Structures dependency rules for react-ts-form
- `buildValidationIntegration()` - Prepares Zod schema integration metadata

**Component Mapping Logic**:
The system analyzes field characteristics and maps to your shadcn component library:

```javascript
// Field Type → Component Mapping Examples
sensitive fields     → 'secret-field'
enum values          → 'select-field' 
boolean fields       → 'toggle-field'
conditional fields   → 'conditional-field' wrapper
URL inputs           → 'url-input'
arrays               → 'array-field'
```

**Integration Preparation**:
- **RJSF Compatibility**: Standard uiSchema properties (ui:widget, ui:options, etc.)
- **react-ts-form Hints**: Component suggestions and props for seamless integration
- **Zod Integration**: Metadata linking to existing generated Zod schemas

**Input**: All processed pipeline data (extensions, categories, dependencies)
**Output**: Complete uiSchema structure ready for form generation

#### `output-formatter.js` - TypeScript File Generator
**Purpose**: Formats the uiSchema structure into production-ready TypeScript
**Key Functions**:
- `formatOutput()` - Main formatting coordinator with Prettier integration
- `generateTypeScriptContent()` - Creates complete file content
- `generateTypeDefinitions()` - Comprehensive TypeScript interfaces
- `generateUtilityFunctions()` - Helper functions for uiSchema consumption

**Output Features**:
- **Type Safety**: Full TypeScript interfaces for all structures
- **Code Quality**: Prettier-formatted, well-commented output
- **Utility Functions**: Helper methods for common uiSchema operations
- **Integration Metadata**: Ready-to-use information for react-ts-form
- **Validation Functions**: Built-in integrity checking

**Input**: Complete uiSchema structure
**Output**: Production-ready TypeScript file

### Generated Output Structure

The generated `src/schemas/generated-uiSchema.ts` contains:

#### Category Organization
```typescript
export const categoryOrganization: CategoryOrganization
export const categories: CategoryInfo[]
export const hierarchicalCategories: HierarchicalCategory[]
```

#### Field Configurations  
```typescript
export const fieldConfigurations: Record<string, FieldConfiguration>
```

#### Conditional Logic
```typescript
export const conditionalRules: Record<string, ConditionalRule>
```

#### Component Mappings
```typescript
export const componentMappings: Record<string, ComponentMapping>
```

#### Integration Metadata
```typescript
export const integrationMetadata: IntegrationMetadata
export const validationIntegration: ValidationIntegration
export const reactTsFormIntegration: ReactTsFormIntegration
```

#### Utility Functions
```typescript
export function getFieldsInCategory(categoryName: string): string[]
export function getFieldCategory(fieldName: string): CategoryInfo | null
export function getDependentFields(targetField: string): string[]
export function getFieldsByCharacteristic(characteristic: string): string[]
export function validateUiSchemaIntegrity(): ValidationResult
```

## Processing Flow Details

### Extension Processing Pipeline

The system processes OpenAPI custom extensions in this specific order to ensure proper dependency resolution:

1. **Extract Raw Extensions** - Pull all `x-` prefixed properties
2. **Normalize Extension Values** - Convert to standardized formats
3. **Validate References** - Ensure dependency targets exist
4. **Build Category Assignments** - Organize fields into logical groups
5. **Process Dependencies** - Handle conditional logic and provider mappings
6. **Generate Component Hints** - Map to shadcn component library
7. **Assemble Final Structure** - Create comprehensive uiSchema

### Dependency Resolution Strategy

The system handles increasingly complex dependency scenarios:

**Level 1 - Simple Dependencies**:
```json
"x-depends-on": { "VECTOR_DB": "chroma" }
```

**Level 2 - Provider Dependencies**:
```json
"x-provider-fields": {
  "chroma": ["CHROMA_TENANT", "CHROMA_DATABASE", ...]
}
```

**Level 3 - Complex Dependencies**:
```json
"x-depends-on": { 
  "FIELD_A": "value1", 
  "FIELD_B": ["value2", "value3"] 
}
```

### Component Integration Strategy

The extraction system is designed to work seamlessly with your existing shadcn component architecture:

**Form Structure Integration**:
- **Categories** → `category-section` components
- **Field Groups** → `field-group` layouts  
- **Individual Fields** → Appropriate field components
- **Conditional Logic** → `conditional-field` wrappers

**Component Selection Logic**:
The system considers multiple factors when suggesting components:
- Field data type and format
- Validation constraints  
- Sensitivity flags
- Enumeration options
- Dependency relationships
- UI complexity requirements

## Future Extensibility

The modular architecture supports easy extension for new OpenAPI custom extensions or shadcn components:

**Adding New Extensions**:
1. Update `extension-extractor.js` with new extension processing logic
2. Modify `uiSchema-builder.js` to incorporate new metadata
3. Update TypeScript interfaces in `output-formatter.js`

**Adding New Component Types**:
1. Update component mapping logic in `uiSchema-builder.js`
2. Add new component suggestions to `inferComponentFromType()`
3. Update alternative component suggestions

**Integration Points**:
- **Validation**: Links to existing Zod schema generation
- **Form Generation**: Provides metadata for react-ts-form consumption  
- **UI Rendering**: Suggests appropriate shadcn components
- **Conditional Logic**: Supports complex field interdependencies

## Error Handling & Validation

The system includes comprehensive error handling and validation:

**Schema Validation**:
- OpenAPI structure validation
- Required component verification
- Property type checking

**Reference Validation**:
- Dependency target existence
- Circular dependency detection
- Category reference integrity

**Output Validation**:
- TypeScript interface compliance
- uiSchema structure integrity
- Component mapping completeness

**Warning System**:
- Non-breaking issues logged as warnings
- Suggestions for schema improvements
- Performance optimization recommendations

This extraction tool bridges the gap between your OpenAPI schema definition and your sophisticated shadcn-based form rendering system, providing the organizational metadata needed for intelligent, category-based form generation with full conditional logic support.
