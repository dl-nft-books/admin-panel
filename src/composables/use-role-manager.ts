import {
  ROLES,
  useContractRegistry,
  useRoleManager as _useRoleManager,
} from '@/composables'
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'

import { ref, computed, watch } from 'vue'

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

  const grantRole = async (role: ROLES, address: string) => {
    await _grantRole(role, address)
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
  }
}
