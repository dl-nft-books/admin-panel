import { PROMOCODE_STATUSES } from '@/enums'
import { JsonApiRecordBase } from '@/types'

export type Statistics = JsonApiRecordBase<'statistics'> & {
  amount_pie_chart: AmountPieChart
  price_pie_chart: PricePieChart
  chain_pie_chart: string
  token_list: PROMOCODE_STATUSES
  nft_list: number
}

type AmountPieChart = JsonApiRecordBase<'amount_pie_chart'> & {
  books: AmountPieChartBooks
  total: number
}

type AmountPieChartBooks = JsonApiRecordBase<'books'> & {
  address: string
  amount: number
}

type PricePieChart = JsonApiRecordBase<'amount_pie_chart'> & {
  books: AmountPieChartBooks
  total: number
}

export type StatisticsByBook = JsonApiRecordBase<'statistics'> & {
  tokens_histogram: PricePieChart
  chain_pie_chart: string
  date_graph: PROMOCODE_STATUSES
  nft_list: number
}
