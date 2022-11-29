import { api } from '@/api'
import { UploadDocumentResponse, Document } from '@/types'

export function uploadDocument(formData: FormData) {
  return api.post<UploadDocumentResponse>('/integrations/documents', formData)
}

export function getDocument(key: string) {
  return api.get<Document>(`/integrations/documents/${key}`)
}
