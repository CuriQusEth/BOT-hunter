'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Shield, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useSpendPermissions } from '@/hooks/useSpendPermissions'
import { SPEND_PERMISSION_CONFIG, formatTokenAmount } from '@/config/spend-permissions'
import type { SpendPermissionManagerProps } from '@/types/spend-permission'

/**
 * Spend Permission Manager Component
 * 
 * Provides UI for users to:
 * - Grant spend permissions for automated transactions
 * - View active permissions and their status
 * - Revoke permissions when needed
 */
export function SpendPermissionManager({
  onPermissionGranted,
  onPermissionRevoked,
}: SpendPermissionManagerProps): JSX.Element {
  const { address, isConnected } = useAccount()
  const [spenderAddress, setSpenderAddress] = useState<string>('')
  const [allowanceAmount, setAllowanceAmount] = useState<string>('10')
  const [periodDays, setPeriodDays] = useState<string>('30')

  const {
    permissions,
    activePermission,
    permissionStatus,
    isLoading,
    error,
    requestSpendPermission,
    revokeSpendPermission,
    refreshPermissions,
  } = useSpendPermissions(spenderAddress as `0x${string}`)

  const handleRequestPermission = async (): Promise<void> => {
    if (!spenderAddress || !allowanceAmount || !periodDays) {
      return
    }

    try {
      const permission = await requestSpendPermission({
        spender: spenderAddress as `0x${string}`,
        token: SPEND_PERMISSION_CONFIG.usdcTokenAddress,
        allowance: BigInt(Math.floor(parseFloat(allowanceAmount) * 1000000)), // Convert to USDC base units
        periodInDays: parseInt(periodDays),
      })

      if (permission && onPermissionGranted) {
        onPermissionGranted(permission)
      }
    } catch (err) {
      console.error('Failed to request permission:', err)
    }
  }

  const handleRevokePermission = async (): Promise<void> => {
    if (!activePermission) return

    try {
      const success = await revokeSpendPermission(activePermission)
      if (success && onPermissionRevoked) {
        onPermissionRevoked()
      }
    } catch (err) {
      console.error('Failed to revoke permission:', err)
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-purple-950/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Spend Permissions
          </CardTitle>
          <CardDescription>
            Connect your wallet to manage spend permissions
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Request New Permission */}
      <Card className="bg-purple-950/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Grant Spend Permission
          </CardTitle>
          <CardDescription>
            Allow a trusted spender to use your tokens for automated transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spender">Spender Address</Label>
            <Input
              id="spender"
              type="text"
              placeholder="0x..."
              value={spenderAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpenderAddress(e.target.value)}
              className="bg-black/30 border-purple-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="allowance">Allowance (USDC)</Label>
              <Input
                id="allowance"
                type="number"
                placeholder="10"
                value={allowanceAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowanceAmount(e.target.value)}
                className="bg-black/30 border-purple-500/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period (Days)</Label>
              <Input
                id="period"
                type="number"
                placeholder="30"
                value={periodDays}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPeriodDays(e.target.value)}
                className="bg-black/30 border-purple-500/30"
              />
            </div>
          </div>

          <Button
            onClick={handleRequestPermission}
            disabled={isLoading || !spenderAddress || !allowanceAmount || !periodDays}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Grant Permission'
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Permissions */}
      {permissions.length > 0 && (
        <Card className="bg-purple-950/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Active Permissions
            </CardTitle>
            <CardDescription>
              Manage your existing spend permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {permissions.map((permission, index) => (
              <div
                key={index}
                className="p-4 bg-black/30 rounded-lg border border-purple-500/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                      Active
                    </Badge>
                    <span className="text-sm text-gray-400">
                      Spender: {permission.spender.slice(0, 6)}...{permission.spender.slice(-4)}
                    </span>
                  </div>
                </div>

                {permissionStatus && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Allowance:</span>
                      <span className="text-white">
                        {formatTokenAmount(permission.allowance)} USDC / {permission.period / 86400} days
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Remaining:</span>
                      <span className="text-green-400">
                        {formatTokenAmount(permissionStatus.remainingSpend)} USDC
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleRevokePermission}
                  disabled={isLoading}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Revoking...
                    </>
                  ) : (
                    'Revoke Permission'
                  )}
                </Button>
              </div>
            ))}

            <Button
              onClick={refreshPermissions}
              variant="outline"
              size="sm"
              className="w-full border-purple-500/30"
            >
              Refresh Permissions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-950/30 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <strong className="text-blue-400">What are Spend Permissions?</strong>
              </p>
              <p>
                Spend Permissions allow you to grant a trusted spender the ability to use your tokens
                within limits you define. This enables seamless experiences like automated reward distribution,
                subscriptions, and in-game purchases without requiring signatures for each transaction.
              </p>
              <p>
                You can revoke permissions at any time, and the spender can only spend within the allowance
                you specify per period.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
