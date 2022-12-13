import { api, Document } from '@/api'
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

//  When functionality on backend is fixed it will be implemented
export function getBookByTitle(title: string) {
  return api.get<Book>(`/integrations/books/title${title}`)
}

export function createBook(opts: {
  tokenName: string
  tokenSymbol: string
  description: string
  price: string
  banner: Document
  book: Document
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
          attributes: opts.banner,
        },
        file: {
          type: 'files',
          attributes: opts.book,
        },
      },
    },
  })
}

export function updateBook(opts: {
  bookId: string
  title?: string
  description?: string
  banner: Document
  book: Document
}) {
  return api.patch(`/integrations/books/${opts.bookId}`, {
    data: {
      type: 'books',
      attributes: {
        ...(opts.title ? { title: opts.title } : {}),
        ...(opts.description ? { description: opts.description } : {}),
        ...(opts.banner.file
          ? {
              banner: {
                type: 'banners',
                attributes: opts.banner,
              },
            }
          : {}),
        ...(opts.book.file
          ? {
              file: {
                type: 'files',
                attributes: opts.book,
              },
            }
          : {}),
      },
    },
  })
}
