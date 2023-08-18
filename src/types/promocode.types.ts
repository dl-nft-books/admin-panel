import { JsonApiRecordBase } from '@distributedlab/jac'

import { PROMOCODE_STATUSES } from '@/enums'

export type Promocode = JsonApiRecordBase<'promocode'> & {
  discount: number
  expiration_date: string
  promocode: string
  state: PROMOCODE_STATUSES
  usages: number
  initial_usages: number
  books: Array<number>
}
