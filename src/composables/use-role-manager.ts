import { api } from '@/api'
import { NotFoundError } from '@/api/json-api'
import {
  useContractRegistry,
  useRoleManager as _useRoleManager,
} from '@/composables'
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { IRoleManager } from '@/types/contracts/RoleManager'

import { ref, computed, watch } from 'vue'

export type FullUserRoleInfo = UserRoleAdditionalInfo &
  Omit<RoleBaseInfo, 'members'>

export type RoleBaseInfo = {
  roleName: string
  role: string
  members: Array<string>
}

type UserRoleAdditionalInfo = {
  address: string
  name: string
  created_at: string
}

export function useRolesManager() {
  const networkStore = useNetworksStore()
  const web3Store = useWeb3ProvidersStore()
  const provider = computed(() => web3Store.provider)

  const { init: initRegistry, getRoleManagerAddress } = useContractRegistry()
  const {
    init: initRoleManager,
    isRoleSupervisor,
    isMarketplaceManager,
    isWithdrawalManager,
    isAdmin,
    grantRole: _grantRole,
    getRolesDetailedInfoPart,
    getRolesList: _getRolesList,
    revokeRole: _revokeRole,
    getUserRoles: _getUserRoles,
  } = _useRoleManager()

  const hasAdminRole = ref(false)
  const hasRolesManagerRole = ref(false)
  const hasMarketplaceManagerRole = ref(false)
  const hadWithdrawalManagerRole = ref(false)

  const isLoadingRoles = ref(false)
  const isLoadingFailed = ref(false)

  const hasNoRoles = computed(
    () =>
      !isLoadingRoles.value &&
      !hasAdminRole.value &&
      !hasMarketplaceManagerRole.value &&
      !hasRolesManagerRole.value &&
      !hadWithdrawalManagerRole.value,
  )

  const _initContractRegistry = async () => {
    if (!provider.value.chainId) return
    if (!networkStore.list.length) {
      await networkStore.loadNetworks()
    }

    const appropriateRegistryAddress = networkStore.list.find(
      network => network.chain_id === Number(provider.value.chainId),
    )?.factory_address

    if (!appropriateRegistryAddress)
      throw new Error('failed to get registry address')

    initRegistry(appropriateRegistryAddress)
  }

  const _initRoleManager = async () => {
    const address = await getRoleManagerAddress()

    if (!address) throw new Error('failed to get roles manager contract')

    initRoleManager(address)
  }

  const _formatRoleInfo = (
    raw: IRoleManager.DetailedRoleInfoStructOutput,
  ): RoleBaseInfo => {
    return {
      roleName: raw.baseRoleData.roleName,
      role: raw.baseRoleData.role,
      members: raw.members,
    }
  }

  const _fetchUsersRoleInfo = async (members: string[]) => {
    try {
      const { data } = await api.get<UserRoleAdditionalInfo[]>(
        '/integrations/nonce-auth-svc/users',
        {
          filter: {
            address: members.join(','),
          },
        },
      )

      return data
    } catch (error) {
      return [] as UserRoleAdditionalInfo[]
    }
  }

  const checkAdminRole = async (address: string) => {
    const response = await isAdmin(address)

    hasAdminRole.value = Boolean(response)

    return response
  }

  const checkRolesManagerRole = async (address: string) => {
    const response = await isRoleSupervisor(address)

    hasRolesManagerRole.value = Boolean(response)

    return response
  }

  const checkMarketplaceManagerRole = async (address: string) => {
    const response = await isMarketplaceManager(address)

    hasMarketplaceManagerRole.value = Boolean(response)

    return response
  }

  const checkWithdrawalManagerRole = async (address: string) => {
    const response = await isWithdrawalManager(address)

    hadWithdrawalManagerRole.value = Boolean(response)

    return response
  }

  const checkRoles = async () => {
    if (!provider.value.selectedAddress) return

    await checkAdminRole(provider.value.selectedAddress)
    await checkMarketplaceManagerRole(provider.value.selectedAddress)
    await checkRolesManagerRole(provider.value.selectedAddress)
    await checkWithdrawalManagerRole(provider.value.selectedAddress)
  }

  const revokeRole = async (role: string, address: string) => {
    await _initContractRegistry()
    await _initRoleManager()
    await _revokeRole(role, address)
  }

  const grantRole = async (role: string, address: string, name: string) => {
    await _initContractRegistry()
    await _initRoleManager()
    await _grantRole(role, address)

    try {
      await api.get(`/integrations/nonce-auth-svc/users/${address}`)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)

      if (error instanceof NotFoundError) {
        await api.post('/integrations/nonce-auth-svc/users', {
          data: {
            attributes: {
              name,
              address,
            },
          },
        })
      }
    }
  }

  const editUserName = async (name: string, address: string) => {
    try {
      await api.patch(`/integrations/nonce-auth-svc/users/${address}`, {
        data: {
          attributes: {
            name,
          },
        },
      })
    } catch (error) {
      // in case we editing default role that was set on contract during deploy
      if (error instanceof NotFoundError) {
        await api.post('/integrations/nonce-auth-svc/users', {
          data: {
            attributes: {
              name,
              address,
            },
          },
        })
      }
    }
  }

  const getDetailedRolesList = async (
    limit: number,
    offset: number,
  ): Promise<FullUserRoleInfo[]> => {
    if (!limit) return []

    await _initContractRegistry()
    await _initRoleManager()

    const roleRawInfo = await getRolesDetailedInfoPart(limit, offset)

    if (!roleRawInfo) return []

    const formattedInfo = roleRawInfo.map(el => _formatRoleInfo(el))

    const processedInfo: FullUserRoleInfo[] = []

    for (const entry of formattedInfo) {
      const backendData = await _fetchUsersRoleInfo(entry.members)

      for (const member of entry.members) {
        const infoFromBackend = backendData.find(el => el.address === member)

        processedInfo.push({
          roleName: entry.roleName,
          role: entry.role,
          address: member,
          name: infoFromBackend?.name ?? entry.roleName,
          created_at: infoFromBackend?.created_at ?? '',
        })
      }
    }
    return processedInfo
  }

  const getRolesList = async (): Promise<
    Omit<RoleBaseInfo, 'members'>[] | null
  > => {
    await _initContractRegistry()
    await _initRoleManager()

    const data = await _getRolesList()

    if (!data) return null

    return data
      .map(role => ({
        roleName: role.roleName,
        role: role.role,
        roleAdmin: role.roleAdmin,
      }))
      .filter(el => el.roleName !== 'Default admin')
  }

  const getUserRoles = async (address: string) => {
    await _initContractRegistry()
    await _initRoleManager()

    return _getUserRoles(address)
  }

  watch(
    () => provider.value.chainId,
    async () => {
      isLoadingFailed.value = false
      isLoadingRoles.value = true
      try {
        await _initContractRegistry()
        await _initRoleManager()
        await checkRoles()
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        isLoadingFailed.value = true
      }
      isLoadingRoles.value = false
    },
    {
      immediate: true,
    },
  )

  watch(
    () => provider.value.selectedAddress,
    async () => {
      isLoadingFailed.value = false
      isLoadingRoles.value = true
      try {
        await checkRoles()
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        isLoadingFailed.value = true
      }
      isLoadingRoles.value = false
    },
  )

  return {
    hasAdminRole,
    hasMarketplaceManagerRole,
    hasRolesManagerRole,
    hadWithdrawalManagerRole,
    isLoadingRoles,
    isLoadingFailed,
    hasNoRoles,
    grantRole,
    getDetailedRolesList,
    getRolesList,
    editUserName,
    getUserRoles,
    revokeRole,
  }
}
