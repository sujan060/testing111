// celotooljs port-forward -e alfajores
// celocli config:set --node http://localhost:8545
// wget https://files.slack.com/files-pri/T7RKE6B5G-FV64J6PUM/tracer.js
// celocli network:trace --tracer tracer.js \
//   --transaction 0x641bca4a3febb911eaed4e5ab9e2dbd3672063e71264e222ccb9b1732a7db505
// celocli network:trace --tracer tracer.js --blockNumber 603190

import { flags } from '@oclif/command'
import fs from 'fs'
import Web3 from 'web3'
import { Debug } from 'web3-eth-debug'
import WebSocket from 'ws'
import { BaseCommand } from '../../base'
import { printValueMapRecursive } from '../../utils/cli'

export default class Trace extends BaseCommand {
  static description = 'Trace a transaction'

  static flags = {
    ...BaseCommand.flags,
    blockNumber: flags.integer({ description: 'Block number to trace' }),
    tracer: flags.string({ description: 'Javascript tracer code' }),
    transaction: flags.string({ description: 'Transaction hash to trace' }),
  }

  async run() {
    const res = this.parse(Trace)
    const tracer = res.flags.tracer ? fs.readFileSync(res.flags.tracer).toString() : ''

    if (res.flags.transaction) {
      printValueMapRecursive(
        await traceTransaction(this.web3, res.flags.transaction, tracer, this.originalProvider)
      )
    } else if (res.flags.blockNumber) {
      printValueMapRecursive(
        await traceBlock(this.web3, res.flags.blockNumber, tracer, this.originalProvider)
      )
    }
  }
}

async function traceTransaction(
  web3: Web3,
  transaction: string,
  tracer: string,
  provider: any
): Promise<Record<string, any>> {
  const args: { [key: string]: string } = { tracer }
  const url = provider.connection ? provider.connection.url : provider.host
  if (provider instanceof Web3.providers.HttpProvider) {
    const debug = new Debug(url)
    const trace = await debug.getTransactionTrace(transaction, args)
    return trace
  } else if (provider instanceof Web3.providers.WebsocketProvider) {
    return (
      await webSocketRPC(
        url,
        '{"id": 1, "method": "debug_traceTransaction", "params": ["' +
          web3.utils.toHex(transaction) +
          '", ' +
          JSON.stringify(args) +
          ']}\n',
        1
      )
    ).result
  } else {
    throw Error('HttpProvider or WebsocketProvider is needed for traceTransaction')
  }
}

async function traceBlock(
  web3: Web3,
  blockNumber: number,
  tracer: string,
  provider: any
): Promise<Record<string, any>> {
  const args: { [key: string]: string } = { tracer }
  const url = provider.connection ? provider.connection.url : provider.host
  if (provider instanceof Web3.providers.HttpProvider) {
    const debug = new Debug(url)
    const trace = await debug.getBlockTraceByNumber(web3.utils.toHex(blockNumber), args)
    return trace
  } else if (provider instanceof Web3.providers.WebsocketProvider) {
    return (
      await webSocketRPC(
        url,
        '{"id": 1, "method": "debug_subscribe", "params": ["traceChain", "' +
          web3.utils.toHex(blockNumber - 1) +
          '", "' +
          web3.utils.toHex(blockNumber) +
          '", ' +
          JSON.stringify(args) +
          ']}\n',
        2
      )
    ).params.result.traces
  } else {
    throw Error('HttpProvider or WebsocketProvider is needed for traceBlock')
  }
}

async function webSocketRPC(
  url: string,
  query: string,
  responseOffset: number
): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    const webSocket = new WebSocket(url)
    let messageCount = 0
    webSocket.onopen = () => {
      webSocket.onerror = (_) => {
        webSocket.close()
        reject()
      }
      webSocket.onmessage = (event) => {
        messageCount++
        if (messageCount == responseOffset) {
          webSocket.close()
          resolve(JSON.parse(event.data.toString()))
        }
      }
      webSocket.send(query)
    }
  })
}
