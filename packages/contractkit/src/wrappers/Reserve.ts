import BigNumber from 'bignumber.js'
import { Address } from '../base'
import { Reserve } from '../generated/types/Reserve'
import {
  BaseWrapper,
  CeloTransactionObject,
  identity,
  NumberLike,
  parseNumber,
  proxyCall,
  proxySend,
  toBigNumber,
  tupleParser,
} from './BaseWrapper'

export interface ReserveConfig {
  tobinTaxStalenessThreshold: BigNumber
}

/**
 * Contract for handling reserve for stable currencies
 */
export class ReserveWrapper extends BaseWrapper<Reserve> {
  /**
   * Query Tobin tax staleness threshold parameter.
   * @returns Current Tobin tax staleness threshold.
   */
  tobinTaxStalenessThreshold = proxyCall(
    this.contract.methods.tobinTaxStalenessThreshold,
    undefined,
    toBigNumber
  )
  /**
   * Returns current configuration parameters.
   */
  async getConfig(): Promise<ReserveConfig> {
    return {
      tobinTaxStalenessThreshold: await this.tobinTaxStalenessThreshold(),
    }
  }

  isSpender: (address: Address) => Promise<boolean> = proxyCall(this.contract.methods.isSpender)

  /**
   * Get the list of tokens stabilized by the reserve
   */
  getTokens: () => Promise<Address[]> = proxyCall(this.contract.methods.getTokens)

  /**
   * @notice Transfer gold.
   * @param to The address that will receive the gold.
   * @param value The amount of gold to transfer.
   */
  transferGold: (to: Address, value: NumberLike) => CeloTransactionObject<any> = proxySend(
    this.kit,
    this.contract.methods.transferGold,
    tupleParser(identity, parseNumber)
  )
}
