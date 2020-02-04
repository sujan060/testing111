import { Address } from '@celo/utils/lib/address'
import { BlockTransactionObject, Transaction } from 'web3-eth'
import { AbiItem } from 'web3-utils'
import { ContractKit } from '../kit'
import { DecodedParamsObject } from '../utils/web3-utils'
import { ContractDetails, mapFromPairs, obtainKitContractDetails } from './base'

export interface CallDetails {
  contract: string
  function: string
  params: DecodedParamsObject
}

export interface ParsedTx {
  callDetails: CallDetails
  tx: Transaction
}

export interface ParsedBlock {
  block: BlockTransactionObject
  parsedTx: ParsedTx[]
}

interface ContractMapping {
  details: ContractDetails
  fnMapping: Map<string, AbiItem>
}

export async function newBlockExplorer(kit: ContractKit) {
  return new BlockExplorer(kit, await obtainKitContractDetails(kit))
}

export class BlockExplorer {
  private addressMapping: Map<Address, ContractMapping>

  constructor(private kit: ContractKit, readonly contractDetails: ContractDetails[]) {
    this.addressMapping = mapFromPairs(
      contractDetails.map((cd) => [
        cd.address,
        {
          details: cd,
          fnMapping: mapFromPairs(
            (cd.jsonInterface as AbiItem[])
              .filter((ad) => ad.type === 'function')
              .map((ad) => [ad.signature, ad])
          ),
        },
      ])
    )
  }

  async fetchBlockByHash(blockHash: string) {
    return this.kit.web3.eth.getBlock(blockHash, true)
  }
  async fetchBlock(blockNumber: number) {
    return this.kit.web3.eth.getBlock(blockNumber, true)
  }

  async fetchBlockRange(from: number, to: number) {
    const results = []
    for (let i = from; i < to; i++) {
      results.push(await this.fetchBlock(i))
    }
    return results
  }

  parseBlock(block: BlockTransactionObject): ParsedBlock {
    const parsedTx: ParsedTx[] = []
    for (const tx of block.transactions as Transaction[]) {
      const maybeKnownCall = this.tryParseTx(tx)
      if (maybeKnownCall != null) {
        parsedTx.push(maybeKnownCall)
      }
    }

    return {
      block,
      parsedTx,
    }
  }

  tryParseTx(tx: Transaction): null | ParsedTx {
    if (tx.to == null) {
      return null
    }

    const contractMapping = this.addressMapping.get(tx.to)
    if (contractMapping == null) {
      return null
    }

    const callSignature = tx.input.slice(0, 10)
    const encodedParams = tx.input.slice(10)

    const matchedAbi = contractMapping.fnMapping.get(callSignature)
    if (matchedAbi == null) {
      return null
    }

    const decodedParams = this.kit.web3.eth.abi.decodeParameters(matchedAbi.inputs!, encodedParams)

    const callDetails: CallDetails = {
      contract: contractMapping.details.name,
      function: matchedAbi.name!,
      params: decodedParams,
    }

    return {
      tx,
      callDetails,
    }
  }
}
