import { POLYGON_CHAINS, ETHEREUM_CHAINS, Q_CHAINS } from '@/enums'

export type NativeCurrency = {
  name: string
  symbol: string
  decimals: number
}

export type ChainID = POLYGON_CHAINS | ETHEREUM_CHAINS | Q_CHAINS

export type ChainInfo = {
  name: string
  rpcUrl: string
  chainId: ChainID
  nativeCurrency: NativeCurrency
  blockExplorerUrl: string
}
