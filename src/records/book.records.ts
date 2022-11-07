import { BookResponse } from '@/types'

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

  constructor(record: BookResponse) {
    this.contractAddress = record.contract_address
    this.contractName = record.contract_name ?? ''
    this.contractVersion = record.contract_version
    this.createdAt = record.created_at
    this.description = record.description
    this.id = record.id
    this.price = record.price
    this.title = record.title
    this.type = record.type

    this.fileKey = record.file.attributes.key
    this.fileName = record.file.attributes.name
    this.fileUrl = record.file.attributes.url
    this.bannerKey = record.banner.attributes.key
    this.bannerUrl = record.banner.attributes.url
  }
}
