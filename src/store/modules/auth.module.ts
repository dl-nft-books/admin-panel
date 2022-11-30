import { defineStore } from 'pinia'
import { refreshToken, login } from '@/api'
import { AuthToken } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    _accessToken: null as AuthToken | null,
    _refreshToken: null as AuthToken | null,
    _account: '',
  }),
  persist: true,
  actions: {
    async login(account: string, signMsg: string): Promise<void> {
      const { data } = await login(account, signMsg)
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
      const { data } = await refreshToken(this._refreshToken!.id)

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
