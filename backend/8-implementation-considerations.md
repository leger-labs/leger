# Implementation Considerations for Cloudflare Architecture

This document outlines key considerations for implementing the Leger system using Cloudflare's edge computing platform, based on the defined business logic and system architecture.

## Cloudflare Services Architecture

| Component | Cloudflare Service | Implementation Considerations |
|-------------------|-------------------------|-------------------------------|
| Application Logic | Cloudflare Workers | - Single Worker for all frontend and backend functionality<br>- Domain-driven design within a single codebase<br>- Edge computing for global performance |
| Authentication | Cloudflare Access | - JWT-based authentication<br>- Identity mapping to internal user records<br>- Role-based permission model |
| Database | Cloudflare D1 | - SQLite-compatible schema design<br>- Type-safe access via Drizzle ORM<br>- Efficient connection pooling |
| Secrets Management | Cloudflare KV | - Secure storage for API keys and secrets<br>- Synchronized with Beam.cloud secrets<br>- Per-tenant secret management |
| Object Storage | Cloudflare R2 | - Tenant-specific buckets<br>- Credential management for tenant access<br>- Dedicated resource per account |
| Email Delivery | Cloudflare Email Workers | - Transactional email delivery<br>- HTML and text email templates<br>- Notification system for key events |

## Subscription and Pricing Implementation

1. **Subscription Tiers**:
   - Free tier (after trial expiration): 3 configurations maximum
   - Paid tier ($99/month): 50 configurations maximum
   - 14-day trial with full feature access for new users

2. **Feature Access Rules**:
   - Configuration creation restricted by tier limits
   - Template creation requires active subscription or trial
   - Advanced versioning features require subscription

3. **Stripe Integration**:
   - Single price point of $99/month
   - Trial to paid conversion flow
   - Subscription management via Customer Portal

## Beam.cloud Integration via fly.io

A critical component of the Leger architecture is the deployment of OpenWebUI instances through Beam.cloud, which requires fly.io as a middle layer:

### fly.io Middleware for Beam.cloud

1. **Architecture**:
   - Cloudflare Worker cannot directly create Beam.cloud pods (requires Python)
   - fly.io hosts a lightweight serverless function acting as a bridge
   - Worker makes requests to fly.io API which then interacts with Beam.cloud

2. **Implementation Pattern**:
```
Leger Worker → fly.io API → Beam.cloud API → OpenWebUI Pod
```

3. **fly.io Service**:
   - Implements a REST API endpoint for pod management
   - Translates Worker requests to Beam.cloud Python SDK calls
   - Returns pod status and details to Worker
   - Handles authentication and error management

4. **Communication Flow**:
```typescript
// domains/deployments/service.ts
async function createDeployment(configId, accountId, userId, env) {
  // Get configuration data from D1
  const config = await getConfiguration(configId, env.DB);
  
  // Transform to deployment parameters
  const deploymentParams = transformConfig(config.config_data);
  
  // Create deployment record in pending state
  const deployment = await createDeploymentRecord({
    account_id: accountId,
    config_id: configId,
    status: 'pending',
    created_by: userId
  }, env.DB);
  
  try {
    // Call fly.io API which bridges to Beam.cloud
    const response = await fetch(`${env.FLY_API_URL}/deployments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.FLY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: deploymentParams,
        tenant_id: accountId,
        deployment_id: deployment.id
      })
    });
    
    if (!response.ok) {
      throw new Error(`fly.io API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Update deployment with pod details
    await updateDeploymentRecord(
      deployment.id,
      {
        beam_pod_id: result.pod_id,
        status: 'deploying'
      },
      env.DB
    );
    
    return deployment;
  } catch (error) {
    // Handle deployment failure
    await updateDeploymentRecord(
      deployment.id,
      {
        status: 'failed',
        error: error.message
      },
      env.DB
    );
    
    throw error;
  }
}
```

## Single Worker Architecture Design

### Domain-Driven Structure

The single Worker architecture organizes code by business domain rather than technical layer:

```
├── domains/                    # Business domains
│   ├── auth/                   # Authentication and user profile
│   │   ├── handlers.ts         # Route handlers for auth endpoints
│   │   ├── service.ts          # Authentication business logic
│   │   └── types.ts            # Auth-specific type definitions
│   │
│   ├── accounts/               # Account management
│   │   ├── handlers.ts         # Route handlers for account endpoints
│   │   ├── service.ts          # Account business logic
│   │   └── types.ts            # Account-specific type definitions
│   │
│   ├── configurations/         # Configuration management
│   │   ├── handlers.ts
│   │   ├── service.ts
│   │   └── types.ts
│   │
│   ├── versions/               # Version management
│   │   ├── handlers.ts
│   │   ├── service.ts
│   │   └── types.ts
│   │
│   ├── billing/                # Billing and subscription
│   │   ├── handlers.ts
│   │   ├── service.ts
│   │   ├── webhook.ts          # Stripe webhook handling
│   │   └── types.ts
│   │
│   ├── deployments/            # Beam.cloud deployments via fly.io
│   │   ├── handlers.ts
│   │   ├── service.ts
│   │   ├── monitor.ts          # Deployment monitoring
│   │   └── types.ts
│   │
│   └── resources/              # Multi-tenant resources
│       ├── handlers.ts
│       ├── service.ts
│       └── types.ts
│
├── db/                         # Database with Drizzle ORM
│   ├── schema/                 # Drizzle schema definitions
│   │   ├── users.ts
│   │   ├── accounts.ts
│   │   ├── configurations.ts
│   │   ├── versions.ts
│   │   ├── billing.ts
│   │   ├── deployments.ts
│   │   ├── resources.ts
│   │   └── index.ts            # Export all schemas
│   │
│   ├── migrations/             # D1 migrations generated by Drizzle
│   └── index.ts                # DB client setup
│
├── middleware/                 # Worker middleware
│   ├── auth.ts                 # Authentication middleware
│   ├── error.ts                # Error handling middleware
│   ├── validation.ts           # Request validation middleware
│   └── index.ts                # Export all middleware
│
├── utils/                      # Utility functions
│   ├── errors.ts               # Error classes
│   ├── logging.ts              # Logging utilities
│   ├── json.ts                 # JSON handling utilities
│   ├── crypto.ts               # Encryption utilities
│   └── fly.ts                  # fly.io client utilities
│
├── frontend/                   # Frontend React application
│   ├── components/             # React components
│   ├── pages/                  # Page components
│   ├── hooks/                  # React hooks
│   ├── schemas/                # Zod schemas (shared with backend)
│   └── main.tsx                # Entry point
│
├── shared/                     # Shared code between frontend and backend
│   ├── types/                  # TypeScript types
│   └── validation/             # Shared Zod schemas
│
├── index.ts                    # Worker entry point
└── wrangler.toml               # Cloudflare Worker configuration
```

### Request Flow

The Worker handles requests using a middleware-based approach:

1. **Request parsing**: Parse incoming request
2. **Authentication check**: Verify Cloudflare Access JWT
3. **Route matching**: Match request to appropriate domain handler
4. **Authorization check**: Verify permission for the operation
5. **Validation**: Validate request data using Zod schemas
6. **Business logic**: Execute domain-specific logic
7. **Database operation**: Interact with D1 via Drizzle ORM
8. **Response formatting**: Format and return response
9. **Error handling**: Consistent error handling throughout the flow

## Database Implementation

### D1 Schema Design

Cloudflare D1 is SQLite-based, which requires adjustments from the PostgreSQL-oriented design:

1. **Data Types**:
   - Replace PostgreSQL-specific types with SQLite equivalents
   - Store JSON as strings with a `{ mode: 'json' }` annotation for Drizzle
   - Use text/string for UUID values, generated in application code

2. **Schema Definition with Drizzle ORM**:
```typescript
// db/schema/users.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar_url: text('avatar_url'),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
});
```

3. **Relationships**:
   - Define relationships using Drizzle's reference functions
   - Enforce foreign key constraints at application level when needed
   - Use transactions for operations involving multiple tables

4. **Migrations**:
   - Generate migrations using Drizzle Kit
   - Apply migrations programmatically or via Wrangler
   - Version control migration files

## Authentication and Authorization

### Cloudflare Access Integration

1. **JWT Handling**:
   - Extract the `CF-Access-JWT-Assertion` header from requests
   - JWT verification is handled automatically by Cloudflare
   - Extract user information from verified JWT

2. **User Record Management**:
   - Create or retrieve user record based on email from JWT
   - Map Cloudflare identity to internal user system
   - Store minimal user profile information

3. **Authorization**:
   - Implement role-based checks in middleware
   - Check account membership for resource access
   - Enforce subscription-based feature access

```typescript
// middleware/auth.ts
export async function authMiddleware(request, env, ctx) {
  const jwt = request.headers.get('CF-Access-JWT-Assertion');
  
  if (!jwt) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    // Extract verified user info from JWT
    const userInfo = getUserInfoFromJwt(jwt);
    
    // Create or get user record
    const user = await getOrCreateUser(userInfo.email, userInfo.name, env.DB);
    
    // Add user to request context
    request.user = user;
    
    // Continue to next handler
    return ctx.next();
  } catch (error) {
    return new Response('Unauthorized', { status: 401 });
  }
}
```

## Secrets Management with Cloudflare KV

### Secure Storage for API Keys

Cloudflare KV is used specifically for secrets management, not for caching:

1. **KV Structure**:
   - Namespace for storing tenant API keys and secrets
   - Keys organized by tenant and service
   - Values encrypted before storage

2. **Two-Way Sync with Beam.cloud**:
   - KV serves as the primary UI-accessible store for secrets
   - Changes in KV are synchronized to Beam.cloud secrets
   - Background processes ensure consistency between systems

3. **Implementation Pattern**:
```typescript
// domains/resources/secrets.ts
export async function storeSecret(tenantId, key, value, env) {
  // Generate a unique key for this tenant's secret
  const kvKey = `tenant:${tenantId}:secret:${key}`;
  
  // Encrypt the value before storing
  const encryptedValue = await encryptValue(value, env.ENCRYPTION_KEY);
  
  // Store in Cloudflare KV
  await env.SECRETS.put(kvKey, encryptedValue);
  
  // Sync to Beam.cloud via fly.io
  await syncSecretToBeam(tenantId, key, value, env);
  
  return true;
}

export async function getSecret(tenantId, key, env) {
  // Generate the key for lookup
  const kvKey = `tenant:${tenantId}:secret:${key}`;
  
  // Retrieve from KV
  const encryptedValue = await env.SECRETS.get(kvKey);
  
  if (!encryptedValue) {
    return null;
  }
  
  // Decrypt the value
  return await decryptValue(encryptedValue, env.ENCRYPTION_KEY);
}

async function syncSecretToBeam(tenantId, key, value, env) {
  // Call fly.io endpoint to sync secret to Beam.cloud
  const response = await fetch(`${env.FLY_API_URL}/secrets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.FLY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tenant_id: tenantId,
      key: key,
      value: value
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to sync secret to Beam.cloud: ${response.status}`);
  }
  
  return true;
}
```

## Multi-Tenant Resource Provisioning

### Per-Tenant Resource Management

1. **Resource Creation**:
   - Automatically provision resources when an account is created
   - Create isolated R2 bucket for each tenant
   - Provision dedicated Upstash Redis instance
   - Generate and securely store access credentials

2. **Resource Mapping**:
   - Maintain mappings between accounts and resources in D1
   - Encrypt sensitive credentials before storing
   - Reference resources by tenant during operations

3. **Deployment Integration**:
   - Include tenant-specific resource details in deployments
   - Use Beam.cloud secrets for sensitive credentials
   - Maintain isolation between tenant deployments

```typescript
// domains/resources/service.ts
export async function provisionTenantResources(accountId, env) {
  // Create R2 bucket
  const r2Result = await provisionR2Bucket(accountId, env);
  
  // Create Redis instance
  const redisResult = await provisionRedisInstance(accountId, env);
  
  return {
    r2: r2Result,
    redis: redisResult
  };
}
```

## Frontend Implementation

### React with Cloudflare Workers

1. **Worker-Rendered Frontend**:
   - Frontend assets bundled with Worker
   - React hydration for interactive components
   - Worker handles both API requests and frontend rendering

2. **Form-Heavy UI**:
   - shadcn/ui components for UI elements
   - React Hook Form for form state management
   - Zod schemas for validation shared with backend

3. **Optimistic Updates**:
   - Update UI immediately before server confirmation
   - Revert changes if server operation fails
   - Provide clear loading and error states

```typescript
// frontend/hooks/use-configurations.ts
export function useCreateConfiguration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create configuration');
      }
      
      return response.json();
    },
    onMutate: async (newConfiguration) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['configurations'] });
      const previousConfigurations = queryClient.getQueryData(['configurations']);
      
      queryClient.setQueryData(['configurations'], (old) => [
        ...old,
        { ...newConfiguration, id: 'temp-' + Date.now() }
      ]);
      
      return { previousConfigurations };
    },
    onError: (err, newConfiguration, context) => {
      // Revert on error
      queryClient.setQueryData(
        ['configurations'],
        context.previousConfigurations
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
    }
  });
}
```

## GitHub-Based Development Workflow

Leger development is centered on GitHub-based workflows rather than local development:

### GitHub-Centric Development

1. **Development Process**:
   - All development happens directly through GitHub
   - GitHub Codespaces for editing when needed
   - Comprehensive CI/CD pipelines handle all builds and testing
   - No local development environment required

2. **GitHub Actions Workflow**:
   - Automated testing on all pull requests
   - Preview deployments for each PR
   - Automatic staging deployment from main branch
   - Scheduled builds for continuous testing

3. **Collaborative Development**:
   - PR reviews for all changes
   - Automated code quality checks
   - Status checks enforce quality standards
   - Deployment previews for visual verification

```yaml
# .github/workflows/pr-workflow.yml
name: Pull Request Workflow
on:
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Build project
        run: npm run build
      
  create-preview:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Deploy preview to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          command: deploy --env preview --name pr-${{ github.event.pull_request.number }}
      - name: Comment with preview URL
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployed to: https://pr-${context.issue.number}.leger-preview.workers.dev`
            })
```

## Error Handling and Logging

### Consistent Error Approach

1. **Structured Error Responses**:
```typescript
// utils/errors.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
  
  toResponse() {
    return new Response(
      JSON.stringify({
        error: {
          code: this.code,
          message: this.message,
          details: this.details
        }
      }),
      {
        status: this.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
```

2. **Error Middleware**:
```typescript
// middleware/error.ts
export async function errorMiddleware(request, env, ctx) {
  try {
    return await ctx.next();
  } catch (error) {
    console.error('Request error:', error);
    
    if (error instanceof ApiError) {
      return error.toResponse();
    }
    
    // For unknown errors, return a generic 500 response
    return new Response(
      JSON.stringify({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
```

3. **Validation Errors**:
```typescript
// middleware/validation.ts
export function validateRequest(schema) {
  return async (request, env, ctx) => {
    try {
      const body = await request.json();
      const validated = schema.parse(body);
      
      // Replace request body with validated data
      request.validatedBody = validated;
      
      return ctx.next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new ApiError(
          400,
          'VALIDATION_ERROR',
          'Invalid request data',
          error.format()
        ).toResponse();
      }
      
      throw error;
    }
  };
}
```

## Security Considerations

### Security Best Practices

1. **Credential Management**:
   - Encrypt sensitive credentials before storing
   - Use Cloudflare KV for secrets management
   - Sync secrets to Beam.cloud for deployment
   - Access control for secret management

2. **Input Validation**:
   - Validate all input with Zod schemas
   - Sanitize data before processing
   - Implement proper content security policies

3. **Authentication & Authorization**:
   - Leverage Cloudflare Access for authentication
   - Implement fine-grained authorization checks
   - Apply principle of least privilege

4. **Tenant Isolation**:
   - Maintain strict isolation between tenant resources
   - Validate tenant ownership on all operations
   - Prevent cross-tenant data access

By following these implementation considerations, the Leger system can be effectively built using Cloudflare's edge computing platform with fly.io as a bridge to Beam.cloud, providing a performant, secure, and scalable solution for OpenWebUI configuration management.
