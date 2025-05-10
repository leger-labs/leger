# Development Workflow for Leger: GitHub-First Approach

## Overview

This document outlines the development workflow for the Leger platform, emphasizing a GitHub-first approach that eliminates the need for extensive local development environments. This workflow is aligned with our architectural choices—a single Cloudflare Worker hosting both frontend and backend, using Vite + React SPA for the frontend and integrated API endpoints.

## Core Principles

Our development workflow is guided by these principles:

1. **GitHub-Centered**: The entire development lifecycle revolves around GitHub, minimizing local environment dependencies.
2. **CI/CD Integration**: Automated testing, building, and deployment through GitHub Actions and Cloudflare Workers Builds.
3. **Preview Deployments**: Every pull request generates a preview deployment for effective review.
4. **Single-Worker Simplicity**: The unified architecture simplifies the deployment pipeline.
5. **Documentation as Code**: Documentation lives alongside the codebase and follows the same workflow.

## Detailed Workflow Components

### 1. Repository Structure

The GitHub repository is structured to support our single-Worker architecture:

```
leger/
├── api/                   # Worker backend code
│   ├── index.ts           # Main Worker entry point
│   ├── routes/            # API routes organized by domain
│   └── db/                # Database integration
├── src/                   # React SPA frontend
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   └── ...                # Other frontend code
├── public/                # Static assets
├── docs/                  # Project documentation
├── schema/                # Database schema and migrations
├── .github/
│   └── workflows/         # GitHub Actions workflows
├── vite.config.ts         # Vite configuration
├── wrangler.jsonc         # Cloudflare Worker configuration
└── package.json           # Project dependencies
```

This structure clearly separates concerns while keeping everything in a single repository for deployment as a unified Worker.

### 2. GitHub Actions Workflow

Our GitHub Actions workflow automates the entire development lifecycle:

#### Continuous Integration

For every push and pull request:

1. **Code Linting**: Enforces code style and best practices
2. **Type Checking**: Ensures TypeScript type safety
3. **Unit Testing**: Runs tests for components and business logic
4. **Schema Validation**: Validates database schema changes

#### Preview Deployments

For pull requests:

1. **Build Process**: Combines frontend and backend into deployable assets
2. **Preview Deployment**: Deploys to a temporary Cloudflare Worker
3. **Preview URL**: Posts the preview URL as a comment on the PR
4. **Status Reporting**: Updates the PR status with deployment results

#### Production Deployment

For merges to the main branch:

1. **Production Build**: Optimized build for production
2. **Deployment**: Deploys to the production Cloudflare Worker
3. **Post-Deployment Verification**: Runs health checks on the deployed Worker
4. **Release Tagging**: Creates a GitHub release with version tag

### 3. Cloudflare Workers Builds Integration

We leverage Cloudflare Workers Builds for streamlined deployment:

1. **GitHub Integration**: Connected directly to our GitHub repository
2. **Automatic Deployments**: Triggered by pushes to protected branches
3. **Preview Deployments**: Generated for non-production branches
4. **Build Logs**: Accessible through the Cloudflare dashboard
5. **Rollback Capability**: Easy rollback to previous deployments

As highlighted in the Cloudflare blog post, Workers Builds now posts preview URLs directly to GitHub PR comments, facilitating easier review of changes.

### 4. Development Environment Requirements

The GitHub-first approach minimizes local environment dependencies:

#### Essential Local Tools

- Git client
- Node.js (for occasional local testing if needed)
- GitHub CLI (optional, for managing PRs and issues)

#### No Local Requirements For

- Database setup
- Cloudflare authentication configuration
- Complex environment configuration
- Multiple service coordination

This simplicity enables new contributors to get started quickly with minimal setup.

### 5. Contribution Workflow

The typical contribution workflow follows these steps:

#### For Feature Development

1. **Issue Creation**: Create or select an issue from the project board
2. **Branch Creation**: Create a feature branch directly on GitHub
3. **Code Development**: Develop using GitHub's web editor or lightweight local setup
4. **Pull Request**: Create a PR when ready for review
5. **Automated Checks**: CI pipeline runs checks and creates preview deployment
6. **Review Process**: Team reviews code and tests functionality on the preview URL
7. **Refinement**: Address feedback directly in the PR
8. **Merge**: Approved changes are merged to main
9. **Deployment**: Automatic deployment to production via Workers Builds

#### For Bug Fixes

1. **Issue Reproduction**: Confirm bug on production or preview environment
2. **Quick Fix Branch**: Create a branch specifically for the bug fix
3. **Fix Implementation**: Implement minimal changes to address the issue
4. **Expedited Review**: Prioritized review process
5. **Hotfix Deployment**: Can bypass normal release cycle for critical issues

### 6. Database Schema Management

Database schema changes follow a structured process:

1. **Schema Definition**: Define schema changes in Drizzle ORM format
2. **Migration Generation**: Generate migration files as part of the PR
3. **Automated Validation**: CI validates migrations for safety and correctness
4. **Migration Application**: Migrations are applied during deployment
5. **Schema Documentation**: Schema changes are documented for reference

This approach ensures database changes are version-controlled and deployed consistently.

### 7. Cloudflare Access Integration

The Cloudflare Access authentication system integrates into the workflow:

1. **Configuration as Code**: Access policies defined in version-controlled configuration
2. **CI/CD Integration**: Access configuration updated through the deployment pipeline
3. **Testing on Preview**: Preview deployments use test Access configurations
4. **Production Access**: Production deployment uses production Access policies

### 8. Advantages of the Single-Worker Architecture

Our single-Worker architecture significantly simplifies the development workflow:

1. **Unified Deployment**: One deployment process handles both frontend and backend
2. **Simplified Testing**: Preview environments include all application components
3. **Consistent Environment**: Development, staging, and production share the same architecture
4. **Resource Bindings**: All resource bindings (D1, KV, R2) are managed in one place
5. **Streamlined Debugging**: Logs and errors are centralized in one Worker

### 9. Feature Development Workflow Example

To illustrate the workflow, here's how a typical feature development process works:

#### Example: Adding a new configuration template feature

1. **Issue Creation**: Create issue "Add template favorites feature"
2. **Branch Creation**: Create branch `feature/template-favorites` on GitHub
3. **Development**:
   - Add database schema changes for favorites
   - Implement API endpoints in the Worker
   - Create React components for the UI
   - Add tests for new functionality
4. **Pull Request Creation**: Create PR with implementation
5. **Automated Processes**:
   - GitHub Actions runs tests and type checking
   - Worker Build creates preview deployment
   - Preview URL is posted to the PR
6. **Review**:
   - Team reviews code in the PR
   - Functionality is tested on the preview deployment
   - Feedback is provided directly in the PR
7. **Refinement**: Make requested changes and updates
8. **Approval and Merge**: PR is approved and merged to main
9. **Production Deployment**: Changes are automatically deployed to production

### 10. Leveraging Cloudflare's Edge Platform

Our workflow takes full advantage of Cloudflare's edge platform:

#### Workers for Local-Equivalent Development

The Cloudflare Vite plugin allows us to develop with the Worker runtime environment, even when working primarily through GitHub:

1. **Accurate Runtime Environment**: The development server runs code in the actual Workers runtime
2. **Binding Emulation**: Local development can use emulated D1, KV, and other bindings
3. **Hot Module Replacement**: Changes are reflected immediately in the development server

#### Edge Deployment Benefits

1. **Global Distribution**: The Worker is automatically deployed globally
2. **Consistent Performance**: Edge computing provides consistent low latency
3. **Scaling**: Automatic scaling based on traffic
4. **Resource Bindings**: Seamless access to D1, KV, R2, and other Cloudflare resources

### 11. Documentation Workflow

Documentation follows the same GitHub-first workflow:

1. **Documentation as Code**: Documentation is stored in Markdown in the repository
2. **Documentation PRs**: Changes to documentation follow the same PR process
3. **Preview Rendering**: Documentation is rendered in preview deployments
4. **Version Alignment**: Documentation versions align with code releases

### 12. Release Management

Our release process leverages GitHub and Cloudflare Workers:

1. **Versioning**: Semantic versioning tracked through Git tags
2. **Release Notes**: Generated from PR descriptions and commits
3. **Deployment Coordination**: Releases tied to specific deployments
4. **Gradual Rollout**: Critical releases can use Cloudflare's gradual deployment feature
5. **Rollback Capability**: Easy rollback to previous versions if issues arise

### 13. Monitoring and Observability

The workflow includes monitoring and observability:

1. **Cloudflare Workers Logs**: Centralized logging through Workers Logs
2. **Error Tracking**: Error reporting integrated into the Worker
3. **Performance Monitoring**: Edge analytics for performance tracking
4. **Usage Metrics**: Tracking of API and feature usage
5. **Alerting**: Automated alerts for critical issues

### 14. Security Considerations

Security is integrated throughout the workflow:

1. **Access Control**: GitHub repository permissions align with roles
2. **Secret Management**: Secrets managed through GitHub Secrets and Cloudflare
3. **Dependency Scanning**: Automated scanning for vulnerable dependencies
4. **Code Review Focus**: Security-focused code review requirements
5. **Edge Security**: Cloudflare's edge security features enabled by default

## Advantages of This Approach

Our GitHub-first, single-Worker approach offers several significant advantages:

1. **Reduced Environment Complexity**: Minimal local environment setup required
2. **Consistent Development Experience**: All developers work in the same environment
3. **Streamlined Deployment**: One-step deployment process for the entire application
4. **Faster Onboarding**: New contributors can start quickly
5. **Transparent Development**: All changes are visible and tracked through GitHub
6. **Integrated Testing**: Testing is part of the automated workflow
7. **Preview-Driven Development**: Every change can be previewed before merging
8. **Documentation Alignment**: Documentation stays in sync with code

## Challenges and Solutions

While this workflow offers many advantages, it does present some challenges:

### 1. Local Development Experience

**Challenge**: Some developers prefer robust local development environments.

**Solution**: The workflow still supports local development using `npm run dev` with the Cloudflare Vite plugin, which runs in the actual Workers runtime. This provides the best of both worlds.

### 2. Complex Database Migrations

**Challenge**: Some database migrations require careful coordination.

**Solution**: Critical migrations can be handled through a dedicated process with additional review and potentially manual coordination steps when necessary.

### 3. Testing Complex Interactions

**Challenge**: Complex user interactions can be difficult to test without a local environment.

**Solution**: The preview deployment environment provides a full application instance for testing, and we can implement comprehensive end-to-end tests using Playwright or similar tools.

### 4. Worker Resource Limitations

**Challenge**: Workers have size and CPU time limitations.

**Solution**: Our architecture is designed with these limitations in mind, with careful attention to code splitting, efficient database queries, and appropriate use of caching.

## Conclusion

The GitHub-first development workflow for Leger, built around a single Cloudflare Worker architecture, offers a streamlined, efficient approach to building and maintaining our platform. By leveraging GitHub Actions, Cloudflare Workers Builds, and the Vite development server, we can provide a consistent, powerful development experience while minimizing the need for complex local environments.

This approach aligns perfectly with our architectural choices and enables us to take full advantage of Cloudflare's edge computing platform, delivering a performant, globally distributed application with minimal operational overhead.
