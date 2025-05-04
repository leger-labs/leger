# Vercel UI Component Inventory

## Component Tracking Table

| Component Name | Priority | Page/Section | Purpose | Behavior | Implementation Notes |
|----------------|----------|-------------|---------|----------|---------------------|
| **Deployment Components** |
| Empty State Deployment Card | P0 | Production Deployment | Communicates absence of production deployment | Static informational display with status explanation | Similar to shadcn Alert variant |
| Contextual Instruction Text | P1 | Production Deployment | Provides technical guidance for deployment initiation | Includes inline CLI command reference | Can use shadcn/ui Text components with formatting |
| Status Metric Cards | P1 | Production Deployment | Displays operational metrics for service categories | Interactive navigation while showing current metrics | Composed of shadcn Card with custom content layout |
| Preview Deployment Section | P1 | Preview Deployments | Shows status of non-production deployments | Maintains separation between production/preview contexts | Uses Empty State pattern with different content |
| **Framework Configuration Components** |
| Framework Preset Selector | P0 | Build & Development | Selects framework-specific configurations | Triggers automatic configuration of multiple settings | Advanced Select component with presets |
| Command Override Controls | P0 | Build & Development | Enables manual override of auto-configured commands | Toggle affects editability of associated command input | Compound component with toggle and text input |
| Root Directory Input | P1 | Build & Development | Specifies base directory containing project code | Conditional field affecting deployment behavior | Text input with directory path validation |
| Directory Inclusion Toggle | P1 | Build & Development | Controls inclusion of files outside root directory | Toggles between Enabled/Disabled states | Switch or Toggle component |
| Skip Deployments Condition | P1 | Build & Development | Prevents unnecessary deployments | Implements Vercel-specific optimization rule | Toggle with conditional explanation |
| Node.js Version Selector | P1 | Build & Development | Specifies Node.js runtime version | Impacts both build and runtime environments | Select component with version options |
| Production Build Priority | P1 | Build & Development | Prioritizes production environment builds | Allocates resources preferentially | Toggle with explanation text |
| Contextual Documentation | P2 | Build & Development | Provides access to relevant documentation | Links to detailed explanations | Inline text links with icon |
| Section-Specific Save | P0 | Build & Development | Allows independent saving of configuration sections | Saves are scoped to individual sections | Primary button with section-scoped action |

## Components by Priority

### P0 (Critical)
- Empty State Deployment Card
- Framework Preset Selector
- Command Override Controls
- Section-Specific Save

### P1 (Important)
- Contextual Instruction Text
- Status Metric Cards
- Preview Deployment Section
- Root Directory Input
- Directory Inclusion Toggle
- Skip Deployments Condition
- Node.js Version Selector
- Production Build Priority

### P2 (Nice-to-have)
- Contextual Documentation Links

## Pending Pages/Sections
- Domains Settings
- Environment Variables
- Integrations
- Serverless Functions
- Edge Functions
- Caching
- Headers
- Redirects
- Rewrites
- Authentication
- Team Members
- Usage & Billing
