import { ethers } from 'ethers'
import { computed } from 'vue'
import { ChainId } from '@distributedlab/w3p'
import { JsonApiBodyBuilder } from '@distributedlab/jac'
import { BN, DECIMALS } from '@distributedlab/tools'

import { api } from '@/api'
import { Book, CreateBookResponse, FullBookInfo, BaseBookInfo } from '@/types'
import {
  useMarketplace,
  useContractRegistry,
  TokenParams,
} from '@/composables/contracts'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { IMarketplace } from '@/types/contracts/MarketPlace'
import { switchNetwork, Document } from '@/helpers'

type CreateBookOpts = {
  tokenName: string
  tokenSymbol: string
  description: string
  price: string
  banner: Document
  bookFile: Document
  chainIds: Array<number>
  floorPrice: string
  isNftBuyable: boolean
  fundsRecipient: string
  vouchers: Array<{
    isVoucherBuyable: boolean
    voucherTokenAddress: string
    voucherTokenAmount: string
  }>
}

export function useBooks(contractRegistryAddress?: string) {
  const networkStore = useNetworksStore()
  const web3Store = useWeb3ProvidersStore()
  const provider = computed(() => web3Store.provider)

  const { getMarketPlaceAddress, init: initRegistry } = useContractRegistry(
    provider,
    contractRegistryAddress,
  )

  const {
    deployTokenContract,
    init: initMarketPlace,
    getTokenParams,
    getBooksBatch,
    updateAllParams,
    getTokenContractsCount,
  } = useMarketplace(provider)

  const _initMarketPlace = async (address?: string) => {
    const marketPlaceAddress = address || (await getMarketPlaceAddress())

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

  const _formatBaseParams = (
    backendData: Book,
    contractData: IMarketplace.BriefTokenInfoStructOutput,
  ): BaseBookInfo => {
    return {
      ...backendData,
      pricePerOneToken: contractData.pricePerOneToken.toString(),
      tokenName: contractData.baseTokenData.tokenName,
      tokenContract: contractData.baseTokenData.tokenContract,
      isDisabled: contractData.isDisabled,
      tokenSymbol: contractData.baseTokenData.tokenSymbol,
    }
  }

  const _formatDetailedParams = (
    backendData: Book,
    contractData: IMarketplace.DetailedTokenInfoStructOutput,
  ): FullBookInfo => {
    return {
      ...backendData,
      pricePerOneToken: contractData.tokenParams.pricePerOneToken.toString(),
      minNFTFloorPrice: contractData.tokenParams.minNFTFloorPrice.toString(),
      voucherTokenContract: contractData.tokenParams.voucherTokenContract,
      voucherTokensAmount:
        contractData.tokenParams.voucherTokensAmount.toString(),
      fundsRecipient: contractData.tokenParams.fundsRecipient,
      isNFTBuyable: contractData.tokenParams.isNFTBuyable,
      isDisabled: contractData.tokenParams.isDisabled,
      tokenName: contractData.baseTokenData.tokenName,
      tokenSymbol: contractData.baseTokenData.tokenSymbol,
      tokenContract: contractData.baseTokenData.tokenContract,
      isVoucherBuyable: contractData.tokenParams.isVoucherBuyable,
    }
  }

  const _gatherDetailedBookData = async (book: Book): Promise<FullBookInfo> => {
    const bookNetwork = book.networks.find(
      el => el.attributes.chain_id === Number(provider.value.chainId),
    )

    if (!bookNetwork) throw new Error('failed to get appropriate info source')

    _initContractRegistry(bookNetwork.attributes.chain_id)
    await _initMarketPlace()

    const bookParams = await getTokenParams([
      bookNetwork.attributes.contract_address,
    ])

    if (!bookParams) throw new Error('Failed to get info from contract')

    return _formatDetailedParams(book, bookParams[0])
  }

  const _gatherBaseBookData = (
    backendInfoPart: Book[],
    contractInfoPart: IMarketplace.BriefTokenInfoStructOutput[],
  ): BaseBookInfo[] => {
    const formattedArray = contractInfoPart.map(book => {
      const matchingInfo = backendInfoPart.find(el =>
        el.networks.find(
          network =>
            network.attributes.contract_address ===
            book.baseTokenData.tokenContract,
        ),
      )

      if (!matchingInfo) return null

      return _formatBaseParams(matchingInfo, book)
    })

    return formattedArray.filter(book => Boolean(book)) as BaseBookInfo[]
  }

  const getBooksFromContract = async (
    limit: number,
    offset: number,
    chainId: ChainId,
  ) => {
    if (!limit) return []

    if (
      !networkStore.list.some(network => network.chain_id === Number(chainId))
    ) {
      return []
    }

    await _initContractRegistry(Number(chainId))
    await _initMarketPlace()

    const bookContractsList = await getBooksBatch(limit, offset)

    if (!bookContractsList?.length) return []

    const { data: booksFromBackend } = await api.get<Book[]>(
      '/integrations/books',
      {
        query: {
          filter: {
            contract: bookContractsList
              .map(book => book.baseTokenData.tokenContract)
              .join(','),
          },
          page: {
            limit: limit,
            order: 'desc',
          },
        },
      },
    )

    const formattedBooks = _gatherBaseBookData(
      booksFromBackend,
      bookContractsList,
    )

    return formattedBooks
  }

  const getBookById = async (id: number | string): Promise<FullBookInfo> => {
    await _initContractRegistry(Number(provider.value.chainId))
    await _initMarketPlace()

    const { data } = await api.get<Book>(`/integrations/books/${id}`)

    const bookData = await _gatherDetailedBookData(data)

    return bookData
  }

  const getTotalBooksAmount = async (chainId: ChainId) => {
    if (
      !networkStore.list.some(network => network.chain_id === Number(chainId))
    ) {
      return
    }

    await _initContractRegistry(Number(chainId))
    await _initMarketPlace()

    const amount = await getTokenContractsCount()

    if (!amount) return

    return amount.toString()
  }

  const _uploadBookMedia = async (...bookMedia: Array<Document>) => {
    await Document.uploadDocuments(bookMedia)
  }

  const _createBook = (opts: {
    description: string
    banner: Document
    bookFile: Document
    networks: Array<{
      attributes: {
        chain_id: number
        contract_address: string
      }
    }>
  }) => {
    const body = new JsonApiBodyBuilder()
      .setType('books')
      .setAttributes({
        description: opts.description,
        banner: {
          type: 'banners',
          attributes: opts.banner,
        },
        file: {
          type: 'files',
          attributes: opts.bookFile,
        },
        networks: opts.networks,
      })
      .build()

    return api.post<CreateBookResponse>('/integrations/books', {
      body,
    })
  }

  /**
   * Deploys 1 book instance on all provided chains
   *
   * @param opts - all needed params for creating new book
   * TODO: handling vouchers
   *
   * @returns - array of deployed books addresses
   */
  const _deployBook = async (
    opts: Omit<CreateBookOpts, 'description' | 'banner' | 'bookFile'>,
  ): Promise<string[]> => {
    const deployedBookAddressList: string[] = []

    let counter = 0
    // deploying 1 book on all chains
    for (const chainId of opts.chainIds) {
      _initContractRegistry(chainId)
      await switchNetwork(chainId)
      await _initMarketPlace()

      const receipt = await deployTokenContract(
        opts.tokenName,
        opts.tokenSymbol,
        {
          pricePerOneToken: opts.price,
          minNFTFloorPrice: opts.floorPrice,
          voucherTokenContract:
            opts.vouchers[counter].voucherTokenAddress &&
            opts.vouchers[counter].isVoucherBuyable
              ? opts.vouchers[counter].voucherTokenAddress
              : ethers.constants.AddressZero,
          voucherTokensAmount:
            opts.vouchers[counter].voucherTokenAmount &&
            opts.vouchers[counter].isVoucherBuyable
              ? BN.fromRaw(
                  opts.vouchers[counter].voucherTokenAmount,
                  DECIMALS.WEI,
                ).value
              : '0',
          isNFTBuyable: opts.isNftBuyable,
          fundsRecipient: opts.fundsRecipient || ethers.constants.AddressZero,
          isDisabled: false,
          isVoucherBuyable: opts.vouchers[counter].isVoucherBuyable,
        },
      )

      counter++

      if (!receipt) throw new Error('Failed to get tx receipt')

      const contractAddress = receipt.logs[0].address
      deployedBookAddressList.push(contractAddress)
    }

    return deployedBookAddressList
  }

  const createBook = async (opts: CreateBookOpts) => {
    const weiPrice = BN.fromRaw(opts.price, DECIMALS.WEI).value
    const weiFloorPrice = opts.floorPrice
      ? BN.fromRaw(opts.floorPrice, DECIMALS.WEI).value
      : '0'

    const deployedBookAddressList = await _deployBook({
      ...opts,
      price: weiPrice,
      floorPrice: weiFloorPrice,
    })

    await _uploadBookMedia(opts.banner, opts.bookFile)

    await _createBook({
      description: opts.description,
      banner: opts.banner,
      bookFile: opts.bookFile,
      networks: opts.chainIds.map((el, idx) => ({
        attributes: {
          chain_id: el,
          contract_address: deployedBookAddressList[idx],
        },
      })),
    })
  }

  /**
   * Update 1 book instance on all provided chains
   *
   * @param opts - all needed params for updating new book
   * TODO: handling vouchers
   */
  const updateBook = async (
    opts: {
      name: string
      symbol: string
      contractParams: TokenParams
      apiParams: Pick<Book, 'description' | 'id' | 'networks'> & {
        file: Document
        banner: Document
      }
    },
    updateOpts: {
      apiValuesUpdated: boolean
      filesUpdated: boolean
      contractValuesUpdate: boolean
    },
  ) => {
    const weiPrice = BN.fromRaw(
      opts.contractParams.pricePerOneToken,
      DECIMALS.WEI,
    ).value
    const weiFloorPrice = BN.fromRaw(
      opts.contractParams.minNFTFloorPrice,
      DECIMALS.WEI,
    ).value

    if (updateOpts.contractValuesUpdate) {
      for (const {
        attributes: { chain_id, contract_address },
      } of opts.apiParams.networks) {
        _initContractRegistry(chain_id)
        await switchNetwork(chain_id)
        await _initMarketPlace()

        await updateAllParams(contract_address, {
          ...opts.contractParams,
          fundsRecipient:
            opts.contractParams.fundsRecipient || ethers.constants.AddressZero,
          pricePerOneToken: weiPrice,
          minNFTFloorPrice: weiFloorPrice,
          voucherTokensAmount: opts.contractParams.voucherTokensAmount
            ? BN.fromRaw(opts.contractParams.voucherTokensAmount, DECIMALS.WEI)
                .value
            : '0',
          voucherTokenContract:
            opts.contractParams.voucherTokenContract ||
            ethers.constants.AddressZero,
          isVoucherBuyable: opts.contractParams.isVoucherBuyable,
        })
      }
    }

    if (updateOpts.filesUpdated) {
      await _uploadBookMedia(opts.apiParams.banner, opts.apiParams.file)
    }

    if (updateOpts.apiValuesUpdated) {
      const body = new JsonApiBodyBuilder()
        .setType('books')
        .setAttributes({
          ...(opts.apiParams.description
            ? { description: opts.apiParams.description }
            : {}),
          ...(opts.apiParams.banner
            ? {
                banner: {
                  type: 'banners',
                  attributes: opts.apiParams.banner,
                },
              }
            : {}),
          ...(opts.apiParams.file
            ? {
                file: {
                  type: 'files',
                  attributes: opts.apiParams.file,
                },
              }
            : {}),
        })
        .build()

      await api.patch(`/integrations/books/${opts.apiParams.id}`, {
        body,
      })
    }
  }

  const addNetworks = async (
    opts: Omit<CreateBookOpts, 'description' | 'banner' | 'bookFile'> & {
      id: string
    },
  ) => {
    const deployedBookAddressList = await _deployBook(opts)

    const data = opts.chainIds.map((el, idx) => ({
      attributes: {
        chain_id: el,
        contract_address: deployedBookAddressList[idx],
      },
    }))

    await api.post(`/integrations/books/${opts.id}/network`, {
      body: {
        data,
      },
    })
  }

  return {
    getBookById,
    createBook,
    updateBook,
    getBooksFromContract,
    getTotalBooksAmount,
    addNetworks,
  }
}
