import { defineStore } from 'pinia'
import { ChainId, EthProviderRpcError, Network, UseProvider } from '@/types'
import { getNetworks } from '@/api'
import { ErrorHandler, getNetworkInfo } from '@/helpers'
import { EIP1193 } from '@/enums'

export const useNetworksStore = defineStore('networks', {
  state: () => ({
    list: [] as Network[],
    isLoaded: false,
  }),
  actions: {
    async loadNetworks(): Promise<void> {
      this.isLoaded = false
      try {
        const { data: networks } = await getNetworks()

        this.list = networks
        this.isLoaded = true
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },

    getNetworkByID(id: number): Network | undefined {
      return this.list.find(network => network.chain_id === id)
    },

    async switchNetwork(provider: UseProvider, chainID: ChainId) {
      try {
        await provider.switchChain(chainID)
      } catch (error) {
        const ethError = error as EthProviderRpcError

        // if wallet has no chain added we need to add it and switch to it
        if (ethError?.code === EIP1193.walletMissingChain) {
          await this.addNetwork(provider, chainID)
        }

        ErrorHandler.processWithoutFeedback(error)
      }
    },

    async addNetwork(provider: UseProvider, chainID: ChainId) {
      try {
        const networkURLs = getNetworkInfo(chainID)
        const networkInfo = this.list.find(
          network => network.chain_id === Number(chainID),
        )

        if (!networkInfo || !networkURLs) return
        await provider.addChain(
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
    },
  },
})
