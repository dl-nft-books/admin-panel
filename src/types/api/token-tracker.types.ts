import { TOKEN_TYPES } from '@/enums'
import { JsonApiRecordBase } from '@/types'

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
