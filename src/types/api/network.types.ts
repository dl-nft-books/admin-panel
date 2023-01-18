import { JsonApiRecordBase } from '@/types'

export type Network = JsonApiRecordBase<'networks'> & {
  chain_id: number
  factory_address: string
  name: string
  token_name: string
  token_symbol: string
  rpc_url: string
}
