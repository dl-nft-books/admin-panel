import { defineStore } from 'pinia'
import { ErrorHandler, logout } from '@/helpers'
import { api } from '@/api'
import { Auth } from '@/types'

import { DateUtil } from '@/utils/date.util'

export const useAuthStore = defineStore('account-store', {
  state: () => ({
    auth: {} as Auth,
  }),
  actions: {
    async initAuth() {
      try {
        this.checkAuthorize()
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },
    checkAuthorize() {
      const accessTokenString = localStorage.getItem('accessToken')
      const accessToken = accessTokenString && JSON.parse(accessTokenString)

      if (accessToken) {
        const isExpired = DateUtil.isSameOrAfter(accessToken.expires_in * 1000)
        if (isExpired) {
          logout()
        } else {
          api.setAuthToken(accessToken.id)

          this.auth = { access_token: accessToken }
        }
      }
    },
  },
  getters: {
    isLoggedIn: state => Boolean(state.auth?.access_token),
  },
})
