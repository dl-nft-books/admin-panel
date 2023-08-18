import { ethers } from 'ethers'

export const getTransactionReceipt = async (
  provider: ethers.providers.Web3Provider,
  transactionHash: string,
) => {
  return provider.getTransactionReceipt(transactionHash)
}
