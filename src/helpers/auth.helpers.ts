import { api } from '@/api'
import { AuthToken } from '@/types'

export const getAuthNonce = async (message: string) => {
  const { data } = await api.post<{ message: string }>(
    '/integrations/nonce-auth-svc/nonce',
    {
      data: {
        type: 'auth_nonce_request',
        attributes: {
          address: message,
        },
      },
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
}

export const saveAuthAccess = (
  accessToken: AuthToken,
  refreshToken: AuthToken,
) => {
  const accessTokenString = JSON.stringify(accessToken)
  const refreshTokenString = JSON.stringify(refreshToken)
  localStorage.setItem('accessToken', accessTokenString)
  localStorage.setItem('refreshToken', refreshTokenString)
}

export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')

  location.reload()
}
