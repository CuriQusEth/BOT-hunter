# Base Spend Permissions Integration Guide

## Overview

Bot Hunter now integrates **Base Spend Permissions**, enabling seamless transactions without requiring signatures for every action. This allows for automated reward distribution, subscriptions, and in-game purchases with a superior user experience.

## What are Spend Permissions?

Spend Permissions let users designate a trusted `spender` (your game's smart contract or backend wallet) to move assets on their behalf within defined limits. After signing the initial permission, all subsequent transactions happen automatically - no pop-ups or additional signatures needed.

### Key Benefits

- **Seamless UX**: No signature prompts for every transaction
- **Automated Rewards**: Distribute rewards automatically when players achieve high scores
- **Subscription Gaming**: Enable game passes or recurring features
- **Tournament Entry**: Automatic entry fees without manual approval
- **User Control**: Players set limits and can revoke anytime

## Architecture

### Files Added

1. **Types** (`src/types/spend-permission.ts`)
   - TypeScript interfaces for spend permissions
   - Status and request types

2. **Configuration** (`src/config/spend-permissions.ts`)
   - Default settings (chain, tokens, allowances)
   - Helper functions for token formatting

3. **Utilities** (`src/lib/spend-permissions.ts`)
   - Core functions wrapping `@base-org/account/spend-permission`
   - Dynamic imports to avoid SSR issues
   - Error handling and logging

4. **Hook** (`src/hooks/useSpendPermissions.ts`)
   - React hook for managing spend permission state
   - Methods for requesting, using, and revoking permissions
   - Automatic status tracking

5. **UI Component** (`src/components/SpendPermissionManager.tsx`)
   - Full-featured UI for permission management
   - Shows active permissions and status
   - Handles grant and revoke flows

6. **Page** (`src/app/spend-permissions/page.tsx`)
   - Dedicated page for managing permissions
   - Connected from main game via quick access link

## Usage Examples

### 1. Request a Spend Permission

```typescript
import { useSpendPermissions } from '@/hooks/useSpendPermissions'
import { SPEND_PERMISSION_CONFIG } from '@/config/spend-permissions'

const { requestSpendPermission } = useSpendPermissions(spenderAddress)

// Request permission for 10 USDC per 30 days
const permission = await requestSpendPermission({
  spender: '0xYourSpenderAddress',
  token: SPEND_PERMISSION_CONFIG.usdcTokenAddress,
  allowance: BigInt(10_000000), // 10 USDC (6 decimals)
  periodInDays: 30,
})
```

### 2. Use an Existing Permission

```typescript
const { useSpendPermission, activePermission } = useSpendPermissions(spenderAddress)

// Spend 1 USDC from the permission
const success = await useSpendPermission(
  activePermission,
  BigInt(1_000000) // 1 USDC
)
```

### 3. Check Permission Status

```typescript
const { permissionStatus } = useSpendPermissions(spenderAddress)

if (permissionStatus) {
  console.log('Is Active:', permissionStatus.isActive)
  console.log('Remaining:', permissionStatus.remainingSpend)
}
```

### 4. Revoke a Permission

```typescript
const { revokeSpendPermission, activePermission } = useSpendPermissions(spenderAddress)

const success = await revokeSpendPermission(activePermission)
```

## Integration with Bot Hunter

### Current Integration Points

1. **Quick Access Link**: Added to main game screen (bottom right)
2. **Dedicated Page**: `/spend-permissions` for full management
3. **Wallet Integration**: Works with existing Wagmi setup

### Potential Use Cases

#### 1. Automated Reward Distribution
```typescript
// When player achieves high score
if (score > 1000) {
  await useSpendPermission(permission, rewardAmount)
  toast.success(`${rewardAmount} tokens sent!`)
}
```

#### 2. Game Pass Subscription
```typescript
// Monthly game pass with recurring payment
await requestSpendPermission({
  spender: gameContractAddress,
  token: usdcAddress,
  allowance: BigInt(5_000000), // 5 USDC
  periodInDays: 30,
})
```

#### 3. Tournament Entry
```typescript
// Auto-pay entry fee when joining tournament
const tournamentFee = BigInt(1_000000) // 1 USDC
await useSpendPermission(permission, tournamentFee)
```

## Configuration

### Default Settings

```typescript
// In src/config/spend-permissions.ts
export const SPEND_PERMISSION_CONFIG = {
  chainId: base.id, // Base mainnet
  defaultAllowance: BigInt(1000000), // 1 USDC
  defaultPeriodInDays: 30,
  usdcTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  nativeTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
}
```

### Customization

You can customize:
- **Chain**: Change `chainId` to use on different chains
- **Token**: Use different ERC-20 tokens or native ETH
- **Allowance**: Set different default limits
- **Period**: Change the reset period (seconds)

## Security Considerations

1. **User Control**: Users always set their own limits
2. **Revocable**: Permissions can be revoked at any time
3. **Transparent**: All limits are clearly displayed in UI
4. **Period-based**: Allowances reset after each period
5. **On-chain**: Permissions are registered on-chain

## API Reference

### `useSpendPermissions` Hook

Returns:
- `permissions`: Array of all permissions
- `activePermission`: Currently active permission
- `permissionStatus`: Status of active permission
- `isLoading`: Loading state
- `error`: Error message if any
- `requestSpendPermission()`: Request new permission
- `useSpendPermission()`: Use existing permission
- `revokeSpendPermission()`: Revoke permission
- `refreshPermissions()`: Refresh permissions list
- `refreshStatus()`: Refresh permission status

### Core Utilities

- `requestSpendPermission()`: Request permission from user
- `prepareSpendCallData()`: Prepare transaction calls
- `getPermissionStatus()`: Check permission status
- `fetchPermissions()`: Get all permissions
- `requestRevoke()`: Request user to revoke
- `executeSpendCalls()`: Execute spending transactions

## Supported Chains

Currently configured for Base mainnet (chain ID: 8453), but can be configured for:
- Base Sepolia (testnet)
- Other chains supported by Base Account SDK

## Documentation Links

- [Base Spend Permissions Docs](https://docs.base.org/base-account/improve-ux/spend-permissions)
- [GitHub Repository](https://github.com/coinbase/spend-permissions)
- [Base Account SDK](https://docs.base.org/base-account/quickstart)

## Next Steps

### Recommended Implementations

1. **Add Reward System**
   - Create reward contract or backend wallet as spender
   - Implement automatic reward distribution on game events
   - Track rewards in game state

2. **Enable Game Pass**
   - Create subscription tiers (daily/weekly/monthly)
   - Grant premium features to subscribers
   - Show subscription status in UI

3. **Tournament System**
   - Implement tournament entry with auto-payment
   - Use spend permissions for prize pool
   - Automatic payout to winners

4. **In-Game Shop**
   - Add purchasable items (skins, power-ups)
   - Use spend permissions for instant checkout
   - Track purchases on-chain

### Testing

1. Visit `/spend-permissions` page
2. Connect wallet
3. Enter test spender address
4. Request permission with small amount
5. Test spending and revoking

## Troubleshooting

### Common Issues

**"No provider available"**
- Ensure wallet is connected via Wagmi
- Check that connector is initialized

**"Failed to request spend permission"**
- User may have rejected the signature
- Check wallet has sufficient balance
- Verify correct chain is selected

**"Insufficient permission allowance"**
- Permission period may have expired
- Remaining allowance too low
- Request new permission or wait for reset

## Support

For questions or issues:
- Check Base docs: https://docs.base.org
- Bot Hunter issues: GitHub repository
- Base Discord: https://discord.gg/base
