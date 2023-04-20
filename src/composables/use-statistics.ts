import { api } from '@/api'
import { JsonApiRecordBase, Statistics } from '@/types'

type TokenStatistics = {
  name: string
  native_currency: number
  usd: number
}

export type StatisticByBook = JsonApiRecordBase<'statistics'> & {
  tokens_histogram: {
    attributes: {
      total: number
      tokens: Array<{
        attributes: TokenStatistics
      }>
    }
  }
}

export function useStatistics() {
  const getStatistics = () => {
    return api.get<Statistics>('/integrations/tracker/statistics')
  }

  const getStatisticByBookId = (id: string) => {
    return api.get<StatisticByBook>(`/integrations/tracker/statistics/${id}`)
  }

  return {
    getStatistics,
    getStatisticByBookId,
  }
}
