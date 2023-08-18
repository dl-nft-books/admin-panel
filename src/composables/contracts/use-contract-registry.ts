import { computed, ref, Ref } from 'vue'
import { ContractRegistry__factory, UnwrappedProvider } from '@/types'
import { ErrorHandler } from '@/helpers'

export const useContractRegistry = (
  provider: Ref<UnwrappedProvider>,
  address?: string,
) => {
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
      ErrorHandler.process(error)
    }
  }

  const getRoleManagerAddress = async () => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getRoleManagerContract()

      return data
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const getTokenFactoryAddress = async () => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getTokenFactoryContract()

      return data
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const getTokenRegistryAddress = async () => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getTokenRegistryContract()

      return data
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  return {
    init,
    getMarketPlaceAddress,
    getRoleManagerAddress,
    getTokenFactoryAddress,
    getTokenRegistryAddress,
  }
}
