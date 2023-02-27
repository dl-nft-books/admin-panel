import { ref, computed } from 'vue'
import { TokenFactory__factory, EthProviderRpcError } from '@/types'

import { handleEthError, sleep } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

export const useTokenFactory = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  // temporary unused
  // eslint-disable-next-line
  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentSigner &&
        !!contractAddress.value &&
        TokenFactory__factory.connect(
          contractAddress.value,
          provider.value.currentSigner,
        )) ||
      undefined,
  )

  const contractInterface = TokenFactory__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
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
      const data = contractInterface.encodeFunctionData('deployTokenContract', [
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
    deployTokenContract,
  }
}
