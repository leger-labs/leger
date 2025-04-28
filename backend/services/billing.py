"""
Stripe Billing API implementation for Leger on top of Basejump.
Implements a simplified subscription model with a single paid tier and 14-day trial.

To test locally:
stripe listen --forward-to localhost:8000/api/billing/webhook
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Optional, Dict, Any, List, Tuple
import stripe
from datetime import datetime, timezone, timedelta
from utils.logger import logger
from utils.config import config, EnvMode
from services.supabase import DBConnection
from utils.auth_utils import get_current_user_id_from_jwt
from pydantic import BaseModel, Field

# Initialize Stripe
stripe.api_key = config.STRIPE_SECRET_KEY

# Initialize router
router = APIRouter(prefix="/billing", tags=["billing"])

# Leger's single subscription tier configuration
SUBSCRIPTION_TIER = {
    'name': 'standard',
    'price': 99,  # $99/month
    'trial_days': 14,
}

# Pydantic models for request/response validation
class CreateCheckoutSessionRequest(BaseModel):
    success_url: str
    cancel_url: str

class CreatePortalSessionRequest(BaseModel):
    return_url: str

class SubscriptionStatus(BaseModel):
    status: str  # e.g., 'active', 'trialing', 'past_due', 'no_subscription'
    plan_name: Optional[str] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False
    trial_end: Optional[datetime] = None
    trial_remaining_days: Optional[int] = None
    created_at: Optional[datetime] = None

# Helper functions
async def get_stripe_customer_id(client, user_id: str) -> Optional[str]:
    """Get the Stripe customer ID for a user."""
    result = await client.schema('basejump').from_('billing_customers') \
        .select('id') \
        .eq('account_id', user_id) \
        .execute()
    
    if result.data and len(result.data) > 0:
        return result.data[0]['id']
    return None

async def create_stripe_customer(client, user_id: str, email: str) -> str:
    """Create a new Stripe customer for a user."""
    # Create customer in Stripe
    customer = stripe.Customer.create(
        email=email,
        metadata={"user_id": user_id}
    )
    
    # Store customer ID in Supabase
    await client.schema('basejump').from_('billing_customers').insert({
        'id': customer.id,
        'account_id': user_id,
        'email': email,
        'provider': 'stripe'
    }).execute()
    
    return customer.id

async def get_user_subscription(user_id: str) -> Optional[Dict]:
    """Get the current subscription for a user from Stripe."""
    try:
        # Get customer ID
        db = DBConnection()
        client = await db.client
        customer_id = await get_stripe_customer_id(client, user_id)
        
        if not customer_id:
            return None
            
        # Get all active subscriptions for the customer
        subscriptions = stripe.Subscription.list(
            customer=customer_id,
            status='active'
        )
        
        # Check if we have any subscriptions
        if not subscriptions or not subscriptions.get('data'):
            return None
            
        # Filter subscriptions to only include our product's subscriptions
        our_subscriptions = []
        for sub in subscriptions['data']:
            # Get the first subscription item
            if sub.get('items') and sub['items'].get('data') and len(sub['items']['data']) > 0:
                item = sub['items']['data'][0]
                if item.get('price') and item['price'].get('product') == config.STRIPE_PRODUCT_ID:
                    our_subscriptions.append(sub)
        
        if not our_subscriptions:
            return None
            
        # If there are multiple active subscriptions, we need to handle this
        if len(our_subscriptions) > 1:
            logger.warning(f"User {user_id} has multiple active subscriptions: {[sub['id'] for sub in our_subscriptions]}")
            
            # Get the most recent subscription
            most_recent = max(our_subscriptions, key=lambda x: x['created'])
            
            # Cancel all other subscriptions
            for sub in our_subscriptions:
                if sub['id'] != most_recent['id']:
                    try:
                        stripe.Subscription.modify(
                            sub['id'],
                            cancel_at_period_end=True
                        )
                        logger.info(f"Cancelled subscription {sub['id']} for user {user_id}")
                    except Exception as e:
                        logger.error(f"Error cancelling subscription {sub['id']}: {str(e)}")
            
            return most_recent
            
        return our_subscriptions[0]
        
    except Exception as e:
        logger.error(f"Error getting subscription from Stripe: {str(e)}")
        return None

async def check_billing_status(client, user_id: str) -> Tuple[bool, str, Optional[Dict]]:
    """
    Check if a user has an active subscription or is in trial period.
    
    Returns:
        Tuple[bool, str, Optional[Dict]]: (can_access, message, subscription_info)
    """
    if config.ENV_MODE == EnvMode.LOCAL:
        logger.info("Running in local development mode - billing checks are disabled")
        return True, "Local development mode - billing disabled", {
            "plan_name": "Local Development",
            "status": "active"
        }
    
    # Get current subscription
    subscription = await get_user_subscription(user_id)
    
    # If no subscription, they can use free trial
    if not subscription:
        # Check if they've had a subscription before
        previous_sub = await client.schema('basejump').from_('billing_subscriptions') \
            .select('*') \
            .eq('account_id', user_id) \
            .order('created', desc=True) \
            .limit(1) \
            .execute()
        
        if previous_sub.data and len(previous_sub.data) > 0:
            # User had a subscription before, but canceled
            return False, "Your subscription has ended. Please subscribe to access the service.", None
        
        # New user - they get a free trial
        return True, "Free trial active", {
            "status": "trialing",
            "plan_name": "Trial",
            "trial_remaining_days": SUBSCRIPTION_TIER['trial_days']
        }
    
    # User has a subscription
    status = subscription.get('status')
    
    if status == 'active':
        return True, "Subscription active", subscription
    elif status == 'trialing':
        # Calculate remaining trial days
        trial_end = subscription.get('trial_end')
        if trial_end:
            trial_end_date = datetime.fromtimestamp(trial_end, tz=timezone.utc)
            now = datetime.now(timezone.utc)
            remaining_days = (trial_end_date - now).days
            
            return True, f"Trial active with {remaining_days} days remaining", {
                **subscription,
                "trial_remaining_days": remaining_days
            }
    elif status in ['past_due', 'incomplete', 'incomplete_expired']:
        return False, "There is an issue with your payment. Please update your payment method.", subscription
    elif status == 'canceled':
        return False, "Your subscription has been canceled. Please subscribe to access the service.", subscription
    
    # Any other status
    return False, f"Subscription status: {status}", subscription

# API endpoints
@router.post("/create-checkout-session")
async def create_checkout_session(
    request: CreateCheckoutSessionRequest,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """Create a Stripe Checkout session for the fixed subscription plan."""
    try:
        # Get Supabase client
        db = DBConnection()
        client = await db.client
        
        # Get user email from auth.users
        user_result = await client.auth.admin.get_user_by_id(current_user_id)
        if not user_result: 
            raise HTTPException(status_code=404, detail="User not found")
        email = user_result.user.email
        
        # Get or create Stripe customer
        customer_id = await get_stripe_customer_id(client, current_user_id)
        if not customer_id: 
            customer_id = await create_stripe_customer(client, current_user_id, email)
        
        # Get the current subscription (if any)
        existing_subscription = await get_user_subscription(current_user_id)
        
        if existing_subscription:
            # User already has a subscription - redirect to portal
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=request.success_url
            )
            
            return {
                "url": session.url,
                "status": "existing_subscription",
                "message": "You already have a subscription. Redirecting to customer portal."
            }
        
        # Create a new subscription checkout session
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product': config.STRIPE_PRODUCT_ID,
                    'recurring': {
                        'interval': 'month'
                    },
                    'unit_amount': SUBSCRIPTION_TIER['price'] * 100,  # Convert to cents
                },
                'quantity': 1
            }],
            mode='subscription',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            metadata={
                'user_id': current_user_id
            },
            subscription_data={
                'trial_period_days': SUBSCRIPTION_TIER['trial_days']
            }
        )
        
        return {"session_id": session.id, "url": session.url, "status": "new"}
        
    except Exception as e:
        logger.exception(f"Error creating checkout session: {str(e)}")
        # Check if it's a Stripe error with more details
        if hasattr(e, 'json_body') and e.json_body and 'error' in e.json_body:
            error_detail = e.json_body['error'].get('message', str(e))
        else:
            error_detail = str(e)
        raise HTTPException(status_code=500, detail=f"Error creating checkout session: {error_detail}")

@router.post("/create-portal-session")
async def create_portal_session(
    request: CreatePortalSessionRequest,
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """Create a Stripe Customer Portal session for subscription management."""
    try:
        # Get Supabase client
        db = DBConnection()
        client = await db.client
        
        # Get customer ID
        customer_id = await get_stripe_customer_id(client, current_user_id)
        if not customer_id:
            raise HTTPException(status_code=404, detail="No billing customer found")
        
        # Ensure the portal configuration has subscription_update enabled
        try:
            # Check if we have a configuration that already enables subscription update
            configurations = stripe.billing_portal.Configuration.list(limit=100)
            active_config = None
            
            # Look for a configuration with subscription_update enabled
            for config_item in configurations.get('data', []):
                features = config_item.get('features', {})
                subscription_update = features.get('subscription_update', {})
                if subscription_update.get('enabled', False):
                    active_config = config_item
                    logger.info(f"Found existing portal configuration with subscription_update enabled: {config_item['id']}")
                    break
            
            # If no config with subscription_update found, create one or update the active one
            if not active_config:
                # Find the active configuration or create a new one
                if configurations.get('data', []):
                    default_config = configurations['data'][0]
                    logger.info(f"Updating default portal configuration: {default_config['id']} to enable subscription_update")
                    
                    active_config = stripe.billing_portal.Configuration.update(
                        default_config['id'],
                        features={
                            'subscription_update': {
                                'enabled': True,
                                'proration_behavior': 'create_prorations',
                                'default_allowed_updates': ['price']
                            },
                            'customer_update': default_config.get('features', {}).get('customer_update', {'enabled': True, 'allowed_updates': ['email', 'address']}),
                            'invoice_history': {'enabled': True},
                            'payment_method_update': {'enabled': True}
                        }
                    )
                else:
                    # Create a new configuration with subscription_update enabled
                    logger.info("Creating new portal configuration with subscription_update enabled")
                    active_config = stripe.billing_portal.Configuration.create(
                        business_profile={
                            'headline': 'Subscription Management',
                            'privacy_policy_url': config.FRONTEND_URL + '/privacy',
                            'terms_of_service_url': config.FRONTEND_URL + '/terms'
                        },
                        features={
                            'subscription_update': {
                                'enabled': True,
                                'proration_behavior': 'create_prorations',
                                'default_allowed_updates': ['price']
                            },
                            'customer_update': {
                                'enabled': True,
                                'allowed_updates': ['email', 'address']
                            },
                            'invoice_history': {'enabled': True},
                            'payment_method_update': {'enabled': True}
                        }
                    )
            
            # Log the active configuration for debugging
            logger.info(f"Using portal configuration: {active_config['id']} with subscription_update: {active_config.get('features', {}).get('subscription_update', {}).get('enabled', False)}")
        
        except Exception as config_error:
            logger.warning(f"Error configuring portal: {config_error}. Continuing with default configuration.")
        
        # Create portal session using the proper configuration if available
        portal_params = {
            "customer": customer_id,
            "return_url": request.return_url
        }
        
        # Add configuration_id if we found or created one with subscription_update enabled
        if active_config:
            portal_params["configuration"] = active_config['id']
        
        # Create the session
        session = stripe.billing_portal.Session.create(**portal_params)
        
        return {"url": session.url}
        
    except Exception as e:
        logger.error(f"Error creating portal session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/subscription")
async def get_subscription(
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """Get the current subscription status for the current user."""
    try:
        # Get Supabase client
        db = DBConnection()
        client = await db.client
        
        # Get subscription from Stripe
        subscription = await get_user_subscription(current_user_id)
        
        if not subscription:
            # Check if they've had a subscription before
            previous_sub = await client.schema('basejump').from_('billing_subscriptions') \
                .select('*') \
                .eq('account_id', current_user_id) \
                .order('created', desc=True) \
                .limit(1) \
                .execute()
            
            if previous_sub.data and len(previous_sub.data) > 0:
                # User had a subscription before, but canceled
                return SubscriptionStatus(
                    status="no_subscription",
                    plan_name="None"
                )
            
            # New user - they get a free trial
            # Calculate when the trial would end (14 days from now)
            trial_end = datetime.now(timezone.utc) + timedelta(days=SUBSCRIPTION_TIER['trial_days'])
            
            return SubscriptionStatus(
                status="trialing",
                plan_name="Trial",
                trial_end=trial_end,
                trial_remaining_days=SUBSCRIPTION_TIER['trial_days']
            )
        
        # Extract current plan details
        status = subscription.get('status')
        created_at = datetime.fromtimestamp(subscription.get('created'), tz=timezone.utc) if subscription.get('created') else None
        trial_end = datetime.fromtimestamp(subscription.get('trial_end'), tz=timezone.utc) if subscription.get('trial_end') else None
        current_period_end = datetime.fromtimestamp(subscription.get('current_period_end'), tz=timezone.utc) if subscription.get('current_period_end') else None
        cancel_at_period_end = subscription.get('cancel_at_period_end', False)
        
        # Calculate trial remaining days
        trial_remaining_days = None
        if status == 'trialing' and trial_end:
            now = datetime.now(timezone.utc)
            remaining_days = max(0, (trial_end - now).days)
            trial_remaining_days = remaining_days
        
        return SubscriptionStatus(
            status=status,
            plan_name=SUBSCRIPTION_TIER['name'],
            current_period_end=current_period_end,
            cancel_at_period_end=cancel_at_period_end,
            trial_end=trial_end,
            trial_remaining_days=trial_remaining_days,
            created_at=created_at
        )
        
    except Exception as e:
        logger.exception(f"Error getting subscription status for user {current_user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving subscription status.")

@router.get("/check-status")
async def check_status(
    current_user_id: str = Depends(get_current_user_id_from_jwt)
):
    """Check if the user has an active subscription or trial."""
    try:
        # Get Supabase client
        db = DBConnection()
        client = await db.client
        
        can_access, message, subscription = await check_billing_status(client, current_user_id)
        
        return {
            "can_access": can_access,
            "message": message,
            "subscription": subscription
        }
        
    except Exception as e:
        logger.error(f"Error checking billing status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events for subscription lifecycle."""
    try:
        # Get the webhook secret from config
        webhook_secret = config.STRIPE_WEBHOOK_SECRET
        
        # Get the webhook payload
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        # Verify webhook signature
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle the event
        event_type = event.get('type')
        
        if event_type.startswith('customer.subscription.'):
            # Get the subscription object
            subscription = event.get('data', {}).get('object', {})
            subscription_id = subscription.get('id')
            customer_id = subscription.get('customer')
            
            if not subscription_id or not customer_id:
                logger.error(f"Missing subscription_id or customer_id in webhook event: {event_type}")
                return {"status": "error", "message": "Missing required data"}
            
            # Get user and account ID from customer
            db = DBConnection()
            client = await db.client
            customer_result = await client.schema('basejump').from_('billing_customers') \
                .select('account_id') \
                .eq('id', customer_id) \
                .execute()
            
            if not customer_result.data or len(customer_result.data) == 0:
                logger.error(f"Customer {customer_id} not found")
                return {"status": "error", "message": "Customer not found"}
            
            account_id = customer_result.data[0]['account_id']
            
            # Get subscription data
            status = subscription.get('status')
            current_period_start = datetime.fromtimestamp(subscription.get('current_period_start'), tz=timezone.utc) if subscription.get('current_period_start') else None
            current_period_end = datetime.fromtimestamp(subscription.get('current_period_end'), tz=timezone.utc) if subscription.get('current_period_end') else None
            cancel_at_period_end = subscription.get('cancel_at_period_end', False)
            trial_start = datetime.fromtimestamp(subscription.get('trial_start'), tz=timezone.utc) if subscription.get('trial_start') else None
            trial_end = datetime.fromtimestamp(subscription.get('trial_end'), tz=timezone.utc) if subscription.get('trial_end') else None
            
            # Calculate trial remaining days
            trial_remaining_days = None
            if status == 'trialing' and trial_end:
                now = datetime.now(timezone.utc)
                remaining_days = max(0, (trial_end - now).days)
                trial_remaining_days = remaining_days

            # Prepare metadata
            metadata = subscription.get('metadata', {})
            
            # Handle different event types
            if event_type == 'customer.subscription.created':
                # New subscription created
                logger.info(f"New subscription {subscription_id} created for account {account_id}")
                
                # Insert subscription to database
                await client.schema('basejump').from_('billing_subscriptions').insert({
                    'id': subscription_id,
                    'account_id': account_id,
                    'billing_customer_id': customer_id,
                    'status': status,
                    'tier': SUBSCRIPTION_TIER['name'],
                    'plan_name': SUBSCRIPTION_TIER['name'],
                    'cancel_at_period_end': cancel_at_period_end,
                    'created': subscription.get('created'),
                    'current_period_start': current_period_start,
                    'current_period_end': current_period_end,
                    'trial_start': trial_start,
                    'trial_end': trial_end,
                    'trial_remaining_days': trial_remaining_days,
                    'metadata': metadata,
                    'provider': 'stripe'
                }).execute()
                
            elif event_type == 'customer.subscription.updated':
                # Subscription updated
                logger.info(f"Subscription {subscription_id} updated for account {account_id}")
                
                # Update subscription in database
                await client.schema('basejump').from_('billing_subscriptions').upsert({
                    'id': subscription_id,
                    'account_id': account_id,
                    'billing_customer_id': customer_id,
                    'status': status,
                    'tier': SUBSCRIPTION_TIER['name'],
                    'plan_name': SUBSCRIPTION_TIER['name'],
                    'cancel_at_period_end': cancel_at_period_end,
                    'current_period_start': current_period_start,
                    'current_period_end': current_period_end,
                    'trial_start': trial_start,
                    'trial_end': trial_end,
                    'trial_remaining_days': trial_remaining_days,
                    'metadata': metadata,
                    'provider': 'stripe'
                }).execute()
                
            elif event_type == 'customer.subscription.deleted':
                # Subscription deleted/canceled
                logger.info(f"Subscription {subscription_id} deleted for account {account_id}")
                
                # Mark as canceled in database
                await client.schema('basejump').from_('billing_subscriptions').update({
                    'status': 'canceled',
                    'cancel_at_period_end': True,
                    'canceled_at': datetime.now(timezone.utc)
                }).eq('id', subscription_id).execute()
        
        # Other webhook events (payment success, failure, etc.)
        elif event_type.startswith('invoice.'):
            invoice = event.get('data', {}).get('object', {})
            subscription_id = invoice.get('subscription')
            customer_id = invoice.get('customer')
            
            if subscription_id and customer_id:
                # Find the subscription
                db = DBConnection()
                client = await db.client
                sub_result = await client.schema('basejump').from_('billing_subscriptions') \
                    .select('account_id') \
                    .eq('id', subscription_id) \
                    .execute()
                
                if sub_result.data and len(sub_result.data) > 0:
                    account_id = sub_result.data[0]['account_id']
                    
                    if event_type == 'invoice.payment_succeeded':
                        logger.info(f"Payment succeeded for subscription {subscription_id}, account {account_id}")
                        
                        # Update status to active if not already
                        await client.schema('basejump').from_('billing_subscriptions').update({
                            'status': 'active'
                        }).eq('id', subscription_id).eq('status', 'past_due').execute()
                        
                    elif event_type == 'invoice.payment_failed':
                        logger.warning(f"Payment failed for subscription {subscription_id}, account {account_id}")
                        
                        # Mark as past_due
                        await client.schema('basejump').from_('billing_subscriptions').update({
                            'status': 'past_due'
                        }).eq('id', subscription_id).execute()
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
