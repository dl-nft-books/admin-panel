import { defineStore } from 'pinia'
import { useProvider, useWeb3 } from '@/composables'
import { ChainId, DesignatedProvider } from '@/types'
import { ErrorHandler, getNetworkInfo } from '@/helpers'
import { useNetworksStore } from '@/store'

export const useWeb3ProvidersStore = defineStore('web3-providers-store', {
  state: () => ({
    providers: [] as DesignatedProvider[],
    provider: useProvider(),
  }),
  actions: {
    async detectProviders() {
      const web3 = useWeb3()
      await web3.init()
      this.providers = web3.providers.value
    },

    addProvider(provider: DesignatedProvider) {
      this.providers.push(provider)
    },

    async addNetwork(chainID: ChainId) {
      try {
        const networkURLs = getNetworkInfo(chainID)
        const networkStore = useNetworksStore()
        const networkInfo = networkStore.getNetworkByID(Number(chainID))

        if (!networkInfo || !networkURLs) throw new Error('Unsupported network')

        await this.provider.addChain(
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
