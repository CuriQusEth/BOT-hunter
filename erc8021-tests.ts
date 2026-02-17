/**
 * ERC-8021 Client Configuration for Bot Hunter
 * 
 * PUBLIC CONFIGURATION - Safe for client-side use
 * Sensitive data is masked/hidden from browser
 */

import type { Schema0Config } from '@/types/erc8021';

/**
 * Get Builder Code from environment
 * Falls back to masked placeholder if not set
 */
function getBuilderCode(): string {
  // Check environment variable first
  const envCode = process.env.NEXT_PUBLIC_BUILDER_CODE;
  
  if (envCode && envCode !== 'bc_9b19fklw') {
    return envCode;
  }
  
  // In production, mask the code for security
  if (process.env.NODE_ENV === 'production') {
    return 'bc_*****'; // Masked for security
  }
  
  // In development, use the actual code
  return 'bc_9b19fklw';
}

/**
 * Get Payout Address - ALWAYS MASKED on client-side
 */
function getPayoutAddress(): string {
  const envAddress = process.env.NEXT_PUBLIC_PAYOUT_ADDRESS;
  
  // ALWAYS mask address on client-side for security
  if (typeof window !== 'undefined') {
    return '0x****...****'; // Masked for security
  }
  
  // Server-side can access full address
  return envAddress || '0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B';
}

/**
 * Get Base App ID from environment
 */
function getBaseAppId(): string {
  return process.env.NEXT_PUBLIC_BASE_APP_ID || '68f40c278c4fe3f562003d93';
}

/**
 * Bot Hunter Client-Safe Configuration
 * 
 * SECURITY: Sensitive data is masked in production
 */
export const BOT_HUNTER_CLIENT_CONFIG = {
  /**
   * App attribution code (masked in production)
   */
  code: getBuilderCode(),
  
  /**
   * Display-only payout address (always masked)
   * NEVER use this for actual transactions
   */
  payoutAddressDisplay: getPayoutAddress(),
  
  /**
   * Base App ID (safe to expose)
   */
  baseAppId: getBaseAppId(),
  
  /**
   * App metadata (public info)
   */
  app: {
    name: 'Bot Hunter',
    url: 'https://bothunter.app',
    description: 'Fast-paced spam-hunting game for the Farcaster community',
  },
  
  /**
   * Network configuration (public)
   */
  network: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
  },
  
  /**
   * Testnet configuration (public)
   */
  testnet: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
  },
} as const;

/**
 * Client-safe attribution configuration
 */
export const CLIENT_ATTRIBUTION_CONFIG: Schema0Config = {
  schemaId: 0,
  codes: [BOT_HUNTER_CLIENT_CONFIG.code],
};

/**
 * Check if test page should be enabled
 */
export function isTestPageEnabled(): boolean {
  // Check environment variable
  const enabled = process.env.NEXT_PUBLIC_ENABLE_TEST_PAGE === 'true';
  
  // Auto-enable in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // In production, require explicit enable
  return enabled;
}

/**
 * Check if debug logging should be enabled
 */
export function isDebugEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEBUG_ATTRIBUTION === 'true' ||
         process.env.NODE_ENV === 'development';
}

/**
 * Log attribution info (only if debug enabled)
 */
export function debugLog(...args: any[]): void {
  if (isDebugEnabled()) {
    console.log('[Attribution]', ...args);
  }
}

/**
 * Check if running on client-side
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
