'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { SendAttributedTransaction } from '@/components/SendAttributedTransaction';
import { TransactionExamples } from '@/components/TransactionExamples';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BOT_HUNTER_CLIENT_CONFIG, isTestPageEnabled } from '@/config/erc8021.client';

/**
 * Test page for Base Builder Codes attribution
 * Demonstrates ERC-8021 transaction attribution with ERC-5792 wallet_sendCalls
 */
export default function TestAttributionPage() {
  // Security: Check if test page is enabled
  if (!isTestPageEnabled()) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Test Page Disabled</h1>
          <p className="text-gray-400 mb-6">
            This test page is disabled in production. Set NEXT_PUBLIC_ENABLE_TEST_PAGE=true in .env.local to enable.
          </p>
          <Link href="/">
            <Button variant="outline" className="border-purple-500/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Game
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Base Builder Codes Test
            </h1>
            <p className="text-gray-400">
              Test ERC-8021 transaction attribution with Bot Hunter
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-purple-500/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Game
            </Button>
          </Link>
        </div>

        {/* Configuration Info */}
        <div className="p-4 bg-black/40 border border-purple-500/20 rounded-lg">
          <h2 className="text-lg font-bold text-white mb-3">Current Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Builder Code</div>
              <div className="text-purple-400 font-mono">{BOT_HUNTER_CLIENT_CONFIG.code}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Network</div>
              <div className="text-purple-400 font-mono">Base ({BOT_HUNTER_CLIENT_CONFIG.network.chainId})</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Payout Address</div>
              <div className="text-purple-400 font-mono text-xs break-all">
                {BOT_HUNTER_CLIENT_CONFIG.payoutAddressDisplay}
              </div>
              <div className="text-xs text-gray-500 mt-1">🔒 Masked for security</div>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <WalletConnect />

        {/* Main Transaction Test */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Send Test Transaction</h2>
          <SendAttributedTransaction />
        </div>

        {/* Transaction Examples */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">More Examples</h2>
          <TransactionExamples />
        </div>

        {/* Documentation */}
        <div className="p-6 bg-black/40 border border-purple-500/20 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">1. ERC-8021 Attribution</h3>
              <p className="text-sm">
                Every transaction includes a data suffix containing your Builder Code. This suffix
                is automatically appended by the wallet when using the <code className="text-purple-400">dataSuffix</code> capability.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">2. ERC-5792 wallet_sendCalls</h3>
              <p className="text-sm">
                We use the <code className="text-purple-400">useSendCalls</code> hook from Wagmi, which implements
                ERC-5792. This allows wallets to handle attribution for both EOA and Smart Account users.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">3. Base Ecosystem Benefits</h3>
              <p className="text-sm">
                Transactions attributed to Bot Hunter will appear in your base.dev dashboard,
                qualify for potential rewards, and contribute to Base ecosystem analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="text-yellow-400 font-semibold mb-2">⚠️ Configuration Required</div>
          <div className="text-sm text-gray-300">
            Before using in production, register on <a href="https://base.dev" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">base.dev</a> to get your official Builder Code and set it in <code className="text-purple-400">.env.local</code>
          </div>
        </div>
      </div>
    </main>
  );
}
