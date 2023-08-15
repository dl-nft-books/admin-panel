import { computed } from 'vue'
import { BN, DECIMALS } from '@distributedlab/tools'

import {
  useTokenFactory,
  useContractRegistry,
  useTokenRegistry,
  useVoucherContract,
} from '@/composables'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { IMarketplace } from '@/types/contracts/MarketPlace'

export function useVouchers() {
  const networkStore = useNetworksStore()
  const web3Store = useWeb3ProvidersStore()
  const provider = computed(() => web3Store.provider)

  const {
    getTokenFactoryAddress,
    getTokenRegistryAddress,
    init: initRegistry,
  } = useContractRegistry(provider)
  const { deployVoucher, init: initTokenFactory } = useTokenFactory(provider)
  const { getVoucherListPart, init: initTokenRegistry } =
    useTokenRegistry(provider)
  const { mintVoucher: _mintVoucher, init: initVoucher } =
    useVoucherContract(provider)

  const _initTokenFactory = async (address?: string) => {
    const factoryAddress = address || (await getTokenFactoryAddress())

    if (!factoryAddress) return

    initTokenFactory(factoryAddress)
  }

  const _initTokenRegistry = async (address?: string) => {
    const registryAddress = address || (await getTokenRegistryAddress())

    if (!registryAddress) return

    initTokenRegistry(registryAddress)
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

  const _formatVoucherParams = (
    raw: IMarketplace.BaseTokenDataStructOutput,
  ): IMarketplace.BaseTokenDataStruct => {
    return {
      tokenContract: raw.tokenContract,
      tokenName: raw.tokenName,
      tokenSymbol: raw.tokenSymbol,
    }
  }

  const createVoucher = async (name: string, symbol: string) => {
    await _initContractRegistry()
    await _initTokenFactory()

    await deployVoucher(name, symbol)
  }

  const getVoucherList = async (limit: number, offset: number) => {
    if (!limit) return []

    await _initContractRegistry()
    await _initTokenRegistry()

    const data = await getVoucherListPart(limit, offset)

    if (!data) return []

    return data.map(el => _formatVoucherParams(el))
  }

  const mintVoucher = async (
    voucherAddress: string,
    recieverAddress: string,
    amount: string,
  ) => {
    initVoucher(voucherAddress)

    const weiAmount = BN.fromRaw(amount, DECIMALS.WEI).value

    await _mintVoucher(recieverAddress, weiAmount)
  }

  return {
    createVoucher,
    getVoucherList,
    mintVoucher,
  }
}
