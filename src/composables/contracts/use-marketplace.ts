import { computed, ref, Ref } from 'vue'
import { MarketPlace__factory, UnwrappedProvider } from '@/types'
import { ErrorHandler, sleep } from '@/helpers'

export type TokenParams = {
  pricePerOneToken: string
  minNFTFloorPrice: string
  voucherTokensAmount: string
  voucherTokenContract: string
  fundsRecipient: string
  isNFTBuyable: boolean
  isDisabled: boolean
  isVoucherBuyable: boolean
}

export const useMarketplace = (
  provider: Ref<UnwrappedProvider>,
  address?: string,
) => {
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

      const txHash = (receipt as unknown as { transactionHash: string })
        .transactionHash

      const txInfo = await provider.value.getTransactionReceipt(txHash)

      return txInfo
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const updateAllParams = async (
    tokenContract: string,
    params: TokenParams,
  ) => {
    try {
      const data = contractInterface.encodeFunctionData('updateTokenParams', [
        tokenContract,
        params,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)

      return receipt
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const getTokenParams = async (tokenContracts: string[]) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getDetailedTokenInfo(
        tokenContracts,
      )

      return data
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const getTokenContractsCount = async () => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getActiveTokenContractsCount()

      return data
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const getBooksContracts = async (limit: number, offset: number) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getTokenContractsPart(
        offset,
        limit,
      )

      return data
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const getBooksBatch = async (limit: number, offset: number) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getBriefTokenInfoPart(
        offset,
        limit,
      )

      return data
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const withdrawFunds = async (
    tokenAddress: string,
    recipient: string,
    amount: string,
    isMax: boolean,
  ) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('withdrawCurrency', [
        tokenAddress,
        recipient,
        amount,
        isMax,
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
    deployTokenContract,
    updateAllParams,
    getTokenParams,
    getTokenContractsCount,
    getBooksContracts,
    getBooksBatch,
    withdrawFunds,
  }
}
