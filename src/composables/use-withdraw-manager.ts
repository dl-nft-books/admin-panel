import { useMarketplace, useContractRegistry } from '@/composables'
import { switchNetwork } from '@/helpers'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { BN } from '@/utils/math.util'
import { ethers } from 'ethers'
import { computed } from 'vue'

export function useWithdrawalManager() {
  const networkStore = useNetworksStore()
  const web3Store = useWeb3ProvidersStore()
  const provider = computed(() => web3Store.provider)

  const { getMarketPlaceAddress, init: initRegistry } = useContractRegistry()

  const { init: initMarketPlace, withdrawFunds } = useMarketplace()

  const _initMarketPlace = async () => {
    const marketPlaceAddress = await getMarketPlaceAddress()

    if (!marketPlaceAddress) return

    initMarketPlace(marketPlaceAddress)
  }

  const _initContractRegistry = async (chainId: number) => {
    if (!networkStore.list.length) {
      await networkStore.loadNetworks()
    }

    const appropriateRegistryAddress = networkStore.list.find(
      network => network.chain_id === chainId,
    )?.factory_address

    if (!appropriateRegistryAddress)
      throw new Error('failed to get registry address')

    initRegistry(appropriateRegistryAddress)
  }

  const withdrawCurrency = async (
    chainId: number,
    recipient: string,
    amount: string,
    isMax: boolean,
    tokenAddress = ethers.constants.AddressZero,
  ) => {
    await _initContractRegistry(chainId)
    await _initMarketPlace()

    const weiAmount = amount ? new BN(amount).toWei().toString() : '0'

    await withdrawFunds(tokenAddress, recipient, weiAmount, isMax)
  }

  const getBalance = async (chainId: number) => {
    if (Number(provider.value.chainId) !== chainId) {
      await switchNetwork(chainId)
    }

    await _initContractRegistry(chainId)

    const address = await getMarketPlaceAddress()
    if (!address) return

    const balance = await provider.value.getBalance(address)

    if (!balance) return

    return new BN(balance._hex).toString()
  }

  return {
    withdrawCurrency,
    getBalance,
  }
}
