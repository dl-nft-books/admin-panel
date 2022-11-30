import { JsonApiRecordBase } from '@/types'

export type Payment = JsonApiRecordBase<'payment'> & {
  payer_address: string
  amount: string
  minted_token_price: string
  purchase_timestamp: string
  book_url: string
  erc20_data: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
}
