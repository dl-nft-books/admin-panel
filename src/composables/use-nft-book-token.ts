import { ref, watch } from 'vue'
import {
  NftBookToken,
  NftBookToken__factory,
  UseUnrefProvider,
  EthProviderRpcError,
} from '@/types'
import { BN } from '@/utils/math.util'
import { handleEthError } from '@/helpers'

export const useNftBookToken = (
  provider: UseUnrefProvider,
  address?: string,
) => {
  const _instance = ref<NftBookToken | undefined>()
  const _instance_rw = ref<NftBookToken | undefined>()

  watch(provider, () => {
    if (address) init(address)
  })

  if (address && provider.currentProvider && provider.currentSigner) {
    _instance.value = NftBookToken__factory.connect(
      address,
      provider.currentProvider,
    )
    _instance_rw.value = NftBookToken__factory.connect(
      address,
      provider.currentSigner,
    )
  }

  const init = (address: string) => {
    if (address && provider.currentProvider && provider.currentSigner) {
      _instance.value = NftBookToken__factory.connect(
        address,
        provider.currentProvider,
      )
      _instance_rw.value = NftBookToken__factory.connect(
        address,
        provider.currentSigner,
      )
    }
  }

  const updateTokenContractParams = async (
    price: string,
    name: string,
    symbol: string,
  ) => {
    try {
      const convertedPrice = new BN(price).toWei().toString()
      const updateTx = await _instance_rw.value?.updateTokenContractParams(
        convertedPrice,
        name,
        symbol,
      )

      await updateTx?.wait()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    updateTokenContractParams,
  }
}
