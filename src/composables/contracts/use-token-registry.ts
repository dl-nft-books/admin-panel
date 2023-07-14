import { computed, ref, Ref } from 'vue'
import {
  TokenRegistry__factory,
  EthProviderRpcError,
  UnwrappedProvider,
} from '@/types'
import { handleEthError } from '@/helpers'

const VOUCHERS_POOL_NAME = 'VOUCHER_TOKEN'

export const useTokenRegistry = (
  provider: Ref<UnwrappedProvider>,
  address?: string,
) => {
  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        TokenRegistry__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )) ||
      undefined,
  )

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const getVoucherListPart = async (limit: number, offset: number) => {
    if (!contractInstance.value) return
    try {
      const data = await contractInstance.value.getBaseTokenDataPart(
        VOUCHERS_POOL_NAME,
        offset,
        limit,
      )

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    getVoucherListPart,
  }
}
