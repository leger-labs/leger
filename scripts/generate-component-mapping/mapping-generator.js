/**
 * Mapping Generator Module
 * 
 * This is the core logic module that combines existing component suggestions from the uiSchema
 * with explicit design override rules to generate the final component mappings. The philosophy
 * here is to leverage the intelligence already present in the uiSchema while allowing focused
 * design decisions to override defaults where needed.
 * 
 * Think of this as a layered decision-making system:
 * 1. Start with existing intelligent suggestions from uiSchema
 * 2. Apply explicit field overrides for special cases
 * 3. Apply pattern-based rules for consistency
 * 4. Use type-based defaults as final fallback
 * 5. Enhance with validation-driven props and wrappers
 * 
 * This approach scales well because we only need to specify overrides for fields that need
 * special treatment, rather than mapping hundreds of fields individually.
 */

import _ from 'lodash';
import {
  EXPLICIT_FIELD_OVERRIDES,
  PATTERN_RULES,
  TYPE_DEFAULTS,
  COMPONENT_WRAPPER_RULES,
  DEFAULT_COMPONENT_PROPS,
  CONDITIONAL_FIELD_RULES,
  VALIDATION_INFLUENCE_RULES,
  COMPONENT_ALTERNATIVES,
  AVAILABLE_COMPONENTS,
  AVAILABLE_WRAPPERS,
  RULE_PRIORITY_ORDER,
  DEBUG_CONFIG
} from './component-mapping-config.js';

/**
 * Generate component mappings for all fields
 * This is the main orchestration function that processes all fields and generates
 * their component assignments using the declarative rules.
 * 
 * @param {object} schemaData - Combined schema information from schema-reader
 * @returns {object} Complete component mapping registry
 */
export function generateComponentMappings(schemaData) {
  console.log('Generating component mappings using declarative design rules...');
  
  const { fields } = schemaData;
  const fieldNames = Object.keys(fields);
  
  // Initialize tracking for decisions and statistics
  const mappingDecisions = {};
  const ruleUsageStats = initializeRuleUsageStats();
  
  console.log(`Processing ${fieldNames.length} fields for component assignment...`);
  
  // Process each field to determine its component mapping
  const componentMappings = {};
  
  fieldNames.forEach(fieldName => {
    const fieldInfo = fields[fieldName];
    const mapping = generateFieldComponentMapping(fieldInfo, ruleUsageStats);
    
    componentMappings[fieldName] = mapping;
    mappingDecisions[fieldName] = mapping.decisionPath;
    
    if (DEBUG_CONFIG.logAssignmentDecisions) {
      console.log(`  ${fieldName} → ${mapping.component} (${mapping.decisionReason})`);
    }
  });
  
  // Validate all component assignments
  if (DEBUG_CONFIG.validateAllAssignments) {
    validateComponentAssignments(componentMappings);
  }
  
  // Generate statistics and coverage report
  const statistics = generateMappingStatistics(componentMappings, ruleUsageStats, schemaData);
  
  if (DEBUG_CONFIG.showRuleUsageStats) {
    logRuleUsageStatistics(ruleUsageStats, statistics);
  }
  
  console.log(`✓ Generated component mappings for ${fieldNames.length} fields`);
  console.log(`  - Components used: ${statistics.uniqueComponents} different types`);
  console.log(`  - Fields with wrappers: ${statistics.fieldsWithWrappers}`);
  console.log(`  - Rule-based assignments: ${statistics.ruleBasedAssignments}`);
  
  return {
    mappings: componentMappings,
    statistics,
    metadata: {
      generatedAt: new Date().toISOString(),
      totalFields: fieldNames.length,
      ruleUsageStats,
      ...(DEBUG_CONFIG.generateCoverageReport && { coverageReport: generateCoverageReport(componentMappings, schemaData) })
    }
  };
}

/**
 * Generate component mapping for a single field
 * This function implements the layered decision-making logic to determine the best
 * component for a specific field based on all available information.
 * 
 * @param {object} fieldInfo - Complete information about the field
 * @param {object} ruleUsageStats - Statistics tracking object
 * @returns {object} Component mapping for the field
 */
function generateFieldComponentMapping(fieldInfo, ruleUsageStats) {
  const { fieldName } = fieldInfo;
  
  // Track decision path for debugging and transparency
  const decisionPath = [];
  
  // Step 1: Check for explicit field overrides (highest priority)
  let component = checkExplicitFieldOverride(fieldName, decisionPath, ruleUsageStats);
  
  // Step 2: If no explicit override, check pattern-based rules
  if (!component) {
    component = checkPatternRules(fieldName, fieldInfo, decisionPath, ruleUsageStats);
  }
  
  // Step 3: If no pattern match, use existing uiSchema suggestion
  if (!component) {
    component = useExistingUiSchemaSuggestion(fieldInfo, decisionPath, ruleUsageStats);
  }
  
  // Step 4: If no existing suggestion, apply validation influence rules
  if (!component) {
    component = applyValidationInfluenceRules(fieldInfo, decisionPath, ruleUsageStats);
  }
  
  // Step 5: Fall back to type-based defaults
  if (!component) {
    component = applyTypeBasedDefault(fieldInfo, decisionPath, ruleUsageStats);
  }
  
  // Step 6: Final fallback to text-field if nothing else worked
  if (!component) {
    component = 'text-field';
    decisionPath.push('fallback-to-text-field');
    ruleUsageStats.fallbacks++;
  }
  
  // Validate that the chosen component exists
  if (!AVAILABLE_COMPONENTS.includes(component)) {
    console.warn(`⚠️  Field '${fieldName}' assigned non-existent component '${component}', falling back to text-field`);
    component = 'text-field';
    decisionPath.push('invalid-component-fallback');
  }
  
  // Generate component props based on field characteristics
  const props = generateComponentProps(component, fieldInfo);
  
  // Determine wrapper components needed
  const wrappers = determineWrapperComponents(component, fieldInfo);
  
  // Get alternative components for this field
  const alternatives = getAlternativeComponents(component, fieldInfo);
  
  return {
    component,
    props,
    wrappers,
    alternatives,
    decisionPath,
    decisionReason: decisionPath[decisionPath.length - 1] || 'unknown'
  };
}

/**
 * Check if field has an explicit override rule
 * Explicit overrides have the highest priority and represent specific design decisions.
 * 
 * @param {string} fieldName - Name of the field
 * @param {Array} decisionPath - Decision tracking array
 * @param {object} ruleUsageStats - Statistics tracking object
 * @returns {string|null} Component name or null if no override
 */
function checkExplicitFieldOverride(fieldName, decisionPath, ruleUsageStats) {
  if (EXPLICIT_FIELD_OVERRIDES[fieldName]) {
    const component = EXPLICIT_FIELD_OVERRIDES[fieldName];
    decisionPath.push(`explicit-override: ${component}`);
    ruleUsageStats.explicitOverrides++;
    return component;
  }
  return null;
}

/**
 * Check if field matches any pattern-based rules
 * Pattern rules provide consistency across fields with similar naming patterns.
 * 
 * @param {string} fieldName - Name of the field
 * @param {object} fieldInfo - Complete field information
 * @param {Array} decisionPath - Decision tracking array
 * @param {object} ruleUsageStats - Statistics tracking object
 * @returns {string|null} Component name or null if no pattern matches
 */
function checkPatternRules(fieldName, fieldInfo, decisionPath, ruleUsageStats) {
  // Check each pattern rule in order until we find a match
  for (const rule of PATTERN_RULES) {
    if (matchesPattern(fieldName, rule.pattern)) {
      decisionPath.push(`pattern-rule: ${rule.pattern} → ${rule.component}`);
      ruleUsageStats.patternMatches++;
      
      // Track which specific patterns are being used
      if (!ruleUsageStats.patternUsage[rule.pattern]) {
        ruleUsageStats.patternUsage[rule.pattern] = 0;
      }
      ruleUsageStats.patternUsage[rule.pattern]++;
      
      return rule.component;
    }
  }
  return null;
}

/**
 * Use existing component suggestion from uiSchema
 * This leverages the intelligent suggestions that were already generated in the uiSchema step.
 * 
 * @param {object} fieldInfo - Complete field information
 * @param {Array} decisionPath - Decision tracking array
 * @param {object} ruleUsageStats - Statistics tracking object
 * @returns {string|null} Component name or null if no existing suggestion
 */
function useExistingUiSchemaSuggestion(fieldInfo, decisionPath, ruleUsageStats) {
  if (fieldInfo.existingComponentSuggestion && AVAILABLE_COMPONENTS.includes(fieldInfo.existingComponentSuggestion)) {
    const component = fieldInfo.existingComponentSuggestion;
    decisionPath.push(`uiSchema-suggestion: ${component}`);
    ruleUsageStats.uiSchemaSuggestions++;
    return component;
  }
  return null;
}

/**
 * Apply validation influence rules
 * This considers field constraints and validation rules to influence component choice.
 * 
 * @param {object} fieldInfo - Complete field information
 * @param {Array} decisionPath - Decision tracking array
 * @param {object} ruleUsageStats - Statistics tracking object
 * @returns {string|null} Component name or null if no validation influences apply
 */
function applyValidationInfluenceRules(fieldInfo, decisionPath, ruleUsageStats) {
  // Check if field has enum values and should use select component
  if (VALIDATION_INFLUENCE_RULES.enumFieldsUseSelect && fieldInfo.enumValues && fieldInfo.enumValues.length > 0) {
    decisionPath.push(`validation-influence: enum-values → select-field`);
    ruleUsageStats.validationInfluences++;
    return 'select-field';
  }
  
  // Check for URL format fields
  if (fieldInfo.format === 'url' || fieldInfo.format === 'uri') {
    decisionPath.push(`validation-influence: url-format → url-input`);
    ruleUsageStats.validationInfluences++;
    return 'url-input';
  }
  
  // Check for password format fields
  if (fieldInfo.format === 'password' || fieldInfo.customExtensions?.sensitive) {
    decisionPath.push(`validation-influence: sensitive-field → secret-field`);
    ruleUsageStats.validationInfluences++;
    return 'secret-field';
  }
  
  return null;
}

/**
 * Apply type-based default rules
 * This provides sensible defaults based on the field's data type.
 * 
 * @param {object} fieldInfo - Complete field information
 * @param {Array} decisionPath - Decision tracking array
 * @param {object} ruleUsageStats - Statistics tracking object
 * @returns {string|null} Component name or null if no type default applies
 */
function applyTypeBasedDefault(fieldInfo, decisionPath, ruleUsageStats) {
  const defaultComponent = TYPE_DEFAULTS[fieldInfo.type];
  if (defaultComponent) {
    decisionPath.push(`type-default: ${fieldInfo.type} → ${defaultComponent}`);
    ruleUsageStats.typeDefaults++;
    return defaultComponent;
  }
  return null;
}

/**
 * Check if a field name matches a pattern
 * Supports wildcards (*) for flexible pattern matching.
 * 
 * @param {string} fieldName - The field name to check
 * @param {string} pattern - The pattern to match against (supports * wildcards)
 * @returns {boolean} True if the field name matches the pattern
 */
function matchesPattern(fieldName, pattern) {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\*/g, '.*')  // Replace * with .*
    .replace(/\?/g, '.');  // Replace ? with .
  
  const regex = new RegExp(`^${regexPattern}$`, 'i'); // Case insensitive
  return regex.test(fieldName);
}

/**
 * Generate component props based on field characteristics
 * This creates the props object that will be passed to the component.
 * 
 * @param {string} component - The selected component
 * @param {object} fieldInfo - Complete field information
 * @returns {object} Props object for the component
 */
function generateComponentProps(component, fieldInfo) {
  // Start with default props for this component type
  const props = { ...DEFAULT_COMPONENT_PROPS[component] || {} };
  
  // Add constraint-based props
  if (VALIDATION_INFLUENCE_RULES.stringConstraintsToProps && fieldInfo.type === 'string') {
    if (fieldInfo.constraints.minLength) props.minLength = fieldInfo.constraints.minLength;
    if (fieldInfo.constraints.maxLength) props.maxLength = fieldInfo.constraints.maxLength;
    if (fieldInfo.constraints.pattern) props.pattern = fieldInfo.constraints.pattern;
  }
  
  if (VALIDATION_INFLUENCE_RULES.numberConstraintsToProps && (fieldInfo.type === 'number' || fieldInfo.type === 'integer')) {
    if (fieldInfo.constraints.minimum !== undefined) props.min = fieldInfo.constraints.minimum;
    if (fieldInfo.constraints.maximum !== undefined) props.max = fieldInfo.constraints.maximum;
  }
  
  // Add enum-specific props for select fields
  if (component === 'select-field' && fieldInfo.enumValues) {
    props.options = fieldInfo.enumValues.map(value => ({
      value: value,
      label: formatEnumLabel(value)
    }));
  }
  
  // Add description as help text
  if (fieldInfo.description) {
    props.description = fieldInfo.description;
  }
  
  // Add placeholder from examples
  if (fieldInfo.examples && fieldInfo.examples.length > 0 && !props.placeholder) {
    props.placeholder = `e.g., ${fieldInfo.examples[0]}`;
  }
  
  // Add conditional props if field has dependencies
  if (fieldInfo.hasConditionalLogic) {
    props.conditional = true;
  }
  
  return props;
}

/**
 * Format enum values into human-readable labels
 * Converts technical enum values into user-friendly display labels.
 * 
 * @param {string} value - The enum value
 * @returns {string} Formatted label
 */
function formatEnumLabel(value) {
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Determine wrapper components needed for a field
 * Wrappers add functionality like conditional visibility or premium feature restrictions.
 * 
 * @param {string} component - The selected component
 * @param {object} fieldInfo - Complete field information
 * @returns {Array} Array of wrapper component names
 */
function determineWrapperComponents(component, fieldInfo) {
  const wrappers = [];
  
  // Add default wrappers for this component type
  if (COMPONENT_WRAPPER_RULES[component]) {
    wrappers.push(...COMPONENT_WRAPPER_RULES[component]);
  }
  
  // Add conditional wrapper for fields with dependencies
  if (fieldInfo.hasConditionalLogic && CONDITIONAL_FIELD_RULES.wrapWithConditional) {
    wrappers.push('conditional-field');
  }
  
  // Add plan restriction wrapper for sensitive/premium fields
  if (fieldInfo.customExtensions?.sensitive || component === 'secret-field') {
    if (!wrappers.includes('plan-restricted-feature')) {
      wrappers.push('plan-restricted-feature');
    }
  }
  
  // Validate that all wrappers exist
  return wrappers.filter(wrapper => {
    if (AVAILABLE_WRAPPERS.includes(wrapper)) {
      return true;
    } else {
      console.warn(`⚠️ Unknown wrapper component '${wrapper}' for field '${fieldInfo.fieldName}'`);
      return false;
    }
  });
}

/**
 * Get alternative components for a field
 * Provides options for progressive enhancement or A/B testing of component choices.
 * 
 * @param {string} primaryComponent - The primary selected component
 * @param {object} fieldInfo - Complete field information
 * @returns {Array} Array of alternative component names
 */
function getAlternativeComponents(primaryComponent, fieldInfo) {
  const alternatives = [];
  
  // Add default alternatives for this component type
  if (COMPONENT_ALTERNATIVES[primaryComponent]) {
    alternatives.push(...COMPONENT_ALTERNATIVES[primaryComponent]);
  }
  
  // Add alternatives from uiSchema if available
  if (fieldInfo.componentAlternatives) {
    fieldInfo.componentAlternatives.forEach(alt => {
      if (AVAILABLE_COMPONENTS.includes(alt) && !alternatives.includes(alt)) {
        alternatives.push(alt);
      }
    });
  }
  
  return alternatives;
}

/**
 * Initialize rule usage statistics tracking
 * This helps us understand which rules are being used and how often.
 * 
 * @returns {object} Initialized statistics object
 */
function initializeRuleUsageStats() {
  return {
    explicitOverrides: 0,
    patternMatches: 0,
    patternUsage: {},
    uiSchemaSuggestions: 0,
    validationInfluences: 0,
    typeDefaults: 0,
    fallbacks: 0
  };
}

/**
 * Validate all component assignments
 * Ensures that all assigned components actually exist in the available component library.
 * 
 * @param {object} componentMappings - The generated component mappings
 */
function validateComponentAssignments(componentMappings) {
  const invalidAssignments = [];
  
  Object.entries(componentMappings).forEach(([fieldName, mapping]) => {
    if (!AVAILABLE_COMPONENTS.includes(mapping.component)) {
      invalidAssignments.push({
        field: fieldName,
        component: mapping.component,
        reason: 'Component not in available components list'
      });
    }
    
    // Validate wrapper components
    mapping.wrappers.forEach(wrapper => {
      if (!AVAILABLE_WRAPPERS.includes(wrapper)) {
        invalidAssignments.push({
          field: fieldName,
          wrapper: wrapper,
          reason: 'Wrapper not in available wrappers list'
        });
      }
    });
  });
  
  if (invalidAssignments.length > 0) {
    console.warn(`⚠️  Found ${invalidAssignments.length} invalid component assignments:`);
    invalidAssignments.slice(0, 5).forEach(invalid => {
      console.warn(`   - ${invalid.field}: ${invalid.component || invalid.wrapper} (${invalid.reason})`);
    });
    if (invalidAssignments.length > 5) {
      console.warn(`   ... and ${invalidAssignments.length - 5} more`);
    }
  }
}

/**
 * Generate mapping statistics
 * Provides insights into the component mapping results.
 * 
 * @param {object} componentMappings - The generated component mappings
 * @param {object} ruleUsageStats - Rule usage statistics
 * @param {object} schemaData - Original schema data
 * @returns {object} Statistics about the mappings
 */
function generateMappingStatistics(componentMappings, ruleUsageStats, schemaData) {
  const mappings = Object.values(componentMappings);
  
  // Count components used
  const componentUsage = {};
  mappings.forEach(mapping => {
    componentUsage[mapping.component] = (componentUsage[mapping.component] || 0) + 1;
  });
  
  // Count wrapper usage
  const wrapperUsage = {};
  mappings.forEach(mapping => {
    mapping.wrappers.forEach(wrapper => {
      wrapperUsage[wrapper] = (wrapperUsage[wrapper] || 0) + 1;
    });
  });
  
  return {
    totalFields: mappings.length,
    uniqueComponents: Object.keys(componentUsage).length,
    componentUsage,
    wrapperUsage,
    fieldsWithWrappers: mappings.filter(m => m.wrappers.length > 0).length,
    fieldsWithAlternatives: mappings.filter(m => m.alternatives.length > 0).length,
    ruleBasedAssignments: mappings.length - ruleUsageStats.fallbacks,
    ruleEffectiveness: {
      explicitOverrides: ruleUsageStats.explicitOverrides,
      patternMatches: ruleUsageStats.patternMatches,
      uiSchemaSuggestions: ruleUsageStats.uiSchemaSuggestions,
      validationInfluences: ruleUsageStats.validationInfluences,
      typeDefaults: ruleUsageStats.typeDefaults,
      fallbacks: ruleUsageStats.fallbacks
    }
  };
}

/**
 * Log rule usage statistics
 * Provides feedback on which rules are being used most effectively.
 * 
 * @param {object} ruleUsageStats - Rule usage statistics
 * @param {object} overallStats - Overall mapping statistics
 */
function logRuleUsageStatistics(ruleUsageStats, overallStats) {
  console.log('\n📊 Rule Usage Statistics:');
  console.log(`  - Explicit overrides: ${ruleUsageStats.explicitOverrides} fields`);
  console.log(`  - Pattern matches: ${ruleUsageStats.patternMatches} fields`);
  console.log(`  - uiSchema suggestions: ${ruleUsageStats.uiSchemaSuggestions} fields`);
  console.log(`  - Validation influences: ${ruleUsageStats.validationInfluences} fields`);
  console.log(`  - Type defaults: ${ruleUsageStats.typeDefaults} fields`);
  console.log(`  - Fallbacks: ${ruleUsageStats.fallbacks} fields`);
  
  if (Object.keys(ruleUsageStats.patternUsage).length > 0) {
    console.log('\n🎯 Most Used Patterns:');
    const sortedPatterns = Object.entries(ruleUsageStats.patternUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    sortedPatterns.forEach(([pattern, count]) => {
      console.log(`  - ${pattern}: ${count} fields`);
    });
  }
  
  console.log('\n🧩 Component Usage:');
  const sortedComponents = Object.entries(overallStats.componentUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  sortedComponents.forEach(([component, count]) => {
    console.log(`  - ${component}: ${count} fields`);
  });
}

/**
 * Generate coverage report
 * Analyzes how well the rule system covers the field set.
 * 
 * @param {object} componentMappings - The generated component mappings
 * @param {object} schemaData - Original schema data
 * @returns {object} Coverage report
 */
function generateCoverageReport(componentMappings, schemaData) {
  const report = {
    totalFields: Object.keys(schemaData.fields).length,
    mappedFields: Object.keys(componentMappings).length,
    coverage: 0,
    unmappedFields: [],
    fieldsNeedingReview: []
  };
  
  report.coverage = (report.mappedFields / report.totalFields) * 100;
  
  // Find unmapped fields
  Object.keys(schemaData.fields).forEach(fieldName => {
    if (!componentMappings[fieldName]) {
      report.unmappedFields.push(fieldName);
    }
  });
  
  // Find fields that might need manual review
  Object.entries(componentMappings).forEach(([fieldName, mapping]) => {
    if (mapping.decisionReason === 'fallback-to-text-field' || 
        mapping.decisionReason === 'invalid-component-fallback') {
      report.fieldsNeedingReview.push({
        field: fieldName,
        reason: mapping.decisionReason,
        component: mapping.component
      });
    }
  });
  
  return report;
}
