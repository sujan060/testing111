/* tslint:disable max-classes-per-file */
import { Address } from '@celo/contractkit'
import { TransactionResult } from '@celo/contractkit/lib/utils/tx-result'
import { getPhoneHash, isE164Number } from '@celo/utils/lib/phoneNumbers'
import { DataSnapshot } from 'firebase-functions/lib/providers/database'
import twilio from 'twilio'
import { AccountPool, AccountRecord, ActionResult } from './account-pool'
import { CeloAdapter } from './celo-adapter'
import { NetworkConfig, RequestType, supports } from './config-new'
import { ExecutionResult, logExecutionResult } from './metrics'

export enum RequestStatus {
  Pending = 'Pending',
  Working = 'Working',
  Done = 'Done',
  Failed = 'Failed',
}

enum MobileOS {
  android = 'android',
  ios = 'ios',
}

export interface RequestRecord {
  beneficiary: Address
  status: RequestStatus
  type: RequestType
  mobileOS?: MobileOS // only on invite
  dollarTxHash?: string
  goldTxHash?: string
  escrowTxHash?: string // only on Invites
}

type RequestHandler = (account: AccountRecord) => Promise<void>
type RequestHandlerFactory = (
  request: RequestRecord,
  snap: DataSnapshot,
  config: NetworkConfig
) => RequestHandler

const RequestHandlerFactories: Record<RequestType, RequestHandlerFactory> = {
  [RequestType.Faucet]: newFaucetHandler,
  [RequestType.Invite]: newInviteHandler,
  [RequestType.KeybaseFaucet]: newKeybaseFaucetHandler,
}

export async function processRequest(snap: DataSnapshot, pool: AccountPool, config: NetworkConfig) {
  const request = snap.val() as RequestRecord

  if (request.status !== RequestStatus.Pending) {
    return
  }

  await snap.ref.update({ status: RequestStatus.Working })
  console.info(
    `req(${snap.key}): Started working on ${request.type} request for:${request.beneficiary}`
  )

  const requestHandlerFactory = RequestHandlerFactories[request.type]
  if (!supports(config, request.type) || requestHandlerFactory == null) {
    logExecutionResult(snap.key, ExecutionResult.InvalidRequestErr)
    return ExecutionResult.InvalidRequestErr
  }

  try {
    const actionResult = await pool.doWithAccount(requestHandlerFactory(request, snap, config))
    if (actionResult === ActionResult.Ok) {
      await snap.ref.update({ status: RequestStatus.Done })
      logExecutionResult(snap.key, ExecutionResult.Ok)
      return ExecutionResult.Ok
    } else {
      await snap.ref.update({ status: RequestStatus.Failed })
      const result =
        actionResult === ActionResult.NoFreeAccount
          ? ExecutionResult.NoFreeAccountErr
          : ExecutionResult.ActionTimedOutErr
      logExecutionResult(snap.key, result)
      return result
    }
  } catch (err) {
    logExecutionResult(snap.key, ExecutionResult.OtherErr)
    console.error(`req(${snap.key}): ERROR proccessRequest`, err)
    await snap.ref.update({ status: RequestStatus.Failed })
    throw err
  }
}

function txProcessor(snap: DataSnapshot) {
  return async (name: string, txPromise: Promise<TransactionResult>) => {
    const tx = await txPromise
    const txHash = await tx.getHash()
    console.info(`req(${snap.key}): tx: ${name}. hash:${txHash}`)
    await snap.ref.update({ [`${name}Hash`]: txHash })
    await tx.waitReceipt()
    return txHash
  }
}

function newFaucetHandler(request: RequestRecord, snap: DataSnapshot, config: NetworkConfig) {
  return async (account: AccountRecord) => {
    const celo = new CeloAdapter(config.nodeUrl, account.pk)
    const faucetConfig = config.requestConfig[RequestType.Faucet]!
    const processTx = txProcessor(snap)
    await processTx('goldTx', celo.transferGold(request.beneficiary, faucetConfig.goldAmount))
    await processTx(
      'dollarTx',
      celo.transferDollars(request.beneficiary, faucetConfig.dollarAmount)
    )
  }
}

function newInviteHandler(request: RequestRecord, snap: DataSnapshot, config: NetworkConfig) {
  return async (account: AccountRecord) => {
    const inviteConfig = config.requestConfig[RequestType.Invite]!

    const twilioClient = twilio(inviteConfig.twilio.sid, inviteConfig.twilio.authToken)

    if (!isE164Number(request.beneficiary)) {
      throw new Error('Must send to valid E164 Number.')
    }
    const celo = new CeloAdapter(config.nodeUrl, account.pk)
    const processTx = txProcessor(snap)

    const { address: tempAddress, inviteCode } = celo.generateInviteCode()

    await processTx('goldTx', celo.transferGold(tempAddress, inviteConfig.goldAmount))
    await processTx('dollarTx', celo.transferDollars(tempAddress, inviteConfig.dollarAmount))

    const phoneHash = getPhoneHash(request.beneficiary)
    await processTx(
      'escrowTx',
      celo.escrowDollars(
        phoneHash,
        tempAddress,
        inviteConfig.escrowDollarAmount,
        inviteConfig.expirarySeconds,
        inviteConfig.minAttestations
      )
    )

    await twilioClient.messages.create({
      body: messageText(inviteCode, request),
      from: inviteConfig.twilio.phoneNumber,
      to: request.beneficiary,
    })
  }
}

function newKeybaseFaucetHandler(
  request: RequestRecord,
  snap: DataSnapshot,
  config: NetworkConfig
) {
  return async (account: AccountRecord) => {
    const celo = new CeloAdapter(config.nodeUrl, account.pk)
    const faucetConfig = config.requestConfig[RequestType.KeybaseFaucet]!
    const processTx = txProcessor(snap)
    await processTx(
      'goldTx',
      celo.transferReserveGold(request.beneficiary, faucetConfig.goldAmount)
    )
  }
}

function messageText(inviteCode: string, request: RequestRecord) {
  return `Hello! Thank you for joining the Celo network. Your invite code is: ${inviteCode} Download the app at ${downloadLink(
    request.mobileOS as MobileOS
  )}`
}

const IOS_URL = 'https://apps.apple.com/us/app/celo-alfajores-wallet/id1482389446'
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=org.celo.mobile.alfajores'

function downloadLink(mobileOS: MobileOS) {
  return mobileOS === MobileOS.ios ? IOS_URL : ANDROID_URL
}
