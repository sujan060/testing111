import 'web3-eth'

declare module 'web3-eth' {
  export interface Transaction {
    feeCurrency: string | null
    gatewayFeeRecipient: string
    gatewayFee: string
  }

  export interface TransactionConfig {
    feeCurrency?: string | null
    gatewayFeeRecipient?: string
    gatewayFee?: string
  }
}
