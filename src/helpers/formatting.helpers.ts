import getSymbolFromCurrency from 'currency-symbol-map'
import { BN, BnLike } from '@distributedlab/tools'

export function cropAddress(address: string, symbol = 6) {
  return `${address.slice(0, symbol)}...${address.slice(-symbol)}`
}

function _formatMoney(formattedAmount: string, currency = '') {
  const symbol = getSymbolFromCurrency(currency)
  return symbol
    ? `${symbol}${formattedAmount}`
    : `${formattedAmount} ${currency}`
}

export function formatFiatAssetFromWei(amount: BnLike, currency = '') {
  const formattedAmount = BN.fromBigInt(amount).format({
    decimals: 2,
  })

  return _formatMoney(formattedAmount, currency)
}

export function formatAssetFromWei(
  amount: BnLike,
  decimals: number,
  currency = '',
) {
  const formattedAmount = BN.fromBigInt(amount).format({ decimals })

  return currency ? `${formattedAmount} ${currency}` : formattedAmount
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}
