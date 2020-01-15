import { AttestationServiceTestRequest } from '@celo/utils/lib/io'
import { parseSignature } from '@celo/utils/lib/signatureUtils'
import express from 'express'
import { getAccountAddress } from '../env'
import { rootLogger } from '../logger'
import { ErrorMessages, respondWithError } from '../request'
import { smsProviderFor } from '../sms'
export { AttestationServiceTestRequestType } from '@celo/utils/lib/io'

export async function handleTestAttestationRequest(
  _req: express.Request,
  res: express.Response,
  testRequest: AttestationServiceTestRequest
) {
  let isValid = false

  try {
    rootLogger.info({ testRequest, accountAddress: getAccountAddress() })
    parseSignature(
      testRequest.phoneNumber + testRequest.message,
      testRequest.signature,
      getAccountAddress()
    )
    isValid = true
  } catch (error) {
    rootLogger.error({ err: error })
  }

  if (!isValid) {
    respondWithError(res, 422, ErrorMessages.INVALID_SIGNATURE)
    return
  }

  const provider = smsProviderFor(testRequest.phoneNumber)
  if (provider === undefined) {
    respondWithError(res, 422, ErrorMessages.NO_PROVIDER_SETUP)
    return
  }

  await provider!.sendSms(testRequest.phoneNumber, testRequest.message)
  res.json({ success: true }).status(201)
}
