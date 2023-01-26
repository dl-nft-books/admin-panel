import { EIP1193, EIP1474 } from '@/enums'

/**
 * General runtime error
 */
export class RuntimeError extends Error {
  code: number
  constructor(message?: string, code?: number) {
    super(message ?? '')
    this.code = code ?? EIP1474.internalError
  }
}

export class ProviderWrapperMethodNotFoundError extends RuntimeError {}

export class ProviderChainNotFoundError extends RuntimeError {
  constructor(message?: string) {
    super(message, EIP1193.walletMissingChain)
  }
}

export class ProviderNotSupportedError extends RuntimeError {}

export class ProviderUserRejectedRequest extends RuntimeError {}

export class ProviderUnauthorized extends RuntimeError {}

export class ProviderUnsupportedMethod extends RuntimeError {}

export class ProviderDisconnected extends RuntimeError {}

export class ProviderChainDisconnected extends RuntimeError {}

export class ProviderParseError extends RuntimeError {}

export class ProviderInvalidRequest extends RuntimeError {}

export class ProviderMethodNotFound extends RuntimeError {}

export class ProviderInvalidParams extends RuntimeError {}

export class ProviderInternalError extends RuntimeError {}

export class ProviderInvalidInput extends RuntimeError {}

export class ProviderResourceNotFound extends RuntimeError {}

export class ProviderResourceUnavailable extends RuntimeError {}

export class ProviderTransactionRejected extends RuntimeError {}

export class ProviderMethodNotSupported extends RuntimeError {}

export class ProviderLimitExceeded extends RuntimeError {}

export class ProviderJsonRpcVersionNotSupported extends RuntimeError {}
