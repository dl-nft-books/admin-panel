import { ref, computed } from 'vue'
import { NftBookToken__factory, EthProviderRpcError } from '@/types'
import { BN } from '@/utils/math.util'
import { handleEthError, sleep } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

export const useNftBookToken = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentSigner &&
        !!contractAddress.value &&
        NftBookToken__factory.connect(
          contractAddress.value,
          provider.value.currentSigner,
        )) ||
      undefined,
  )

  const contractInterface = NftBookToken__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
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

      const data = contractInterface.encodeFunctionData(
        'updateTokenContractParams',
        [convertedPrice, convertedFloorPrice, name, symbol],
      )

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

  const updateVoucherParams = async (
    voucherTokenAddress: string,
    voucherTokenAmount: string,
  ) => {
    try {
      const convertedAmount = new BN(voucherTokenAmount).toWei().toString()

      const data = contractInterface.encodeFunctionData('updateVoucherParams', [
        voucherTokenAddress,
        convertedAmount,
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

  const minNFTFloorPrice = () => {
    if (!contractInstance.value) return

    return contractInstance.value.minNFTFloorPrice()
  }

  return {
    init,
    updateTokenContractParams,
    updateVoucherParams,
    minNFTFloorPrice,
  }
}
