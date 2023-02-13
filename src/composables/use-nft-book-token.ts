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
    minNFTFloorPrice: string,
    name: string,
    symbol: string,
  ) => {
    try {
      const convertedPrice = new BN(price).toWei().toString()
      const convertedFloorPrice = new BN(minNFTFloorPrice).toWei().toString()

      const updateTx = await _instance_rw.value?.updateTokenContractParams(
        convertedPrice,
        convertedFloorPrice,
        name,
        symbol,
      )

      await updateTx?.wait()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const updateVoucherParams = async (
    voucherTokenAddress: string,
    voucherTokenAmount: string,
  ) => {
    try {
      const convertedAmount = new BN(voucherTokenAmount).toWei().toString()

      const updateTx = await _instance_rw.value?.updateVoucherParams(
        voucherTokenAddress,
        convertedAmount,
      )

      await updateTx?.wait()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    updateTokenContractParams,
    updateVoucherParams,
  }
}
