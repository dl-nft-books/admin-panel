import { ref, Ref } from 'vue'
import { TokenFactory__factory, UnwrappedProvider } from '@/types'
import { ErrorHandler } from '@/helpers'

export const useTokenFactory = (
  provider: Ref<UnwrappedProvider>,
  address?: string,
) => {
  const contractAddress = ref(address || '')

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
      ErrorHandler.process(error)
    }
  }

  return {
    init,
    deployVoucher,
  }
}
