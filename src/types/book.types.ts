export type Book = {
  id: number | string
  title: string
  price: {
    amount: number
    assetCode: string
  }
  coverUrl: string
  description?: string
  meta?: {
    volume?: string
  }
  token?: {
    amount: string
    assetCode: string
  }
  document?: {
    name: string
  }
  signature?: string
  purchaseDate?: string
}

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
