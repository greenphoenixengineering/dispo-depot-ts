# Subscription Management Implementation

This document explains the new professional subscription management functionality implemented in your codebase.

## Overview

The new implementation provides a clean separation of concerns for handling subscription operations:

- **Upgrades**: Immediate changes with proration
- **Downgrades**: Immediate changes (can be modified to schedule for end of period)
- **New Subscriptions**: Create checkout sessions for new users
- **Cancellations**: Schedule for end of period

## Key Components

### 1. Core Functions (`libs/stripe.ts`)

#### `upgradeSubscription(subscriptionId, newPriceId)`
- Immediately upgrades a subscription with proration
- Updates the subscription in Stripe
- Updates user data in Supabase

#### `downgradeSubscription(subscriptionId, newPriceId)`
- Immediately downgrades a subscription (no proration)
- Updates the subscription in Stripe
- Updates user data in Supabase

#### `cancelSubscriptionAtPeriodEnd(subscriptionId)`
- Schedules subscription cancellation for the end of the current period
- User maintains access until the period ends

#### `manageSubscription(params)`
- Smart router that decides which action to take based on user state
- Handles new subscriptions, upgrades, and downgrades
- Returns appropriate responses for UI handling

#### `getPlanOperation(currentPlan, newPlan)`
- Determines if a plan change is an upgrade, downgrade, or new subscription
- Uses plan hierarchy: Free (0) < Standard (1) < Pro (2)

### 2. API Routes

#### `/api/stripe/manage-subscription` (NEW)
- Handles subscription management operations
- Accepts `priceId` and `operation` parameters
- Returns structured responses for different actions

#### `/api/stripe/create-checkout` (UPDATED)
- Simplified to only create checkout sessions
- Better error handling and return type consistency

### 3. React Components

#### `SubscriptionManager` (NEW)
- Handles subscription changes in the UI
- Supports upgrade, downgrade, and new subscription operations
- Provides loading states and error handling

#### `Pricing` (UPDATED)
- Now uses `SubscriptionManager` for plan changes
- Shows current plan status
- Displays appropriate buttons based on user's current plan

#### `CurrentPlanCard` (NEW)
- Displays current subscription information
- Provides options to change plans
- Shows plan features and pricing

## Usage Examples

### Basic Usage

```tsx
import SubscriptionManager from '@/components/SubscriptionManager';

// For upgrades
<SubscriptionManager
  priceId="price_123"
  operation="upgrade"
  onSuccess={() => console.log('Upgraded successfully')}
  onError={(error) => console.error('Upgrade failed:', error)}
>
  Upgrade to Pro
</SubscriptionManager>

// For downgrades
<SubscriptionManager
  priceId="price_456"
  operation="downgrade"
>
  Downgrade to Standard
</SubscriptionManager>
```

### Programmatic Usage

```typescript
import { manageSubscription } from '@/libs/stripe';

const result = await manageSubscription({
  user: {
    email: 'user@example.com',
    customerId: 'cus_123'
  },
  newPriceId: 'price_123',
  operation: 'upgrade'
});

if (result.action === 'upgraded') {
  console.log('Subscription upgraded successfully');
} else if (result.action === 'new_subscription' && result.url) {
  window.location.href = result.url;
}
```

## Plan Hierarchy

The system uses a simple hierarchy to determine upgrade/downgrade operations:

```typescript
const planHierarchy = {
  [PlanName.FREE]: 0,
  [PlanName.STANDARD]: 1,
  [PlanName.PRO]: 2,
};
```

- **Upgrade**: Moving to a higher number (e.g., Free → Standard)
- **Downgrade**: Moving to a lower number (e.g., Pro → Standard)
- **New**: Same level or invalid plan names

## Error Handling

All functions include proper error handling:

- Network errors are caught and logged
- Stripe API errors are handled gracefully
- User-friendly error messages are provided
- Authentication errors redirect to login

## Webhook Integration

The existing webhook handlers in `/api/webhook/stripe/route.ts` continue to work with the new system:

- `customer.subscription.updated` - Handles plan changes
- `customer.subscription.deleted` - Handles cancellations
- `checkout.session.completed` - Handles new subscriptions

## Migration from Old System

The old `createCheckout` function has been simplified:

**Before:**
- Handled subscription logic internally
- Mixed concerns (checkout + subscription management)
- Inconsistent return types

**After:**
- Only creates checkout sessions
- Clean separation of concerns
- Consistent error handling
- Professional subscription management patterns

## Best Practices

1. **Always use the `SubscriptionManager` component** for UI interactions
2. **Use `manageSubscription` function** for programmatic operations
3. **Handle all response types** in your UI components
4. **Provide user feedback** for loading states and errors
5. **Test upgrade/downgrade flows** thoroughly
6. **Monitor webhook events** for subscription changes

## Configuration

Ensure your environment variables are set:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

Test the following scenarios:

1. **New user subscription** (no existing subscription)
2. **Upgrade from Free to Standard**
3. **Upgrade from Standard to Pro**
4. **Downgrade from Pro to Standard**
5. **Downgrade from Standard to Free**
6. **Error handling** (network issues, invalid price IDs)
7. **Authentication** (unauthenticated users)

This implementation provides a robust, professional subscription management system that follows SaaS best practices and provides a great user experience. 