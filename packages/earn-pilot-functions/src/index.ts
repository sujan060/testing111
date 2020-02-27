import * as functions from 'firebase-functions'
import { transferDollars } from './sendTokens'
const crypto = require('crypto')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const REQUESTS_DB_NAME = 'celo-org-mobile-earn-pilot'
const REQUESTS_DB_URL = `https://${REQUESTS_DB_NAME}.firebaseio.com`
const PILOT_PARTICIPANTS_DB_URL = 'https://celo-org-mobile-pilot.firebaseio.com'

const SHILLINGS_PER_DOLLAR = 100

const FIGURE_EIGHT_KEY = functions.config().envs
  ? functions.config().envs.secret_key
  : 'placeholder_for_local_dev'

exports.handleFigureEightConfirmation = functions.database
  .instance(REQUESTS_DB_NAME)
  .ref('confirmations/{uid}')
  .onWrite((change) => {
    // Whenever a confirmation is written

    const message = change.after.val()
    const { signature, confirmed, userId, adjAmount, jobTitle, conversionId } = message
    console.info(`Confirmed: ${confirmed}`)
    console.info(`Data: ${JSON.stringify(message)}`)
    if (typeof message.updated !== 'undefined' && message.updated) {
      // Already updated
      console.info('Already processed request, returning')
      return null
    }

    if (!confirmed) {
      // No response needed until request is confirmed
      console.info(`Unconfirmed request, no update needed for message: ${JSON.stringify(message)}`)
      return null
    }

    if (!validSignature(signature, JSON.stringify(message.payload))) {
      console.error('Invalid sig')
      return change.after.ref.update({
        valid: false,
      })
    }
    console.info(`Confirmed: ${confirmed}, adjAmount: ${adjAmount}}`)
    console.info(`User ID: ${userId}`)

    const uid = sanitizeId(userId)

    console.info(`Updating confirmed payment for userId ${uid}`)
    const participantsDb = admin
      .app()
      .database(PILOT_PARTICIPANTS_DB_URL)
      .ref('earnPilot/participants')
    const msgRoot = participantsDb.child(uid)
    msgRoot.child('earned').transaction((earned: number) => {
      return (earned || 0) + adjAmount
    })
    console.info(`Incremented balance by ${adjAmount}`)
    msgRoot.child(`conversions/${conversionId}`).set({ jobTitle, adjAmount })
    console.info(`Added conversion record ${conversionId} for job ${jobTitle}`)
    return change.after.ref.update({
      valid: true,
      updated: true,
    })
  })

exports.transferEarnedBalance = functions.database
  .instance(REQUESTS_DB_NAME)
  .ref('requests/{uid}')
  .onWrite(async (change) => {
    const message = change.after.val()

    const { timestamp, userId, amountEarned, account, processed, txId } = message

    if (processed) {
      console.info(`Already handled request for ${userId}, returning`)
      return
    }
    console.info(`Cashing out user ${userId}. Request time: ${timestamp}`)
    const transferSuccess = await transferDollars(amountEarned, account)

    if (!transferSuccess) {
      console.error(`Unable to fulfill request ${txId}, returning unprocessed`)
      return
    }

    const participantsDb = admin
      .app()
      .database(PILOT_PARTICIPANTS_DB_URL)
      .ref('earnPilot/participants')
    const msgRoot = participantsDb.child(userId)
    msgRoot.child('earned').set(0)
    msgRoot.child('cashedOut').transaction((cashedOut: number) => {
      return (cashedOut || 0) + amountEarned
    })
    msgRoot.child('cashOutTxs').push({ txId, timestamp, userId, amountEarned })

    // TODO confirm userId and address and amount match in database

    return change.after.ref.update({
      processed: true,
    })
  })

const validSignature = (signature: string, params: string) => {
  if (!FIGURE_EIGHT_KEY) {
    console.log('Could not load figure eight key')
  }
  const digest = crypto
    .createHash('sha1')
    .update(JSON.stringify(params) + FIGURE_EIGHT_KEY)
    .digest('hex')
  console.log(`Digest ${digest} should equal signature ${signature}`)
  // return digest === signature // TODO enable security
  return true
}

const sanitizeId = (uid: string) => {
  return uid.toLowerCase()
}

enum PostType {
  INITIAL = 'INITIAL',
  CONFIRM = 'CONFIRM',
}

const shillingsToDollars = (amount: string) => {
  return parseFloat(amount) / SHILLINGS_PER_DOLLAR
}

export const handlePost = functions.https.onRequest((request, response) => {
  const data = request.body
  const signature = data.signature
  const payload = JSON.parse(data.payload)
  console.info(`@handlePost payload: ${JSON.stringify(payload)}`)

  if (!validSignature(signature, JSON.stringify(payload))) {
    console.info(
      `Received request ${JSON.stringify(request.body)} with invalid signature ${signature}`
    )
    response.status(401).send(`Unauthorized. Invalid signature: ${signature}`)
    return
  }

  const postType =
    data && typeof payload.conversion_id !== 'undefined' ? PostType.CONFIRM : PostType.INITIAL

  const requestsDb = admin
    .app()
    .database(REQUESTS_DB_URL)
    .ref('confirmations')

  if (postType === PostType.INITIAL) {
    console.info(`Confirmation payload: ${JSON.stringify(payload)}`)
    const { amount, adjusted_amount, uid } = payload
    console.info(`Initial request for payment of ${adjusted_amount} to user ${uid}`)
    const userId = sanitizeId(uid)
    const conversionId = requestsDb.push({
      userId,
      confirmed: false,
      adjAmount: shillingsToDollars(adjusted_amount), // Convert from shillings displayed in Fig8 UI to cUSD
      amount,
    }).key
    console.info(`Assigned conversion ID ${conversionId} to unconfirmed request`)
    response.status(200).send(conversionId) // `${JSON.stringify({ conversion_id: conversionId })}`)
    return
  } else if (postType === PostType.CONFIRM) {
    console.info(`Confirmation payload: ${JSON.stringify(payload)}`)
    const { job_title, conversion_id } = payload
    if (!conversion_id || !job_title) {
      response
        .status(400)
        .send(`Missing conversion_id or job_title in received payload: ${JSON.stringify(payload)}`)
      return
    }
    console.info(`Confirmation request for ${job_title} and conversion id ${conversion_id}`)
    requestsDb
      .child(conversion_id)
      .update({ jobTitle: job_title, confirmed: true, conversionId: conversion_id }) // Duplicate storage of conversionId for convenient handleFigureEightConfirmation access
    console.info(`Request ${job_title} confirmed`)
    response.status(200).send('OK')
    return
  } else {
    console.log('Unkown post type')
    response.status(400).send('Unkown post type')
    return
  }
})
