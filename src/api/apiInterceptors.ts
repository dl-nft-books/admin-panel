import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store'
import { i18n } from '@/localization'
import { Bus } from '@/helpers'
import { HTTP_STATUS_CODES } from '@/api/json-api/enums'
import { logout } from '@/helpers'

export function attachBearerInjector(axios: AxiosInstance): void {
  axios.interceptors.request.use((request): AxiosRequestConfig => {
    const authStore = useAuthStore()
    if (!authStore.accessToken) return request

    if (!request.headers) request.headers = {}
    if (!request.headers['Authorization']) {
      request.headers['Authorization'] = `Bearer ${authStore.accessToken.id}`
    }
    return request
  })
}

export function attachStaleTokenHandler(axios: AxiosInstance): void {
  axios.interceptors.response.use(
    response => response,
    async error => {
      const config = error?.config
      if (
        error?.response?.status === HTTP_STATUS_CODES.unauthorized &&
        !config?._retry &&
        error.config.url !== '/integrations/nonce-auth-svc/refresh-token'
      ) {
        const authStore = useAuthStore()
        try {
          config._retry = true

          await authStore.refreshToken()

          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${authStore.accessToken?.id}`,
          }
          return axios(config)
        } catch (_error) {
          logout()
          Bus.info({
            title: i18n.global.t('api-errors.session-expired-title'),
            message: i18n.global.t('api-errors.session-expired-desc'),
          })
          return Promise.reject(_error)
        }
      }
      return Promise.reject(error)
    },
  )
}
