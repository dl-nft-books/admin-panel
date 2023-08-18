import { ref, Ref } from 'vue'
import { Voucher__factory, UnwrappedProvider } from '@/types'
import { ErrorHandler } from '@/helpers'

export const useVoucherContract = (
  provider: Ref<UnwrappedProvider>,
  address?: string,
) => {
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
      ErrorHandler.process(error)
    }
  }

  return {
    init,
    mintVoucher,
  }
}
