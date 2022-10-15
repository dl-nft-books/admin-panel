import { ROUTE_NAMES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const web3ProviderStore = useWeb3ProvidersStore()
  const router = useRouter()

  const logout = () => {
    web3ProviderStore.provider.disconnect()
    router.push({ name: ROUTE_NAMES.login })
  }

  return {
    logout,
  }
}
