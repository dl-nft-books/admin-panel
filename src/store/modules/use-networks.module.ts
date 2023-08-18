import { defineStore } from 'pinia'
import { JsonApiRecordBase } from '@distributedlab/jac'

import { api } from '@/api'
import { PageOrder } from '@/types'
import { config } from '@/config'

type Network = JsonApiRecordBase<'networks'> & {
  chain_id: number
  factory_address: string
  name: string
  token_name: string
  token_symbol: string
  rpc_url: string
  decimals: number
}

export const useNetworksStore = defineStore('networks', {
  state: () => ({
    list: [] as Network[],
  }),
  actions: {
    // Loads supported network from backend
    async loadNetworks(opts?: {
      pageLimit?: number
      pageOrder?: PageOrder
    }): Promise<void> {
      const { data: networks } = await api.get<Network[]>(
        '/integrations/networks',
        {
          query: {
            page: {
              limit: opts?.pageLimit || config.DEFAULT_PAGE_LIMIT,
              order: opts?.pageOrder || 'desc',
            },
          },
        },
      )

      this.list = networks
    },

    getNetworkByID(id: number): Network | undefined {
      return this.list.find(network => network.chain_id === id)
    },
  },
})
