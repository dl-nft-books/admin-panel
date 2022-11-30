import { api, StoreDocument } from '@/api'
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
  banner: StoreDocument
  book: StoreDocument
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
            name: opts.banner._name,
            mime_type: opts.banner._mimeType,
            key: opts.banner._key,
          },
        },
        file: {
          type: 'files',
          attributes: {
            name: opts.book._name,
            mime_type: opts.book._mimeType,
            key: opts.book._key,
          },
        },
      },
    },
  })
}

export function updateBook(opts: {
  bookId: string
  title?: string
  description?: string
  banner?: StoreDocument
  book?: StoreDocument
}) {
  return api.patch(`/integrations/books/${opts.bookId}`, {
    data: {
      type: 'books',
      attributes: {
        ...(opts.title ? { title: opts.title } : {}),
        ...(opts.description ? { description: opts.description } : {}),
        ...(opts.banner
          ? {
              banner: {
                type: 'banners',
                attributes: {
                  name: opts.banner?._name,
                  mime_type: opts.banner?._mimeType,
                  key: opts.banner?._key,
                },
              },
            }
          : {}),
        ...(opts.book
          ? {
              file: {
                type: 'files',
                attributes: {
                  name: opts.book?._name,
                  mime_type: opts.book?._mimeType,
                  key: opts.book?._key,
                },
              },
            }
          : {}),
      },
    },
  })
}
