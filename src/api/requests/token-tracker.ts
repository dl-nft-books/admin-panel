import { api } from '@/api'
import { Payment, PageOrder } from '@/types'
import { config } from '@/config'

export function getPayments(opts: {
  bookIds?: (number | string)[]
  ids?: (number | string)[]
  tokenAddresses?: string[]
  pageLimit?: number
  pageOrder?: PageOrder
}) {
  return api.get<Payment[]>('/integrations/tracker/payments', {
    page: {
      limit: opts.pageLimit || config.DEFAULT_PAGE_LIMIT,
      order: opts.pageOrder || 'desc',
    },
    filter: {
      ...(opts?.bookIds?.length ? { book_id: opts.bookIds.join(',') } : {}),
      ...(opts?.ids?.length ? { id: opts.ids.join(',') } : {}),
      ...(opts?.tokenAddresses?.length
        ? { token_address: opts.tokenAddresses.join(',') }
        : {}),
    },
  })
}
