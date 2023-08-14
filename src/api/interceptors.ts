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

// prefixes of services, that don't require auth
const UNAUTHORIZED_SERVICES = ['networks', 'nonce-auth-svc']

const isAllowedUnauth = (url: string) => {
  return UNAUTHORIZED_SERVICES.some(service => url.includes(service))
}

export const bearerAttachInterceptor: FetcherRequestInterceptor = async (
  request: FetcherRequest,
) => {
  // no need to attach access token while refreshing
  if (isAllowedUnauth(request.url)) return request

  const authStore = useAuthStore()

  if (!authStore.accessToken) return request

  if (!request.headers) request.headers = {}

  // Attach bearer token to every request
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${authStore.accessToken}`,
  }

  return request
}

export const refreshTokenInterceptor: FetcherRequestInterceptor = async (
  request: FetcherRequest,
) => {
  if (isAllowedUnauth(request.url)) return request

  const authStore = useAuthStore()
  const { t } = i18n.global

  if (!authStore.refreshToken) {
    authStore.logout()

    Bus.info({
      title: t('api-errors.session-expired-title'),
      message: t('api-errors.session-expired-desc'),
    })

    return request
  }

  if (!authStore.accessToken) {
    await authStore.refresh()
  }

  return request
}

export const refreshTokenInterceptorOnError: FetcherErrorResponseInterceptor =
  async (response: FetcherResponse<unknown>) => {
    const config = response?.request
    const isUnauthorized = response.status === HTTP_STATUS_CODES.UNAUTHORIZED

    // If error isn't unauthorized - return error
    if (!isUnauthorized || isAllowedUnauth(config.url))
      return Promise.reject(response)

    const { t } = i18n.global
    const authStore = useAuthStore()

    try {
      await authStore.refresh()

      const url = new URL(config.url)

      return new Fetcher({ baseUrl: url.origin }).request({
        endpoint: url.pathname,
        method: config.method as HTTP_METHODS,
        ...(config.body ? { body: config.body } : {}),
        headers: {
          ...config.headers,
          // Reset default authorization header with new token
          Authorization: `Bearer ${authStore.accessToken}`,
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
