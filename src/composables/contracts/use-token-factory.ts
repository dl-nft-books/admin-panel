import { useWeb3ProvidersStore } from '@/store'
import { computed, ref } from 'vue'
import { TokenFactory__factory, EthProviderRpcError } from '@/types'
import { handleEthError } from '@/helpers'

export const useTokenFactory = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  // eslint-disable-next-line
  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        TokenFactory__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )) ||
      undefined,
  )

  const contractInterface = TokenFactory__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const deployVoucher = async (voucherName: string, voucherSymbol: string) => {
    try {
      const data = contractInterface.encodeFunctionData('deployVoucher', [
        voucherName,
        voucherSymbol,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    deployVoucher,
  }
}
