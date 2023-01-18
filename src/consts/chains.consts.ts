import { ChainInfo } from '@/types'
import { POLYGON_CHAINS, Q_CHAINS } from '@/enums'

export const POLYGON_MUMBAI_CHAIN: ChainInfo = {
  name: 'Mumbai',
  rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
  chainId: POLYGON_CHAINS.mumbai,
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  blockExplorerUrl: 'https://mumbai.polygonscan.com',
}

export const Q_TESTNET_CHAIN: ChainInfo = {
  name: 'Q Testnet',
  rpcUrl: 'https://rpc.qtestnet.org',
  chainId: Q_CHAINS.testnet,
  nativeCurrency: {
    name: 'Q',
    symbol: 'Q ',
    decimals: 18,
  },
  blockExplorerUrl: 'https://explorer.qtestnet.org/',
}
