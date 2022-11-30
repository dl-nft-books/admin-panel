import { JsonApiRecordBase } from '@/types'

export type UploadDocumentResponse = JsonApiRecordBase<'s3keys'> & {
  key: string
}

export type Document = JsonApiRecordBase<'documents'> & {
  url: string
}
