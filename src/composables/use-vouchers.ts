import { useTokenFactory, useContractRegistry } from '@/composables'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { computed } from 'vue'

export function useVouchers() {
  const networkStore = useNetworksStore()
  const web3Store = useWeb3ProvidersStore()
  const provider = computed(() => web3Store.provider)

  const { getTokenFactoryAddress, init: initRegistry } = useContractRegistry()
  const { deployVoucher, init: initTokenFactory } = useTokenFactory()

  const _initTokenFactory = async (address?: string) => {
    const factoryAddress = address || (await getTokenFactoryAddress())

    if (!factoryAddress) return

    initTokenFactory(factoryAddress)
  }

  const _initContractRegistry = async () => {
    if (!networkStore.list.length) {
      await networkStore.loadNetworks()
    }

    const appropriateRegistryAddress = networkStore.list.find(
      network => network.chain_id === Number(provider.value.chainId),
    )?.factory_address

    if (!appropriateRegistryAddress)
      throw new Error('failed to get registry address')

    initRegistry(appropriateRegistryAddress)
  }

  const createVoucher = async (name: string, symbol: string) => {
    await _initContractRegistry()
    await _initTokenFactory()

    await deployVoucher(name, symbol)
  }

  return {
    createVoucher,
  }
}
