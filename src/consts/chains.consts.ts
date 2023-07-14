import { ChainInfo } from '@/types'

export const POLYGON_MUMBAI_CHAIN: ChainInfo = {
  rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
  blockExplorerUrl: 'https://mumbai.polygonscan.com',
}

export const POLYGON_MAINNET_CHAIN: ChainInfo = {
  rpcUrl: 'https://polygon-rpc.com',
  blockExplorerUrl: 'https://polygonscan.com/',
}

export const SEPOLIA_CHAIN: ChainInfo = {
  rpcUrl: 'https://rpc2.sepolia.org',
  blockExplorerUrl: 'https://sepolia.etherscan.io/',
}

export const Q_TESTNET_CHAIN: ChainInfo = {
  rpcUrl: 'https://rpc.qtestnet.org',
  blockExplorerUrl: 'https://explorer.qtestnet.org/',
}

export const Q_MAINNET_CHAIN: ChainInfo = {
  rpcUrl: 'https://rpc.q.org',
  blockExplorerUrl: 'https://explorer.q.org/',
}
