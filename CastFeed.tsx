'use client'

import { SpendPermissionManager } from '@/components/SpendPermissionManager'
import { WalletConnect } from '@/components/WalletConnect'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/**
 * Spend Permissions Management Page
 * 
 * Dedicated page for users to manage their spend permissions
 * for the Bot Hunter game.
 */
export default function SpendPermissionsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Spend Permissions
            </h1>
            <p className="text-gray-400">
              Manage automated transaction permissions for Bot Hunter
            </p>
          </div>

          <Link href="/">
            <Button variant="outline" className="gap-2 border-purple-500/30">
              <ArrowLeft className="w-4 h-4" />
              Back to Game
            </Button>
          </Link>
        </div>

        {/* Wallet Connection */}
        <div className="flex justify-center">
          <WalletConnect />
        </div>

        {/* Spend Permission Manager */}
        <SpendPermissionManager
          onPermissionGranted={(permission) => {
            console.log('Permission granted:', permission)
          }}
          onPermissionRevoked={() => {
            console.log('Permission revoked')
          }}
        />

        {/* Use Cases */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 bg-purple-950/30 border border-purple-500/20 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-purple-400">🎁 Automated Rewards</h3>
            <p className="text-gray-300 text-sm">
              Grant permission for the game to automatically distribute rewards when you achieve
              high scores or complete challenges.
            </p>
          </div>

          <div className="p-6 bg-blue-950/30 border border-blue-500/20 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-blue-400">⚡ Instant Transactions</h3>
            <p className="text-gray-300 text-sm">
              No more pop-ups or signatures for every action. Play seamlessly with automated
              transactions for in-game purchases and features.
            </p>
          </div>

          <div className="p-6 bg-green-950/30 border border-green-500/20 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-green-400">🎮 Tournament Entry</h3>
            <p className="text-gray-300 text-sm">
              Automatically enter tournaments and competitions without manual transaction approval
              for each entry.
            </p>
          </div>

          <div className="p-6 bg-yellow-950/30 border border-yellow-500/20 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-yellow-400">🔒 Always in Control</h3>
            <p className="text-gray-300 text-sm">
              You set the limits and can revoke permissions at any time. Full transparency and
              control over your assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
