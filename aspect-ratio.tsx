'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogOut, CheckCircle } from 'lucide-react';

/**
 * Wallet connection component for Base Builder Codes transactions
 */
export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Wallet Connected
          </CardTitle>
          <CardDescription>Ready to send attributed transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
            <div className="text-xs text-gray-400 mb-1">Address</div>
            <div className="text-sm text-white font-mono break-all">
              {address}
            </div>
          </div>
          <Button
            onClick={() => disconnect()}
            variant="outline"
            className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>Connect to send transactions with attribution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isPending ? 'Connecting...' : `Connect with ${connector.name}`}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
