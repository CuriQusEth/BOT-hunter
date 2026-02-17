'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import type { SpendPermission, SpendPermissionStatus } from '@/types/spend-permission'
import {
  requestSpendPermission as requestPermission,
  fetchPermissions,
  getPermissionStatus,
  prepareSpendCallData,
  executeSpendCalls,
  requestRevoke,
} from '@/lib/spend-permissions'
import { SPEND_PERMISSION_CONFIG } from '@/config/spend-permissions'

interface UseSpendPermissionsReturn {
  permissions: SpendPermission[]
  activePermission: SpendPermission | null
  permissionStatus: SpendPermissionStatus | null
  isLoading: boolean
  error: string | null
  requestSpendPermission: (params: {
    spender: `0x${string}`
    token: `0x${string}`
    allowance: bigint
    periodInDays: number
  }) => Promise<SpendPermission | null>
  useSpendPermission: (permission: SpendPermission, amount: bigint) => Promise<boolean>
  revokeSpendPermission: (permission: SpendPermission) => Promise<boolean>
  refreshPermissions: () => Promise<void>
  refreshStatus: (permission: SpendPermission) => Promise<void>
}

/**
 * Hook for managing Spend Permissions in the Bot Hunter game
 * 
 * Provides functionality to:
 * - Request new spend permissions from users
 * - Use existing permissions to spend tokens
 * - Revoke permissions when needed
 * - Track permission status and remaining allowance
 */
export function useSpendPermissions(spenderAddress?: `0x${string}`): UseSpendPermissionsReturn {
  const { address, connector } = useAccount()
  const [permissions, setPermissions] = useState<SpendPermission[]>([])
  const [activePermission, setActivePermission] = useState<SpendPermission | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<SpendPermissionStatus | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch permissions on mount and when address changes
  const refreshPermissions = useCallback(async () => {
    if (!address || !spenderAddress) return

    setIsLoading(true)
    setError(null)

    try {
      const provider = await connector?.getProvider()
      if (!provider) {
        throw new Error('No provider available')
      }

      const fetchedPermissions = await fetchPermissions(
        {
          account: address,
          chainId: SPEND_PERMISSION_CONFIG.chainId,
          spender: spenderAddress,
        },
        provider
      )

      setPermissions(fetchedPermissions)
      
      // Set the first active permission as the active one
      if (fetchedPermissions.length > 0) {
        setActivePermission(fetchedPermissions[0])
      }
    } catch (err) {
      console.error('Error fetching permissions:', err)
      setError('Failed to fetch permissions')
    } finally {
      setIsLoading(false)
    }
  }, [address, spenderAddress, connector])

  // Refresh status of a specific permission
  const refreshStatus = useCallback(async (permission: SpendPermission) => {
    try {
      const status = await getPermissionStatus(permission)
      setPermissionStatus(status)
    } catch (err) {
      console.error('Error fetching permission status:', err)
    }
  }, [])

  // Request a new spend permission
  const requestSpendPermission = useCallback(
    async (params: {
      spender: `0x${string}`
      token: `0x${string}`
      allowance: bigint
      periodInDays: number
    }): Promise<SpendPermission | null> => {
      if (!address) {
        setError('No wallet connected')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const provider = await connector?.getProvider()
        if (!provider) {
          throw new Error('No provider available')
        }

        const permission = await requestPermission(
          {
            account: address,
            chainId: SPEND_PERMISSION_CONFIG.chainId,
            ...params,
          },
          provider
        )

        // Refresh permissions list
        await refreshPermissions()

        return permission
      } catch (err) {
        console.error('Error requesting spend permission:', err)
        setError('Failed to request spend permission')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [address, connector, refreshPermissions]
  )

  // Use an existing spend permission
  const useSpendPermission = useCallback(
    async (permission: SpendPermission, amount: bigint): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const provider = await connector?.getProvider()
        if (!provider) {
          throw new Error('No provider available')
        }

        // Check permission status first
        const status = await getPermissionStatus(permission)
        if (!status.isActive || status.remainingSpend < amount) {
          setError('Insufficient permission allowance')
          return false
        }

        // Prepare the spend calls
        const calls = await prepareSpendCallData(permission, amount)

        // Execute the calls
        await executeSpendCalls(calls, permission.spender, provider)

        // Refresh status after spending
        await refreshStatus(permission)

        return true
      } catch (err) {
        console.error('Error using spend permission:', err)
        setError('Failed to use spend permission')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [connector, refreshStatus]
  )

  // Revoke a spend permission
  const revokeSpendPermission = useCallback(
    async (permission: SpendPermission): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        await requestRevoke(permission)

        // Refresh permissions after revoke
        await refreshPermissions()

        return true
      } catch (err) {
        console.error('Error revoking spend permission:', err)
        setError('Failed to revoke spend permission')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshPermissions]
  )

  // Load permissions on mount
  useEffect(() => {
    if (address && spenderAddress) {
      refreshPermissions()
    }
  }, [address, spenderAddress, refreshPermissions])

  // Refresh status when active permission changes
  useEffect(() => {
    if (activePermission) {
      refreshStatus(activePermission)
    }
  }, [activePermission, refreshStatus])

  return {
    permissions,
    activePermission,
    permissionStatus,
    isLoading,
    error,
    requestSpendPermission,
    useSpendPermission,
    revokeSpendPermission,
    refreshPermissions,
    refreshStatus,
  }
}
