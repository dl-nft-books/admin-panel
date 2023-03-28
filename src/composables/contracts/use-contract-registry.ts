import { useWeb3ProvidersStore } from '@/store'
import { computed, ref } from 'vue'
import { ContractRegistry__factory, EthProviderRpcError } from '@/types'
import { handleEthError } from '@/helpers'

export const useContractRegistry = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        ContractRegistry__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )) ||
      undefined,
  )

  // eslint-disable-next-line
  const contractInterface = ContractRegistry__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const getMarketPlaceAddress = async () => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getMarketplaceContract()

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getRoleManagerAddress = async () => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getRoleManagerContract()

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    getMarketPlaceAddress,
    getRoleManagerAddress,
  }
}
