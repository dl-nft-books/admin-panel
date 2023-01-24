import { POLYGON_MUMBAI_CHAIN, Q_TESTNET_CHAIN } from '@/consts'
import {
  ETHEREUM_CHAINS,
  NETWORKS,
  POLYGON_CHAINS,
  Q_CHAINS,
  ICON_NAMES,
} from '@/enums'
import { ChainId } from '@/types'

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
export function getNetworkInfo(chainID: ChainId) {
  switch (chainID.toString()) {
    case POLYGON_CHAINS.mumbai:
      return POLYGON_MUMBAI_CHAIN
    case Q_CHAINS.testnet:
      return Q_TESTNET_CHAIN
    default:
      return null
  }
}
