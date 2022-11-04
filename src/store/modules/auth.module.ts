import { defineStore } from 'pinia'
import { api } from '@/api'
import { AuthResponse, RefreshTokenResponse, AuthToken } from '@/types'
import { HTTP_METHODS } from '@/api/json-api/enums'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    _accessToken: null as AuthToken | null,
    _refreshToken: null as AuthToken | null,
    _account: '',
  }),
  persist: true,
  actions: {
    async login(account: string, signMsg: string): Promise<void> {
      const { data } = await api.post<AuthResponse>(
        '/integrations/nonce-auth-svc/login/admin',
        {
          data: {
            type: 'admin_login',
            attributes: {
              auth_pair: {
                address: account,
                signed_message: signMsg,
              },
            },
          },
        },
      )
      this._accessToken = data.access_token
      this._refreshToken = data.refresh_token
      this._account = account
    },

    logout(): void {
      this._accessToken = null
      this._refreshToken = null
      this._account = ''
    },

    async refreshToken(): Promise<void> {
      const { data } = await api.request<RefreshTokenResponse>({
        endpoint: '/integrations/nonce-auth-svc/refresh-token',
        method: HTTP_METHODS.GET,
        headers: {
          Authorization: `Bearer ${this._refreshToken?.id}`,
        },
      })
      this._accessToken = data.access_token
      this._refreshToken = data.refresh_token
    },
  },

  getters: {
    isLoggedIn: state => Boolean(state._accessToken),
    accessToken: state => state._accessToken,
    account: state => state._account,
  },
})
