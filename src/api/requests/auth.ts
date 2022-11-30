import { api } from '@/api'
import { AuthResponse, RefreshTokenResponse, NonceResponse } from '@/types'
import { HTTP_METHODS } from '@/api/json-api/enums'

export function getNonce(message: string) {
  return api.post<NonceResponse>('/integrations/nonce-auth-svc/nonce', {
    data: {
      type: 'auth_nonce_request',
      attributes: {
        address: message,
      },
    },
  })
}

export function refreshToken(refreshTokenId: string) {
  return api.request<RefreshTokenResponse>({
    endpoint: '/integrations/nonce-auth-svc/refresh-token',
    method: HTTP_METHODS.GET,
    headers: {
      Authorization: `Bearer ${refreshTokenId}`,
    },
  })
}

export function login(account: string, signMsg: string) {
  return api.post<AuthResponse>('/integrations/nonce-auth-svc/login/admin', {
    data: {
      type: 'admin_login',
      attributes: {
        auth_pair: {
          address: account,
          signed_message: signMsg,
        },
      },
    },
  })
}
