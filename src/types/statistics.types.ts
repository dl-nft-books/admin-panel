import { JsonApiRecordBase } from '@distributedlab/jac'

import { TOKEN_TYPES } from '@/enums'

export type Payment = JsonApiRecordBase<TOKEN_TYPES> & {
  amount: string
  book_id: number
  contract_address: string
  minted_token_price: string
  payer_address: string
  payment_token_price: string
  purchase_timestamp: string
  token_id: number
  erc20_data: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
}

// Just refactored types due to updated statics on backend
// Implementation of statistics will be in another branch

export type StatisticsByBook = JsonApiRecordBase<'statistics'> & {
  chain_pie_chart: ChainPieChartData
  date_graph: DateGraphStatistics[]
  nft_list: NftStatistics[] | null
  tokens_histogram: TokenHistogramData
}

export type GeneralStatistics = JsonApiRecordBase<'statistics'> & {
  amount_pie_chart: AmountPieChartData
  chain_pie_chart: ChainPieChartData
  nft_list: NftStatistics[] | null
  price_pie_chart: TokenHistogramData
  token_list: TokenStatistics[]
}

type AmountPieChartData = JsonApiRecordBase<'amount_pie_chart'> & {
  books: AmountStatistics[]
  total: number
}

type AmountStatistics = JsonApiRecordBase<'amount'> & {
  amount: number
  book_id: number
}

type DateGraphStatistics = JsonApiRecordBase<'date_info'> & {
  amount: number
  date: string
}

type NftStatistics = JsonApiRecordBase<'nft-list'> & {
  address: string
}

type ChainPieChartData = JsonApiRecordBase<'chain_pie_chart'> & {
  chains: ChainStatistics[]
  total: number
}

type ChainStatistics = JsonApiRecordBase<'chain'> & {
  amount: number
  chain_id: string
}

type TokenHistogramData = JsonApiRecordBase<'token_histogram'> & {
  tokens: TokenStatistics[]
  total: string
}

type TokenStatistics = JsonApiRecordBase<'token'> & {
  name: string
  native_currency: string
  usd: string
}
