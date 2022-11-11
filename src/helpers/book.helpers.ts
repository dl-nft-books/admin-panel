import { api } from '@/api'
import { BookResponse, BookSaleHistory } from '@/types'
import { BOOK_DEPLOY_STATUSES } from '@/enums'

export async function createBook(opts: {
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
  const { data } = await api.post<{
    token_id: string
    book_id: string
    signature: {
      r: string
      s: string
      v: number
    }
  }>('/integrations/books', {
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

  return data
}

export async function getBooks(opts: {
  deployStatus?: BOOK_DEPLOY_STATUSES[]
}) {
  const { data } = await api.get<BookResponse[]>('/integrations/books', {
    page: {
      limit: 100, // FIXME: add pagination
    },
    filter: {
      ...(opts.deployStatus?.length
        ? { deploy_status: opts.deployStatus.join(',') }
        : {}),
    },
  })

  return data
}

export async function getBookById(id: number | string) {
  const { data } = await api.get<BookResponse>(`/integrations/books/${id}`)

  return data
}

export async function getSaleHistory(opts: { bookId: number | string }) {
  const { data } = await api.get<BookSaleHistory[]>(
    '/integrations/token-tracker/payments',
    {
      page: {
        limit: 100, // FIXME: add pagination
      },
      filter: {
        book_id: opts.bookId,
      },
    },
  )

  return data
}
