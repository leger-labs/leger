# External Integration Details

This document outlines the interfaces between the Leger Worker and external services, detailing the integration points, data exchange, error handling, and implementation patterns.

## Stripe Integration

The Stripe integration handles all payment processing and subscription management. The integration is implemented within the Billing domain of the single Worker architecture.

### Customer Management

#### Creating a Stripe Customer

**Process:**
1. When a user initiates checkout, the Worker first checks if a Stripe customer exists for their account
2. If no customer exists, a new one is created via the Stripe API
3. The customer ID is stored in the `BillingCustomer` table in D1

**Data Requirements:**
- Account ID (to link customer record)
- User email (for Stripe customer creation)
- Optional metadata (account_id as metadata)

**API Calls:**
- `POST https://api.stripe.com/v1/customers`
  - Required fields: `email`
  - Optional fields: `metadata[account_id]`

**Data Storage:**
- Store `customer.id` in `BillingCustomer.id`
- Store account ID in `BillingCustomer.account_id`
- Store email in `BillingCustomer.email`
- Set provider to "stripe"

**Implementation:**
```typescript
// domains/billing/service.ts
async function getOrCreateCustomer(accountId: string, email: string) {
  // Check for existing customer
  const existingCustomer = await db.query.billingCustomers.findFirst({
    where: eq(billingCustomers.account_id, accountId)
  });
  
  if (existingCustomer) {
    return existingCustomer.id;
  }
  
  // Create new customer
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const customer = await stripe.customers.create({
    email,
    metadata: { account_id: accountId }
  });
  
  // Store customer record
  await db.insert(billingCustomers).values({
    id: customer.id,
    account_id: accountId,
    email,
    provider: 'stripe'
  });
  
  return customer.id;
}
```

### Checkout Process

#### Creating a Checkout Session

**Process:**
1. User requests a checkout session for subscription
2. Worker creates a Stripe checkout session with appropriate parameters
3. User is redirected to the Stripe-hosted checkout page
4. After payment, user is redirected back to the application

**Data Requirements:**
- Stripe customer ID (from previous step)
- Success and cancel URLs
- Subscription details (price, trial period)

**API Calls:**
- `POST https://api.stripe.com/v1/checkout/sessions`
  - Required fields:
    - `customer`: Stripe customer ID
    - `payment_method_types`: ["card"]
    - `line_items`: Array with product details
    - `mode`: "subscription"
    - `success_url`: URL to redirect after success
    - `cancel_url`: URL to redirect after cancellation

**Implementation:**
```typescript
// domains/billing/handlers.ts
async function createCheckoutSessionHandler(request: Request, env: Env, userContext: UserContext) {
  const { accountId, successUrl, cancelUrl } = await parseRequestBody(request);
  
  // Verify account access
  const hasAccess = await hasOwnerRoleOnAccount(userContext, accountId);
  if (!hasAccess) {
    return new Response('Access denied', { status: 403 });
  }
  
  try {
    // Get customer ID
    const customerId = await getOrCreateCustomer(accountId, userContext.user.email);
    
    // Create checkout session
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
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
    
    return new Response(
      JSON.stringify({
        session_id: session.id,
        url: session.url,
        status: 'new'
      }),
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

### Customer Portal

#### Creating a Customer Portal Session

**Process:**
1. User requests access to manage their subscription
2. Worker creates a Stripe customer portal session
3. User is redirected to the Stripe-hosted portal

**Data Requirements:**
- Stripe customer ID
- Return URL after portal session

**API Calls:**
- `POST https://api.stripe.com/v1/billing_portal/sessions`
  - Required fields:
    - `customer`: Stripe customer ID
    - `return_url`: URL to redirect after portal session

**Implementation:**
```typescript
// domains/billing/handlers.ts
async function createPortalSessionHandler(request: Request, env: Env, userContext: UserContext) {
  const { accountId, returnUrl } = await parseRequestBody(request);
  
  // Verify account access
  const hasAccess = await hasOwnerRoleOnAccount(userContext, accountId);
  if (!hasAccess) {
    return new Response('Access denied', { status: 403 });
  }
  
  try {
    // Get customer ID
    const customer = await db.query.billingCustomers.findFirst({
      where: eq(billingCustomers.account_id, accountId)
    });
    
    if (!customer) {
      return new Response(
        JSON.stringify({ error: 'No billing customer found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create portal session
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl
    });
    
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Stripe portal error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create portal session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

### Webhook Handling

#### Processing Subscription Events

**Process:**
1. Stripe sends webhook events to the `/billing/webhook` endpoint
2. Worker verifies the webhook signature using the webhook secret
3. Worker processes the event based on the event type
4. Worker updates subscription records accordingly

**Webhook Events Handled:**
1. `customer.subscription.created`: New subscription created
2. `customer.subscription.updated`: Subscription details updated
3. `customer.subscription.deleted`: Subscription canceled
4. `invoice.payment_succeeded`: Payment processed successfully
5. `invoice.payment_failed`: Payment failed

**Implementation:**
```typescript
// domains/billing/handlers.ts
async function webhookHandler(request: Request, env: Env) {
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }
  
  try {
    const body = await request.text();
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    
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
    console.error('Webhook processing error:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
```

**Subscription Update Processing:**
```typescript
// domains/billing/service.ts
async function processSubscriptionUpdate(subscription, db) {
  // Find related customer to get account ID
  const customer = await db.query.billingCustomers.findFirst({
    where: eq(billingCustomers.id, subscription.customer)
  });
  
  if (!customer) {
    console.error('Customer not found for subscription', subscription.id);
    return;
  }
  
  // Calculate trial remaining days
  let trialRemainingDays = null;
  if (subscription.trial_end) {
    const now = Math.floor(Date.now() / 1000);
    trialRemainingDays = Math.max(0, Math.floor((subscription.trial_end - now) / 86400));
  }
  
  // Create or update subscription record
  await db.transaction(async (tx) => {
    // Check for existing subscription
    const existingSubscription = await tx.query.billingSubscriptions.findFirst({
      where: eq(billingSubscriptions.id, subscription.id)
    });
    
    if (existingSubscription) {
      // Update existing subscription
      await tx
        .update(billingSubscriptions)
        .set({
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          trial_end: subscription.trial_end 
            ? new Date(subscription.trial_end * 1000).toISOString() 
            : null,
          trial_remaining_days: trialRemainingDays
        })
        .where(eq(billingSubscriptions.id, subscription.id));
    } else {
      // Create new subscription record
      await tx.insert(billingSubscriptions).values({
        id: subscription.id,
        account_id: customer.account_id,
        billing_customer_id: customer.id,
        status: subscription.status,
        tier: 'standard',
        plan_name: 'Leger Standard',
        cancel_at_period_end: subscription.cancel_at_period_end,
        created: new Date(subscription.created * 1000).toISOString(),
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_start: subscription.trial_start 
          ? new Date(subscription.trial_start * 1000).toISOString() 
          : null,
        trial_end: subscription.trial_end 
          ? new Date(subscription.trial_end * 1000).toISOString() 
          : null,
        trial_remaining_days: trialRemainingDays,
        provider: 'stripe'
      });
    }
  });
}
```

## Cloudflare Email Workers Integration

The system uses Cloudflare Email Workers for all email communications:

### Email Templates and Sending

**Process:**
1. Various system events trigger email notifications
2. The Worker generates the email content with appropriate templates
3. Cloudflare Email Workers delivers the email

**Implementation:**
```typescript
// domains/accounts/service.ts
async function sendInvitationEmail(
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
```

**Email Types:**
1. **Invitation Emails**: When users are invited to accounts
2. **Trial Status Emails**: When trial is ending
3. **Subscription Status Emails**: When subscription status changes
4. **Deployment Status Emails**: When deployments complete or fail

### Request Flow Architecture

The request flow between components follows this pattern:

1. **Client Request**: Worker receives deployment request with configuration ID
2. **Configuration Retrieval**: Worker fetches configuration data from D1
3. **Parameter Transformation**: Worker transforms configuration to deployment parameters
4. **Direct SDK Invocation**: Worker uses Cloudflare Workers Python to invoke Beam.cloud SDK directly
5. **Deployment Creation**: Beam.cloud creates pod with specified parameters
6. **Status Tracking**: Worker initiates background status monitoring
7. **Result Communication**: Deployment status updates communicated to client

This streamlined flow ensures reliable deployment while providing appropriate status visibility.

### Configuration Transformation Strategy

The transformation of Leger configurations to Beam.cloud deployment parameters follows a structured approach:

1. **Schema-Based Mapping**: Explicit mapping between configuration schema and deployment parameters
2. **Environment Variable Generation**: Configuration properties converted to environment variables
3. **Secret Reference Substitution**: Sensitive values replaced with Beam.cloud secret references
4. **Resource Calculation**: Compute resources determined based on configuration complexity
5. **Validation Gates**: Multi-stage validation ensures deployable configuration

This transformation strategy ensures configurations are properly prepared for deployment while maintaining security.

### Deployment Monitoring Architecture

The deployment monitoring system implements a robust approach:

1. **Status Polling**: Regular polling of deployment status with appropriate intervals
2. **Event-Based Updates**: Status changes communicated through worker events
3. **Log Capture**: Deployment logs captured and stored for troubleshooting
4. **Health Verification**: Deployed services verified for proper health
5. **Alerting Integration**: Critical status changes trigger appropriate alerts

This monitoring architecture provides visibility throughout the deployment lifecycle.

### Error Handling Strategy

Error handling for Beam.cloud integration follows a comprehensive approach:

1. **Error Classification**: Errors categorized by source and recoverability
2. **Detailed Logging**: Rich context captured for deployment failures
3. **User Communication**: Clear, actionable error messages for users
4. **Recovery Procedures**: Documented recovery paths for common failure modes
5. **Automatic Retries**: Selective retries for transient failures

This strategy ensures users receive appropriate information while maximizing deployment success rates.

## Beam.cloud Integration

The system integrates with Beam.cloud for deploying OpenWebUI instances:

### Pod Deployment

**Process:**
1. User initiates deployment of a configuration
2. Worker transforms configuration to Pod parameters
3. Worker calls Beam.cloud API to create a Pod
4. Worker monitors Pod status until active or failed

**Implementation:**
```typescript
// domains/deployments/service.ts
async function createDeployment(
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
  
  // Get tenant resources for environment variables
  const resources = await getTenantResources(accountId, env.DB);
  const environmentVariables = prepareEnvironmentVariables(
    deploymentParams,
    resources
  );
  
  // Create deployment record in pending state
  const deployment = await createDeploymentRecord({
    account_id: accountId,
    config_id: configId,
    status: 'pending',
    created_by: userId
  }, env.DB);
  
  // Call Beam.cloud API to create Pod
  try {
    const response = await fetch(`${env.BEAM_API_URL}/pods`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.BEAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `owui-${configId.substring(0, 8)}`,
        image: "openwebui/openwebui:latest",
        env: environmentVariables,
        ports: [8080],
        cpu: deploymentParams.cpu || 2,
        memory: deploymentParams.memory || "8Gi",
        gpu: deploymentParams.gpu || null
      })
    });
    
    if (!response.ok) {
      throw new Error(`Beam API error: ${response.status}`);
    }
    
    const pod = await response.json();
    
    // Update deployment with pod ID
    await updateDeploymentRecord(
      deployment.id,
      {
        beam_pod_id: pod.id,
        metadata: { pod_details: pod }
      },
      env.DB
    );
    
    // Schedule status monitoring
    env.DEPLOYMENT_QUEUE.send({
      deployment_id: deployment.id,
      beam_pod_id: pod.id
    });
    
    return deployment;
  } catch (error) {
    // Mark deployment as failed
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

### Pod Status Monitoring

**Process:**
1. Worker sends status check to a background queue
2. Queue processor periodically checks Pod status
3. When status changes to active or failed, deployment record is updated

**Implementation:**
```typescript
// workers/deployment-monitor.ts
export default {
  async fetch(request, env) {
    return new Response('Deployment Monitor Worker');
  },
  
  async queue(batch, env) {
    for (const message of batch.messages) {
      const { deployment_id, beam_pod_id } = message.body;
      await monitorDeployment(deployment_id, beam_pod_id, env);
    }
  }
};

async function monitorDeployment(deploymentId, beamPodId, env) {
  try {
    // Check pod status
    const response = await fetch(`${env.BEAM_API_URL}/pods/${beamPodId}`, {
      headers: {
        'Authorization': `Bearer ${env.BEAM_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Beam API error: ${response.status}`);
    }
    
    const
```

## Secret Management Architecture

Secret management across integration points follows a comprehensive architecture:

### Secret Storage Strategy

The secret storage approach emphasizes security and accessibility:

1. **Layered Storage**: Secrets stored in both Cloudflare KV and Beam.cloud secret storage
2. **Encryption at Rest**: Secrets encrypted before storage in Cloudflare KV
3. **Namespace Isolation**: Tenant-specific secrets stored in isolated namespaces
4. **Access Control**: Strict access controls for secret retrieval
5. **Audit Logging**: All secret access logged for security monitoring

### Secret Synchronization Pattern

Secret synchronization between systems follows a consistent pattern:

1. **Source of Truth**: Cloudflare KV serves as the primary source of truth
2. **Immediate Propagation**: Secret changes immediately synchronized to Beam.cloud
3. **Verification Process**: Synchronization confirmed through verification checks
4. **Conflict Resolution**: Clear procedure for resolving synchronization conflicts
5. **Failure Recovery**: Automated recovery from synchronization failures

### Secret Reference Strategy

Secret usage employs a reference-based approach:

1. **Indirect References**: Configurations refer to secrets by name rather than value
2. **Just-in-Time Resolution**: Secret references resolved only during deployment
3. **Scoped Access**: References limited to appropriate tenant context
4. **Reference Validation**: Secret references validated before deployment
5. **Reference Lifecycle**: Clear processes for handling stale references

This secret management architecture ensures sensitive information remains secure while being available for legitimate use.

## Integration Testing Architecture

The application implements a comprehensive testing architecture for external integrations:

### Testing Layers

Integration testing occurs at multiple layers:

1. **Unit Testing**: Integration adapters tested with mock dependencies
2. **Contract Testing**: API contracts verified through automated tests
3. **Integration Testing**: End-to-end tests against staging environments
4. **Production Verification**: Synthetic transactions in production environment

### Mock Service Pattern

For development and testing, mock services follow a consistent pattern:

1. **API Compatibility**: Mocks implement the same interface as real services
2. **Configurable Behavior**: Failure modes and edge cases can be simulated
3. **Response Recording**: Real service responses recorded for replay in tests
4. **Environment Detection**: Integration layer automatically uses mocks in test environments

### Integration Test Data Management

Test data for integrations follows a structured approach:

1. **Data Isolation**: Test data isolated from production data
2. **Reproducible Datasets**: Standard test datasets for consistent testing
3. **Data Cleanup**: Automatic cleanup of test data after test execution
4. **State Reset**: Ability to reset integration state for clean test runs

This testing architecture ensures integrations remain reliable across changes and environments.

## Observability Architecture

The integration points include comprehensive observability capabilities:

### Monitoring Components

The monitoring architecture includes several key components:

1. **Health Metrics**: Standard health indicators for each integration
2. **Performance Metrics**: Response times and throughput measurements
3. **Error Rates**: Tracking of success and failure rates
4. **Dependency Status**: Visibility into external service health
5. **Resource Utilization**: Usage metrics for controlled resources

### Logging Strategy

The logging approach provides comprehensive visibility:

1. **Structured Logging**: All logs follow consistent structure with rich metadata
2. **Context Propagation**: Request context propagated through integration points
3. **Sensitive Data Handling**: PII and secrets automatically redacted from logs
4. **Log Levels**: Appropriate verbosity based on operational needs
5. **Correlation IDs**: Unique identifiers to trace requests across systems

### Alerting Framework

The alerting system follows a thoughtful approach:

1. **Alert Thresholds**: Carefully calibrated thresholds to minimize false positives
2. **Alert Severity**: Clear severity levels with appropriate escalation paths
3. **Alert Grouping**: Related alerts grouped to reduce notification fatigue
4. **Alert Context**: Rich context included with alerts for faster diagnosis
5. **Alert Verification**: Automatic verification before triggering alerts

This observability architecture ensures operational visibility while minimizing unnecessary noise.

## Integration Documentation Strategy

The application maintains comprehensive integration documentation:

### Developer Documentation

Documentation for developers includes:

1. **Integration Overview**: High-level description of each integration's purpose
2. **API Reference**: Detailed interface documentation with request/response formats
3. **Authentication Guide**: Step-by-step setup instructions for credentials
4. **Code Examples**: Working examples of common integration scenarios
5. **Troubleshooting Guide**: Solutions for common integration issues

### Operational Documentation

Documentation for operations includes:

1. **Dependency Map**: Visual representation of integration dependencies
2. **Health Verification**: Procedures for verifying integration health
3. **Failure Recovery**: Step-by-step recovery procedures for common failures
4. **Scaling Considerations**: Guidance on scaling integration components
5. **Performance Tuning**: Recommendations for optimizing integration performance

This documentation strategy ensures both developers and operators can work effectively with the integrations.
