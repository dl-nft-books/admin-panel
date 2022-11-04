export type AuthToken = {
  id: string
  type: string
  expires_in: number
}

export type AuthResponse = {
  type: string
  refresh_token: AuthToken
  access_token: AuthToken
  id: string
}

export type RefreshTokenResponse = {
  type: 'jwt_pair'
  refresh_token: AuthToken
  access_token: AuthToken
}
