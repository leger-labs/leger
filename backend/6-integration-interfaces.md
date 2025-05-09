# External Integration Details

## Stripe Integration

The Stripe integration is a critical component of the Leger system, handling all payment processing and subscription management. This section documents the integration points, data exchange, webhook handling, and error management for Stripe.

### Customer Management

#### Creating a Stripe Customer

**Process:**
1. When a user initiates checkout, the system first checks if a Stripe customer exists for their account
2. If no customer exists, a new one is created via the Stripe API
3. The customer ID is stored in the `BillingCustomer` table

**Data Requirements:**
- Account ID (to link customer record)
- User email (for Stripe customer creation)
- Optional metadata (user_id as metadata)

**API Calls:**
- `POST https://api.stripe.com/v1/customers`
  - Required fields: `email`
  - Optional fields: `metadata[user_id]`

**Data Storage:**
- Store `customer.id` in `BillingCustomer.id`
- Store account ID in `BillingCustomer.account_id`
- Store email in `BillingCustomer.email`
- Set provider to "stripe"

**Error Handling:**
- Retry logic for network failures
- Fallback to manual setup if customer creation fails

### Checkout Process

#### Creating a Checkout Session

**Process:**
1. User requests a checkout session for subscription
2. System creates a Stripe checkout session with appropriate parameters
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
  - Optional fields:
    - `subscription_data.trial_period_days`: 14 (for trial)
    - `metadata.user_id`: User ID for tracking

**Response Handling:**
- Store `session.id` for reference
- Return `session.url` to redirect user

**Error Handling:**
- Display clear error messages for any Stripe errors
- Log detailed errors for troubleshooting

### Customer Portal

#### Creating a Customer Portal Session

**Process:**
1. User requests access to manage their subscription
2. System creates a Stripe customer portal session
3. User is redirected to the Stripe-hosted portal

**Data Requirements:**
- Stripe customer ID
- Return URL after portal session

**API Calls:**
- `POST https://api.stripe.com/v1/billing_portal/sessions`
  - Required fields:
    - `customer`: Stripe customer ID
    - `return_url`: URL to redirect after portal session
  - Optional fields:
    - `configuration`: Portal configuration ID if custom

**Response Handling:**
- Return `session.url` to redirect user

**Error Handling:**
- Display appropriate error if customer record not found
- Log detailed errors for troubleshooting

### Webhook Handling

#### Processing Subscription Events

**Process:**
1. Stripe sends webhook events to the `/api/billing/webhook` endpoint
2. System verifies the webhook signature using the webhook secret
3. System processes the event based on the event type
4. System updates subscription records accordingly

**Webhook Events Handled:**
1. `customer.subscription.created`: New subscription created
2. `customer.subscription.updated`: Subscription details updated
3. `customer.subscription.deleted`: Subscription canceled
4. `invoice.payment_succeeded`: Payment processed successfully
5. `invoice.payment_failed`: Payment failed

**Webhook Signature Verification:**
- Extract `stripe-signature` header from request
- Verify signature using Stripe webhook secret
- Reject requests with invalid signatures

**Event Processing:**
- Extract subscription ID and customer ID from event
- Look up the account associated with the customer
- Update subscription status and details in the database
- Log the webhook event for audit purposes

**Error Handling:**
- Return 200 response even for processing errors (to prevent retries)
- Log detailed errors for troubleshooting
- Implement idempotency to handle duplicate events

### Subscription Data Model

The system stores a complete record of subscription information from Stripe:

**Subscription Status Values:**
- `active`: Subscription is active and paid
- `trialing`: In trial period
- `past_due`: Payment failed but subscription still active
- `canceled`: Subscription canceled
- `incomplete`: Initial payment failed
- `incomplete_expired`: Initial payment failed and expired

**Subscription Fields Synchronized:**
- `status`: Current status of subscription
- `current_period_start`: Start of current billing period
- `current_period_end`: End of current billing period
- `cancel_at_period_end`: Whether subscription will cancel at period end
- `trial_start`: Start of trial period (if applicable)
- `trial_end`: End of trial period (if applicable)
- `trial_remaining_days`: Calculated days remaining in trial

### Error Management

**Common Stripe Errors and Handling:**
1. `card_declined`: Inform user their card was declined
2. `expired_card`: Prompt user to update payment method
3. `incorrect_cvc`: Request card verification code
4. `processing_error`: Suggest trying again later
5. `rate_limit`: Implement exponential backoff
6. `invalid_request_error`: Log detailed error for developer investigation

**Webhook Processing Errors:**
1. Log full event data for debugging
2. Continue processing other events if one fails
3. Implement an error recovery mechanism for critical events

## Email Integration

Email functionality will transition to Cloudflare Email Workers. The current system uses email for:

### Invitation Emails

**Process:**
1. When an invitation is created, an email is sent to the invitee
2. Email contains a unique invitation link with the token
3. Invitee clicks the link to accept the invitation

**Data Requirements:**
- Recipient email address
- Invitation token
- Account name
- Inviter name

**Email Content:**
- Subject: "You've been invited to join [Account Name] on Leger"
- Body includes:
  - Inviter's name
  - Account name
  - Role being offered
  - Expiration information (if applicable)
  - Call to action button with invitation link

### Password Reset Emails

**Process:**
1. User requests password reset
2. System generates reset token
3. Email with reset link is sent to user
4. User clicks link and sets new password

**Data Requirements:**
- Recipient email address
- Reset token
- Expiration time

**Email Content:**
- Subject: "Reset your Leger password"
- Body includes:
  - Reset instructions
  - Reset link with token
  - Expiration information
  - Security notice about ignoring if not requested

### Subscription Status Emails

**Process:**
1. System sends emails for important subscription events
2. Emails include information about subscription status and actions needed

**Email Types:**
1. Trial started
2. Trial ending soon (3 days before expiration)
3. Subscription activated
4. Payment failed
5. Subscription canceled
6. Subscription renewed

**Data Requirements:**
- Recipient email address
- Subscription details
- Account name
- Action links (like update payment method)

## Upstash Redis Integration

Redis is used for caching and performance optimization. The key integration points are:

### Session Caching

**Use Case:**
- Caching user session data to reduce database load

**Data Structure:**
- Key: `session:{user_id}`
- Value: Session data JSON
- TTL: 60 minutes (matching JWT expiration)

### Configuration Caching

**Use Case:**
- Caching frequently accessed configurations

**Data Structure:**
- Key: `config:{config_id}`
- Value: Configuration data JSON
- TTL: 5 minutes
- Invalidated on update

### Rate Limiting

**Use Case:**
- Preventing abuse of API endpoints

**Data Structure:**
- Key: `ratelimit:{ip}:{endpoint}`
- Value: Counter
- TTL: Varies by endpoint (typically 1-5 minutes)

**Limits:**
- Health check: 60 requests per minute
- Authentication endpoints: 10 requests per minute
- General API endpoints: 30 requests per minute

### Feature Flag Caching

**Use Case:**
- Storing and quickly retrieving feature flags

**Data Structure:**
- Key: `feature:{feature_name}`
- Value: Boolean or JSON configuration
- No expiration (manually invalidated)

## Fly.io Integration for Beam.cloud

The system integrates with Fly.io as a bridge to Beam.cloud for specific processing tasks:

### API Integration

**Process:**
1. System sends requests to Fly.io endpoint
2. Fly.io forwards to Beam.cloud
3. Results are returned to the system

**API Endpoints:**
- `POST https://fly-instance.fly.dev/process` - Generic processing endpoint
- `POST https://fly-instance.fly.dev/analyze` - Data analysis endpoint

**Authentication:**
- API key authentication in headers
- Rate limiting implemented on Fly.io side

**Data Exchange:**
- Request: JSON payload with processing instructions
- Response: JSON result data or error message

**Error Handling:**
- Timeout handling (30 second maximum)
- Retry logic for transient errors
- Circuit breaker pattern for persistent failures
