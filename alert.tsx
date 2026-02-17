'use client';

import { useSendCalls } from 'wagmi/experimental';
import { parseEther, encodeFunctionData } from 'viem';
import { encodeSchema0Attribution } from '@/lib/erc8021';
import { Button } from '@/components/ui/button';
import { BOT_HUNTER_CONFIG } from '@/config/erc8021';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Collection of transaction examples with Base Builder Codes attribution
 */
export function TransactionExamples() {
  const { sendCalls, isPending } = useSendCalls();
  const [status, setStatus] = useState<string>('');

  // Example 1: Simple ETH transfer with attribution
  const sendSimpleTransfer = async () => {
    try {
      setStatus('Sending simple transfer...');
      const dataSuffix = encodeSchema0Attribution([BOT_HUNTER_CONFIG.code]);

      await sendCalls({
        calls: [
          {
            to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
            value: parseEther('0.001'),
          },
        ],
        capabilities: {
          dataSuffix: {
            value: dataSuffix
          }
        }
      });

      setStatus('✅ Simple transfer sent with attribution!');
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  // Example 2: Contract interaction with attribution
  const sendContractCall = async () => {
    try {
      setStatus('Sending contract call...');
      const dataSuffix = encodeSchema0Attribution([BOT_HUNTER_CONFIG.code]);

      await sendCalls({
        calls: [
          {
            to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
            data: '0xdeadbeef', // Your contract function call
          },
        ],
        capabilities: {
          dataSuffix: {
            value: dataSuffix
          }
        }
      });

      setStatus('✅ Contract call sent with attribution!');
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  // Example 3: Batch transaction with attribution
  const sendBatchTransaction = async () => {
    try {
      setStatus('Sending batch transaction...');
      const dataSuffix = encodeSchema0Attribution([BOT_HUNTER_CONFIG.code]);

      await sendCalls({
        calls: [
          {
            to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
            data: '0xdeadbeef',
          },
          {
            to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
            value: parseEther('0.001'),
          },
        ],
        capabilities: {
          dataSuffix: {
            value: dataSuffix
          }
        }
      });

      setStatus('✅ Batch transaction sent with attribution!');
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  // Example 4: Multi-entity attribution (Bot Hunter + Wallet)
  const sendMultiEntityTransaction = async () => {
    try {
      setStatus('Sending multi-entity transaction...');
      
      // Attribute to both Bot Hunter and a wallet
      const dataSuffix = encodeSchema0Attribution([BOT_HUNTER_CONFIG.code, 'wallet_code_example']);

      await sendCalls({
        calls: [
          {
            to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
            data: '0xdeadbeef',
          },
        ],
        capabilities: {
          dataSuffix: {
            value: dataSuffix
          }
        }
      });

      setStatus('✅ Multi-entity transaction sent!');
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Simple Transfer</CardTitle>
          <CardDescription>Send ETH with attribution</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={sendSimpleTransfer}
            disabled={isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Send 0.001 ETH
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Contract Call</CardTitle>
          <CardDescription>Call contract with attribution</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={sendContractCall}
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Call Contract
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Batch Transaction</CardTitle>
          <CardDescription>Multiple calls in one transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={sendBatchTransaction}
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Send Batch
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Multi-Entity</CardTitle>
          <CardDescription>Attribute to app + wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={sendMultiEntityTransaction}
            disabled={isPending}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Multi-Attribution
          </Button>
        </CardContent>
      </Card>

      {status && (
        <Card className="col-span-full bg-black/40 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="text-sm text-white font-mono">{status}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
