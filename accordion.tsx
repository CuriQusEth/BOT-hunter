'use client';

import { useSendCalls } from 'wagmi/experimental';
import { parseEther } from 'viem';
import { encodeSchema0Attribution } from '@/lib/erc8021';
import { Button } from '@/components/ui/button';
import { BOT_HUNTER_CLIENT_CONFIG, debugLog } from '@/config/erc8021.client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Component that sends a transaction with Base Builder Codes attribution
 * Uses ERC-8021 data suffix to attribute transactions to Bot Hunter
 */
export function SendAttributedTransaction() {
  const { sendCalls, isPending, data } = useSendCalls();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendTransaction = async () => {
    try {
      setError(null);
      setTxHash(null);

      // Generate ERC-8021 attribution suffix with Bot Hunter code
      const dataSuffix = encodeSchema0Attribution([BOT_HUNTER_CLIENT_CONFIG.code]);

      debugLog('📤 Sending transaction with Bot Hunter attribution');

      // Send transaction with attribution capability (ERC-5792)
      const result = await sendCalls({
        calls: [
          {
            to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
            data: '0xdeadbeef',
            value: parseEther('0.001'), // 0.001 ETH
          },
        ],
        capabilities: {
          dataSuffix: {
            value: dataSuffix
          }
        }
      });

      setTxHash(result as string);
      debugLog('✅ Transaction sent with attribution');
    } catch (err: any) {
      debugLog('❌ Transaction failed:', err);
      setError(err.message || 'Transaction failed');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-purple-500/20 rounded-lg bg-black/40">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-white">Test Attribution Transaction</h3>
        <p className="text-sm text-gray-400">
          Send a transaction with Bot Hunter attribution code
        </p>
        <div className="text-xs text-purple-400 font-mono">
          Code: {BOT_HUNTER_CLIENT_CONFIG.code}
        </div>
      </div>

      <Button
        onClick={handleSendTransaction}
        disabled={isPending}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Test Transaction'
        )}
      </Button>

      {txHash && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-sm">
          <div className="text-green-400 font-semibold mb-1">✅ Transaction Sent!</div>
          <div className="text-xs text-gray-300 break-all font-mono">
            {txHash}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm">
          <div className="text-red-400 font-semibold mb-1">❌ Error</div>
          <div className="text-xs text-gray-300">{error}</div>
        </div>
      )}

      {data && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm">
          <div className="text-blue-400 font-semibold mb-1">📊 Transaction Data</div>
          <pre className="text-xs text-gray-300 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
