import { ethers } from 'ethers'
import {
  connectEthAccounts,
  ErrorHandler,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  getNetworkInfo,
  handleEthError,
  requestAddEthChain,
  requestSwitchEthChain,
  getTransactionReceipt as _getTransactionReceipt,
} from '@/helpers'
import { computed, ref } from 'vue'
import {
  EthProviderRpcError,
  EthTransactionResponse,
  ChainId,
  ProviderInstance,
  ProviderWrapper,
  TransactionResponse,
  TxRequestBody,
  NativeCurrency,
} from '@/types'
import { Deferrable } from '@ethersproject/properties'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { useNetworksStore } from '@/store'

export const useMetamask = (provider: ProviderInstance): ProviderWrapper => {
  const chainId = ref<ChainId>('')
  const selectedAddress = ref('')

  const currentProvider = computed(
    () =>
      new ethers.providers.Web3Provider(
        provider as ethers.providers.ExternalProvider,
        'any',
      ),
  )
  const currentSigner = computed(() => currentProvider.value.getSigner())

  const isConnected = computed(() =>
    Boolean(selectedAddress.value && chainId.value),
  )

  const init = async () => {
    _setListeners()
    await _updateProviderState()
  }

  const _setListeners = () => {
    const tempProviderStub = currentProvider.value.provider as {
      on: (eventName: string, cb: () => void) => void
    }

    tempProviderStub.on('accountsChanged', () => {
      _updateProviderState()
    })
    tempProviderStub.on('chainChanged', () => {
      _updateProviderState()
    })
    tempProviderStub.on('disconnect', () => {
      selectedAddress.value = ''
    })
  }

  const _updateProviderState = async () => {
    try {
      const network = await currentProvider.value.detectNetwork()
      chainId.value = network.chainId

      const currentAccounts = await currentProvider.value.listAccounts()
      selectedAddress.value = currentAccounts[0]
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const connect = async () => {
    try {
      await connectEthAccounts(currentProvider.value)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const switchChain = async (chainId: ChainId) => {
    try {
      await requestSwitchEthChain(currentProvider.value, Number(chainId))
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const addChain = async (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
    nativeCurrency: NativeCurrency,
    blockExplorerUrl: string,
  ) => {
    try {
      await requestAddEthChain(
        currentProvider.value,
        Number(chainId),
        chainName,
        chainRpcUrl,
        nativeCurrency,
        blockExplorerUrl,
      )
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const addNetwork = async (chainID: ChainId) => {
    try {
      const networkURLs = getNetworkInfo(chainID)
      const networkStore = useNetworksStore()
      const networkInfo = networkStore.getNetworkByID(Number(chainID))

      if (!networkInfo || !networkURLs) throw new Error('Unsupported network')

      await addChain(
        chainID,
        networkInfo.name,
        networkURLs.rpcUrl,
        {
          name: networkInfo.token_name,
          symbol: networkInfo.token_symbol,
          decimals: networkInfo.decimals,
        },
        networkURLs.blockExplorerUrl,
      )
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }

  const signAndSendTransaction = async (txRequestBody: TxRequestBody) => {
    try {
      const transactionResponse = await currentSigner.value.sendTransaction(
        txRequestBody as Deferrable<TransactionRequest>,
      )
      await transactionResponse.wait()

      return transactionResponse
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getTransactionReceipt = async (transactionHash: string) => {
    try {
      const txInfo = await _getTransactionReceipt(
        currentProvider.value,
        transactionHash,
      )

      return txInfo
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getHashFromTxResponse = (txResponse: TransactionResponse) => {
    const transactionResponse = txResponse as EthTransactionResponse

    return transactionResponse.hash
  }

  const getTxUrl = (explorerUrl: string, txHash: string) => {
    return getEthExplorerTxUrl(explorerUrl, txHash)
  }

  const getAddressUrl = (explorerUrl: string, address: string) => {
    return getEthExplorerAddressUrl(explorerUrl, address)
  }

  const signMessage = async (message: string) => {
    try {
      const signer = currentProvider.value.getSigner()
      const msg = await signer.signMessage(message)
      return msg
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getBalance = async (address: string) => {
    try {
      const balance = await currentProvider.value.getBalance(address)

      return balance
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    currentProvider,
    currentSigner,

    chainId,
    selectedAddress,
    isConnected,

    init,
    connect,
    switchChain,
    addChain,
    signAndSendTransaction,
    getHashFromTxResponse,
    getTxUrl,
    getAddressUrl,
    signMessage,
    addNetwork,
    getTransactionReceipt,
    getBalance,
  }
}
