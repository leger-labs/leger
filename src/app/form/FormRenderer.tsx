// src/form/FormRenderer.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTsForm } from '@ts-react/form';
import { useTsController } from '@ts-react/form';

// Import all generated schemas and metadata
import { OpenWebUIConfigSchema } from '@/schemas/generated-schemas';
import { 
  categories, 
  fieldConfigurations, 
  conditionalRules,
  categoryOrganization 
} from '@/schemas/generated-uiSchema';
import { 
  getComponentForField,
  getComponentProps,
  getFieldWrappers 
} from '@/schemas/generated-component-mapping';

// Import UI components
import { CategorySection } from '@/components/ui/form/layouts/category-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

// Import field components
import { TextField } from '@/components/ui/form/fields/text-field';
import { SecretField } from '@/components/ui/form/fields/secret-field';
import { SelectField } from '@/components/ui/form/fields/select-field';
import { ToggleField } from '@/components/ui/form/fields/toggle-field';
import { ArrayField } from '@/components/ui/form/fields/array-field';
import { MarkdownTextArea } from '@/components/ui/form/fields/markdown-text-area';
import { UrlInput } from '@/components/ui/form/fields/url-input';

// Import wrapper components
import { ConditionalField } from '@/components/ui/form/wrappers/conditional-field';
import { OverrideableField } from '@/components/ui/form/wrappers/overrideable-field';
import { PlanRestrictedFeature } from '@/components/ui/form/wrappers/plan-restricted-feature';

// Types
interface FormRendererProps {
  initialValues?: Partial<z.infer<typeof OpenWebUIConfigSchema>>;
  onSave?: (category: string, data: any) => Promise<void>;
  onError?: (error: Error) => void;
}

interface CategoryStatus {
  [key: string]: {
    isSaving: boolean;
    lastSaved?: Date;
    hasError?: boolean;
    errorMessage?: string;
  };
}

/**
 * Universal Field Renderer
 * This component dynamically renders the appropriate field component based on
 * the generated component mappings. It's the bridge between our static components
 * and the dynamic field metadata.
 */
function UniversalFieldRenderer({ name: fieldName }: { name: string }) {
  const { field, error } = useTsController<any>();
  const { toast } = useToast();
  
  // Get all metadata for this field from our generated files
  const componentType = getComponentForField(fieldName);
  const componentProps = getComponentProps(fieldName);
  const wrappers = getFieldWrappers(fieldName);
  const fieldConfig = fieldConfigurations[fieldName];
  const conditionalRule = conditionalRules[fieldName];
  
  // Extract field metadata for rendering
  const fieldMetadata = {
    label: fieldConfig?.['ui:title'] || fieldName,
    description: fieldConfig?.['ui:description'],
    help: fieldConfig?.['ui:help'],
    required: fieldConfig?.['ui:validation']?.required,
    placeholder: componentProps?.placeholder,
  };
  
  // Base props that all field components receive
  const baseFieldProps = {
    name: field.name,
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    error: error?.errorMessage,
    ...fieldMetadata,
    ...componentProps,
  };
  
  // Render the appropriate component based on the mapping
  let fieldComponent: React.ReactElement;
  
  switch (componentType) {
    case 'text-field':
      fieldComponent = <TextField {...baseFieldProps} />;
      break;
      
    case 'secret-field':
      fieldComponent = <SecretField {...baseFieldProps} />;
      break;
      
    case 'select-field':
      fieldComponent = (
        <SelectField 
          {...baseFieldProps} 
          options={componentProps?.options || []}
        />
      );
      break;
      
    case 'toggle-field':
      fieldComponent = (
        <ToggleField 
          {...baseFieldProps}
          checked={field.value || false}
          onCheckedChange={field.onChange}
        />
      );
      break;
      
    case 'url-input':
      fieldComponent = <UrlInput {...baseFieldProps} />;
      break;
      
    case 'array-field':
      fieldComponent = (
        <ArrayField 
          {...baseFieldProps}
          value={field.value || []}
        />
      );
      break;
      
    case 'markdown-text-area':
      fieldComponent = (
        <MarkdownTextArea 
          {...baseFieldProps}
          rows={componentProps?.rows || 4}
        />
      );
      break;
      
    default:
      // Fallback to text field with a warning
      console.warn(`Unknown component type '${componentType}' for field '${fieldName}'`);
      fieldComponent = <TextField {...baseFieldProps} />;
  }
  
  // Apply wrapper components based on the generated mappings
  let wrappedComponent = fieldComponent;
  
  // Apply wrappers in reverse order so they nest correctly
  [...wrappers].reverse().forEach(wrapper => {
    switch (wrapper) {
      case 'conditional-field':
        if (conditionalRule) {
          wrappedComponent = (
            <ConditionalField
              dependencies={conditionalRule.rules.map(rule => ({
                field: rule.field,
                value: rule.value,
                operator: rule.operator || 'equals',
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
  
  return <div className="space-y-2">{wrappedComponent}</div>;
}

// Create the form mapping for react-ts-form
const mapping = [
  [z.any(), UniversalFieldRenderer],
] as const;

// Create the typed form component
const ConfigForm = createTsForm(mapping);

/**
 * Main Form Renderer Component
 * This orchestrates the entire form generation process, reading the generated
 * metadata and creating a complete configuration interface.
 */
export function FormRenderer({ 
  initialValues = {}, 
  onSave,
  onError 
}: FormRendererProps) {
  const { toast } = useToast();
  const [categoryStatus, setCategoryStatus] = useState<CategoryStatus>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Initialize form with the complete schema
  const form = useForm({
    resolver: zodResolver(OpenWebUIConfigSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });
  
  // Watch form values for conditional logic
  const watchedValues = useWatch({ control: form.control });
  
  // Get hierarchical category structure from generated metadata
  const hierarchicalCategories = useMemo(() => {
    return categoryOrganization.hierarchy;
  }, []);
  
  // Handle category save
  const handleCategorySave = useCallback(async (categoryName: string) => {
    if (!onSave) return;
    
    setCategoryStatus(prev => ({
      ...prev,
      [categoryName]: { ...prev[categoryName], isSaving: true, hasError: false }
    }));
    
    try {
      // Find the category in our metadata
      const category = categories.find(cat => cat.name === categoryName);
      if (!category) throw new Error(`Category ${categoryName} not found`);
      
      // Extract only the fields for this category
      const categoryData: Record<string, any> = {};
      const formValues = form.getValues();
      
      category.fields.forEach(field => {
        if (field.name in formValues) {
          categoryData[field.name] = formValues[field.name];
        }
      });
      
      // Validate only the category fields
      const categoryFields = category.fields.map(f => f.name);
      const isValid = await form.trigger(categoryFields as any);
      
      if (!isValid) {
        throw new Error('Please fix validation errors before saving');
      }
      
      // Save the category
      await onSave(categoryName, categoryData);
      
      // Mark fields as not dirty after successful save
      categoryFields.forEach(fieldName => {
        form.resetField(fieldName as any, { keepValue: true });
      });
      
      setCategoryStatus(prev => ({
        ...prev,
        [categoryName]: { 
          isSaving: false, 
          lastSaved: new Date(),
          hasError: false 
        }
      }));
      
      toast({
        title: "Changes saved",
        description: `${category.displayName} configuration has been saved successfully.`,
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes';
      
      setCategoryStatus(prev => ({
        ...prev,
        [categoryName]: { 
          isSaving: false, 
          hasError: true,
          errorMessage 
        }
      }));
      
      toast({
        title: "Save failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError) onError(error as Error);
    }
  }, [form, onSave, onError, toast]);
  
  // Create schema for a specific category
  const createCategorySchema = useCallback((category: typeof categories[0]) => {
    const schemaShape: Record<string, z.ZodTypeAny> = {};
    
    category.fields.forEach(field => {
      // Access the field from the main schema
      const fieldSchema = (OpenWebUIConfigSchema as any).shape[field.name];
      if (fieldSchema) {
        schemaShape[field.name] = fieldSchema;
      }
    });
    
    return z.object(schemaShape);
  }, []);
  
  // Check if a category has unsaved changes
  const isCategoryDirty = useCallback((category: typeof categories[0]) => {
    return category.fields.some(field => 
      form.formState.dirtyFields[field.name as keyof typeof form.formState.dirtyFields]
    );
  }, [form.formState.dirtyFields]);
  
  return (
    <FormProvider {...form}>
      <div className="flex h-screen bg-background">
        {/* Sidebar Navigation */}
        <div className="w-80 border-r bg-muted/10">
          <ScrollArea className="h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Configuration</h2>
              <div className="space-y-1">
                {categories.map((category, index) => {
                  const status = categoryStatus[category.name];
                  const isDirty = isCategoryDirty(category);
                  const isActive = activeCategory === category.name;
                  
                  return (
                    <React.Fragment key={category.name}>
                      {index > 0 && category.characteristics.isHierarchical && 
                        !categories[index - 1].characteristics.isHierarchical && (
                        <Separator className="my-2" />
                      )}
                      
                      <button
                        onClick={() => {
                          setActiveCategory(category.name);
                          // Scroll to category
                          document.getElementById(category.name)?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start' 
                          });
                        }}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg transition-all
                          hover:bg-accent hover:text-accent-foreground
                          ${isActive ? 'bg-accent text-accent-foreground' : ''}
                          ${category.characteristics.child ? 'pl-8 text-sm' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{category.displayName}</span>
                          <div className="flex items-center gap-1">
                            {isDirty && (
                              <Badge variant="secondary" className="h-5 text-xs">
                                Unsaved
                              </Badge>
                            )}
                            {status?.lastSaved && (
                              <Badge variant="outline" className="h-5 text-xs">
                                Saved
                              </Badge>
                            )}
                            {status?.hasError && (
                              <Badge variant="destructive" className="h-5 text-xs">
                                Error
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="container max-w-4xl mx-auto py-10 px-6">
              <div className="space-y-8">
                {categories.map(category => {
                  const categorySchema = createCategorySchema(category);
                  const status = categoryStatus[category.name];
                  const isDirty = isCategoryDirty(category);
                  
                  return (
                    <Card key={category.name} id={category.name}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{category.displayName}</CardTitle>
                            <CardDescription className="mt-1">
                              {category.description}
                            </CardDescription>
                          </div>
                          <Button
                            onClick={() => handleCategorySave(category.name)}
                            disabled={!isDirty || status?.isSaving}
                            size="sm"
                          >
                            {status?.isSaving ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                        {status?.hasError && (
                          <div className="mt-2 text-sm text-destructive">
                            {status.errorMessage}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <ConfigForm
                          form={form}
                          schema={categorySchema}
                          props={Object.fromEntries(
                            category.fields.map(field => [
                              field.name,
                              { name: field.name }
                            ])
                          )}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </FormProvider>
  );
}
