import { defineStore } from 'pinia'
import { computed } from 'vue'
import {
  ProviderDetector,
  PROVIDERS,
  MetamaskProvider,
} from '@distributedlab/w3p'

import { useProvider } from '@/composables'

const STORE_NAME = 'web3-providers-store'

export const useWeb3ProvidersStore = defineStore(STORE_NAME, () => {
  const provider = useProvider()

  const providerDetector = computed(() => new ProviderDetector<PROVIDERS>())

  async function detectProviders() {
    await providerDetector.value.init()
  }

  async function init() {
    const metamaskProvider = providerDetector.value.getProvider(
      PROVIDERS.Metamask,
    )

    if (!metamaskProvider) return

    await provider.init(MetamaskProvider, {
      providerDetector: providerDetector.value,
    })
  }

  return {
    provider,

    detectProviders,
    init,
  }
})
