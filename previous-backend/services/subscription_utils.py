"""
Subscription utility functions for Leger.

This module provides utility functions for managing subscriptions,
checking subscription status, and enforcing subscription limits.
"""

from typing import Dict, Any, Optional, Tuple, List
from datetime import datetime, timezone, timedelta
import stripe
from utils.logger import logger
from utils.config import config, EnvMode
from services.supabase import DBConnection

# Define the subscription tier info
SUBSCRIPTION_TIER = {
    'name': 'standard',
    'price': 99,  # $99/month
    'trial_days': 14,
    'features': {
        'max_configurations': 50,
        'configuration_sharing': True,
        'configuration_templates': True,
        'advanced_versioning': True
    }
}

async def get_subscription_status(user_id: str) -> Dict[str, Any]:
    """
    Get detailed subscription status for a user.
    
    Args:
        user_id: The user ID to check
        
    Returns:
        Dict with subscription status details
    """
    try:
        # Get database connection
        db = DBConnection()
        client = await db.client
        
        # Skip checks in local development mode
        if config.ENV_MODE == EnvMode.LOCAL:
            return {
                "status": "active",
                "plan_name": "Development",
                "is_paid": True,
                "in_trial": False,
                "trial_days_remaining": 0,
                "features": SUBSCRIPTION_TIER['features']
            }
        
        # Get latest subscription status from database
        result = await client.schema('basejump').from_('billing_subscriptions') \
            .select('*') \
            .eq('account_id', user_id) \
            .order('created', desc=True) \
            .limit(1) \
            .execute()
        
        # No subscription found - check if user qualifies for trial
        if not result.data or len(result.data) == 0:
            # Check if this is a new user who hasn't had a subscription before
            all_subs = await client.schema('basejump').from_('billing_subscriptions') \
                .select('id') \
                .eq('account_id', user_id) \
                .execute()
            
            # User has never had a subscription - eligible for trial
            if not all_subs.data or len(all_subs.data) == 0:
                return {
                    "status": "trialing",
                    "plan_name": "Trial",
                    "is_paid": False,
                    "in_trial": True,
                    "trial_days_remaining": SUBSCRIPTION_TIER['trial_days'],
                    "trial_end": (datetime.now(timezone.utc) + timedelta(days=SUBSCRIPTION_TIER['trial_days'])).isoformat(),
                    "features": SUBSCRIPTION_TIER['features']
                }
            
            # User had a subscription before but doesn't now
            return {
                "status": "no_subscription",
                "plan_name": "None",
                "is_paid": False,
                "in_trial": False,
                "features": {
                    "max_configurations": config.MAX_CONFIGURATIONS_FREE_TIER,
                    "configuration_sharing": False,
                    "configuration_templates": True,  # Can use templates but not create
                    "advanced_versioning": False
                }
            }
        
        # Get subscription details
        subscription = result.data[0]
        status = subscription.get('status')
        
        # Check if subscription is in trial period
        in_trial = status == 'trialing'
        is_paid = status == 'active'
        
        # Calculate trial days remaining if applicable
        trial_days_remaining = 0
        if in_trial and subscription.get('trial_end'):
            trial_end = datetime.fromisoformat(subscription['trial_end'].replace('Z', '+00:00'))
            now = datetime.now(timezone.utc)
            trial_days_remaining = max(0, (trial_end - now).days)
        
        # Active or trialing subscription
        if status in ['active', 'trialing']:
            return {
                "status": status,
                "plan_name": subscription.get('plan_name', SUBSCRIPTION_TIER['name']),
                "is_paid": is_paid,
                "in_trial": in_trial,
                "trial_days_remaining": trial_days_remaining,
                "current_period_end": subscription.get('current_period_end'),
                "cancel_at_period_end": subscription.get('cancel_at_period_end', False),
                "features": SUBSCRIPTION_TIER['features']
            }
        
        # Problem with payment
        if status in ['past_due', 'incomplete', 'incomplete_expired']:
            return {
                "status": status,
                "plan_name": subscription.get('plan_name', SUBSCRIPTION_TIER['name']),
                "is_paid": False,
                "in_trial": False,
                "payment_issue": True,
                "features": {  # Limited features due to payment issues
                    "max_configurations": config.MAX_CONFIGURATIONS_FREE_TIER,
                    "configuration_sharing": False,
                    "configuration_templates": True,
                    "advanced_versioning": False
                }
            }
        
        # Canceled subscription
        return {
            "status": status,
            "plan_name": "None",
            "is_paid": False,
            "in_trial": False,
            "features": {
                "max_configurations": config.MAX_CONFIGURATIONS_FREE_TIER,
                "configuration_sharing": False,
                "configuration_templates": True,
                "advanced_versioning": False
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting subscription status for user {user_id}: {str(e)}")
        # Return default free tier features on error
        return {
            "status": "error",
            "plan_name": "Error",
            "is_paid": False,
            "in_trial": False,
            "error": str(e),
            "features": {
                "max_configurations": config.MAX_CONFIGURATIONS_FREE_TIER,
                "configuration_sharing": False,
                "configuration_templates": True,
                "advanced_versioning": False
            }
        }

async def can_create_configuration(user_id: str) -> Tuple[bool, str]:
    """
    Check if a user can create a new configuration based on their subscription limits.
    
    Args:
        user_id: The user ID to check
        
    Returns:
        Tuple[bool, str]: (can_create, reason)
    """
    try:
        # Get subscription status
        subscription = await get_subscription_status(user_id)
        
        # Get database connection
        db = DBConnection()
        client = await db.client
        
        # Count existing configurations
        result = await client.table('configurations') \
            .select('count', count='exact') \
            .eq('account_id', user_id) \
            .execute()
        
        configuration_count = result.count if hasattr(result, 'count') else 0
        max_configurations = subscription.get('features', {}).get('max_configurations', config.MAX_CONFIGURATIONS_FREE_TIER)
        
        # Check if user has reached their configuration limit
        if configuration_count >= max_configurations:
            if subscription.get('is_paid'):
                return False, f"You have reached the maximum number of configurations ({max_configurations}) allowed on your plan."
            else:
                return False, f"You have reached the free tier limit of {max_configurations} configurations. Please upgrade to create more configurations."
        
        # Check subscription status
        status = subscription.get('status')
        if status in ['past_due', 'incomplete', 'incomplete_expired']:
            return False, "There is a payment issue with your subscription. Please update your payment method to create new configurations."
        
        if status == 'canceled':
            return False, "Your subscription has been canceled. Please resubscribe to create new configurations."
        
        return True, "OK"
        
    except Exception as e:
        logger.error(f"Error checking if user {user_id} can create a configuration: {str(e)}")
        # Allow creation on error but log it
        return True, "OK"

async def can_share_configuration(user_id: str) -> Tuple[bool, str]:
    """
    Check if a user can share a configuration based on their subscription.
    
    Args:
        user_id: The user ID to check
        
    Returns:
        Tuple[bool, str]: (can_share, reason)
    """
    try:
        # Get subscription status
        subscription = await get_subscription_status(user_id)
        
        # Check if sharing is allowed on this subscription
        can_share = subscription.get('features', {}).get('configuration_sharing', False)
        
        if not can_share:
            if subscription.get('is_paid'):
                # Should not happen with current tier structure, but handled for future flexibility
                return False, "Configuration sharing is not available on your current plan."
            else:
                return False, "Configuration sharing is only available on paid plans. Please upgrade to share configurations."
        
        # Check subscription status
        status = subscription.get('status')
        if status in ['past_due', 'incomplete', 'incomplete_expired']:
            return False, "There is a payment issue with your subscription. Please update your payment method to share configurations."
        
        if status == 'canceled':
            return False, "Your subscription has been canceled. Please resubscribe to share configurations."
        
        return True, "OK"
        
    except Exception as e:
        logger.error(f"Error checking if user {user_id} can share a configuration: {str(e)}")
        # Deny sharing on error to be safe
        return False, "Unable to verify subscription status. Please try again later."

async def can_use_advanced_features(user_id: str, feature: str) -> Tuple[bool, str]:
    """
    Check if a user can use a specific advanced feature based on their subscription.
    
    Args:
        user_id: The user ID to check
        feature: The feature to check (e.g., 'advanced_versioning')
        
    Returns:
        Tuple[bool, str]: (can_use, reason)
    """
    try:
        # Get subscription status
        subscription = await get_subscription_status(user_id)
        
        # Check if feature is allowed on this subscription
        can_use = subscription.get('features', {}).get(feature, False)
        
        if not can_use:
            if subscription.get('is_paid'):
                # Should not happen with current tier structure, but handled for future flexibility
                return False, f"The {feature} feature is not available on your current plan."
            else:
                return False, f"The {feature} feature is only available on paid plans. Please upgrade to use this feature."
        
        # Check subscription status
        status = subscription.get('status')
        if status in ['past_due', 'incomplete', 'incomplete_expired']:
            return False, "There is a payment issue with your subscription. Please update your payment method to use advanced features."
        
        if status == 'canceled':
            return False, "Your subscription has been canceled. Please resubscribe to use advanced features."
        
        return True, "OK"
        
    except Exception as e:
        logger.error(f"Error checking if user {user_id} can use feature {feature}: {str(e)}")
        # Allow basic usage on error but log it
        return True, "OK"
