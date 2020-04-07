import { CeloContract } from '@celo/contractkit'
import { BaseCommand } from '../../base'
import { displaySendTx } from '../../utils/cli'
import { Flags } from '../../utils/command'

export default class RemoveExpired extends BaseCommand {
  static args = [
    {
      name: 'token',
      required: true,
      default: CeloContract.StableToken,
      options: [CeloContract.StableToken],
    },
    {
      name: 'numReports',
      required: true,
    },
  ]

  static flags = {
    ...BaseCommand.flags,
    from: Flags.address({ required: true, description: 'Address of the oracle account' }),
  }

  async run() {
    const res = this.parse(RemoveExpired)
    const sortedOracles = await this.kit.contracts.getSortedOracles()
    const numReports = parseInt(res.args.numReports, 10)

    await displaySendTx(
      'sortedOracles.removeExpiredReports',
      await sortedOracles.removeExpiredReports(res.args.token, numReports)
    )

    console.info('succeeded at removing expired reports')
  }
}
