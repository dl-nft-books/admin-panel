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
  [
    /* 
      request interceptor checks if tokens are expired BEFORE making the 
      request and refreshes if it is possible
    */
    { request: refreshTokenInterceptor },
    { request: bearerAttachInterceptor },
  ],
)
