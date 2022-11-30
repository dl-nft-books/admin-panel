import { JsonApiRecordBase } from '@/types'

export type AuthToken = JsonApiRecordBase<'access_jwt' | 'refresh_jwt'> & {
  expires_in: number
}

export type AuthResponse = JsonApiRecordBase<'jwt_pair'> & {
  refresh_token: AuthToken
  access_token: AuthToken
}

export type RefreshTokenResponse = JsonApiRecordBase<'jwt_pair'> & {
  refresh_token: AuthToken
  access_token: AuthToken
}

export type NonceResponse = JsonApiRecordBase<'auth_nonce_message'> & {
  message: string
}
