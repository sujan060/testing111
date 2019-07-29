import {
  awaitConfirmation,
  getStableTokenContract,
  sendTransactionAsync,
  SendTransactionLogEvent,
  SendTransactionLogEventType,
} from '@celo/contractkit'
import Logger from 'src/utils/Logger'
import { web3 } from 'src/web3/contracts'
import { TransactionObject } from 'web3/eth/types'

// As per https://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checking
function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x)
}

const getLogger = (tag: string, txId: string) => {
  return (event: SendTransactionLogEvent) => {
    switch (event.type) {
      case SendTransactionLogEventType.Confirmed:
        Logger.debug(tag, `Transaction confirmed with id: ${txId}`)
        break
      case SendTransactionLogEventType.EstimatedGas:
        Logger.debug(tag, `Transaction with id ${txId} estimated gas: ${event.gas}`)
        break
      case SendTransactionLogEventType.ReceiptReceived:
        Logger.debug(
          tag,
          `Transaction id ${txId} received receipt: ${JSON.stringify(event.receipt)}`
        )
        break
      case SendTransactionLogEventType.TransactionHashReceived:
        Logger.debug(tag, `Transaction id ${txId} hash received: ${event.hash}`)
        break
      case SendTransactionLogEventType.Started:
        Logger.debug(tag, `Sending transaction with id ${txId}`)
        break
      case SendTransactionLogEventType.Failed:
        Logger.error(tag, `Transaction failed: ${txId}`, event.error)
        break
      case SendTransactionLogEventType.Exception:
        Logger.error(tag, `Transaction Exception caught ${txId}: `, event.error)
        break
      default:
        assertNever(event)
    }
  }
}

interface AccountWithPrivateKey {
  address: string
  privateKey: string
}

type AccountWithPrivateKeyType = AccountWithPrivateKey

export interface Tx {
  nonce?: string | number
  chainId?: string | number
  from?: string
  to?: string
  data?: string
  value?: string | number
  gas?: string | number
  gasPrice?: string | number
}

// Sends a transaction and async returns promises for the txhash, confirmation, and receipt
// Only use this method if you need more granular control of the different events
export const sendTransactionPromises = async (
  tx: TransactionObject<any>,
  accountWithPrivateKey: AccountWithPrivateKeyType,
  tag: string,
  txId: string
) => {
  const stableToken = await getStableTokenContract(web3)
  Logger.debug(tag, `ACCOUNT!!! ${JSON.stringify(accountWithPrivateKey)}`)
  const account = accountWithPrivateKey.address
  const accountWithPrivateKeyObject = web3.eth.accounts.privateKeyToAccount(
    accountWithPrivateKey.privateKey
  )
  // @ts-ignore
  accountWithPrivateKeyObject.signTransaction(tx)
  return sendTransactionAsync(tx, account, stableToken, getLogger(tag, txId), web3)
}

// Send a transaction and await for its confirmation
// Use this method for sending transactions and awaiting them to be confirmed
export const sendTransaction = async (
  tx: TransactionObject<any>,
  accountWithPrivateKey: AccountWithPrivateKeyType,
  tag: string,
  txId: string
) => {
  return sendTransactionPromises(tx, accountWithPrivateKey, tag, txId).then(awaitConfirmation)
}
