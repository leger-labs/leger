## Component Organization

### Form Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| **Basic Form Fields** |
| `TextField` | `components/ui/form/fields/text-field.tsx` | Standard text input field with label, description, error handling, and character count | Used in forms throughout the application |
| `SecretField` | `components/ui/form/fields/secret-field.tsx` | Password/secret input with show/hide toggle | Used for sensitive information like API keys |
| `ToggleField` | `components/ui/form/fields/toggle-field.tsx` | Toggle switch with label and description | Used for boolean settings |
| `SelectField` | `components/ui/form/fields/select-field.tsx` | Dropdown select with options | Used for selecting from predefined options |
| `ArrayField` | `components/ui/form/fields/array-field.tsx` | Manages a list of string values with add/remove functionality | Used for managing lists like allowed domains |
| `MarkdownTextArea` | `components/ui/form/fields/markdown-text-area.tsx` | Textarea with markdown support and character count | Used for rich text content |
| `URLInput` | `components/ui/form/fields/url-input.tsx` | Input field specifically for URLs with optional prefix | Used for domain/URL configuration |
| `SameInformationCheckbox` | `components/ui/form/fields/same-information-checkbox.tsx` | Checkbox for indicating same information across fields | Used in forms with duplicate information |
| **Form Wrappers** |
| `OverrideableField` | `components/ui/form/wrappers/overrideable-field.tsx` | Field that can be overridden from a default value | Used for configuration with defaults |
| `ConditionalField` | `components/ui/form/wrappers/conditional-field.tsx` | Field that shows/hides based on a condition | Used for dynamic form fields |
| `PlanRestrictedFeature` | `components/ui/form/wrappers/plan-restricted-feature.tsx` | Feature locked behind a subscription plan | Used for premium features |
| **Form Layouts** |
| `CategorySection` | `components/ui/form/layouts/category-section.tsx` | Card-based section with title, description, and save button | Used to group related form fields |
| `FormSection` | `components/ui/form/layouts/form-section.tsx` | Subsection within a category | Used to organize form fields |
| `FieldGroup` | `components/ui/form/layouts/field-group.tsx` | Group of related form fields | Used to visually group fields |
| **Form Feedback** |
| `SaveButton` | `components/ui/form/feedback/save-button.tsx` | Button with loading and dirty states | Used for form submission |
| `ValidationMessage` | `components/ui/form/feedback/validation-message.tsx` | Error message for form validation | Used to display field errors |
| `DangerousActionButton` | `components/ui/form/feedback/dangerous-action-button.tsx` | Button for destructive actions | Used for delete operations |
| `ToastError` | `components/ui/form/feedback/toast-error.tsx` | Toast notification for errors | Used for form validation errors |
| `CharacterCounter` | `components/ui/form/feedback/character-counter.tsx` | Character count display | Used in text inputs with limits |
| `VisibilityNotice` | `components/ui/form/feedback/visibility-notice.tsx` | Indicator for public/private status | Used for visibility settings |

### Environment Variable Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| `EnvironmentVariableTable` | `components/ui/env-vars/environment-variable-table.tsx` | Table displaying environment variables with actions | Used in environment configuration |
| `EnvironmentVariableForm` | `components/ui/env-vars/environment-variable-form.tsx` | Form for adding/editing environment variables | Used with EnvironmentVariableTable |
| `EnvironmentVariableImport` | `components/ui/env-vars/environment-variable-import.tsx` | Import environment variables from .env files | Used in environment configuration |

### Navigation Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| `HierarchicalNavigation` | `components/ui/navigation/hierarchical-navigation.tsx` | Nested navigation menu with expand/collapse | Used for sidebar navigation |
| `SectionAccordion` | `components/ui/navigation/section-accordion.tsx` | Expandable/collapsible section | Used to organize content sections |

### Protection Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| `ProtectionModeSelector` | `components/ui/protection/protection-mode-selector.tsx` | Selector for authentication methods | Used in security configuration |

### Team Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| `TeamSelectorChip` | `components/ui/team/team-selector-chip.tsx` | Chip displaying selected team with remove option | Used in team selection interfaces |

### Environment Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| `EnvironmentCard` | `components/ui/environments/environment-card.tsx` | Card displaying environment details | Used in dashboard |
| `EnvironmentBreadcrumb` | `components/ui/environments/environment-breadcrumb.tsx` | Breadcrumb navigation for environments | Used in environment pages |

### Documentation Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| `DocumentationLink` | `components/ui/docs/documentation-link.tsx` | External link to documentation | Used throughout the application |
| `CodeReference` | `components/ui/docs/code-reference.tsx` | Formatted code snippet | Used in documentation sections |

### Path Management Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| `PathManagementList` | `components/ui/path-management/path-management-list.tsx` | List of paths with add/remove functionality | Used for API route configuration |

### API Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| `PermissionScopeRow` | `components/ui/api/permission-scope-row.tsx` | Row for configuring API permission scopes | Used in API configuration |

### Framework Components

| Component | File Path | Purpose | Relationships |
|-----------|-----------|---------|--------------|
| `FrameworkIcon` | `components/ui/framework/framework-icon.tsx` | Icon representing a framework | Used in framework selection |
| `FrameworkPresetSelector` | `components/ui/framework/framework-preset-selector.tsx` | Dropdown for selecting framework presets | Used in deployment configuration |
| `CommandFieldGroup` | `components/ui/framework/command-field-group.tsx` | Field for command configuration with override | Used in deployment configuration |

## Component Relationships and Hierarchies

### Form Component Hierarchy

```
CategorySection
├── FormSection
│   └── FieldGroup
│       ├── TextField
│       ├── SecretField
│       ├── SelectField
│       ├── ToggleField
│       ├── ArrayField
│       ├── MarkdownTextArea
│       ├── URLInput
│       └── SameInformationCheckbox
└── SaveButton
```

### Environment Variable Component Hierarchy

```
CategorySection
├── EnvironmentVariableTable
│   └── EnvironmentVariableForm
└── EnvironmentVariableImport
```

### Navigation Component Hierarchy

```
HierarchicalNavigation
└── SectionAccordion
    └── [Form Components]
```

## Usage Examples

### Basic Form Field Usage

```tsx
import { TextField } from "@/components/ui/form/fields/text-field"

export function MyForm() {
  const [value, setValue] = useState("")
  
  return (
    <TextField
      label="Display Name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter your name"
      description="Your name as displayed to other users"
      maxLength={50}
      showCharCount
    />
  )
}
