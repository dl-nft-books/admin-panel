import { defineStore } from 'pinia'
import { Network } from '@/types'
import { getNetworks } from '@/api'
import { ErrorHandler } from '@/helpers'

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
  },
})
