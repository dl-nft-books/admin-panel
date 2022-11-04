import { api } from '@/api'

export class StoreDocument {
  _file?: File
  _name?: string
  _mimeType?: string
  _key?: string
  _url?: string

  constructor(opts?: {
    file?: File
    name: string
    mimeType: string
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
    const formData = new FormData()
    const arrayBuffer = await this._file?.arrayBuffer()

    if (!arrayBuffer) throw new Error('No array buffer')

    const blob = new Blob([new Uint8Array(arrayBuffer)], {
      type: this._mimeType,
    })
    formData.append('Document', blob)
    const { data } = await api.post<{
      id: string
      type: string
      key: string
    }>('/integrations/documents', formData)

    this._key = data.key
  }

  async load() {
    const { data } = await api.get<{
      id: string
      type: string
      url: string
    }>(`/integrations/documents/${this._key}`)

    this._url = data.url
  }

  get getPublicUrl() {
    // FIXME
    return this._url?.replace('localstack', 'localhost')
  }
}
