import { api } from '@/api'
import { Book, PageOrder, CreateBookResponse } from '@/types'
import { BOOK_DEPLOY_STATUSES } from '@/enums'
import { config } from '@/config'

export function getBooks(opts: {
  deployStatus?: BOOK_DEPLOY_STATUSES[]
  chainId?: number
  pageLimit?: number
  pageOrder?: PageOrder
}) {
  return api.get<Book[]>('/integrations/books', {
    page: {
      limit: opts.pageLimit || config.DEFAULT_PAGE_LIMIT,
      order: opts.pageOrder || 'desc',
    },
    filter: {
      ...(opts.deployStatus?.length
        ? { deploy_status: opts.deployStatus.join(',') }
        : {}),
      ...(opts.chainId ? { chain_id: opts.chainId } : {}),
    },
  })
}

export function getBookById(id: number | string) {
  return api.get<Book>(`/integrations/books/${id}`)
}

export function createBook(opts: {
  tokenName: string
  tokenSymbol: string
  description: string
  price: string
  bookKey: string
  bannerKey: string
  bookName: string
  bannerName: string
  bookType: string
  bannerType: string
}) {
  return api.post<CreateBookResponse>('/integrations/books', {
    data: {
      type: 'books',
      attributes: {
        title: opts.tokenName,
        description: opts.description,
        token_name: opts.tokenName,
        token_symbol: opts.tokenSymbol,
        price: opts.price,
        banner: {
          type: 'banners',
          attributes: {
            name: opts.bannerName,
            mime_type: opts.bannerType,
            key: opts.bannerKey,
          },
        },
        file: {
          type: 'files',
          attributes: {
            name: opts.bookName,
            mime_type: opts.bookType,
            key: opts.bookKey,
          },
        },
      },
    },
  })
}
