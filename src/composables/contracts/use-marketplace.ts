import { useWeb3ProvidersStore } from '@/store'
import { computed, ref } from 'vue'
import { MarketPlace__factory, EthProviderRpcError } from '@/types'
import { handleEthError, sleep } from '@/helpers'

type TokenParams = {
  pricePerOneToken: string
  minNFTFloorPrice: string
  voucherTokensAmount: string
  isNFTBuyable: boolean
  voucherTokenContract: string
  fundsRecipient: string
}

export const useMarketplace = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        MarketPlace__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )) ||
      undefined,
  )

  const contractInterface = MarketPlace__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const deployTokenContract = async (
    name: string,
    symbol: string,
    params: TokenParams,
  ) => {
    try {
      const data = contractInterface.encodeFunctionData('addToken', [
        name,
        symbol,
        params,
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

  const updateAllParams = async (
    tokenContract: string,
    name: string,
    symbol: string,
    params: TokenParams,
  ) => {
    try {
      const data = contractInterface.encodeFunctionData('updateAllParams', [
        tokenContract,
        name,
        symbol,
        params,
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

  const getTokenParams = async (tokenContract: string) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getTokenParams(tokenContract)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getTokenContractsCount = async () => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getTokenContractsCount()

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    deployTokenContract,
    updateAllParams,
    getTokenParams,
    getTokenContractsCount,
  }
}
