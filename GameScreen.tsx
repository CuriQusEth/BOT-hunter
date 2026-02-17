'use client';

/**
 * ClaimRewardButton Component
 * 
 * Example component showing how to use attributed transactions
 * for claiming NFT rewards with automatic Bot Hunter attribution
 */

import { useAttributedTransaction } from '@/hooks/useAttributedTransaction';
import { encodeFunctionData } from 'viem';
import { Button } from '@/components/ui/button';
import type { Address } from 'viem';

/**
 * Example NFT Contract ABI
 * Minimal ABI for mint function
 */
const NFT_ABI = [
  {
    name: 'mint',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  }
] as const;

/**
 * Example NFT contract address
 * Replace with actual contract address
 */
const NFT_CONTRACT_ADDRESS: Address = '0x0000000000000000000000000000000000000000';

/**
 * ClaimRewardButton Props
 */
interface ClaimRewardButtonProps {
  userAddress: Address;
  tokenId: bigint;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * ClaimRewardButton Component
 * 
 * Example implementation of attributed transaction for NFT minting
 * Demonstrates how to use useAttributedTransaction hook
 * 
 * @example
 * ```tsx
 * <ClaimRewardButton 
 *   userAddress="0xUser" 
 *   tokenId={1n}
 *   onSuccess={() => console.log('NFT claimed!')}
 * />
 * ```
 */
export function ClaimRewardButton({ 
  userAddress, 
  tokenId,
  onSuccess,
  onError 
}: ClaimRewardButtonProps) {
  const { sendWithAttribution, isPending } = useAttributedTransaction();

  const handleClaimNFT = async (): Promise<void> => {
    try {
      // Encode the mint function call
      const calldata = encodeFunctionData({
        abi: NFT_ABI,
        functionName: 'mint',
        args: [userAddress, tokenId],
      });

      // Send transaction with Bot Hunter attribution
      // Attribution is automatically added via ERC-5792 dataSuffix!
      const txId = await sendWithAttribution([
        {
          to: NFT_CONTRACT_ADDRESS,
          data: calldata,
          value: 0n
        }
      ]);

      console.log('NFT claimed with Bot Hunter attribution!', txId);
      onSuccess?.();
    } catch (error) {
      console.error('Claim failed:', error);
      onError?.(error as Error);
    }
  };

  return (
    <Button 
      onClick={handleClaimNFT}
      disabled={isPending}
      className="w-full"
    >
      {isPending ? 'Claiming...' : 'Claim Bot Slayer NFT'}
    </Button>
  );
}

/**
 * Alternative: Simple transaction example
 * Shows basic send transaction with attribution
 */
export function SendTransactionExample() {
  const { sendWithAttribution, isPending } = useAttributedTransaction();

  const handleSendEth = async (): Promise<void> => {
    try {
      await sendWithAttribution([
        {
          to: '0xRecipient' as Address,
          value: 1000000000000000n, // 0.001 ETH
        }
      ]);
      
      console.log('ETH sent with Bot Hunter attribution!');
    } catch (error) {
      console.error('Send failed:', error);
    }
  };

  return (
    <Button onClick={handleSendEth} disabled={isPending}>
      {isPending ? 'Sending...' : 'Send 0.001 ETH'}
    </Button>
  );
}
