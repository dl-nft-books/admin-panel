import { api } from '@/api'
import { config } from '@/config'
import { PROMOCODE_STATUSES } from '@/enums'
import { PageOrder, Promocode } from '@/types'

export function getPromocodes(opts: {
  pageLimit?: number
  pageOrder?: PageOrder
  status?: PROMOCODE_STATUSES[]
}) {
  return api.get<Promocode[]>('/integrations/generator/promocodes', {
    page: {
      limit: opts.pageLimit ?? config.DEFAULT_PAGE_LIMIT,
      order: opts.pageOrder ?? 'desc',
    },
    filter: {
      ...(opts.status?.length ? { state: opts.status.join(',') } : {}),
    },
  })
}

export function updatePromocode(numberOfUses: number, id: string) {
  return api.patch(`/integrations/generator/promocodes/${id}`, {
    data: {
      attributes: {
        initial_usages: numberOfUses,
      },
    },
  })
}

export function createPromocode(opts: {
  discount: number
  initial_usages: number
  expiration_date: string
}) {
  return api.post<Promocode>('/integrations/generator/promocodes', {
    data: {
      attributes: {
        discount: opts.discount,
        expiration_date: opts.expiration_date,
        initial_usages: opts.initial_usages,
      },
    },
  })
}

export function deletePromocode(id: string) {
  return api.delete(`/integrations/generator/promocodes/${id}`)
}
