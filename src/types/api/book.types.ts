import { JsonApiRecordBase } from '@/types'

export type BookFile = JsonApiRecordBase<'files'> & {
  attributes: {
    key: string
    mime_type: string
    name: string
    url: string
  }
}

type BookNetwork = {
  attributes: {
    chain_id: number
    contract_address: string
  }
}

export type Book = JsonApiRecordBase<'books'> & {
  banner: BookFile
  created_at: string
  description: string
  file: BookFile
  networks: BookNetwork[]
}

export type CreateBookResponse = JsonApiRecordBase<'create_book'> & {
  book_id: string
}
