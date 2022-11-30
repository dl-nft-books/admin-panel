import { getNonce } from '@/api'
import { useAuthStore } from '@/store'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'

export const getAuthNonce = async (message: string) => {
  const { data } = await getNonce(message)

  /**
   * we are using split('\n')... instead of just authNonce message
   * because authNonce has format of
   * 'user-friendly part'\n'message we need'
   * so we have to use split to take that last part
   * with message for signing
   */
  return data.message.split('\n')[data.message.split('\n').length - 1]
}

export const logout = () => {
  const authStore = useAuthStore()
  authStore.logout()
  router.push({ name: ROUTE_NAMES.login })
}
