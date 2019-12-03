import { CeloContract } from '@celo/contractkit'
import { BaseCommand } from '../../base'

export default class WhitelistedOracle extends BaseCommand {
  static description = 'checks if this account is an oracle'

  static flags = {
    ...BaseCommand.flags,
  }

  static args = [
    {
      name: 'token',
      required: true,
      description: 'Token to get the rates for',
      options: [CeloContract.StableToken],
      default: CeloContract.StableToken,
    },
    {
      name: 'account',
      required: true,
    },
  ]

  static example = ['whitelisted StableToken 0x8c349AAc7065a35B7166f2659d6C35D75A3893C1']

  async run() {
    const res = this.parse(WhitelistedOracle)
    const sortedOracles = await this.kit.contracts.getSortedOracles()

    const result = await sortedOracles.isOracle(res.args.token, res.args.account)
    console.log(`is oracle? ${result}`)
  }
}
