import { base } from 'viem/chains'

// Configuration for Spend Permissions
export const SPEND_PERMISSION_CONFIG = {
  // Default chain for spend permissions
  chainId: base.id,
  
  // Default allowance (1 USDC in base units - 6 decimals)
  defaultAllowance: BigInt(1000000),
  
  // Default period in days
  defaultPeriodInDays: 30,
  
  // USDC token address on Base
  usdcTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
  
  // Native token address (ETH) using ERC-7528 format
  nativeTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as `0x${string}`,
  
  // Base Account SDK configuration
  sdkConfig: {
    appName: 'Bot Hunter',
    appLogoUrl: '/favicon.ico',
    appChainIds: [base.id],
  }
} as const

// Helper function to format token amounts
export function formatTokenAmount(amount: bigint, decimals: number = 6): string {
  const divisor = BigInt(10 ** decimals)
  const whole = amount / divisor
  const remainder = amount % divisor
  const remainderStr = remainder.toString().padStart(decimals, '0')
  return `${whole}.${remainderStr}`
}

// Helper function to parse token amounts
export function parseTokenAmount(amount: string, decimals: number = 6): bigint {
  const [whole = '0', fraction = '0'] = amount.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction)
}
