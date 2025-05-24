/**
 * Dependency Processor Module  
 * Processes complex conditional logic and dependency relationships
 * Handles both x-depends-on conditions and x-provider-fields mappings
 * Designed to support complex scenarios and future-proof the system
 */

/**
 * Process all dependency relationships from the extracted extensions
 * Creates a comprehensive dependency map for conditional field rendering
 * @param {object} extensionsMap - Map of field names to their extension data
 * @returns {object} Comprehensive dependency map and analysis
 */
export function processDependencies(extensionsMap) {
  console.log('Processing dependency relationships and conditional logic...');
  
  // Step 1: Extract and normalize all dependency relationships
  const dependencyRelationships = extractDependencyRelationships(extensionsMap);
  
  // Step 2: Process provider field mappings as special dependency cases
  const providerDependencies = processProviderFieldMappings(extensionsMap);
  
  // Step 3: Merge and consolidate all dependency types
  const consolidatedDependencies = consolidateDependencies(dependencyRelationships, providerDependencies);
  
  // Step 4: Analyze dependency chains and detect potential issues
  const dependencyAnalysis = analyzeDependencyChains(consolidatedDependencies, extensionsMap);
  
  // Step 5: Build the final dependency map optimized for react-ts-form consumption
  const dependencyMap = buildDependencyMap(consolidatedDependencies, dependencyAnalysis);
  
  console.log(`✓ Processed dependencies for ${Object.keys(dependencyMap).length} fields`);
  console.log(`  - Simple conditions: ${dependencyAnalysis.simpleConditions}`);
  console.log(`  - Complex conditions: ${dependencyAnalysis.complexConditions}`);
  console.log(`  - Provider mappings: ${dependencyAnalysis.providerMappings}`);
  
  if (dependencyAnalysis.warnings.length > 0) {
    console.log(`  - Warnings: ${dependencyAnalysis.warnings.length}`);
  }
  
  return dependencyMap;
}

/**
 * Extract dependency relationships from x-depends-on extensions
 * @param {object} extensionsMap - The extracted extensions data
 * @returns {Array} Array of dependency relationship objects
 */
function extractDependencyRelationships(extensionsMap) {
  const relationships = [];
  
  Object.keys(extensionsMap).forEach(fieldName => {
    const fieldData = extensionsMap[fieldName];
    const dependsOn = fieldData.customExtensions['depends-on'];
    
    if (dependsOn) {
      relationships.push({
        field: fieldName,
        type: 'conditional',
        source: 'depends-on',
        dependency: dependsOn,
        metadata: fieldData.standardMetadata
      });
    }
  });
  
  return relationships;
}

/**
 * Process x-provider-fields mappings as special dependency cases
 * These create conditional field visibility based on provider selection
 * @param {object} extensionsMap - The extracted extensions data  
 * @returns {Array} Array of provider-based dependency objects
 */
function processProviderFieldMappings(extensionsMap) {
  const providerDependencies = [];
  
  Object.keys(extensionsMap).forEach(fieldName => {
    const fieldData = extensionsMap[fieldName];  
    const providerFields = fieldData.customExtensions['provider-fields'];
    
    if (providerFields) {
      // This field acts as a provider selector - create dependencies for all its provider fields
      Object.keys(providerFields).forEach(providerName => {
        const providerFieldsList = providerFields[providerName];
        
        providerFieldsList.forEach(dependentFieldName => {
          providerDependencies.push({
            field: dependentFieldName,
            type: 'provider',
            source: 'provider-fields',
            dependency: {
              type: 'simple',
              operator: 'and',
              conditions: [{
                field: fieldName,
                operator: 'equals',
                value: providerName,
                type: 'simple'
              }]
            },
            providerSelector: fieldName,
            providerValue: providerName,
            metadata: extensionsMap[dependentFieldName]?.standardMetadata || {}
          });
        });
      });
    }
  });
  
  return providerDependencies;
}

/**
 * Consolidate different types of dependencies into a unified structure
 * @param {Array} dependencyRelationships - Regular dependencies from x-depends-on
 * @param {Array} providerDependencies - Provider-based dependencies  
 * @returns {Array} Consolidated array of all dependencies
 */
function consolidateDependencies(dependencyRelationships, providerDependencies) {
  const consolidated = [];
  const fieldDependencyMap = new Map();
  
  // Process regular dependencies first
  dependencyRelationships.forEach(dep => {
    fieldDependencyMap.set(dep.field, dep);
  });
  
  // Add or merge provider dependencies
  providerDependencies.forEach(providerDep => {
    const fieldName = providerDep.field;
    
    if (fieldDependencyMap.has(fieldName)) {
      // Field already has dependencies - merge them
      const existing = fieldDependencyMap.get(fieldName);
      const merged = mergeDependencies(existing, providerDep);
      fieldDependencyMap.set(fieldName, merged);
    } else {
      // New dependency for this field
      fieldDependencyMap.set(fieldName, providerDep);
    }
  });
  
  return Array.from(fieldDependencyMap.values());
}

/**
 * Merge multiple dependency definitions for the same field
 * This handles cases where a field has both x-depends-on and provider-based dependencies
 * @param {object} existing - Existing dependency definition
 * @param {object} additional - Additional dependency to merge
 * @returns {object} Merged dependency definition
 */
function mergeDependencies(existing, additional) {
  // Create a complex dependency that requires both conditions to be true
  const merged = {
    field: existing.field,
    type: 'complex',
    source: 'merged',
    dependency: {
      type: 'complex',
      operator: 'and',
      conditions: []
    },
    metadata: existing.metadata || additional.metadata
  };
  
  // Add conditions from existing dependency
  if (existing.dependency.conditions) {
    merged.dependency.conditions.push(...existing.dependency.conditions);
  } else if (existing.dependency.type === 'simple') {
    merged.dependency.conditions.push(existing.dependency);
  }
  
  // Add conditions from additional dependency
  if (additional.dependency.conditions) {
    merged.dependency.conditions.push(...additional.dependency.conditions);
  } else if (additional.dependency.type === 'simple') {
    merged.dependency.conditions.push(additional.dependency);
  }
  
  return merged;
}

/**
 * Analyze dependency chains to detect issues and provide insights
 * @param {Array} consolidatedDependencies - All processed dependencies
 * @param {object} extensionsMap - Original extensions map for validation
 * @returns {object} Analysis results and warnings
 */
function analyzeDependencyChains(consolidatedDependencies, extensionsMap) {
  const analysis = {
    simpleConditions: 0,
    complexConditions: 0,
    providerMappings: 0,
    dependencyChains: [],
    circularDependencies: [],
    warnings: [],
    fieldReferenceCounts: new Map(),
    maxChainDepth: 0
  };
  
  // Count condition types and build reference map
  consolidatedDependencies.forEach(dep => {
    if (dep.type === 'provider') {
      analysis.providerMappings++;
    } else if (dep.dependency.type === 'simple') {
      analysis.simpleConditions++;
    } else {
      analysis.complexConditions++;
    }
    
    // Track field references for popularity analysis
    if (dep.dependency.conditions) {
      dep.dependency.conditions.forEach(condition => {
        const count = analysis.fieldReferenceCounts.get(condition.field) || 0;
        analysis.fieldReferenceCounts.set(condition.field, count + 1);
      });
    }
  });
  
  // Detect circular dependencies
  analysis.circularDependencies = detectCircularDependencies(consolidatedDependencies);
  
  // Find dependency chains and calculate max depth
  analysis.dependencyChains = findDependencyChains(consolidatedDependencies);
  analysis.maxChainDepth = Math.max(...analysis.dependencyChains.map(chain => chain.length), 0);
  
  // Generate warnings for potential issues
  generateDependencyWarnings(analysis, consolidatedDependencies, extensionsMap);
  
  return analysis;
}

/**
 * Detect circular dependency patterns
 * @param {Array} dependencies - Array of dependency definitions
 * @returns {Array} Array of circular dependency chains
 */
function detectCircularDependencies(dependencies) {
  const dependencyGraph = new Map();
  const circularDependencies = [];
  
  // Build dependency graph
  dependencies.forEach(dep => {
    if (!dependencyGraph.has(dep.field)) {
      dependencyGraph.set(dep.field, new Set());
    }
    
    if (dep.dependency.conditions) {
      dep.dependency.conditions.forEach(condition => {
        dependencyGraph.get(dep.field).add(condition.field);
      });
    }
  });
  
  // Detect cycles using depth-first search
  const visited = new Set();
  const recursionStack = new Set();
  
  function detectCycle(field, path = []) {
    if (recursionStack.has(field)) {
      // Found a cycle - extract the circular part
      const cycleStart = path.indexOf(field);
      const cycle = path.slice(cycleStart).concat([field]);
      circularDependencies.push(cycle);
      return true;
    }
    
    if (visited.has(field)) {
      return false;
    }
    
    visited.add(field);
    recursionStack.add(field);
    path.push(field);
    
    const dependencies = dependencyGraph.get(field);
    if (dependencies) {
      for (const dependency of dependencies) {
        if (detectCycle(dependency, [...path])) {
          // Continue to find all cycles, don't return early
        }
      }
    }
    
    recursionStack.delete(field);
    path.pop();
    return false;
  }
  
  // Check all fields for cycles
  dependencyGraph.forEach((_, field) => {
    if (!visited.has(field)) {
      detectCycle(field);
    }
  });
  
  return circularDependencies;
}

/**
 * Find and analyze dependency chains
 * @param {Array} dependencies - Array of dependency definitions
 * @returns {Array} Array of dependency chain objects
 */
function findDependencyChains(dependencies) {
  const chains = [];
  const dependencyGraph = new Map();
  
  // Build dependency graph
  dependencies.forEach(dep => {
    if (!dependencyGraph.has(dep.field)) {
      dependencyGraph.set(dep.field, []);
    }
    
    if (dep.dependency.conditions) {
      dep.dependency.conditions.forEach(condition => {
        dependencyGraph.get(dep.field).push(condition.field);
      });
    }
  });
  
  // Find chains for each field
  function findChainForField(field, visited = new Set()) {
    if (visited.has(field)) {
      return [field]; // Circular reference
    }
    
    visited.add(field);
    const dependencies = dependencyGraph.get(field) || [];
    
    if (dependencies.length === 0) {
      return [field]; // End of chain
    }
    
    // Find the longest chain from this field
    let longestChain = [field];
    dependencies.forEach(depField => {
      const subChain = findChainForField(depField, new Set(visited));
      const fullChain = [field, ...subChain];
      if (fullChain.length > longestChain.length) {
        longestChain = fullChain;
      }
    });
    
    return longestChain;
  }
  
  // Find chains for all dependent fields
  dependencies.forEach(dep => {
    const chain = findChainForField(dep.field);
    if (chain.length > 1) {
      chains.push({
        rootField: dep.field,
        chain: chain,
        length: chain.length
      });
    }
  });
  
  return chains;
}

/**
 * Generate warnings for potential dependency issues
 * @param {object} analysis - The dependency analysis object
 * @param {Array} dependencies - Array of dependency definitions
 * @param {object} extensionsMap - Original extensions map
 */
function generateDependencyWarnings(analysis, dependencies, extensionsMap) {
  // Warn about circular dependencies
  if (analysis.circularDependencies.length > 0) {
    analysis.warnings.push({
      type: 'circular_dependency',
      message: `Found ${analysis.circularDependencies.length} circular dependency chains`,
      details: analysis.circularDependencies
    });
  }
  
  // Warn about very deep dependency chains
  if (analysis.maxChainDepth > 3) {
    analysis.warnings.push({
      type: 'deep_chain',
      message: `Maximum dependency chain depth is ${analysis.maxChainDepth}, consider simplifying`,
      details: analysis.dependencyChains.filter(chain => chain.length > 3)
    });
  }
  
  // Warn about fields referenced by many dependencies
  analysis.fieldReferenceCounts.forEach((count, field) => {
    if (count > 5) {
      analysis.warnings.push({
        type: 'popular_dependency',
        message: `Field '${field}' is referenced by ${count} dependencies, consider review`,
        details: { field, referenceCount: count }
      });
    }
  });
  
  // Warn about dependencies on fields that don't exist
  dependencies.forEach(dep => {
    if (dep.dependency.conditions) {
      dep.dependency.conditions.forEach(condition => {
        if (!extensionsMap[condition.field]) {
          analysis.warnings.push({
            type: 'missing_reference',
            message: `Field '${dep.field}' depends on non-existent field '${condition.field}'`,
            details: { dependentField: dep.field, missingField: condition.field }
          });
        }
      });
    }
  });
}

/**
 * Build the final dependency map optimized for react-ts-form consumption
 * @param {Array} consolidatedDependencies - All processed dependencies
 * @param {object} dependencyAnalysis - Analysis results
 * @returns {object} Final dependency map
 */
function buildDependencyMap(consolidatedDependencies, dependencyAnalysis) {
  const dependencyMap = {};
  
  consolidatedDependencies.forEach(dep => {
    const fieldName = dep.field;
    
    dependencyMap[fieldName] = {
      // Core dependency information
      type: dep.type,
      source: dep.source,
      conditions: normalizeConditionsForReactTsForm(dep.dependency),
      
      // Metadata for UI rendering hints
      metadata: {
        hasComplexLogic: dep.type === 'complex',
        isProviderDependent: dep.type === 'provider',
        conditionCount: dep.dependency.conditions ? dep.dependency.conditions.length : 0,
        fieldType: dep.metadata?.type,
        suggestedComponent: suggestComponentForDependentField(dep)
      },
      
      // Provider-specific information (if applicable)
      ...(dep.providerSelector && {
        providerSelector: dep.providerSelector,
        providerValue: dep.providerValue
      }),
      
      // Chain analysis information
      ...(dependencyAnalysis.dependencyChains.find(chain => chain.rootField === fieldName) && {
        chainDepth: dependencyAnalysis.dependencyChains.find(chain => chain.rootField === fieldName).length
      })
    };
  });
  
  return dependencyMap;
}

/**
 * Normalize dependency conditions for optimal react-ts-form consumption
 * @param {object} dependency - Raw dependency definition  
 * @returns {object} Normalized conditions structure
 */
function normalizeConditionsForReactTsForm(dependency) {
  if (!dependency.conditions) {
    return { type: 'none', operator: 'and', rules: [] };
  }
  
  const normalizedRules = dependency.conditions.map(condition => ({
    field: condition.field,
    operator: condition.operator || 'equals',
    value: condition.value,
    type: condition.type || 'simple'
  }));
  
  return {
    type: dependency.type || 'simple',
    operator: dependency.operator || 'and',
    rules: normalizedRules
  };
}

/**
 * Suggest appropriate component types for dependent fields
 * This helps the UI layer make better rendering decisions
 * @param {object} dependency - Dependency definition
 * @returns {string} Suggested component type
 */
function suggestComponentForDependentField(dependency) {
  const fieldType = dependency.metadata?.type;
  const hasEnum = Boolean(dependency.metadata?.enum);
  const isProvider = dependency.type === 'provider';
  
  if (isProvider) {
    return 'conditional-field'; // Use conditional wrapper
  }
  
  if (hasEnum) {
    return 'select-field'; // Enumerated values work well with selects
  }
  
  switch (fieldType) {
    case 'boolean':
      return 'toggle-field';
    case 'string':
      return dependency.metadata?.format === 'password' ? 'secret-field' : 'text-field';
    case 'number':
    case 'integer':
      return 'text-field';
    default:
      return 'text-field';
  }
}

/**
 * Utility function to get dependency information for a specific field
 * @param {object} dependencyMap - The processed dependency map
 * @param {string} fieldName - Name of the field to check
 * @returns {object|null} Dependency information or null if no dependencies
 */
export function getDependencyInfo(dependencyMap, fieldName) {
  return dependencyMap[fieldName] || null;
}

/**
 * Check if a field has dependencies
 * @param {object} dependencyMap - The processed dependency map
 * @param {string} fieldName - Name of the field to check
 * @returns {boolean} True if field has dependencies
 */
export function hasDependencies(dependencyMap, fieldName) {
  return Boolean(dependencyMap[fieldName]);
}

/**
 * Get all fields that depend on a specific field
 * @param {object} dependencyMap - The processed dependency map
 * @param {string} targetField - Field to find dependents for
 * @returns {Array} Array of field names that depend on the target field
 */
export function getDependentFields(dependencyMap, targetField) {
  const dependents = [];
  
  Object.keys(dependencyMap).forEach(fieldName => {
    const dependency = dependencyMap[fieldName];
    const rules = dependency.conditions.rules || [];
    
    const dependsOnTarget = rules.some(rule => rule.field === targetField);
    if (dependsOnTarget) {
      dependents.push(fieldName);
    }
  });
  
  return dependents;
}
