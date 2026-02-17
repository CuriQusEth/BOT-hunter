/**
 * ERC-8021 Server Configuration for Bot Hunter
 * 
 * SERVER-ONLY CONFIGURATION - Contains sensitive data
 * ⚠️ NEVER import this file in client components
 */

import type { Schema0Config, Schema1Config } from '@/types/erc8021';

/**
 * Get full builder code (server-side only)
 */
function getServerBuilderCode(): string {
  return process.env.NEXT_PUBLIC_BUILDER_CODE || 'bc_9b19fklw';
}

/**
 * Get full payout address (server-side only)
 */
function getServerPayoutAddress(): string {
  return process.env.NEXT_PUBLIC_PAYOUT_ADDRESS || '0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B';
}

/**
 * Get Base App ID (server-side)
 */
function getServerBaseAppId(): string {
  return process.env.NEXT_PUBLIC_BASE_APP_ID || '68f40c278c4fe3f562003d93';
}

/**
 * Bot Hunter Server Configuration
 * 
 * ⚠️ SECURITY WARNING: This contains sensitive data
 * Only use in server-side code (API routes, Server Components, etc.)
 */
export const BOT_HUNTER_SERVER_CONFIG = {
  /**
   * Full builder code (sensitive)
   */
  code: getServerBuilderCode(),
  
  /**
   * Full payout address (sensitive)
   */
  payoutAddress: getServerPayoutAddress(),
  
  /**
   * Base App ID
   */
  baseAppId: getServerBaseAppId(),
  
  /**
   * App metadata
   */
  app: {
    name: 'Bot Hunter',
    url: 'https://bothunter.app',
    description: 'Fast-paced spam-hunting game for the Farcaster community',
  },
  
  /**
   * Base network configuration
   */
  network: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
  },
  
  /**
   * Testnet configuration
   */
  testnet: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
  },
} as const;

/**
 * Server-side attribution configuration
 */
export const SERVER_ATTRIBUTION_CONFIG: Schema0Config = {
  schemaId: 0,
  codes: [BOT_HUNTER_SERVER_CONFIG.code],
};

/**
 * Multi-entity attribution (server-side)
 */
export function createServerMultiEntityConfig(walletCode: string): Schema0Config {
  return {
    schemaId: 0,
    codes: [BOT_HUNTER_SERVER_CONFIG.code, walletCode],
  };
}

/**
 * Custom registry configuration (server-side)
 */
export function createServerCustomRegistryConfig(
  registryAddress: string,
  chainId: number = BOT_HUNTER_SERVER_CONFIG.network.chainId
): Schema1Config {
  return {
    schemaId: 1,
    codes: [BOT_HUNTER_SERVER_CONFIG.code],
    codeRegistryChainId: chainId,
    codeRegistryAddress: registryAddress,
  };
}

/**
 * Validation: Ensure server configuration is correct
 */
export function validateServerConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate payout address
  if (!BOT_HUNTER_SERVER_CONFIG.payoutAddress.match(/^0x[0-9a-fA-F]{40}$/)) {
    errors.push('Invalid payout address format');
  }
  
  // Validate code
  if (!BOT_HUNTER_SERVER_CONFIG.code || BOT_HUNTER_SERVER_CONFIG.code.length === 0) {
    errors.push('Attribution code is empty');
  }
  
  // Validate chain IDs
  if (BOT_HUNTER_SERVER_CONFIG.network.chainId < 1) {
    errors.push('Invalid mainnet chain ID');
  }
  
  if (BOT_HUNTER_SERVER_CONFIG.testnet.chainId < 1) {
    errors.push('Invalid testnet chain ID');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get environment-based configuration
 */
export function getServerEnvironmentConfig() {
  const isDev = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  
  return {
    isDevelopment: isDev,
    isTest: isTest,
    isProduction: !isDev && !isTest,
    useTestnet: isDev || isTest,
    network: isDev || isTest 
      ? BOT_HUNTER_SERVER_CONFIG.testnet 
      : BOT_HUNTER_SERVER_CONFIG.network,
  };
}

/**
 * Security check: Ensure this file is only used server-side
 */
if (typeof window !== 'undefined') {
  console.error('⚠️ SECURITY WARNING: erc8021.server.ts imported on client-side!');
  console.error('This file contains sensitive data and should only be used in server-side code.');
}
