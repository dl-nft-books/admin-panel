import { ref, watch } from 'vue'
import {
  TokenFactory,
  TokenFactory__factory,
  EthProviderRpcError,
  DesignatedProvider,
  ChainId,
  TransactionResponse,
  TxRequestBody,
} from '@/types'
import { ethers } from 'ethers'
import { PROVIDERS } from '@/enums'
import { handleEthError } from '@/helpers'

export interface UseUnrefProvider {
  currentProvider: ethers.providers.Web3Provider | undefined
  currentSigner: ethers.providers.JsonRpcSigner | undefined

  selectedProvider: PROVIDERS | undefined
  chainId: ChainId | undefined
  selectedAddress: string | undefined
  isConnected: boolean

  init: (provider: DesignatedProvider) => Promise<void>
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: ChainId) => Promise<void>
  addChain: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
  ) => Promise<void>
  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
  signMessage: (message: string) => Promise<string | undefined>
}

export const useTokenFactory = (
  provider: UseUnrefProvider,
  address?: string,
) => {
  const _instance = ref<TokenFactory | undefined>()
  const _instance_rw = ref<TokenFactory | undefined>()

  watch(provider, () => {
    if (address) init(address)
  })

  if (address && provider.currentProvider && provider.currentSigner) {
    _instance.value = TokenFactory__factory.connect(
      address,
      provider.currentProvider,
    )
    _instance_rw.value = TokenFactory__factory.connect(
      address,
      provider.currentSigner,
    )
  }

  const init = (address: string) => {
    if (address && provider.currentProvider && provider.currentSigner) {
      _instance.value = TokenFactory__factory.connect(
        address,
        provider.currentProvider,
      )
      _instance_rw.value = TokenFactory__factory.connect(
        address,
        provider.currentSigner,
      )
    }
  }

  const deployTokenContract = async (
    tokenId: string,
    name: string,
    symbol: string,
    amount: string,
    r: string,
    s: string,
    v: number,
  ) => {
    try {
      const contractTransaction = await _instance_rw.value?.deployTokenContract(
        +tokenId,
        name,
        symbol,
        amount,
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
