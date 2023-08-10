import { JsonApiClient } from '@distributedlab/jac'
import { config } from '@config'
import {
  bearerAttachInterceptor,
  refreshTokenInterceptor,
} from '@/api/interceptors'

export const api = new JsonApiClient(
  {
    baseUrl: config.API_URL,
  },
  [{ request: bearerAttachInterceptor, error: refreshTokenInterceptor }],
)
