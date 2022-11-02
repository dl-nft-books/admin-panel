import { JsonApiClient } from '@/api/json-api'
import { config } from '@config'

export const api = new JsonApiClient({ baseUrl: config.API_URL })

export * from './utils'
