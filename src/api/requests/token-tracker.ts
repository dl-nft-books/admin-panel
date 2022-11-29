import { api } from '@/api'
import { Payment, PageOrder } from '@/types'
import { config } from '@/config'

export function getPayments(opts: {
  bookId: number | string
  pageLimit?: number
  pageOrder?: PageOrder
}) {
  return api.get<Payment[]>('/integrations/token-tracker/payments', {
    page: {
      limit: opts.pageLimit || config.DEFAULT_PAGE_LIMIT,
      order: opts.pageOrder || 'desc',
    },
    filter: {
      book_id: opts.bookId,
    },
  })
}
