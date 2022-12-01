import { Book } from '@/types'
import { Document } from '@/api'

export class BookRecord {
  contractAddress: string
  contractName: string
  contractVersion: string
  createdAt: string
  description: string
  id: string
  price: string
  title: string
  type: string
  fileKey: string
  bannerKey: string
  fileName: string
  fileUrl: string
  bannerUrl: string
  contractSymbol: string
  file: Document
  banner: Document

  constructor(record: Book) {
    this.contractAddress = record.contract_address
    this.contractName = record.contract_name ?? ''
    this.contractVersion = record.contract_version
    this.createdAt = record.created_at
    this.description = record.description
    this.contractSymbol = record.contract_symbol
    this.id = record.id
    this.price = record.price
    this.title = record.title
    this.type = record.type

    this.file = new Document(record.file.attributes)
    this.fileKey = record.file.attributes.key
    this.fileName = record.file.attributes.name
    this.fileUrl = record.file.attributes.url
    this.banner = new Document(record.banner.attributes)
    this.bannerKey = record.banner.attributes.key
    this.bannerUrl = record.banner.attributes.url
  }
}
