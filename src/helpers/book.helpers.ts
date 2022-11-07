import { api } from '@/api'
import { BookResponse } from '@/types'

export async function createBook(opts: {
  name: string
  description: string
  contractAddress: string
  price: string
  bookKey: string
  bannerKey: string
  bookName: string
  bannerName: string
  bookType: string
  bannerType: string
}) {
  const response = await api.post('/integrations/books', {
    data: {
      type: 'books',
      attributes: {
        title: opts.name,
        description: opts.description,
        price: opts.price,
        contract_address: opts.contractAddress,
        contract_name: opts.name,
        contract_version: '1',
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

  return response
}

export async function getBooks() {
  const { data } = await api.get<BookResponse[]>('/integrations/books')

  return data
}

export async function getBookById(id: number | string) {
  const { data } = await api.get<BookResponse>(`/integrations/books/${id}`)

  return data
}
