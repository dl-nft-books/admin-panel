import { useWeb3ProvidersStore } from '@/store'
import { computed, ref } from 'vue'
import { Voucher__factory, EthProviderRpcError } from '@/types'
import { handleEthError } from '@/helpers'

export const useVoucherContract = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInterface = Voucher__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const mintVoucher = async (address: string, amount: string) => {
    try {
      const data = contractInterface.encodeFunctionData('mint', [
        address,
        amount,
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
    mintVoucher,
  }
}
