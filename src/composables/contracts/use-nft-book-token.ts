import { ref, watch, computed } from 'vue'
import {
  NftBookToken,
  NftBookToken__factory,
  EthProviderRpcError,
} from '@/types'
import { BN } from '@/utils/math.util'
import { handleEthError } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

export const useNftBookToken = (address?: string) => {
  const _instance = ref<NftBookToken | undefined>()
  const _instance_rw = ref<NftBookToken | undefined>()

  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  watch(provider, () => {
    if (address) init(address)
  })

  if (
    address &&
    provider.value.currentProvider &&
    provider.value.currentSigner
  ) {
    _instance.value = NftBookToken__factory.connect(
      address,
      provider.value.currentProvider,
    )
    _instance_rw.value = NftBookToken__factory.connect(
      address,
      provider.value.currentSigner,
    )
  }

  const init = (address: string) => {
    if (
      address &&
      provider.value.currentProvider &&
      provider.value.currentSigner
    ) {
      _instance.value = NftBookToken__factory.connect(
        address,
        provider.value.currentProvider,
      )
      _instance_rw.value = NftBookToken__factory.connect(
        address,
        provider.value.currentSigner,
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
