import {
  Fetcher,
  FetcherErrorResponseInterceptor,
  FetcherRequest,
  FetcherRequestInterceptor,
  FetcherResponse,
  HTTP_METHODS,
  HTTP_STATUS_CODES,
} from '@distributedlab/fetcher'

import { useAuthStore } from '@/store'
import { i18n } from '@/localization'
import { Bus } from '@/helpers'

const REFRESH_TOKEN_URL = '/integrations/nonce-auth-svc/refresh-token'

export const bearerAttachInterceptor: FetcherRequestInterceptor = async (
  request: FetcherRequest,
) => {
  const authStore = useAuthStore()

  if (!authStore.accessToken) return request

  if (!request.headers) request.headers = {}

  // Attach bearer token to every request
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${authStore.accessToken.id}`,
  }

  return request
}

export const refreshTokenInterceptor: FetcherErrorResponseInterceptor = async (
  response: FetcherResponse<unknown>,
) => {
  const config = response?.request
  const isUnauthorized = response.status === HTTP_STATUS_CODES.UNAUTHORIZED

  // If error isn't unauthorized - return error
  if (!isUnauthorized || config.url === REFRESH_TOKEN_URL)
    return Promise.reject(response)

  const { t } = i18n.global
  const authStore = useAuthStore()

  try {
    await authStore.refreshToken()

    const url = new URL(config.url)

    return new Fetcher({ baseUrl: url.origin }).request({
      endpoint: url.pathname,
      method: config.method as HTTP_METHODS,
      ...(config.body ? { body: config.body } : {}),
      headers: {
        ...config.headers,
        // Reset default authorization header with new token
        Authorization: `Bearer ${authStore.accessToken?.id}`,
      },
    })
  } catch (error) {
    authStore.logout()

    Bus.info({
      title: t('api-errors.session-expired-title'),
      message: t('api-errors.session-expired-desc'),
    })

    return Promise.reject(error)
  }
}
