export type BookSaleHistory = {
  id: number | string
  purchaseDate?: string
  price: {
    amount: number
    assetCode: string
  }
  token?: {
    amount: string
    assetCode: string
  }
  bookLink: string
  buyerAddress: string
}

export interface BookFileResponse {
  id: string
  type: string
  attributes: {
    key: string
    mime_type: string
    name: string
  }
}

export interface BookResponse {
  banner: BookFileResponse
  contract_address: string
  contract_name: string
  contract_version: string
  created_at: string
  description: string
  file: BookFileResponse
  id: string
  price: string
  title: string
  type: string
}
