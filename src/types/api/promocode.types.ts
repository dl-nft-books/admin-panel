import { PROMOCODE_STATUSES } from '@/enums'
import { JsonApiRecordBase } from '@/types'

export type Promocode = JsonApiRecordBase<'promocode'> & {
  discount: number
  expiration_date: string
  promocode: string
  state: PROMOCODE_STATUSES
  usages: number
  initial_usages: number
  books: Array<number>
}
