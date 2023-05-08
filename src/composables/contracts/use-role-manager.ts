import { useWeb3ProvidersStore } from '@/store'
import { computed, ref } from 'vue'
import { RoleManager__factory, EthProviderRpcError } from '@/types'
import { handleEthError, sleep } from '@/helpers'

export enum ROLES {
  admin = 'e5a0b4d50f56047f84728557fedbda92f956391bc9d5c762e8461996dd8e7ad7',
  tokenFactoryManager = '9b3077845551d13315ea3fdea4fe39ce79a7046bbe3a9a3e08358c080c7e19a6',
  tokenRegistryManager = '4564dc68c6f36c264e1671b056a553d485b86dc9e2e186ca7ab933dbedf609fd',
  tokenManager = '593fb413ec9f9ad9f53f309300b515310ff474591268ca3cbe9752fd88eb76a0',
  roleSupervisor = '0c7ade2c7c08453ea605b4a8f3fb0e03e3ffcffbfa41ca8ee543d0fd74cada38',
  withdrawalManager = '8c2448210e908fe94c15d486079b8c1daacbaa9169018ef9ea35bf02aeeb558d',
  marketPlaceManager = '222f64fc3b8eb8a095e07f1e2e07b8043e0434ea0260bed1f246981164619676',
}

export const useRoleManager = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        RoleManager__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )) ||
      undefined,
  )

  const contractInterface = RoleManager__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const isAdmin = async (address: string) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.isAdmin(address)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const isTokenFactoryManager = async (address: string) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.isTokenFactoryManager(address)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const isTokenRegistryManager = async (address: string) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.isTokenRegistryManager(address)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const isTokenManager = async (address: string) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.isTokenManager(address)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const isRoleSupervisor = async (address: string) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.isRoleSupervisor(address)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const isWithdrawalManager = async (address: string) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.isWithdrawalManager(address)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const isMarketplaceManager = async (address: string) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.isMarketplaceManager(address)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const hasAnyRole = async (address: string) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.hasAnyRole(address)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const grantRole = async (role: ROLES, address: string) => {
    try {
      const data = contractInterface.encodeFunctionData('grantRole', [
        role,
        address,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const grantRoleBatch = async (
    roles: Array<ROLES>,
    accounts: Array<string>,
  ) => {
    try {
      const data = contractInterface.encodeFunctionData('grantRoleBatch', [
        roles,
        accounts,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    isAdmin,
    isTokenFactoryManager,
    isTokenRegistryManager,
    isTokenManager,
    isRoleSupervisor,
    isWithdrawalManager,
    isMarketplaceManager,
    hasAnyRole,
    grantRole,
    grantRoleBatch,
  }
}
