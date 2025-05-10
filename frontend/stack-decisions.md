# Frontend Stack Decisions for Leger

## Overview

This document outlines the technical decisions made for the Leger platform's frontend architecture. Leger is a configuration management tool for OpenWebUI deployments, requiring a robust UI for managing complex configuration settings, versioning, deployments, and team collaboration.

## Core Architecture Decision: Vite + React SPA with Cloudflare Worker Backend

After evaluating multiple approaches including Next.js and other frameworks, we have selected **Vite + React SPA with a unified Cloudflare Worker backend** as our architecture. This decision was informed by several factors:

### Why Vite + React SPA?

1. **Performance and Developer Experience**
   
   Vite offers exceptionally fast development server startup and hot module replacement (HMR), making it ideal for iterative development of a complex UI. The Cloudflare Vite plugin further enhances this by enabling the development server to run within the actual Workers runtime.

2. **Single Worker Simplicity**
   
   As highlighted in Cloudflare's "Your frontend, backend, and database — now in one Cloudflare Worker" blog post, this architecture allows us to combine frontend assets, backend API, and database connections in a single deployment unit, simplifying the overall system architecture.

3. **Form-Heavy Interface Support**
   
   Leger's core functionality revolves around complex configuration forms. React's component model and rich ecosystem of form libraries (React Hook Form + Zod) provide excellent support for building, validating, and managing these complex interfaces.

4. **Client-Side State Management**
   
   For a configuration editor with many interdependent fields and conditional logic, client-side state management offers advantages in terms of immediate feedback and complex validation rules.

### Advantages Over Alternative Approaches

1. **Compared to Next.js (with SaaS Stack)**
   
   While Next.js offers powerful server-side rendering capabilities, our evaluation determined that:
   - Leger's authenticated dashboard doesn't significantly benefit from SSR
   - The complexity of the configuration editor UI is better served by client-side rendering
   - The migration from Next.js to Vite would require significant restructuring of the SaaS Stack

2. **Compared to React Router (formerly Remix)**
   
   Though React Router v7 with Cloudflare has official support, our evaluation found that:
   - The form-centric nature of Leger aligns better with a pure SPA approach
   - The clear separation between frontend and backend in the SPA model provides better maintainability
   - The configuration editor's complex state management is more straightforward in a client-rendered app

## Technical Implementation Details

### 1. Project Structure

The Leger platform follows this high-level structure:

```
leger/
├── api/              # Worker backend code
├── src/              # React SPA frontend
├── public/           # Static assets
├── vite.config.ts    # Vite configuration
└── wrangler.jsonc    # Cloudflare Worker configuration
```

This structure clearly separates frontend (React SPA) and backend (Worker API) code while maintaining them in a single repository and deployment unit.

### 2. Frontend Framework: React

We chose React for the frontend framework due to:

- Mature ecosystem with extensive component libraries
- Strong support for complex form handling
- Excellent TypeScript integration
- Widespread adoption making it easier to find resources and developers

### 3. Build Tool: Vite

Vite provides:

- Extremely fast development server startup
- Efficient hot module replacement
- Modern ES module-based development
- First-class TypeScript support
- Seamless integration with Cloudflare Workers via the official plugin

### 4. API Integration

The backend API is implemented as a Cloudflare Worker in the same repository:

- The `api/index.ts` file serves as the main Worker entry point
- API routes are organized by domain (configurations, teams, deployments, etc.)
- The Worker handles both API requests and serves static assets

### 5. UI Component Library: ShadCN UI

For UI components, we're using ShadCN UI:

- Headless, accessible components based on Radix UI primitives
- Fully customizable with Tailwind CSS
- TypeScript support for type safety
- Lightweight and modular approach allowing us to include only what we need

### 6. Form Management: React Hook Form + Zod

For the complex configuration forms, we're using:

- **React Hook Form**: Efficient form state management with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- This combination provides:
  - Type-safe form validation
  - Excellent performance even with complex forms
  - Consistent validation on both client and server

### 7. Styling: Tailwind CSS

We've adopted Tailwind CSS for styling:

- Utility-first approach for consistent design
- Excellent integration with ShadCN UI components
- Lower maintenance overhead compared to custom CSS
- Built-in support for dark/light themes

### 8. Authentication: Cloudflare Access

We're using Cloudflare Access for authentication:

- Enterprise-grade identity management
- JWT-based authentication handled at the edge
- Seamless integration with the Worker architecture
- Minimal code required in our application

## Cloudflare Worker Integration

The Cloudflare Worker integration is a key aspect of our architecture:

### 1. Static Asset Serving

- Worker serves static assets built by Vite
- SPA mode enabled via `not_found_handling: "single-page-application"` in Worker configuration
- This ensures client-side routing works correctly

### 2. API Endpoints

- The Worker implements API endpoints for all Leger functionality
- These are organized by domain (configurations, teams, deployments)
- The Hono framework provides routing and middleware capabilities

### 3. Database Connectivity

- The Worker connects to D1 database using Drizzle ORM
- This provides type-safe database access for all operations
- Multi-tenant data isolation is enforced at the database query level

### 4. Resource Bindings

- The Worker includes bindings to Cloudflare resources:
  - D1 for relational data storage
  - KV for secrets management and caching
  - R2 for tenant-specific file storage (if needed)

## Development Workflow

The development workflow is streamlined:

1. **Local Development**
   - `npm run dev` starts Vite development server with the Worker running in the actual Workers runtime
   - This enables simultaneous work on frontend and backend code
   - Hot module replacement preserves state during development

2. **Build Pipeline**
   - `npm run build` builds both frontend and backend code
   - Frontend assets are built by Vite
   - Backend Worker code is prepared for deployment

3. **Deployment**
   - `npm run deploy` deploys the entire application to Cloudflare
   - This is integrated with GitHub workflows for CI/CD
   - Preview deployments are created for pull requests

## Conclusion

The Vite + React SPA architecture with a unified Cloudflare Worker backend provides the ideal foundation for the Leger platform. It combines development efficiency, performance, and simplicity while supporting the complex requirements of a configuration management tool.

This architecture allows us to leverage the full power of Cloudflare's platform while maintaining a clean separation of concerns between frontend and backend code. The result is a maintainable, performant application that delivers an excellent user experience for managing OpenWebUI configurations.
