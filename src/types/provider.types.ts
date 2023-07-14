import { useWeb3ProvidersStore } from '@/store'
import { useProvider } from '@/composables'

export type UnwrappedProvider = ReturnType<
  typeof useWeb3ProvidersStore
>['provider']

export type UseProvider = ReturnType<typeof useProvider>
