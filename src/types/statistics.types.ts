import { JsonApiRecordBase } from '@/types'

export type TokenStatistics = {
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
