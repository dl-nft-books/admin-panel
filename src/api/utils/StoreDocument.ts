import { api } from '@/api'

export class StoreDocument {
  _file?: File
  _name?: string
  _mimeType?: string
  _key?: string
  _type?: string
  _url?: string

  constructor(opts?: {
    file?: File
    name: string
    mimeType: string
    key?: string
    type: string
  }) {
    if (opts) {
      this._file = opts.file
      this._name = opts.name
      this._mimeType = opts.mimeType
      this._key = opts.key
      this._type = opts.type
    }
  }

  async uploadSelf(ownerAddress: string) {
    const docMetadata = {
      data: {
        type: 'passport', // FIXME
        attributes: {
          content_type: this._mimeType,
        },
        relationships: {
          owner: {
            data: {
              id: ownerAddress,
            },
          },
        },
      },
    }
    const formData = new FormData()
    const arrayBuffer = await this._file?.arrayBuffer()

    if (!arrayBuffer) throw new Error('No array buffer')

    const blob = new Blob([new Uint8Array(arrayBuffer)], {
      type: this._mimeType,
    })
    formData.append('Image', blob)
    formData.append('Document', JSON.stringify(docMetadata))

    const { data } = await api.post<{
      id: string
      content_type: string
      owner: {
        type: string
        id: string
      }
      relationshipNames: string[]
      type: string
      url: string
    }>('integrations/storage/documents', formData)

    this._key = data.id
  }

  async load() {
    const { data } = await api.get<{
      type: string
      id: string
      content_type: string
      url: string
      owner: {
        type: string
        id: string
      }
      relationshipNames: string[]
    }>(`/integrations/storage/documents/${this._key}`)

    this._url = data.url
  }

  get getPublicUrl() {
    // FIXME
    return this._url?.replace('localstack', 'localhost')
  }
}
