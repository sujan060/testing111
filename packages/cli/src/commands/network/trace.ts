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
    const url = this.originalProvider.connection
      ? this.originalProvider.connection.url
      : this.originalProvider.host
    const args: { [key: string]: string } = {}
    if (res.flags.tracer) {
      args.tracer = fs.readFileSync(res.flags.tracer).toString()
    }

    if (res.flags.transaction) {
      if (!(this.originalProvider instanceof Web3.providers.HttpProvider)) {
        throw Error('HttpProvider is required with --transaction')
      }
      const debug = new Debug(url)
      const trace = await debug.getTransactionTrace(res.flags.transaction, args)
      printValueMapRecursive(trace)
    } else if (res.flags.blockNumber) {
      if (!(this.originalProvider instanceof Web3.providers.HttpProvider)) {
        throw Error('HttpProvider is required with --blockNumber')
      }
      const debug = new Debug(url)
      const trace = await debug.getBlockTraceByNumber(
        this.web3.utils.toHex(res.flags.blockNumber),
        args
      )
      printValueMapRecursive(trace)
    } else {
      if (!(this.originalProvider instanceof Web3.providers.WebsocketProvider)) {
        throw Error('WebsocketProvider is required for debug_subscribe')
      }
      const webSocket = new WebSocket(url)
      webSocket.onopen = () => {
        webSocket.onmessage = (event) => {
          console.info(event.data)
        }
        webSocket.send(
          '{"id": 1, "method": "debug_subscribe", "params": ["traceChain", "0x0", "0xffff", ' +
            JSON.stringify(args) +
            ']}\n'
        )
      }
    }
  }
}
