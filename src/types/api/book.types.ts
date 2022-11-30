import { JsonApiRecordBase } from '@/types'

export type BookFile = JsonApiRecordBase<'files'> & {
  attributes: {
    key: string
    mime_type: string
    name: string
    url: string
  }
}

export type Book = JsonApiRecordBase<'books'> & {
  banner: BookFile
  contract_address: string
  contract_name: string
  contract_version: string
  created_at: string
  description: string
  file: BookFile
  price: string
  title: string
}

export type CreateBookResponse = JsonApiRecordBase<'create_signatures'> & {
  token_id: string
  book_id: string
  signature: {
    r: string
    s: string
    v: number
  }
}
