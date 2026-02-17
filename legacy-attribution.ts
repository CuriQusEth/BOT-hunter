/**
 * ERC-8021 Configuration for Bot Hunter
 * 
 * Centralized configuration for transaction attribution
 * including wallet addresses, registry settings, and network configuration
 */

import type { Schema0Config, Schema1Config } from '@/types/erc8021';

/**
 * Bot Hunter App Configuration
 */
export const BOT_HUNTER_CONFIG = {
  /**
   * App attribution code
   * Registered in Base canonical Code Registry
   */
  code: 'bc_9b19fklw',

  /**
   * Payout address for Bot Hunter rewards
   * This address receives attribution rewards and incentives
   */
  payoutAddress: '0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B',

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
 * Default attribution configuration
 * Uses Schema 0 with Base canonical registry
 */
export const DEFAULT_ATTRIBUTION_CONFIG: Schema0Config = {
  schemaId: 0,
  codes: [BOT_HUNTER_CONFIG.code],
};

/**
 * Multi-entity attribution with wallet
 * Use this when both Bot Hunter and wallet want attribution
 * 
 * @param walletCode Wallet attribution code
 * @returns Attribution config with both codes
 */
export function createMultiEntityConfig(walletCode: string): Schema0Config {
  return {
    schemaId: 0,
    codes: [BOT_HUNTER_CONFIG.code, walletCode],
  };
}

/**
 * Custom registry configuration
 * Use this for custom Code Registry deployments
 * 
 * @param registryAddress Custom registry contract address
 * @param chainId Chain ID where registry is deployed
 * @returns Schema 1 attribution config
 */
export function createCustomRegistryConfig(
  registryAddress: string,
  chainId: number = BOT_HUNTER_CONFIG.network.chainId
): Schema1Config {
  return {
    schemaId: 1,
    codes: [BOT_HUNTER_CONFIG.code],
    codeRegistryChainId: chainId,
    codeRegistryAddress: registryAddress,
  };
}

/**
 * Known wallet codes for multi-entity attribution
 */
export const KNOWN_WALLETS = {
  coinbase: 'coinbase',
  rainbow: 'rainbow',
  metamask: 'metamask',
  walletconnect: 'walletconnect',
} as const;

/**
 * Registry addresses per network
 * TBD = To Be Determined (awaiting official deployment)
 */
export const REGISTRY_ADDRESSES = {
  [BOT_HUNTER_CONFIG.network.chainId]: 'TBD', // Base Mainnet
  [BOT_HUNTER_CONFIG.testnet.chainId]: 'TBD', // Base Sepolia
} as const;

/**
 * Feature flags for ERC-8021 integration
 */
export const FEATURE_FLAGS = {
  /**
   * Enable attribution for all transactions
   */
  enableAttribution: true,

  /**
   * Enable multi-entity attribution (app + wallet)
   */
  enableMultiEntity: true,

  /**
   * Enable custom registry support
   */
  enableCustomRegistry: true,

  /**
   * Enable attribution parsing and analytics
   */
  enableAnalytics: true,

  /**
   * Enable security validations
   */
  enableSecurityChecks: true,
} as const;

/**
 * Get current network configuration
 * 
 * @param isTestnet Whether to use testnet configuration
 * @returns Network configuration
 */
export function getNetworkConfig(isTestnet: boolean = false) {
  return isTestnet ? BOT_HUNTER_CONFIG.testnet : BOT_HUNTER_CONFIG.network;
}

/**
 * Get registry address for current network
 * 
 * @param chainId Chain ID
 * @returns Registry address or 'TBD'
 */
export function getRegistryAddress(chainId: number): string {
  return REGISTRY_ADDRESSES[chainId as keyof typeof REGISTRY_ADDRESSES] || 'TBD';
}

/**
 * Check if registry is deployed on network
 * 
 * @param chainId Chain ID
 * @returns True if registry is deployed (not TBD)
 */
export function isRegistryDeployed(chainId: number): boolean {
  const address = getRegistryAddress(chainId);
  return address !== 'TBD' && address.startsWith('0x');
}

/**
 * Validation: Ensure configuration is correct
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate payout address
  if (!BOT_HUNTER_CONFIG.payoutAddress.match(/^0x[0-9a-fA-F]{40}$/)) {
    errors.push('Invalid payout address format');
  }

  // Validate code
  if (!BOT_HUNTER_CONFIG.code || BOT_HUNTER_CONFIG.code.length === 0) {
    errors.push('Attribution code is empty');
  }

  // Validate chain IDs
  if (BOT_HUNTER_CONFIG.network.chainId < 1) {
    errors.push('Invalid mainnet chain ID');
  }

  if (BOT_HUNTER_CONFIG.testnet.chainId < 1) {
    errors.push('Invalid testnet chain ID');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Environment-based configuration
 */
export function getEnvironmentConfig() {
  const isDev = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';

  return {
    isDevelopment: isDev,
    isTest: isTest,
    isProduction: !isDev && !isTest,
    useTestnet: isDev || isTest,
    network: getNetworkConfig(isDev || isTest),
  };
}
