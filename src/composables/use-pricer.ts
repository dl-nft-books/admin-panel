import { api } from '@/api'
import { JsonApiRecordBase } from '@/types'
import { ETHEREUM_CHAINS, POLYGON_CHAINS, Q_CHAINS } from '@/enums'

export type Platform = JsonApiRecordBase<'platforms'> & {
  chain_identifier: number
  name: string
  shortname: string
}

export type TokenPrice = JsonApiRecordBase<'prices'> & {
  price: string
  token: {
    decimals: number
    symbol: string
    name: string
  }
}

export type NftPrice = JsonApiRecordBase<'nft-price'> & {
  native_currency: number
  usd: number
}

export function usePricer() {
  const getPlatformsList = () => {
    return api.get<Platform[]>('/integrations/pricer/platforms')
  }

  const getPriceByPlatform = (
    platform: string,
    contract?: string,
    chainID?: number,
  ) => {
    return api.get<TokenPrice>('/integrations/pricer/price', {
      platform,
      ...(contract ? { contract } : {}),
      ...(chainID ? { chain_id: chainID } : {}),
    })
  }

  const getNftPriceByPlatform = (platform: string, contract: string) => {
    return api.get<NftPrice>('/integrations/pricer/nft', {
      platform,
      contract,
    })
  }

  // Pricer returns price only for not test networks, for debug need to convert
  const formatChain = (chainId: number): string => {
    switch (chainId.toString()) {
      case POLYGON_CHAINS.mumbai:
      case POLYGON_CHAINS.mainnet:
        return POLYGON_CHAINS.mainnet
      case ETHEREUM_CHAINS.goerli:
      case ETHEREUM_CHAINS.sepolia:
      case ETHEREUM_CHAINS.ethereum:
        return ETHEREUM_CHAINS.ethereum
      case Q_CHAINS.testnet:
      case Q_CHAINS.mainet:
        return Q_CHAINS.mainet
      default:
        return POLYGON_CHAINS.mainnet
    }
  }

  return {
    getNftPriceByPlatform,
    getPriceByPlatform,
    getPlatformsList,
    formatChain,
  }
}
