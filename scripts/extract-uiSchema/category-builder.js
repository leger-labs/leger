/**
 * Category Builder Module
 * Builds both flat and hierarchical category structures from extracted extensions
 * This provides the flexibility needed for different UI rendering approaches
 */

/**
 * Build comprehensive category structures from extension data
 * Creates both flat (for processing) and hierarchical (for display) organizations
 * @param {object} extensionsMap - Map of field names to their extension data
 * @returns {object} Complete category structure with flat and hierarchical views
 */
export function buildCategories(extensionsMap) {
  console.log('Building category organization structures...');
  
  // Step 1: Collect all fields with their category information
  const categorizedFields = collectCategorizedFields(extensionsMap);
  
  // Step 2: Build the flat category structure (easy for processing)
  const flatCategories = buildFlatCategories(categorizedFields);
  
  // Step 3: Build the hierarchical category structure (good for display)
  const hierarchicalCategories = buildHierarchicalCategories(flatCategories);
  
  // Step 4: Create category metadata and statistics
  const categoryMetadata = buildCategoryMetadata(flatCategories, hierarchicalCategories);
  
  console.log(`✓ Organized ${categorizedFields.length} fields into ${flatCategories.length} categories`);
  console.log(`  - Flat categories: ${flatCategories.length}`);
  console.log(`  - Hierarchical groups: ${Object.keys(hierarchicalCategories).length}`);
  
  return {
    // Fields organized by category for easy processing
    categorizedFields,
    
    // Flat array of categories - good for iteration and processing
    categories: flatCategories,
    
    // Hierarchical structure - good for UI rendering with nested sections
    hierarchy: hierarchicalCategories,
    
    // Additional metadata about the category structure
    metadata: categoryMetadata
  };
}

/**
 * Collect all fields that have category information
 * @param {object} extensionsMap - The extracted extensions data
 * @returns {Array} Array of field objects with category information
 */
function collectCategorizedFields(extensionsMap) {
  const categorizedFields = [];
  const uncategorizedFields = [];
  
  Object.keys(extensionsMap).forEach(fieldName => {
    const fieldData = extensionsMap[fieldName];
    const categoryExtension = fieldData.customExtensions.category;
    const displayOrder = fieldData.customExtensions['display-order'] || 999;
    
    const fieldInfo = {
      name: fieldName,
      displayOrder,
      category: categoryExtension,
      extensions: fieldData.customExtensions,
      metadata: fieldData.standardMetadata
    };
    
    if (categoryExtension) {
      categorizedFields.push(fieldInfo);
    } else {
      uncategorizedFields.push(fieldInfo);
    }
  });
  
  // Handle uncategorized fields by putting them in a default category
  if (uncategorizedFields.length > 0) {
    console.log(`  ℹ️  Found ${uncategorizedFields.length} uncategorized fields, placing in 'General' category`);
    
    uncategorizedFields.forEach(field => {
      field.category = {
        name: 'General',
        displayName: 'General Configuration',
        parts: ['General'],
        isHierarchical: false,
        parent: null,
        child: null
      };
      categorizedFields.push(field);
    });
  }
  
  return categorizedFields;
}

/**
 * Build flat category structure - array of categories with their fields
 * This structure is optimized for processing and iteration
 * @param {Array} categorizedFields - Fields with category assignments
 * @returns {Array} Flat array of category objects
 */
function buildFlatCategories(categorizedFields) {
  const categoryMap = new Map();
  
  // Group fields by category name
  categorizedFields.forEach(field => {
    const categoryName = field.category.name;
    
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        name: categoryName,
        displayName: field.category.displayName,
        description: `Configuration options for ${field.category.displayName}`,
        isHierarchical: field.category.isHierarchical,
        parent: field.category.parent,
        child: field.category.child,
        parts: field.category.parts,
        fields: [],
        fieldCount: 0,
        hasConditionalFields: false,
        hasSensitiveFields: false
      });
    }
    
    const category = categoryMap.get(categoryName);
    category.fields.push(field);
    category.fieldCount++;
    
    // Track category characteristics
    if (field.extensions['depends-on']) {
      category.hasConditionalFields = true;
    }
    if (field.extensions.sensitive) {
      category.hasSensitiveFields = true;
    }
  });
  
  // Convert map to array and sort categories by their first field's display order
  const categories = Array.from(categoryMap.values());
  
  categories.forEach(category => {
    // Sort fields within each category by display order
    category.fields.sort((a, b) => a.displayOrder - b.displayOrder);
    
    // Calculate category display order based on first field
    category.displayOrder = category.fields.length > 0 ? category.fields[0].displayOrder : 999;
  });
  
  // Sort categories by their display order
  categories.sort((a, b) => a.displayOrder - b.displayOrder);
  
  return categories;
}

/**
 * Build hierarchical category structure for UI display
 * This creates nested structures that are good for rendering category sections
 * @param {Array} flatCategories - The flat category array
 * @returns {object} Hierarchical category structure
 */
function buildHierarchicalCategories(flatCategories) {
  const hierarchy = {};
  const parentCategories = new Set();
  const childCategories = new Map();
  
  // First pass: identify parent and child categories
  flatCategories.forEach(category => {
    if (category.isHierarchical && category.parent) {
      parentCategories.add(category.parent);
      
      if (!childCategories.has(category.parent)) {
        childCategories.set(category.parent, []);
      }
      childCategories.get(category.parent).push(category);
    }
  });
  
  // Second pass: build the hierarchy
  flatCategories.forEach(category => {
    if (category.isHierarchical && category.parent) {
      // This is a child category - it will be nested under its parent
      if (!hierarchy[category.parent]) {
        hierarchy[category.parent] = {
          name: category.parent,
          displayName: category.parent,
          description: `Configuration options for ${category.parent}`,
          isParent: true,
          children: [],
          totalFields: 0,
          hasConditionalFields: false,
          hasSensitiveFields: false
        };
      }
      
      const parentCategory = hierarchy[category.parent];
      parentCategory.children.push(category);
      parentCategory.totalFields += category.fieldCount;
      
      if (category.hasConditionalFields) {
        parentCategory.hasConditionalFields = true;
      }
      if (category.hasSensitiveFields) {
        parentCategory.hasSensitiveFields = true;
      }
    } else if (!category.parent) {
      // This is a standalone category or a parent without being explicitly hierarchical
      if (!parentCategories.has(category.name)) {
        hierarchy[category.name] = {
          ...category,
          isParent: false,
          children: [],
          totalFields: category.fieldCount
        };
      }
    }
  });
  
  // Third pass: sort children within each parent
  Object.keys(hierarchy).forEach(parentName => {
    const parent = hierarchy[parentName];
    if (parent.children.length > 0) {
      parent.children.sort((a, b) => a.displayOrder - b.displayOrder);
    }
  });
  
  return hierarchy;
}

/**
 * Build metadata about the category structure
 * Provides statistics and insights about the organization
 * @param {Array} flatCategories - The flat categories
 * @param {object} hierarchicalCategories - The hierarchical structure
 * @returns {object} Category metadata and statistics
 */
function buildCategoryMetadata(flatCategories, hierarchicalCategories) {
  const metadata = {
    totalCategories: flatCategories.length,
    totalFields: flatCategories.reduce((sum, cat) => sum + cat.fieldCount, 0),
    hierarchicalGroups: Object.keys(hierarchicalCategories).length,
    categoriesWithConditionalFields: flatCategories.filter(cat => cat.hasConditionalFields).length,
    categoriesWithSensitiveFields: flatCategories.filter(cat => cat.hasSensitiveFields).length,
    
    // Field distribution statistics
    fieldDistribution: {},
    
    // Category name patterns
    categoryPatterns: {
      simple: [],
      hierarchical: [],
      parents: [],
      children: []
    },
    
    // Display order ranges
    displayOrderRange: {
      min: Math.min(...flatCategories.map(cat => cat.displayOrder)),
      max: Math.max(...flatCategories.map(cat => cat.displayOrder))
    }
  };
  
  // Calculate field distribution per category
  flatCategories.forEach(category => {
    const fieldCount = category.fieldCount;
    const bucket = fieldCount <= 5 ? '1-5' : 
                   fieldCount <= 10 ? '6-10' : 
                   fieldCount <= 20 ? '11-20' : '20+';
    
    metadata.fieldDistribution[bucket] = (metadata.fieldDistribution[bucket] || 0) + 1;
  });
  
  // Analyze category naming patterns
  flatCategories.forEach(category => {
    if (category.isHierarchical) {
      metadata.categoryPatterns.hierarchical.push(category.name);
      if (category.parent) {
        metadata.categoryPatterns.parents.push(category.parent);
        metadata.categoryPatterns.children.push(category.name);
      }
    } else {
      metadata.categoryPatterns.simple.push(category.name);
    }
  });
  
  // Remove duplicates from parent list
  metadata.categoryPatterns.parents = [...new Set(metadata.categoryPatterns.parents)];
  
  return metadata;
}

/**
 * Get a category by name from the flat categories array
 * Utility function for other modules that need to find specific categories
 * @param {Array} categories - Array of flat categories
 * @param {string} categoryName - Name of the category to find
 * @returns {object|null} The category object or null if not found
 */
export function getCategoryByName(categories, categoryName) {
  return categories.find(category => category.name === categoryName) || null;
}

/**
 * Get all fields in a specific category
 * @param {Array} categories - Array of flat categories
 * @param {string} categoryName - Name of the category
 * @returns {Array} Array of fields in the category
 */
export function getFieldsInCategory(categories, categoryName) {
  const category = getCategoryByName(categories, categoryName);
  return category ? category.fields : [];
}

/**
 * Suggest optimal display groupings based on category analysis
 * This can help inform UI rendering decisions
 * @param {object} categoryStructure - The complete category structure
 * @returns {object} Suggested display organization
 */
export function suggestDisplayGrouping(categoryStructure) {
  const { categories, hierarchy, metadata } = categoryStructure;
  
  const suggestions = {
    // Categories that should be rendered as expandable sections
    expandableSections: categories.filter(cat => cat.fieldCount > 10).map(cat => cat.name),
    
    // Categories that can be rendered inline
    inlineSections: categories.filter(cat => cat.fieldCount <= 5).map(cat => cat.name),
    
    // Categories that need special attention (sensitive fields)
    sensitiveCategories: categories.filter(cat => cat.hasSensitiveFields).map(cat => cat.name),
    
    // Categories with complex conditional logic
    conditionalCategories: categories.filter(cat => cat.hasConditionalFields).map(cat => cat.name),
    
    // Suggested render order based on field importance and dependencies
    recommendedOrder: suggestRenderOrder(categories),
    
    // Hierarchical groupings that should be rendered together
    hierarchicalGroups: Object.keys(hierarchy).filter(key => hierarchy[key].children.length > 0)
  };
  
  return suggestions;
}

/**
 * Suggest an optimal render order for categories
 * Takes into account dependencies and logical grouping
 * @param {Array} categories - Array of categories
 * @returns {Array} Suggested order of category names
 */
function suggestRenderOrder(categories) {
  // Start with the existing display order
  const ordered = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
  
  // Move categories with dependencies after their dependencies
  const reordered = [];
  const processed = new Set();
  
  function processCategoryAndDependencies(category) {
    if (processed.has(category.name)) {
      return;
    }
    
    // Find any dependencies this category's fields might have
    const dependencies = new Set();
    category.fields.forEach(field => {
      if (field.extensions['depends-on']) {
        field.extensions['depends-on'].conditions.forEach(condition => {
          // Find which category contains this dependency field
          const dependencyCategory = ordered.find(cat => 
            cat.fields.some(f => f.name === condition.field)
          );
          if (dependencyCategory && dependencyCategory.name !== category.name) {
            dependencies.add(dependencyCategory.name);
          }
        });
      }
    });
    
    // Process dependencies first
    dependencies.forEach(depName => {
      const depCategory = ordered.find(cat => cat.name === depName);
      if (depCategory) {
        processCategoryAndDependencies(depCategory);
      }
    });
    
    // Now process this category
    if (!processed.has(category.name)) {
      reordered.push(category.name);
      processed.add(category.name);
    }
  }
  
  // Process all categories
  ordered.forEach(category => {
    processCategoryAndDependencies(category);
  });
  
  return reordered;
}
