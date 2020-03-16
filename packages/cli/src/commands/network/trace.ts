// celotooljs port-forward -e alfajores
// celocli config:set --node http://localhost:8545
// wget https://files.slack.com/files-pri/T7RKE6B5G-FV64J6PUM/tracer.js
// celocli network:trace --tracer tracer.js \
//   --transaction 0x641bca4a3febb911eaed4e5ab9e2dbd3672063e71264e222ccb9b1732a7db505
// celocli network:trace --tracer tracer.js --blockNumber 603190

import { stopProvider } from '@celo/contractkit/lib/providers/celo-provider'
import { flags } from '@oclif/command'
import fs from 'fs'
import { Debug } from 'web3-eth-debug'
import Web3Utils from 'web3-utils'
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
        await traceTransaction(this.originalProvider, res.flags.transaction, tracer)
      )
    } else if (res.flags.blockNumber) {
      printValueMapRecursive(await traceBlock(this.originalProvider, res.flags.blockNumber, tracer))
    }
  }
}

async function traceTransaction(
  provider: any,
  transaction: string,
  tracer: string
): Promise<Record<string, any>> {
  const args: { [key: string]: string } = { tracer }
  const url = provider.connection ? provider.connection.url : provider.host
  const debug = new Debug(url)
  const trace = await debug.getTransactionTrace(transaction, args)
  stopProvider(debug.currentProvider)
  return trace
}

async function traceBlock(
  provider: any,
  blockNumber: number,
  tracer: string
): Promise<Record<string, any>> {
  const args: { [key: string]: string } = { tracer }
  const url = provider.connection ? provider.connection.url : provider.host
  const debug = new Debug(url)
  const trace = await debug.getBlockTraceByNumber(Web3Utils.toHex(blockNumber), args)
  stopProvider(debug.currentProvider)
  return trace
}
