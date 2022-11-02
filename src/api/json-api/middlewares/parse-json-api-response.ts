import { JsonApiResponse } from '@/api/json-api/response'
import { AxiosResponse } from 'axios'
import { JsonApiClient } from '@/api/json-api'

export const parseJsonApiResponse = <T>(opts: {
  raw: AxiosResponse
  apiClient: JsonApiClient
  needRaw: boolean
  withCredentials: boolean
}) => {
  return new JsonApiResponse<T>(opts)
}
