import { defineStore } from 'pinia'
import { JsonApiBodyBuilder, JsonApiRecordBase } from '@distributedlab/jac'
import { time } from '@distributedlab/tools'

import { api } from '@/api'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'

type NonceResponse = JsonApiRecordBase<'auth_nonce_message'> & {
  message: string
}

type AuthToken = JsonApiRecordBase<'access_jwt' | 'refresh_jwt'> & {
  expires_in: number
}

type TokenResponse = JsonApiRecordBase<'jwt_pair'> & {
  refresh_token: AuthToken
  access_token: AuthToken
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    _accessToken: null as AuthToken | null,
    _refreshToken: null as AuthToken | null,
    _account: '',
  }),
  persist: true,
  actions: {
    async login(account: string, signMsg: string): Promise<void> {
      const body = new JsonApiBodyBuilder()
        .setType('admin_login')
        .setAttributes({
          auth_pair: {
            address: account,
            signed_message: signMsg,
          },
        })
        .build()

      const { data } = await api.post<TokenResponse>(
        '/integrations/nonce-auth-svc/login/admin',
        { body },
      )

      this._accessToken = data.access_token
      this._refreshToken = data.refresh_token
      this._account = account
    },

    logout(): void {
      this._accessToken = null
      this._refreshToken = null
      this._account = ''

      router.push({ name: ROUTE_NAMES.login })
    },

    async refresh(): Promise<void> {
      const { data } = await api.get<TokenResponse>(
        '/integrations/nonce-auth-svc/refresh-token',
        {
          headers: {
            Authorization: `Bearer ${this._refreshToken!.id}`,
          },
        },
      )

      this._accessToken = data.access_token
      this._refreshToken = data.refresh_token
    },

    async getAuthNonce(address: string) {
      const body = new JsonApiBodyBuilder()
        .setType('auth_nonce_request')
        .setAttributes({ address })
        .build()

      const { data } = await api.post<NonceResponse>(
        '/integrations/nonce-auth-svc/nonce',
        {
          body,
        },
      )

      /**
       * we are using split('\n')... instead of just authNonce message
       * because authNonce has format of
       * 'user-friendly part'\n'message we need'
       * so we have to use split to take that last part
       * with message for signing
       */
      return data.message.split('\n')[data.message.split('\n').length - 1]
    },
  },

  getters: {
    isLoggedIn: state => Boolean(state._accessToken),
    accessToken: state => {
      if (!state._accessToken) return ''

      return time().isAfter(state._accessToken.expires_in)
        ? ''
        : state._accessToken.id
    },
    refreshToken: state => {
      if (!state._refreshToken) return ''

      return time().isAfter(state._refreshToken.expires_in)
        ? ''
        : state._refreshToken.id
    },
    account: state => state._account,
  },
})
