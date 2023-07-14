import {
  POLYGON_MAINNET_CHAIN,
  POLYGON_MUMBAI_CHAIN,
  Q_MAINNET_CHAIN,
  Q_TESTNET_CHAIN,
  SEPOLIA_CHAIN,
} from '@/consts'
import {
  ETHEREUM_CHAINS,
  NETWORKS,
  POLYGON_CHAINS,
  Q_CHAINS,
  ICON_NAMES,
} from '@/enums'
import { ChainInfo } from '@/types'
import { ChainId, CHAIN_TYPES } from '@distributedlab/w3p'
import { ErrorHandler } from '@/helpers'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'

export function getNetworkScheme(chainID: ChainId) {
  switch (chainID?.toString()) {
    case ETHEREUM_CHAINS.ethereum:
    case ETHEREUM_CHAINS.goerli:
    case ETHEREUM_CHAINS.sepolia:
      return NETWORKS.ETHEREUM
    case POLYGON_CHAINS.mainnet:
    case POLYGON_CHAINS.mumbai:
      return NETWORKS.POLYGON
    case Q_CHAINS.mainet:
    case Q_CHAINS.testnet:
      return NETWORKS.Q
    default:
      return NETWORKS.UNSUPPORTED
  }
}

export function getIconByScheme(scheme: NETWORKS) {
  switch (scheme) {
    case NETWORKS.POLYGON:
      return ICON_NAMES.polygon
    case NETWORKS.ETHEREUM:
      return ICON_NAMES.ethereum
    case NETWORKS.Q:
      return ICON_NAMES.q
    case NETWORKS.UNSUPPORTED:
    default:
      return ICON_NAMES.ban
  }
}

// For non-default chains
export function getNetworkInfo(chainID: ChainId): ChainInfo | null {
  switch (chainID.toString()) {
    case POLYGON_CHAINS.mumbai:
      return POLYGON_MUMBAI_CHAIN
    case POLYGON_CHAINS.mainnet:
      return POLYGON_MAINNET_CHAIN
    case Q_CHAINS.testnet:
      return Q_TESTNET_CHAIN
    case Q_CHAINS.mainet:
      return Q_MAINNET_CHAIN
    case ETHEREUM_CHAINS.sepolia:
      return SEPOLIA_CHAIN
    default:
      return null
  }
}

export async function switchNetwork(chainID: ChainId) {
  const web3Store = useWeb3ProvidersStore()
  const networkStore = useNetworksStore()

  const networkURLs = getNetworkInfo(chainID)
  const networkInfo = networkStore.getNetworkByID(Number(chainID))

  if (!networkInfo || !networkURLs) throw new Error('Unsupported network')

  try {
    await web3Store.provider.switchChain(chainID)
  } catch (error) {
    // if wallet has no chain added we need to add it and switch to it
    await web3Store.provider.addChain({
      id: chainID,
      name: networkInfo.name,
      rpcUrl: networkURLs.rpcUrl,
      explorerUrl: networkURLs.blockExplorerUrl,
      type: CHAIN_TYPES.EVM,
      token: {
        name: networkInfo.token_name,
        symbol: networkInfo.token_symbol,
        decimals: networkInfo.decimals,
      },
      icon: '',
    })

    ErrorHandler.processWithoutFeedback(error)
  }
}
