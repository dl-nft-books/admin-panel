import { JsonApiClient } from '@distributedlab/jac'
import { config } from '@config'
import {
  bearerAttachInterceptor,
  refreshTokenInterceptor,
  refreshTokenInterceptorOnError,
} from '@/api/interceptors'

export const api = new JsonApiClient(
  {
    baseUrl: config.API_URL,
  },
  [
    /* 
      request interceptor checks if tokens are expired BEFORE making the 
      request and refreshes if it is possible

      error interceptor checks if request failed with 401 status, tries to
      refresh tokens if so, and retries request, that failed.

      NOTE: only possible case when error interceptor will be triggered is when 
      user manually corrupts tokens in localstorage, all other cases is handled 
      by first one
    */
    { request: refreshTokenInterceptor, error: refreshTokenInterceptorOnError },
    { request: bearerAttachInterceptor },
  ],
)
