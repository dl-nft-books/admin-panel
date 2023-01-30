import { api } from '@/api'
import { config } from '@/config'
import { PageOrder, Network } from '@/types'

export function getNetworks(opts?: {
  pageLimit?: number
  pageOrder?: PageOrder
}) {
  return api.get<Network[]>('/integrations/networks', {
    page: {
      limit: opts?.pageLimit || config.DEFAULT_PAGE_LIMIT,
      order: opts?.pageOrder || 'desc',
    },
  })
}
