import { ref, watch, computed } from 'vue'
import {
  TokenFactory,
  TokenFactory__factory,
  EthProviderRpcError,
} from '@/types'

import { handleEthError } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

export const useTokenFactory = (address?: string) => {
  const _instance = ref<TokenFactory | undefined>()
  const _instance_rw = ref<TokenFactory | undefined>()

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
    _instance.value = TokenFactory__factory.connect(
      address,
      provider.value.currentProvider,
    )
    _instance_rw.value = TokenFactory__factory.connect(
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
      _instance.value = TokenFactory__factory.connect(
        address,
        provider.value.currentProvider,
      )
      _instance_rw.value = TokenFactory__factory.connect(
        address,
        provider.value.currentSigner,
      )
    }
  }

  const deployTokenContract = async (
    tokenId: string,
    name: string,
    symbol: string,
    amount: string,
    voucherTokenContract: string,
    voucherTokensAmount: string,
    r: string,
    s: string,
    v: number,
  ) => {
    try {
      const contractTransaction = await _instance_rw.value?.deployTokenContract(
        {
          tokenContractId: Number(tokenId),
          tokenName: name,
          tokenSymbol: symbol,
          pricePerOneToken: amount,
          voucherTokenContract,
          voucherTokensAmount,
        },
        r,
        s,
        v,
      )

      await contractTransaction?.wait()

      return contractTransaction
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    deployTokenContract,
  }
}
