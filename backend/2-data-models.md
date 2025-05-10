# Data Models

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Account : "is member of"
    Account ||--o{ Configuration : owns
    Configuration ||--o{ ConfigurationVersion : "has versions"
    Account ||--o{ AccountUser : "has members"
    User ||--o{ AccountUser : "belongs to"
    Account ||--o{ BillingSubscription : "has subscription"
    Account ||--o{ BillingCustomer : "has billing customer"
    Account ||--o{ TenantResource : "has dedicated"
    
    User {
        string id PK "Generated UUID"
        string email "From Cloudflare Access"
        string name "From Cloudflare Access"
        string avatar_url "Optional"
        string created_at "ISO datetime"
    }
    
    Account {
        string id PK "Generated UUID"
        string name "Display name"
        string slug "URL-friendly identifier"
        boolean personal_account "0 or 1"
        string primary_owner_user_id FK "User ID"
        string metadata "JSON string"
        string created_at "ISO datetime"
        string updated_at "ISO datetime"
    }
    
    AccountUser {
        string id PK "Generated UUID"
        string account_id FK "References Account"
        string user_id FK "References User"
        string account_role "owner or member"
        string created_at "ISO datetime"
    }
    
    Configuration {
        string config_id PK "Generated UUID"
        string account_id FK "References Account"
        string name "Display name"
        string description "Optional"
        string config_data "JSON string"
        boolean is_template "0 or 1"
        boolean is_public "0 or 1"
        integer version "Auto-incremented"
        string created_at "ISO datetime"
        string updated_at "ISO datetime"
        string created_by FK "User ID"
        string updated_by FK "User ID"
    }
    
    ConfigurationVersion {
        string version_id PK "Generated UUID"
        string config_id FK "References Configuration"
        integer version "Version number"
        string config_data "JSON string"
        string created_at "ISO datetime"
        string created_by FK "User ID"
        string change_description "Optional"
    }
    
    BillingSubscription {
        string id PK "Stripe subscription ID"
        string account_id FK "References Account"
        string billing_customer_id FK "Stripe customer ID"
        string status "Subscription status"
        string tier "Subscription tier"
        string plan_name "Human-readable name"
        boolean cancel_at_period_end "0 or 1"
        string created "ISO datetime"
        string current_period_start "ISO datetime"
        string current_period_end "ISO datetime"
        string trial_start "ISO datetime, optional"
        string trial_end "ISO datetime, optional"
        integer trial_remaining_days "Optional"
        string metadata "JSON string"
        string provider "Default: stripe"
    }
    
    BillingCustomer {
        string id PK "Stripe customer ID"
        string account_id FK "References Account"
        string email "Customer email"
        string provider "Default: stripe"
    }
    
    Invitation {
        string invitation_id PK "Generated UUID"
        string account_id FK "References Account"
        string token "Unique token"
        string account_role "owner or member"
        string invitation_type "one_time or 24_hour"
        string created_at "ISO datetime"
        string expires_at "ISO datetime, optional"
        string created_by FK "User ID"
        boolean used "0 or 1"
        string used_at "ISO datetime, optional"
    }
    
    WebhookLog {
        string id PK "Generated UUID"
        string event_type "Webhook event type"
        string subscription_id "Optional Stripe ID"
        string customer_id "Optional Stripe ID"
        string account_id "Optional Account ID"
        string data "JSON string"
        string created_at "ISO datetime"
        boolean processed "0 or 1"
        string processed_at "ISO datetime, optional"
    }

    TenantResource {
        string id PK "Generated UUID"
        string account_id FK "References Account"
        string resource_type "r2, redis, etc."
        string resource_id "External identifier"
        string endpoint "Resource endpoint"
        string credentials "JSON string (encrypted)"
        string created_at "ISO datetime"
        string updated_at "ISO datetime"
        string status "provisioned, failed, etc."
    }

    Deployment {
        string id PK "Generated UUID"
        string account_id FK "References Account"
        string config_id FK "References Configuration"
        string beam_pod_id "Beam.cloud pod ID"
        string status "pending, active, etc."
        string url "Deployment URL"
        string created_at "ISO datetime"
        string updated_at "ISO datetime"
        string created_by FK "User ID"
        string error "Optional error message"
        string metadata "JSON string"
    }
```

## Drizzle ORM Schema Definitions

The data models are implemented using Drizzle ORM, providing type-safe access to Cloudflare D1. Below are the schema definitions for the core entities:

### User Schema

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

### Account Schema

```typescript
// db/schema/accounts.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  personal_account: integer('personal_account', { mode: 'boolean' }).notNull().default(false),
  primary_owner_user_id: text('primary_owner_user_id').notNull().references(() => users.id),
  metadata: text('metadata', { mode: 'json' }).default('{}'),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
  updated_at: text('updated_at').$defaultFn(() => new Date().toISOString()),
});

export const accountUsers = sqliteTable('account_users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  account_id: text('account_id').notNull().references(() => accounts.id),
  user_id: text('user_id').notNull().references(() => users.id),
  account_role: text('account_role').notNull().default('member'), // 'owner' or 'member'
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
});
```

### Configuration Schema

```typescript
// db/schema/configurations.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { accounts } from './accounts';
import { users } from './users';

export const configurations = sqliteTable('configurations', {
  config_id: text('config_id').primaryKey().$defaultFn(() => createId()),
  account_id: text('account_id').notNull().references(() => accounts.id),
  name: text('name').notNull(),
  description: text('description'),
  config_data: text('config_data', { mode: 'json' }).notNull().default('{}'),
  is_template: integer('is_template', { mode: 'boolean' }).notNull().default(false),
  is_public: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  version: integer('version').notNull().default(1),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
  updated_at: text('updated_at').$defaultFn(() => new Date().toISOString()),
  created_by: text('created_by').references(() => users.id),
  updated_by: text('updated_by').references(() => users.id),
});

export const configurationVersions = sqliteTable('configuration_versions', {
  version_id: text('version_id').primaryKey().$defaultFn(() => createId()),
  config_id: text('config_id').notNull().references(() => configurations.config_id),
  version: integer('version').notNull(),
  config_data: text('config_data', { mode: 'json' }).notNull(),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
  created_by: text('created_by').references(() => users.id),
  change_description: text('change_description'),
});
```

### Billing Schema

```typescript
// db/schema/billing.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { accounts } from './accounts';

export const billingCustomers = sqliteTable('billing_customers', {
  id: text('id').primaryKey(), // Stripe customer ID
  account_id: text('account_id').notNull().references(() => accounts.id).unique(),
  email: text('email').notNull(),
  provider: text('provider').notNull().default('stripe'),
});

export const billingSubscriptions = sqliteTable('billing_subscriptions', {
  id: text('id').primaryKey(), // Stripe subscription ID
  account_id: text('account_id').notNull().references(() => accounts.id),
  billing_customer_id: text('billing_customer_id').notNull().references(() => billingCustomers.id),
  status: text('status').notNull(),
  tier: text('tier').notNull().default('standard'),
  plan_name: text('plan_name').notNull(),
  cancel_at_period_end: integer('cancel_at_period_end', { mode: 'boolean' }).notNull().default(false),
  created: text('created').notNull(),
  current_period_start: text('current_period_start').notNull(),
  current_period_end: text('current_period_end').notNull(),
  trial_start: text('trial_start'),
  trial_end: text('trial_end'),
  trial_remaining_days: integer('trial_remaining_days'),
  metadata: text('metadata', { mode: 'json' }).default('{}'),
  provider: text('provider').notNull().default('stripe'),
});
```

### Tenant Resources Schema

```typescript
// db/schema/tenant-resources.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { accounts } from './accounts';

export const tenantResources = sqliteTable('tenant_resources', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  account_id: text('account_id').notNull().references(() => accounts.id),
  resource_type: text('resource_type').notNull(), // 'r2', 'redis', etc.
  resource_id: text('resource_id').notNull(), // External identifier
  endpoint: text('endpoint').notNull(), // Resource endpoint
  credentials: text('credentials', { mode: 'json' }).notNull(), // Encrypted
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
  updated_at: text('updated_at').$defaultFn(() => new Date().toISOString()),
  status: text('status').notNull().default('provisioning'), // 'provisioning', 'provisioned', 'failed'
});
```

### Deployment Schema

```typescript
// db/schema/deployments.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { accounts } from './accounts';
import { configurations } from './configurations';
import { users } from './users';

export const deployments = sqliteTable('deployments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  account_id: text('account_id').notNull().references(() => accounts.id),
  config_id: text('config_id').notNull().references(() => configurations.config_id),
  beam_pod_id: text('beam_pod_id'),
  status: text('status').notNull().default('pending'), // 'pending', 'active', 'failed', 'stopped'
  url: text('url'),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
  updated_at: text('updated_at').$defaultFn(() => new Date().toISOString()),
  created_by: text('created_by').references(() => users.id),
  error: text('error'),
  metadata: text('metadata', { mode: 'json' }).default('{}'),
});
```

## Data Access Patterns

The application uses Drizzle ORM to interact with the Cloudflare D1 database. This provides type-safe queries and ensures data integrity through the type system.

### Example Query Patterns

```typescript
// Retrieving a user's accounts
const getUserAccounts = async (userId: string) => {
  return await db
    .select({
      account: accounts,
      role: accountUsers.account_role,
    })
    .from(accounts)
    .innerJoin(accountUsers, eq(accounts.id, accountUsers.account_id))
    .where(eq(accountUsers.user_id, userId));
};

// Creating a new configuration
const createConfiguration = async (data, userId: string, accountId: string) => {
  return await db.transaction(async (tx) => {
    // Create the configuration
    const [config] = await tx
      .insert(configurations)
      .values({
        account_id: accountId,
        name: data.name,
        description: data.description,
        config_data: data.config_data,
        is_template: data.is_template || false,
        is_public: data.is_public || false,
        created_by: userId,
        updated_by: userId,
      })
      .returning();

    // Create initial version
    await tx.insert(configurationVersions).values({
      config_id: config.config_id,
      version: 1,
      config_data: data.config_data,
      created_by: userId,
      change_description: 'Initial version',
    });

    return config;
  });
};
```

## Business Rules and Data Validation

Data validation is implemented at multiple levels:

1. **Frontend Validation**: Using Zod schemas with React Hook Form
2. **Worker Validation**: Server-side validation using the same Zod schemas
3. **Database Constraints**: SQL constraints enforced by D1
4. **Application Logic**: Additional business rules enforced in code

### Shared Zod Schemas

```typescript
// shared/validation/configuration.schema.ts
import { z } from 'zod';

export const configurationSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  config_data: z.record(z.any()).default({}),
  is_template: z.boolean().optional().default(false),
  is_public: z.boolean().optional().default(false),
});

export const configurationUpdateSchema = configurationSchema.partial();

export type ConfigurationInput = z.infer<typeof configurationSchema>;
export type ConfigurationUpdateInput = z.infer<typeof configurationUpdateSchema>;
```

## Multi-Tenant Resource Management

The `tenant_resources` table tracks dedicated resources provisioned for each tenant:

1. **Resource Provisioning**: When a new account is created, the system automatically provisions:
   - A dedicated R2 bucket for file storage
   - A dedicated Upstash Redis instance for caching

2. **Resource Access**: When a request needs to access a tenant-specific resource:
   - The Worker queries the tenant_resources table
   - The appropriate endpoint and credentials are retrieved
   - The Worker connects to the resource using these credentials

3. **Resource Lifecycle**: Resources follow the same lifecycle as the account:
   - Created during account provisioning
   - Updated if needed during subscription changes
   - Resources are retained when accounts are deactivated (for potential recovery)

This approach ensures complete data isolation between tenants while maintaining the operational benefits of a single Worker architecture.
