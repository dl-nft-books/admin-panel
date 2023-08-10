import { JsonApiRecordBase } from '@distributedlab/jac'

import { api } from '@/api'

type UploadDocumentResponse = JsonApiRecordBase<'s3keys'> & {
  key: string
}

type DocumentResponse = JsonApiRecordBase<'documents'> & {
  url: string
}

function uploadDocument(formData: FormData) {
  return api.post<UploadDocumentResponse>('/integrations/documents', {
    body: formData,
  })
}

function getDocument(key: string) {
  return api.get<DocumentResponse>(`/integrations/documents/${key}`)
}

export class Document {
  _file?: File
  _name?: string
  _mimeType?: string
  _key?: string
  _url?: string

  constructor(opts?: {
    file?: File
    name?: string
    mimeType?: string
    key?: string
  }) {
    this._file = opts?.file
    this._name = opts?.name
    this._mimeType = opts?.mimeType
    this._key = opts?.key
  }

  get file() {
    return this._file
  }

  get name() {
    return this._name
  }

  get mimeType() {
    return this._mimeType
  }

  get key() {
    return this._key
  }

  get isEmpty() {
    return !this._file && !this.isUploaded
  }

  get isUploaded() {
    return Boolean(this._key)
  }

  toJSON() {
    if (!this.isUploaded) return

    return {
      mime_type: this._mimeType || '',
      name: this._name || '',
      key: this._key || '',
    }
  }

  async uploadSelf() {
    if (this.isUploaded) return this
    if (this.isEmpty) throw new Error('Cannot upload an empty doc')

    const arrayBuffer = await this._file?.arrayBuffer()

    if (!arrayBuffer) throw new Error('No array buffer')

    const blob = new Blob([new Uint8Array(arrayBuffer)], {
      type: this._mimeType,
    })

    const formData = new FormData()
    formData.append('Document', blob)

    const { data } = await uploadDocument(formData)

    this._key = data.key
    return this
  }

  async load() {
    if (!this._key) throw new Error('No file key')

    const { data } = await getDocument(this._key)
    this._url = data.url
  }

  get getPublicUrl() {
    // FIXME
    return this._url?.replace('localstack', 'localhost')
  }

  static async uploadDocuments(documents: Document[]) {
    await Promise.all(
      documents.map(doc => {
        if (doc.isEmpty) return
        return doc.uploadSelf()
      }),
    )
  }
}
