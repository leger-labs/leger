// src/form/interpreter/index.tsx
/**
 * Form Interpreter System
 * 
 * This is the stable "interpreter" layer that reads the generated schema data
 * and renders the appropriate form interface. This code doesn't change when
 * the OpenAPI spec changes - it dynamically adapts to whatever data is generated.
 */

import React, { useMemo, useCallback } from 'react';
import { z } from 'zod';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTsForm } from '@ts-react/form';

// Import ALL generated data - this is what changes with the OpenAPI spec
import * as GeneratedSchemas from '@/schemas/generated-schemas';
import * as UISchema from '@/schemas/generated-uiSchema';
import * as ComponentMappings from '@/schemas/generated-component-mapping';

// Import stable UI components
import { CategorySection } from '@/components/ui/form/layouts/category-section';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import field components
import { TextField } from '@/components/ui/form/fields/text-field';
import { SecretField } from '@/components/ui/form/fields/secret-field';
import { SelectField } from '@/components/ui/form/fields/select-field';
import { ToggleField } from '@/components/ui/form/fields/toggle-field';
import { ArrayField } from '@/components/ui/form/fields/array-field';
import { MarkdownTextArea } from '@/components/ui/form/fields/markdown-text-area';
import { UrlInput } from '@/components/ui/form/fields/url-input';

// Import wrappers
import { ConditionalField } from '@/components/ui/form/wrappers/conditional-field';
import { OverrideableField } from '@/components/ui/form/wrappers/overrideable-field';
import { PlanRestrictedFeature } from '@/components/ui/form/wrappers/plan-restricted-feature';
import { useTsController } from '@ts-react/form';

/**
 * Universal Field Component
 * This component reads the generated component mapping and renders the appropriate field
 */
function UniversalField({ name: fieldName }: { name: string }) {
  const { field, error } = useTsController<any>();
  
  // Get all metadata for this field from generated files
  const componentType = ComponentMappings.getComponentForField(fieldName);
  const componentProps = ComponentMappings.getComponentProps(fieldName);
  const wrappers = ComponentMappings.getFieldWrappers(fieldName);
  const fieldConfig = UISchema.fieldConfigurations[fieldName];
  const conditionalRule = UISchema.conditionalRules[fieldName];
  
  // Create the base field component based on the generated mapping
  let fieldComponent: React.ReactElement;
  
  switch (componentType) {
    case 'text-field':
      fieldComponent = (
        <TextField
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.errorMessage}
          label={fieldConfig?.['ui:title'] || fieldName}
          description={fieldConfig?.['ui:description']}
          {...componentProps}
        />
      );
      break;
      
    case 'secret-field':
      fieldComponent = (
        <SecretField
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.errorMessage}
          label={fieldConfig?.['ui:title'] || fieldName}
          description={fieldConfig?.['ui:description']}
          {...componentProps}
        />
      );
      break;
      
    case 'select-field':
      fieldComponent = (
        <SelectField
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.errorMessage}
          label={fieldConfig?.['ui:title'] || fieldName}
          description={fieldConfig?.['ui:description']}
          options={componentProps.options || []}
          {...componentProps}
        />
      );
      break;
      
    case 'toggle-field':
      fieldComponent = (
        <ToggleField
          checked={field.value || false}
          onCheckedChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.errorMessage}
          label={fieldConfig?.['ui:title'] || fieldName}
          description={fieldConfig?.['ui:description']}
          {...componentProps}
        />
      );
      break;
      
    case 'url-input':
      fieldComponent = (
        <UrlInput
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.errorMessage}
          label={fieldConfig?.['ui:title'] || fieldName}
          description={fieldConfig?.['ui:description']}
          {...componentProps}
        />
      );
      break;
      
    case 'array-field':
      fieldComponent = (
        <ArrayField
          value={field.value || []}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.errorMessage}
          label={fieldConfig?.['ui:title'] || fieldName}
          description={fieldConfig?.['ui:description']}
          {...componentProps}
        />
      );
      break;
      
    case 'markdown-text-area':
      fieldComponent = (
        <MarkdownTextArea
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.errorMessage}
          label={fieldConfig?.['ui:title'] || fieldName}
          description={fieldConfig?.['ui:description']}
          {...componentProps}
        />
      );
      break;
      
    default:
      // Fallback to text field
      fieldComponent = (
        <TextField
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={error?.errorMessage}
          label={fieldConfig?.['ui:title'] || fieldName}
          description={fieldConfig?.['ui:description']}
        />
      );
  }
  
  // Apply wrappers based on generated mappings
  let wrappedComponent = fieldComponent;
  
  wrappers.forEach(wrapper => {
    switch (wrapper) {
      case 'conditional-field':
        if (conditionalRule) {
          wrappedComponent = (
            <ConditionalField
              dependencies={conditionalRule.rules.map(r => ({
                field: r.field,
                value: r.value,
                operator: r.operator
              }))}
            >
              {wrappedComponent}
            </ConditionalField>
          );
        }
        break;
        
      case 'overrideable-field':
        wrappedComponent = (
          <OverrideableField>
            {wrappedComponent}
          </OverrideableField>
        );
        break;
        
      case 'plan-restricted-feature':
        wrappedComponent = (
          <PlanRestrictedFeature requiredPlan="premium">
            {wrappedComponent}
          </PlanRestrictedFeature>
        );
        break;
    }
  });
  
  return wrappedComponent;
}

// Create the mapping for react-ts-form
// This is a simple mapping that always uses UniversalField
const mapping = [
  [z.any(), UniversalField],
] as const;

// Create the form component
const DynamicConfigForm = createTsForm(mapping);

/**
 * Main Form Interpreter Component
 * This reads all the generated metadata and creates the complete form
 */
export function ConfigurationForm({ 
  initialValues = {},
  onSave 
}: {
  initialValues?: Partial<z.infer<typeof GeneratedSchemas.OpenWebUIConfigSchema>>;
  onSave?: (category: string, data: any) => Promise<void>;
}) {
  const [savingCategory, setSavingCategory] = React.useState<string | null>(null);
  
  // Use the generated schema for validation
  const form = useForm({
    resolver: zodResolver(GeneratedSchemas.OpenWebUIConfigSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });
  
  // Extract category information from generated uiSchema
  const categories = UISchema.categories;
  
  // Handle category submission
  const handleCategorySubmit = useCallback(async (categoryName: string) => {
    if (!onSave) return;
    
    setSavingCategory(categoryName);
    
    try {
      const category = categories.find(cat => cat.name === categoryName);
      if (!category) return;
      
      // Extract only the fields for this category
      const categoryData: any = {};
      const formData = form.getValues();
      
      category.fields.forEach(field => {
        if (field.name in formData) {
          categoryData[field.name] = formData[field.name];
        }
      });
      
      await onSave(categoryName, categoryData);
      
      // Reset dirty state for these fields
      category.fields.forEach(field => {
        form.resetField(field.name as any, { keepValue: true });
      });
    } catch (error) {
      console.error(`Error saving category ${categoryName}:`, error);
    } finally {
      setSavingCategory(null);
    }
  }, [form, onSave, categories]);
  
  // Create schema for a specific category dynamically
  const createCategorySchema = useCallback((category: typeof categories[0]) => {
    const schemaShape: any = {};
    
    category.fields.forEach(field => {
      // Get the field schema from the complete schema
      const completeSchema = GeneratedSchemas.OpenWebUIConfigSchema;
      if (completeSchema.shape && field.name in completeSchema.shape) {
        schemaShape[field.name] = completeSchema.shape[field.name];
      }
    });
    
    return z.object(schemaShape);
  }, []);
  
  return (
    <FormProvider {...form}>
      <div className="flex h-screen">
        {/* Sidebar Navigation - dynamically generated from categories */}
        <div className="w-64 border-r bg-background">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Configuration</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <a
                    key={category.name}
                    href={`#${category.name}`}
                    className="block px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {category.displayName}
                  </a>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
        
        {/* Main Form Content - dynamically generated from categories */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="container mx-auto p-6 space-y-6">
              {categories.map(category => (
                <CategorySection
                  key={category.name}
                  id={category.name}
                  title={category.displayName}
                  description={category.description}
                  onSave={() => handleCategorySubmit(category.name)}
                  isSaving={savingCategory === category.name}
                  isDirty={category.fields.some(f => 
                    form.formState.dirtyFields[f.name as keyof typeof form.formState.dirtyFields]
                  )}
                >
                  <DynamicConfigForm
                    form={form}
                    schema={createCategorySchema(category)}
                    props={{
                      // Props for all fields in this category
                      ...Object.fromEntries(
                        category.fields.map(field => [
                          field.name,
                          { name: field.name }
                        ])
                      )
                    }}
                  />
                </CategorySection>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </FormProvider>
  );
}
