# Authentication and Authorization Model

## Authentication System

Leger uses Cloudflare Access for authentication, providing a secure, scalable identity solution without the need to implement custom authentication flows.

### Cloudflare Access Integration

1. **Authentication Flow:**
   - Users authenticate through Cloudflare Access
   - Cloudflare Access validates the user's identity
   - The Worker receives a request with a `CF-Access-JWT-Assertion` header
   - The JWT is verified and decoded to extract user information
   - The user is mapped to an internal user record if one exists, or a new record is created

2. **JWT Handling:**
   - Cloudflare Access JWT contains identity information (email, name)
   - The Worker verifies JWT signatures automatically
   - No custom token management is required

3. **First-Time User Flow:**
   - When a user authenticates for the first time, a user record is automatically created
   - A personal account is created for the user
   - An initial 14-day trial period is started
   - The user is redirected to the onboarding flow

4. **Session Management:**
   - Session lifecycle is managed by Cloudflare Access
   - No custom session management code required
   - Sessions automatically expire based on Cloudflare Access settings

### Implementation Details

```typescript
// middleware/auth.ts
import { Env, UserContext }

export async function sendTrialEndingSoonEmail(
  userEmail: string,
  userName: string,
  daysRemaining: number,
  accountName: string,
  env: Env
) {
  const billingUrl = `${env.APP_URL}/settings/billing`;
  
  return await env.EMAIL.send({
    to: userEmail,
    from: env.FROM_EMAIL,
    subject: `Your Leger trial for ${accountName} ends in ${daysRemaining} days`,
    text: `Hi ${userName}, your free trial for ${accountName} will end in ${daysRemaining} days. To continue using premium features, please subscribe at ${billingUrl}`,
    html: `
      <h2>Your Leger trial is ending soon</h2>
      <p>Hi ${userName},</p>
      <p>Your free trial for <strong>${accountName}</strong> will end in <strong>${daysRemaining} days</strong>.</p>
      <p>To continue using premium features, please <a href="${billingUrl}">subscribe now</a>.</p>
    `
  });
}

export async function sendSubscriptionStatusEmail(
  userEmail: string,
  userName: string,
  accountName: string,
  status: string,
  env: Env
) {
  let subject, message;
  const billingUrl = `${env.APP_URL}/settings/billing`;
  
  switch (status) {
    case 'active':
      subject = `Your Leger subscription for ${accountName} is now active`;
      message = `Your subscription has been activated successfully. You now have full access to all premium features.`;
      break;
    case 'canceled':
      subject = `Your Leger subscription for ${accountName} has been canceled`;
      message = `Your subscription has been canceled. You'll continue to have access to premium features until the end of your current billing period.`;
      break;
    case 'past_due':
      subject = `Action required: Payment issue with your Leger subscription`;
      message = `We encountered an issue processing your payment. Please update your payment method to avoid interruption to your service.`;
      break;
    default:
      subject = `Update about your Leger subscription for ${accountName}`;
      message = `There has been a change to your subscription status. Please check your account for details.`;
  }
  
  return await env.EMAIL.send({
    to: userEmail,
    from: env.FROM_EMAIL,
    subject,
    text: `Hi ${userName}, ${message} Manage your subscription at ${billingUrl}`,
    html: `
      <h2>${subject}</h2>
      <p>Hi ${userName},</p>
      <p>${message}</p>
      <p><a href="${billingUrl}">Manage your subscription</a></p>
    `
  });
}
```

## Multi-Tenant Resource Provisioning

The system provisions and manages dedicated resources for each tenant account:

```typescript
// domains/resources/service.ts
import { R2Client, RedisClient } from '../utils/resource-clients';
import { encryptCredentials, decryptCredentials } from '../utils/crypto';

export async function provisionTenantResources(
  accountId: string,
  env: Env
) {
  try {
    // Provision R2 bucket
    const r2Client = new R2Client(env.R2_ADMIN_KEY, env.R2_ADMIN_SECRET);
    const bucketName = `tenant-${accountId}`;
    await r2Client.createBucket(bucketName);
    
    // Generate credentials for tenant access
    const r2Credentials = await r2Client.generateCredentials(bucketName);
    
    // Store R2 resource record
    await storeTenantResource({
      account_id: accountId,
      resource_type: 'r2',
      resource_id: bucketName,
      endpoint: env.R2_ENDPOINT,
      credentials: await encryptCredentials(r2Credentials, env.ENCRYPTION_KEY),
      status: 'provisioned'
    }, env.DB);
    
    // Provision Redis instance
    const redisClient = new RedisClient(env.UPSTASH_API_KEY);
    const redisName = `tenant-${accountId}`;
    const redisInstance = await redisClient.createDatabase(redisName);
    
    // Store Redis resource record
    await storeTenantResource({
      account_id: accountId,
      resource_type: 'redis',
      resource_id: redisInstance.id,
      endpoint: redisInstance.endpoint,
      credentials: await encryptCredentials(
        { password: redisInstance.password },
        env.ENCRYPTION_KEY
      ),
      status: 'provisioned'
    }, env.DB);
    
    return true;
  } catch (error) {
    console.error('Failed to provision tenant resources', error);
    
    // Store failed resource records
    await storeTenantResource({
      account_id: accountId,
      resource_type: 'r2',
      resource_id: `tenant-${accountId}`,
      endpoint: env.R2_ENDPOINT,
      credentials: await encryptCredentials({}, env.ENCRYPTION_KEY),
      status: 'failed'
    }, env.DB);
    
    await storeTenantResource({
      account_id: accountId,
      resource_type: 'redis',
      resource_id: `tenant-${accountId}`,
      endpoint: '',
      credentials: await encryptCredentials({}, env.ENCRYPTION_KEY),
      status: 'failed'
    }, env.DB);
    
    return false;
  }
}

export async function getTenantResourceCredentials(
  accountId: string,
  resourceType: string,
  env: Env
) {
  // Get resource record
  const resource = await getTenantResource(accountId, resourceType, env.DB);
  
  if (!resource || resource.status !== 'provisioned') {
    throw new Error(`Resource not found or not provisioned: ${resourceType}`);
  }
  
  // Decrypt credentials
  return {
    endpoint: resource.endpoint,
    credentials: await decryptCredentials(resource.credentials, env.ENCRYPTION_KEY)
  };
}

export async function getR2Client(accountId: string, env: Env) {
  const r2Resource = await getTenantResourceCredentials(accountId, 'r2', env);
  
  return new R2Client(
    r2Resource.credentials.access_key,
    r2Resource.credentials.secret_key,
    r2Resource.endpoint
  );
}

export async function getRedisClient(accountId: string, env: Env) {
  const redisResource = await getTenantResourceCredentials(accountId, 'redis', env);
  
  return new RedisClient(
    redisResource.endpoint,
    redisResource.credentials.password
  );
}
```

## Edge Caching Strategy

The Worker implements strategic caching to optimize performance:

```typescript
// middleware/cache.ts
export async function cacheMiddleware(
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  const url = new URL(request.url);
  const cacheKey = `${url.pathname}${url.search}`;
  
  // Skip caching for non-GET requests
  if (request.method !== 'GET') {
    return null;
  }
  
  // Check for cache in KV
  const cachedResponse = await env.CACHE.get(cacheKey, 'json');
  
  if (cachedResponse) {
    // Return cached response
    return new Response(cachedResponse.body, {
      headers: new Headers(cachedResponse.headers),
      status: cachedResponse.status
    });
  }
  
  // Continue to handler
  return null;
}

export async function cacheResponse(
  response: Response,
  request: Request,
  env: Env,
  ttl = 300 // 5 minutes default
) {
  const url = new URL(request.url);
  const cacheKey = `${url.pathname}${url.search}`;
  
  // Only cache successful responses
  if (!response.ok) {
    return response;
  }
  
  // Clone the response for caching
  const clonedResponse = response.clone();
  const body = await clonedResponse.text();
  
  // Cache in KV
  await env.CACHE.put(
    cacheKey,
    JSON.stringify({
      body,
      headers: Object.fromEntries(clonedResponse.headers.entries()),
      status: clonedResponse.status
    }),
    { expirationTtl: ttl }
  );
  
  return response;
}

// Cache invalidation helper
export async function invalidateCache(
  patterns: string[],
  env: Env
) {
  for (const pattern of patterns) {
    const keys = await env.CACHE.list({ prefix: pattern });
    for (const key of keys.keys) {
      await env.CACHE.delete(key.name);
    }
  }
}
```

## Additional Security Measures

Beyond authentication and authorization, the system implements several security measures:

### 1. Secure Headers

```typescript
// middleware/security.ts
export function securityHeadersMiddleware(request: Request) {
  return {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.cloudflare.com; font-src 'self' data:; connect-src 'self' https://*.stripe.com",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  };
}
```

### 2. Rate Limiting

```typescript
// middleware/rate-limit.ts
export async function rateLimitMiddleware(
  request: Request,
  env: Env
) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Define limits for different paths
  let limit = 60; // Default: 60 requests per minute
  let ttl = 60;   // Default: 1 minute window
  
  if (path.startsWith('/billing')) {
    limit = 20;   // More sensitive endpoints
  } else if (path.startsWith('/auth')) {
    limit = 10;   // Authentication endpoints
  }
  
  // Create cache key
  const cacheKey = `ratelimit:${ip}:${path}`;
  
  // Get current count
  const currentValue = await env.CACHE.get(cacheKey);
  const count = currentValue ? parseInt(currentValue) : 0;
  
  // Check if limit exceeded
  if (count >= limit) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  // Increment count
  await env.CACHE.put(cacheKey, (count + 1).toString(), { expirationTtl: ttl });
  
  // Continue to handler
  return null;
}
```

### 3. Credentials Encryption

```typescript
// utils/crypto.ts
export async function encryptCredentials(
  credentials: any,
  key: string
): Promise<string> {
  // Convert credentials to JSON string
  const plaintext = JSON.stringify(credentials);
  
  // Get encryption key
  const encryptionKey = await crypto.subtle.importKey(
    'raw',
    base64ToArrayBuffer(key),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt data
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    encryptionKey,
    new TextEncoder().encode(plaintext)
  );
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  // Return as base64 string
  return arrayBufferToBase64(combined);
}

export async function decryptCredentials(
  encryptedData: string,
  key: string
): Promise<any> {
  // Decode base64
  const combined = base64ToArrayBuffer(encryptedData);
  
  // Extract IV
  const iv = combined.slice(0, 12);
  
  // Extract ciphertext
  const ciphertext = combined.slice(12);
  
  // Get decryption key
  const decryptionKey = await crypto.subtle.importKey(
    'raw',
    base64ToArrayBuffer(key),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  // Decrypt data
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv)
    },
    decryptionKey,
    ciphertext
  );
  
  // Parse JSON
  return JSON.parse(new TextDecoder().decode(decrypted));
}
```

These integrations and security measures ensure that the single Worker architecture can securely and efficiently handle all aspects of the Leger application while providing robust multi-tenant isolation.
 from '../types';

export async function authMiddleware(
  request: Request,
  env: Env,
  ctx: ExecutionContext
) {
  // Get the JWT from Cloudflare Access header
  const accessJwt = request.headers.get('CF-Access-JWT-Assertion');
  
  if (!accessJwt) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    // Verify and decode the JWT (handled automatically by Cloudflare)
    const jwt = await verifyAccessJWT(accessJwt, env);
    
    // Extract user information
    const email = jwt.email;
    const name = jwt.name || email.split('@')[0];
    
    // Get or create user in the database
    const user = await getOrCreateUser(email, name, env.DB);
    
    // Attach user context to the request for downstream handlers
    const userContext: UserContext = {
      user,
      userAccounts: await getUserAccounts(user.id, env.DB),
    };
    
    // Pass the request to the next handler with user context
    return await handleRequest(request, env, ctx, userContext);
  } catch (error) {
    return new Response('Unauthorized', { status: 401 });
  }
}
```

## Authorization Model

The authorization model is implemented at the application level within the Worker, independent of the authentication mechanism.

### Role-Based Access Control

The system uses a simple role-based permission model:

1. **Account Roles:**
   - `owner`: Full administrative privileges for an account
   - `member`: Standard user privileges for an account

2. **Special Designations:**
   - `primary_owner`: Special designation for the account creator or designated primary admin

### Permission Matrix

| Action | No Authentication | Account Member | Account Owner | Primary Owner |
|--------|------------------|----------------|---------------|--------------|
| View public templates | ✓ | ✓ | ✓ | ✓ |
| Use public templates | ✗ | ✓ | ✓ | ✓ |
| Create personal account | N/A* | N/A | N/A | N/A |
| Create team account | ✗ | ✓ | ✓ | ✓ |
| View account configurations | ✗ | ✓ | ✓ | ✓ |
| Create/edit configurations | ✗ | ✓ | ✓ | ✓ |
| Delete configurations | ✗ | ✗ | ✓ | ✓ |
| Create templates | ✗ | ✓** | ✓** | ✓** |
| View account members | ✗ | ✓ | ✓ | ✓ |
| Invite members | ✗ | ✗ | ✓ | ✓ |
| Remove members | ✗ | ✗ | ✓ | ✓ |
| Change member roles | ✗ | ✗ | ✓ | ✓ |
| Update account details | ✗ | ✗ | ✓ | ✓ |
| Delete account | ✗ | ✗ | ✗ | ✓ |
| Transfer primary ownership | ✗ | ✗ | ✗ | ✓ |
| Manage subscription | ✗ | ✗ | ✓ | ✓ |
| Manage tenant resources | ✗ | ✗ | ✓ | ✓ |

*Account creation happens automatically with first authentication
**Requires active subscription or trial

### Authorization Implementation

The authorization logic is implemented through middleware and helper functions:

```typescript
// utils/authorization.ts
import { UserContext, AccountRole } from '../types';
import { eq, and } from 'drizzle-orm';
import { accounts, accountUsers } from '../db/schema';

// Check if the user has a role on an account
export async function hasRoleOnAccount(
  userContext: UserContext,
  accountId: string,
  requiredRole?: AccountRole
): Promise<boolean> {
  const accountMembership = userContext.userAccounts.find(
    a => a.account.id === accountId
  );
  
  if (!accountMembership) {
    return false;
  }
  
  if (!requiredRole) {
    return true; // Just checking membership
  }
  
  if (requiredRole === 'owner') {
    return accountMembership.role === 'owner';
  }
  
  return true; // Member role is satisfied by either member or owner
}

// Check if user can create more configurations
export async function canCreateConfiguration(
  accountId: string,
  db: D1Database
): Promise<boolean> {
  // Get subscription status
  const subscription = await getSubscriptionStatus(accountId, db);
  
  // Get current configuration count
  const configCount = await getConfigurationCount(accountId, db);
  
  // Check against limits
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    return configCount < 50; // Paid tier limit
  }
  
  return configCount < 3; // Free tier limit
}

// Middleware for enforcing account membership
export function requireAccountMembership(accountIdParam = 'account_id') {
  return async (request: Request, env: Env, userContext: UserContext) => {
    const url = new URL(request.url);
    const accountId = url.pathname.split('/').find(segment => 
      segment === accountIdParam
    ) || url.searchParams.get(accountIdParam);
    
    if (!accountId) {
      return new Response('Account ID is required', { status: 400 });
    }
    
    const hasAccess = await hasRoleOnAccount(userContext, accountId);
    if (!hasAccess) {
      return new Response('Access denied', { status: 403 });
    }
    
    // Continue to the handler
    return null;
  };
}

// Middleware for enforcing owner role
export function requireOwnerRole(accountIdParam = 'account_id') {
  return async (request: Request, env: Env, userContext: UserContext) => {
    const url = new URL(request.url);
    const accountId = url.pathname.split('/').find(segment => 
      segment === accountIdParam
    ) || url.searchParams.get(accountIdParam);
    
    if (!accountId) {
      return new Response('Account ID is required', { status: 400 });
    }
    
    const hasAccess = await hasRoleOnAccount(userContext, accountId, 'owner');
    if (!hasAccess) {
      return new Response('Owner role required', { status: 403 });
    }
    
    // Continue to the handler
    return null;
  };
}
```

### Subscription-Based Feature Access

Authorization also considers subscription status for feature access:

```typescript
// utils/subscription.ts
import { eq } from 'drizzle-orm';
import { billingSubscriptions } from '../db/schema';

// Check if account has access to premium features
export async function hasPremiumAccess(
  accountId: string,
  db: D1Database
): Promise<boolean> {
  const subscription = await db.query.billingSubscriptions.findFirst({
    where: eq(billingSubscriptions.account_id, accountId),
    orderBy: [{ created: 'desc' }],
  });
  
  if (!subscription) {
    return false;
  }
  
  // Active or trialing subscriptions have premium access
  return ['active', 'trialing'].includes(subscription.status);
}

// Check if account can create templates
export async function canCreateTemplates(
  accountId: string,
  db: D1Database
): Promise<boolean> {
  return await hasPremiumAccess(accountId, db);
}

// Check if account can use advanced features
export async function canUseAdvancedFeatures(
  accountId: string,
  db: D1Database
): Promise<boolean> {
  return await hasPremiumAccess(accountId, db);
}
```

## External Integrations

### Stripe Integration

Stripe integration for subscription management is implemented in the BillingDomain:

```typescript
// domains/billing/service.ts
import Stripe from 'stripe';

export async function createCheckoutSession(
  accountId: string,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string,
  env: Env
) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  
  // Check for existing customer
  let customerId = await getStripeCustomerId(accountId, env.DB);
  
  // Create customer if needed
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: customerEmail,
      metadata: { account_id: accountId }
    });
    
    customerId = customer.id;
    await storeCustomerId(accountId, customerId, customerEmail, env.DB);
  }
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { account_id: accountId }
  });
  
  return {
    session_id: session.id,
    url: session.url,
    status: 'new'
  };
}

export async function handleWebhook(
  request: Request,
  env: Env
) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.text();
  
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }
  
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  
  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
    
    // Log webhook event
    await logWebhookEvent(event, env.DB);
    
    // Process based on event type
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await processSubscriptionUpdate(event.data.object, env.DB);
        break;
      case 'customer.subscription.deleted':
        await processSubscriptionDeletion(event.data.object, env.DB);
        break;
      case 'invoice.payment_failed':
        await processPaymentFailure(event.data.object, env.DB);
        break;
    }
    
    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
```

### Beam.cloud Integration

The system integrates with Beam.cloud for deploying OpenWebUI instances:

```typescript
// domains/deployments/service.ts
import { BeamClient } from '../utils/beam-client';

export async function createDeployment(
  configId: string,
  accountId: string,
  userId: string,
  env: Env
) {
  // Get the configuration
  const config = await getConfiguration(configId, env.DB);
  
  if (!config) {
    throw new Error('Configuration not found');
  }
  
  // Transform configuration to deployment parameters
  const deploymentParams = transformConfigToDeployment(config.config_data);
  
  // Get tenant resources
  const resources = await getTenantResources(accountId, env.DB);
  
  // Prepare environment variables with tenant resource information
  const environmentVariables = prepareEnvironmentVariables(
    deploymentParams,
    resources
  );
  
  // Call Beam.cloud API to create Pod
  const beamClient = new BeamClient(env.BEAM_API_KEY);
  const pod = await beamClient.createPod({
    name: `owui-${configId.substring(0, 8)}`,
    image: "openwebui:latest",
    env: environmentVariables,
    ports: [8080],
    resources: deploymentParams.resources
  });
  
  // Store deployment record
  const deployment = await storeDeployment({
    account_id: accountId,
    config_id: configId,
    beam_pod_id: pod.id,
    status: 'pending',
    created_by: userId,
    url: null // Will be updated when active
  }, env.DB);
  
  // Monitor deployment status (background task)
  env.DEPLOYMENT_MONITOR.publish({
    deployment_id: deployment.id,
    beam_pod_id: pod.id
  });
  
  return deployment;
}

export async function monitorDeployment(
  deploymentId: string,
  beamPodId: string,
  env: Env
) {
  const beamClient = new BeamClient(env.BEAM_API_KEY);
  
  let retries = 0;
  const maxRetries = 30;
  const interval = 5000; // 5 seconds
  
  while (retries < maxRetries) {
    const pod = await beamClient.getPod(beamPodId);
    
    if (pod.status === 'running') {
      // Update deployment as active
      await updateDeploymentStatus(
        deploymentId,
        'active',
        pod.url,
        null,
        env.DB
      );
      return;
    }
    
    if (pod.status === 'failed') {
      // Update deployment as failed
      await updateDeploymentStatus(
        deploymentId,
        'failed',
        null,
        pod.error || 'Deployment failed',
        env.DB
      );
      return;
    }
    
    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, interval));
    retries++;
  }
  
  // If we've reached max retries, mark as stalled
  await updateDeploymentStatus(
    deploymentId,
    'failed',
    null,
    'Deployment timed out',
    env.DB
  );
}
```

### Cloudflare Email Workers Integration

The system uses Cloudflare Email Workers for transactional emails:

```typescript
// utils/email.ts
export async function sendInvitationEmail(
  invitationToken: string,
  recipientEmail: string,
  accountName: string,
  inviterName: string,
  role: string,
  env: Env
) {
  const inviteUrl = `${env.APP_URL}/invitations/accept?token=${invitationToken}`;
  
  return await env.EMAIL.send({
    to: recipientEmail,
    from: env.FROM_EMAIL,
    subject: `You've been invited to join ${accountName} on Leger`,
    text: `${inviterName} has invited you to join ${accountName} with the role of ${role}. Click this link to accept: ${inviteUrl}`,
    html: `
      <h2>You've been invited to join ${accountName}</h2>
      <p>${inviterName} has invited you to join ${accountName} with the role of ${role}.</p>
      <p><a href="${inviteUrl}">Click here to accept the invitation</a></p>
    `
  });
}
