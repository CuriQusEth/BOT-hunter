'use client';

/**
 * useAttributedTransaction Hook
 * 
 * Provides transaction functionality with automatic ERC-8021 attribution
 * Appends Bot Hunter attribution code to all transactions via ERC-5792
 */

import { useSendCalls } from 'wagmi/experimental';
import { BOT_HUNTER_CLIENT_CONFIG, debugLog } from '@/config/erc8021.client';
import { encodeSchema0Attribution } from '@/lib/erc8021';
import type { Address } from 'viem';

/**
 * Transaction call interface
 */
export interface AttributedCall {
  to: Address;
  data?: `0x${string}`;
  value?: bigint;
}

/**
 * Hook result interface
 */
export interface UseAttributedTransactionResult {
  sendWithAttribution: (calls: AttributedCall[]) => Promise<string>;
  isPending: boolean;
  error: Error | null;
}

/**
 * useAttributedTransaction Hook
 * 
 * Automatically appends Bot Hunter attribution code to transactions
 * Uses ERC-5792 wallet_sendCalls with dataSuffix capability
 * 
 * @returns Transaction functions with attribution support
 * 
 * @example
 * ```tsx
 * const { sendWithAttribution, isPending } = useAttributedTransaction();
 * 
 * await sendWithAttribution([{
 *   to: '0xContract',
 *   data: '0xCalldata',
 *   value: 0n
 * }]);
 * ```
 */
export function useAttributedTransaction(): UseAttributedTransactionResult {
  const { sendCalls, isPending, error } = useSendCalls();

  const sendWithAttribution = async (calls: AttributedCall[]): Promise<string> => {
    // Generate attribution suffix using Builder Code
    const dataSuffix = encodeSchema0Attribution([BOT_HUNTER_CLIENT_CONFIG.code]);
    
    debugLog('Preparing attributed transaction');

    // Send transaction with attribution capability (ERC-5792)
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
    sendWithAttribution, 
    isPending,
    error 
  };
}

/**
 * Hook for sending a single attributed transaction
 * Convenience wrapper for single-call transactions
 * 
 * @example
 * ```tsx
 * const { sendSingleWithAttribution } = useSingleAttributedTransaction();
 * 
 * await sendSingleWithAttribution({
 *   to: '0xContract',
 *   data: '0xCalldata'
 * });
 * ```
 */
export function useSingleAttributedTransaction() {
  const { sendWithAttribution, isPending, error } = useAttributedTransaction();

  const sendSingleWithAttribution = async (call: AttributedCall): Promise<string> => {
    return sendWithAttribution([call]);
  };

  return { 
    sendSingleWithAttribution, 
    isPending,
    error 
  };
}
