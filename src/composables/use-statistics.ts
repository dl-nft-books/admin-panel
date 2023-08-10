import { api } from '@/api'
import { config } from '@/config'
import {
  GeneralStatistics,
  StatisticsByBook,
  PageOrder,
  Payment,
} from '@/types'
import { flattenNestedResponseData } from '@/helpers'

export function useStatistics() {
  const getStatistics = async () => {
    const { data } = await api.get<GeneralStatistics>(
      '/integrations/tracker/statistics',
    )

    return flattenNestedResponseData(data)
  }

  const getStatisticByBookId = async (id: string) => {
    const { data } = await api.get<StatisticsByBook>(
      `/integrations/tracker/statistics/${id}`,
    )

    return flattenNestedResponseData(data)
  }

  const getPayments = (opts: {
    bookIds?: (number | string)[]
    ids?: (number | string)[]
    tokenAddresses?: string[]
    pageLimit?: number
    pageOrder?: PageOrder
  }) => {
    return api.get<Payment[]>('/integrations/tracker/payments', {
      query: {
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
      },
    })
  }

  return {
    getStatistics,
    getStatisticByBookId,
    getPayments,
  }
}
