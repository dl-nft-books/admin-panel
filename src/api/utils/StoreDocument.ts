import { getDocument, uploadDocument } from '@/api'

export class StoreDocument {
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
    if (opts) {
      this._file = opts.file
      this._name = opts.name
      this._mimeType = opts.mimeType
      this._key = opts.key
    }
  }

  async uploadSelf() {
    const arrayBuffer = await this._file?.arrayBuffer()

    if (!arrayBuffer) throw new Error('No array buffer')

    const blob = new Blob([new Uint8Array(arrayBuffer)], {
      type: this._mimeType,
    })

    const formData = new FormData()
    formData.append('Document', blob)
    const { data } = await uploadDocument(formData)

    this._key = data.key
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
}
