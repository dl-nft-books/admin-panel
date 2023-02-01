import {
  POLYGON_MAINNET_CHAIN,
  POLYGON_MUMBAI_CHAIN,
  Q_MAINNET_CHAIN,
  Q_TESTNET_CHAIN,
} from '@/consts'
import {
  ETHEREUM_CHAINS,
  NETWORKS,
  POLYGON_CHAINS,
  Q_CHAINS,
  ICON_NAMES,
  EIP1193,
} from '@/enums'
import { ChainId, EthProviderRpcError, ChainInfo } from '@/types'
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

export function getNetworkScheme(chainID: ChainId) {
  switch (chainID?.toString()) {
    case ETHEREUM_CHAINS.ethereum:
    case ETHEREUM_CHAINS.goerli:
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
    default:
      return null
  }
}

export async function switchNetwork(chainID: ChainId) {
  const { provider } = useWeb3ProvidersStore()
  try {
    await provider.switchChain(chainID)
  } catch (error) {
    const ethError = error as EthProviderRpcError

    // if wallet has no chain added we need to add it and switch to it
    if (ethError?.code === EIP1193.walletMissingChain) {
      await provider.addNetwork(chainID)
    }

    ErrorHandler.processWithoutFeedback(error)
  }
}
