'use client';

/**
 * useMultiEntityAttribution Hook
 * 
 * Provides multi-entity attribution for both Bot Hunter and wallet
 * Enables both app and wallet to receive attribution credit
 */

import { useSendCalls } from 'wagmi/experimental';
import { Attribution } from 'ox/erc8021';
import { BOT_HUNTER_CLIENT_CONFIG, debugLog } from '@/config/erc8021.client';
import type { AttributedCall } from './useAttributedTransaction';

/**
 * Multi-entity attribution hook result
 */
export interface UseMultiEntityAttributionResult {
  sendWithMultiAttribution: (calls: AttributedCall[]) => Promise<string>;
  isPending: boolean;
  error: Error | null;
}

/**
 * Known wallet codes for attribution
 */
export const KNOWN_WALLETS = {
  coinbase: 'coinbase',
  rainbow: 'rainbow',
  metamask: 'metamask',
  walletconnect: 'walletconnect',
} as const;

/**
 * useMultiEntityAttribution Hook
 * 
 * Appends attribution for both Bot Hunter and the wallet provider
 * Supports multiple entity attribution per ERC-8021 spec
 * 
 * @param walletCode Attribution code for the wallet (optional)
 * @returns Transaction functions with multi-entity attribution
 * 
 * @example
 * ```tsx
 * // Attribute to Bot Hunter + Coinbase Wallet
 * const { sendWithMultiAttribution } = useMultiEntityAttribution('coinbase');
 * 
 * await sendWithMultiAttribution([{
 *   to: '0xContract',
 *   data: '0xCalldata',
 *   value: 0n
 * }]);
 * ```
 */
export function useMultiEntityAttribution(
  walletCode?: string
): UseMultiEntityAttributionResult {
  const { sendCalls, isPending, error } = useSendCalls();

  const sendWithMultiAttribution = async (calls: AttributedCall[]): Promise<string> => {
    // Build codes array: Bot Hunter + Wallet (if provided)
    const codes = walletCode 
      ? [BOT_HUNTER_CLIENT_CONFIG.code, walletCode]
      : [BOT_HUNTER_CLIENT_CONFIG.code];
    
    debugLog('Multi-entity attribution:', codes.length, 'codes');

    // Generate multi-entity attribution suffix
    const dataSuffix = Attribution.toDataSuffix({ codes });

    // Send transaction with multi-entity attribution
    const id = await sendCalls({
      calls,
      capabilities: {
        dataSuffix: {
          value: dataSuffix
        }
      }
    });

    return id;
  };

  return { 
    sendWithMultiAttribution, 
    isPending,
    error 
  };
}

/**
 * Hook with auto-detected wallet attribution
 * Attempts to detect wallet provider and add its code automatically
 * 
 * @example
 * ```tsx
 * const { sendWithAutoAttribution } = useAutoMultiEntityAttribution();
 * 
 * // Automatically detects and attributes to both Bot Hunter + detected wallet
 * await sendWithAutoAttribution([...]);
 * ```
 */
export function useAutoMultiEntityAttribution() {
  // Detect wallet provider (simplified example)
  const detectedWallet = detectWalletProvider();
  
  return useMultiEntityAttribution(detectedWallet);
}

/**
 * Detect wallet provider from window object
 * Returns known wallet code or undefined
 */
function detectWalletProvider(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  // Check for Coinbase Wallet
  if ((window as any).coinbaseWalletExtension) {
    return KNOWN_WALLETS.coinbase;
  }

  // Check for MetaMask
  if ((window as any).ethereum?.isMetaMask) {
    return KNOWN_WALLETS.metamask;
  }

  // Check for Rainbow
  if ((window as any).ethereum?.isRainbow) {
    return KNOWN_WALLETS.rainbow;
  }

  return undefined;
}

/**
 * Helper: Create custom wallet attribution
 * 
 * @param appCode App attribution code
 * @param walletCode Wallet attribution code
 * @returns Attribution codes array
 */
export function createCustomAttribution(appCode: string, walletCode: string): string[] {
  return [appCode, walletCode];
}
