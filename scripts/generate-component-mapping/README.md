# Component Mapping Generator for OpenWebUI Forms

This tool generates intelligent component mappings for OpenWebUI configuration forms by applying declarative design rules to field characteristics extracted from OpenAPI schemas and uiSchema metadata.

## 🎯 Core Philosophy: Design Decisions, Not Technical Inference

The fundamental principle governing this system is that **component selection is a design decision, not a technical inference problem**. While algorithms can suggest reasonable defaults based on field types and constraints, the final choice of which component to use for each field should flow from explicit design rules that humans can understand, modify, and debug.

This system **amplifies human design decisions** rather than trying to replace them with algorithmic guessing. Every component assignment is traceable to either an explicit override rule, a pattern match, or a sensible type-based default.

## 🏗️ Architecture Overview

### Pipeline Context

This component mapping generator is the **third and final step** in the OpenWebUI form generation pipeline:

1. **`openapi-to-zod`** → Generates type-safe Zod validation schemas
2. **`extract-uiSchema`** → Extracts UI organization metadata and intelligent component suggestions
3. **`generate-component-mapping`** → Applies design rules to create final component registry *(this tool)*

### System Design

The system leverages a **layered decision-making approach**:

```
┌─────────────────────────────────────┐
│ Explicit Field Overrides           │ ← Highest Priority
├─────────────────────────────────────┤
│ Pattern-Based Rules                 │
├─────────────────────────────────────┤
│ Existing uiSchema Suggestions       │ ← Leverage existing intelligence
├─────────────────────────────────────┤
│ Validation Influence Rules          │
├─────────────────────────────────────┤
│ Type-Based Defaults                 │
└─────────────────────────────────────┘
```

This approach scales well because you only need to specify overrides for fields requiring special treatment, rather than mapping hundreds of fields individually.

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- Completed previous pipeline steps (`openapi-to-zod` and `extract-uiSchema`)

### Installation

```bash
cd scripts/generate-component-mapping
npm install
```

### Basic Usage

```bash
# Generate component mappings
npm run generate

# Or run directly
node index.js
```

The tool will:
1. Read existing Zod schemas and uiSchema data
2. Apply declarative design rules 
3. Generate `src/schemas/generated-component-mapping.ts`
4. Provide detailed statistics and insights

## 📋 Configuration Guide

### Understanding the Configuration File

The core of this system is `component-mapping-config.js`, which contains all the declarative rules that drive component selection. Understanding this file is crucial for maintaining and evolving your form designs.

#### Explicit Field Overrides

Use explicit overrides when specific fields need special treatment regardless of their characteristics:

```javascript
export const EXPLICIT_FIELD_OVERRIDES = {
  'OPENAI_API_KEY': 'secret-field',     // Always secure for API keys
  'VECTOR_DB': 'select-field',          // Critical selection needs dropdown
  'RAG_TEMPLATE': 'markdown-text-area', // Complex content needs rich editor
};
```

**When to use explicit overrides:**
- Fields that represent critical business decisions (like `VECTOR_DB`)
- Security-sensitive fields that must always be masked
- Fields with complex content that benefits from rich text editing
- Fields where user experience is paramount regardless of technical type

#### Pattern-Based Rules

Pattern rules provide consistency across fields with similar naming conventions:

```javascript
export const PATTERN_RULES = [
  { 
    pattern: '*_API_KEY', 
    component: 'secret-field',
    wrappers: ['plan-restricted-feature'],
    rationale: 'API keys contain sensitive authentication data'
  },
  { 
    pattern: 'ENABLE_*', 
    component: 'toggle-field',
    rationale: 'Enable flags are boolean toggles'
  }
];
```

**Pattern Rule Design Principles:**
- **Specificity First**: More specific patterns should come before general ones
- **Consistent Naming**: Patterns work best when your OpenAPI schema follows consistent naming conventions
- **Clear Rationale**: Always include a rationale explaining why this pattern choice makes sense

#### Type-Based Defaults

These provide sensible fallbacks when no explicit rules apply:

```javascript
export const TYPE_DEFAULTS = {
  'boolean': 'toggle-field',
  'string': 'text-field', 
  'array': 'array-field',
};
```

Type defaults ensure every field gets a reasonable component even if you haven't specified explicit rules for it.

### Modifying Component Mappings

#### Adding a New Field Override

When you need a specific field to use a different component:

1. **Identify the field name** from your OpenAPI schema
2. **Choose the appropriate component** from the available shadcn components
3. **Add the override** to `EXPLICIT_FIELD_OVERRIDES`
4. **Consider if this suggests a pattern** that should be generalized

Example scenario: You add a new field `CUSTOM_WEBHOOK_URL` that should use URL validation:

```javascript
// Add to EXPLICIT_FIELD_OVERRIDES
'CUSTOM_WEBHOOK_URL': 'url-input',

// Or better yet, create/enhance a pattern rule
{ 
  pattern: '*_WEBHOOK_URL', 
  component: 'url-input',
  rationale: 'Webhook URLs need URL-specific validation'
}
```

#### Creating Pattern Rules

When you notice multiple fields need similar treatment:

1. **Identify the naming pattern** (e.g., fields ending in `_SECRET`, starting with `ENABLE_`)
2. **Choose the appropriate component** for all fields matching this pattern
3. **Add a pattern rule** with clear rationale
4. **Test the pattern** by regenerating mappings and reviewing the results

Example: Adding support for password fields:

```javascript
{ 
  pattern: '*_PASSWORD', 
  component: 'secret-field',
  wrappers: ['plan-restricted-feature'], // If passwords indicate premium features
  rationale: 'Password fields require masking for security'
}
```

#### Modifying Wrapper Requirements

Some fields need wrapper components for conditional logic or premium features:

```javascript
export const COMPONENT_WRAPPER_RULES = {
  'secret-field': ['plan-restricted-feature'], // API keys often require premium access
};
```

**Common wrapper scenarios:**
- `conditional-field`: For fields that depend on other field values
- `plan-restricted-feature`: For premium or advanced features
- `overrideable-field`: For fields that can be overridden at different configuration levels

## 🔧 Advanced Configuration

### Validation Influence Rules

These rules let field constraints influence component selection:

```javascript
export const VALIDATION_INFLUENCE_RULES = {
  enumFieldsUseSelect: true,    // Fields with enum values become select components
  stringConstraintsToProps: true, // String length constraints become input props
  patternConstraintsToValidation: true, // Regex patterns add validation hints
};
```

### Component Props Generation

The system automatically generates component props based on field characteristics:

```javascript
// For a field with minLength: 8, maxLength: 50
// The system generates:
{
  component: 'text-field',
  props: {
    minLength: 8,
    maxLength: 50,
    placeholder: 'Enter at least 8 characters...'
  }
}
```

### Alternative Components

The system suggests alternative components for progressive enhancement:

```javascript
export const COMPONENT_ALTERNATIVES = {
  'text-field': ['textarea', 'input'],
  'select-field': ['radio-group', 'combobox'],
  'toggle-field': ['checkbox', 'switch'],
};
```

## 🛠️ Troubleshooting & Maintenance

### Common Issues and Solutions

#### Issue: "Fields using fallback components"

**Symptoms:** The generation log shows fields falling back to `text-field`
**Cause:** No explicit override, pattern rule, or existing suggestion for these fields
**Solution:** 
1. Review the fields using fallbacks in the generation statistics
2. Decide if they need explicit overrides or if a pattern rule would help
3. Add appropriate rules to the configuration

#### Issue: "Component not in available components list"

**Symptoms:** Warning about invalid component assignments
**Cause:** Configuration references a component that doesn't exist in your shadcn library
**Solution:**
1. Check the `AVAILABLE_COMPONENTS` list in the config file
2. Either add the component to your shadcn library or choose a different component
3. Update the configuration with valid component names

#### Issue: "Low component suggestion extraction rate"

**Symptoms:** Warning about low parsing quality from uiSchema
**Cause:** The TypeScript parsing couldn't extract existing component suggestions
**Solution:**
1. Regenerate the uiSchema using `extract-uiSchema`
2. Check that the uiSchema file structure matches expected patterns
3. Add more explicit overrides to compensate for missing suggestions

### Debugging Component Assignments

The system provides comprehensive debugging information:

```bash
# Enable detailed logging
DEBUG_CONFIG.logAssignmentDecisions = true

# View decision paths for specific fields
getComponentDecisionPath('OPENAI_API_KEY')
// Returns: ['explicit-override: secret-field']

getComponentDecisionReason('ENABLE_SIGNUP') 
// Returns: 'pattern-rule: ENABLE_* → toggle-field'
```

### Performance Considerations

**File Size Management:** Large schemas with hundreds of fields generate substantial TypeScript files. The system automatically chunks large configurations to maintain readability and compilation performance.

**Rule Evaluation Order:** Rules are evaluated in priority order. More specific rules (explicit overrides) are checked before general rules (type defaults) to ensure predictable behavior.

**Caching:** The system doesn't cache results between runs to ensure fresh generation with any configuration changes.

## 📊 Understanding Generation Statistics

After each generation, the tool provides detailed statistics to help you understand and improve your component mapping strategy:

### Rule Effectiveness

```
Rule Effectiveness:
- Explicit overrides: 15 fields (3.7%)
- Pattern matches: 127 fields (31.8%) 
- uiSchema suggestions: 201 fields (50.2%)
- Type defaults: 52 fields (13.0%)
- Fallbacks: 5 fields (1.3%)
```

**Interpreting these numbers:**
- **High uiSchema suggestions (>40%)**: Good! The system is leveraging existing intelligence
- **High pattern matches (>25%)**: Excellent! Your pattern rules are working effectively
- **High fallbacks (>5%)**: Consider adding more explicit overrides or pattern rules
- **High explicit overrides (>10%)**: You might benefit from generalizing some overrides into patterns

### Component Usage Distribution

```
Component Usage:
- text-field: 156 fields (39.0%)
- toggle-field: 89 fields (22.2%)
- secret-field: 67 fields (16.8%)
- select-field: 34 fields (8.5%)
- url-input: 28 fields (7.0%)
```

**Design insights:**
- **Balanced distribution**: Good variety suggests thoughtful component selection
- **Heavy text-field usage**: May indicate opportunities for more specific components
- **High secret-field usage**: Suggests good security practices for sensitive data

## 🔄 Evolution and Maintenance

### When Your OpenAPI Schema Changes

As your OpenWebUI configuration evolves, the component mapping system adapts gracefully:

1. **New fields**: Get sensible defaults based on type and existing patterns
2. **Changed field types**: Automatically get new component assignments
3. **Removed fields**: Are automatically excluded from the generated mappings

**Best practices for schema evolution:**
- Follow consistent naming conventions to leverage pattern rules
- Add explicit overrides for critical new fields
- Review generation statistics after major schema changes
- Update pattern rules when you identify new naming patterns

### Maintaining Design Consistency

**Regular Review Process:**
1. **Monthly**: Review generation statistics for new patterns or issues
2. **Quarterly**: Analyze component usage distribution for design consistency
3. **After major schema changes**: Full review of generated mappings

**Documentation Maintenance:**
- Keep rationales updated in pattern rules
- Document design decisions for future team members
- Update examples when adding new component types

### Integration with Form Rendering

The generated component mappings integrate seamlessly with your form rendering system:

```typescript
import { getComponentForField, getComponentProps } from './generated-component-mapping';

// In your form renderer
const component = getComponentForField('OPENAI_API_KEY'); // 'secret-field'
const props = getComponentProps('OPENAI_API_KEY'); // { type: 'password', autoComplete: 'new-password' }
```

### Team Collaboration Guidelines

**For Design Changes:**
1. Discuss significant component assignment changes with the team
2. Document the rationale for design decisions
3. Test component changes across different form contexts
4. Update pattern rules rather than adding many explicit overrides

**For New Team Members:**
1. Read this README thoroughly
2. Understand the layered decision-making approach
3. Practice by adding a few explicit overrides
4. Learn to identify when explicit overrides should become pattern rules

## 🧪 Testing and Validation

### Built-in Validation

The system includes comprehensive validation:

```typescript
// Validate all component mappings
const validation = validateComponentMappings();
if (!validation.valid) {
  console.log('Issues found:', validation.issues);
}
```

### Manual Testing Checklist

Before deploying component mapping changes:

- [ ] **Generate mappings**: Ensure generation completes without errors
- [ ] **Review statistics**: Check for unexpected changes in component distribution
- [ ] **Test critical fields**: Verify that security-sensitive fields use appropriate components
- [ ] **Check wrappers**: Ensure conditional fields have proper wrapper components
- [ ] **Validate alternatives**: Review alternative component suggestions

### Integration Testing

Test the generated mappings with your form rendering system:

```typescript
// Test component resolution
const testFields = ['OPENAI_API_KEY', 'ENABLE_SIGNUP', 'VECTOR_DB'];
testFields.forEach(field => {
  const component = getComponentForField(field);
  const props = getComponentProps(field);
  console.log(`${field}: ${component}`, props);
});
```

## 📚 Reference

### Available shadcn Components

The system maps to these form components from your shadcn library:

- `text-field`: Basic text input with validation
- `secret-field`: Password/API key input with masking
- `select-field`: Dropdown selection with options
- `toggle-field`: Boolean toggle/switch
- `url-input`: URL validation and input
- `array-field`: Array/list management
- `markdown-text-area`: Rich text editing for templates

### Available Wrapper Components

- `conditional-field`: Wrapper for conditional visibility based on other field values
- `overrideable-field`: Wrapper for fields with override capability at different levels
- `plan-restricted-feature`: Wrapper for premium features requiring specific plans

### Configuration File Reference

**Priority Order (highest to lowest):**
1. `EXPLICIT_FIELD_OVERRIDES`
2. `PATTERN_RULES` 
3. Existing uiSchema suggestions
4. `VALIDATION_INFLUENCE_RULES`
5. `TYPE_DEFAULTS`

**Key Configuration Objects:**
- `EXPLICIT_FIELD_OVERRIDES`: Field name → component mappings
- `PATTERN_RULES`: Array of pattern objects with component assignments
- `TYPE_DEFAULTS`: Data type → default component mappings
- `COMPONENT_WRAPPER_RULES`: Component → required wrappers
- `DEFAULT_COMPONENT_PROPS`: Component → default props

## 🤝 Contributing

When contributing to this system:

1. **Understand the philosophy**: Component selection should be predictable and traceable
2. **Add rationales**: Always explain why specific design decisions were made
3. **Test thoroughly**: Ensure changes don't break existing mappings
4. **Update documentation**: Keep this README current with any system changes
5. **Consider patterns**: Look for opportunities to generalize explicit overrides

## 📞 Support

If you encounter issues or need help with component mapping:

1. **Check the troubleshooting section** above
2. **Review generation statistics** for insights
3. **Enable debug logging** to understand decision paths
4. **Validate your configuration** against the reference section

Remember: This system is designed to be **predictable and debuggable**. Every component assignment should be traceable to a specific rule or decision point. If you can't understand why a field got a particular component, that's a sign the system needs improvement, not more complexity.
