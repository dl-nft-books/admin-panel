import { POLYGON_MUMBAI_CHAIN, Q_TESTNET_CHAIN } from '@/consts'
import {
  ETHEREUM_CHAINS,
  NETWORKS,
  POLYGON_CHAINS,
  Q_CHAINS,
  ICON_NAMES,
  EIP1193,
} from '@/enums'
import { ChainId, EthProviderRpcError, UseProvider } from '@/types'
import { ErrorHandler } from '@/helpers'
import { useNetworksStore } from '@/store'

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

export async function switchNetwork(provider: UseProvider, chainID: ChainId) {
  try {
    await provider.switchChain(chainID)
  } catch (error) {
    const ethError = error as EthProviderRpcError

    // if wallet has no chain added we need to add it and switch to it
    if (ethError?.code === EIP1193.walletMissingChain) {
      await addNetwork(provider, chainID)
    }

    ErrorHandler.processWithoutFeedback(error)
  }
}

export async function addNetwork(provider: UseProvider, chainID: ChainId) {
  try {
    const networkURLs = getNetworkInfo(chainID)
    const networkStore = useNetworksStore()
    const networkInfo = networkStore.getNetworkByID(Number(chainID))

    if (!networkInfo || !networkURLs) throw new Error('Unsupported network')

    await provider.addChain(
      chainID,
      networkInfo.name,
      networkURLs.rpcUrl,
      {
        name: networkInfo.token_name,
        symbol: networkInfo.token_symbol,
        decimals: networkInfo.decimals,
      },
      networkURLs.blockExplorerUrl,
    )
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }
}
