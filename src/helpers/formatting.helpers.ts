import getSymbolFromCurrency from 'currency-symbol-map'
import { BN, BnLike } from '@/utils/math.util'

export function cropAddress(address: string, symbol = 6) {
  return `${address.slice(0, symbol)}...${address.slice(-symbol)}`
}

function _formatMoney(formattedAmount: string, currency = '') {
  const symbol = getSymbolFromCurrency(currency)
  return symbol
    ? `${symbol}${formattedAmount}`
    : `${formattedAmount} ${currency}`
}

export function formatFiatAsset(amount: BnLike, currency = '') {
  const formattedAmount = new BN(amount).format({
    decimals: 2,
  })

  return _formatMoney(formattedAmount, currency)
}

export function formatNumber(amount: BnLike) {
  const formattedAmount = new BN(amount).format({
    decimals: 2,
  })

  return formattedAmount
}
