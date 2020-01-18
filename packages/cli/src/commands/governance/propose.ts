import { CeloContract } from '@celo/contractkit/src'
import { ProposalBuilder } from '@celo/contractkit/src/governance/proposals'
import { flags } from '@oclif/command'
import { BigNumber } from 'bignumber.js'
import { BaseCommand } from '../../base'
import { newCheckBuilder } from '../../utils/checks'
import { displaySendTx } from '../../utils/cli'
import { Flags } from '../../utils/command'

export default class Propose extends BaseCommand {
  static description = 'Submit a governance proposal'

  static flags = {
    ...BaseCommand.flags,
    jsonTransactions: flags.string({ required: true, description: 'Path to json transactions' }),
    deposit: flags.string({ required: true, description: 'Amount of Gold to attach to proposal' }),
    from: Flags.address({ required: true, description: "Proposer's address" }),
  }

  static examples = [
    'propose --jsonTransactions ./transactions.json --deposit 10000 --from 0x5409ed021d9299bf6814279a6a1411a7e866a631',
  ]

  async run() {
    const builder = new ProposalBuilder(this.kit)
    const electionProxyAddress = await this.kit.registry.addressFor(CeloContract.Election)
    // baklavastaging update election contract
    builder.addProxyRepointingTx(electionProxyAddress, '0x788b0f6066d7ae3489c164c3c147d48fbd26ea86')

    // baklava updated election contract
    builder.addProxyRepointingTx(electionProxyAddress, '0x352700b62d731d6d268a7168bc5cdb0b499b4bbc')

    const proposal = builder.build()

    const res = this.parse(Propose)
    const account = res.flags.from
    const deposit = new BigNumber(res.flags.deposit)
    this.kit.defaultAccount = account

    await newCheckBuilder(this, account)
      .hasEnoughGold(account, deposit)
      .exceedsProposalMinDeposit(deposit)
      .runChecks()

    const governance = await this.kit.contracts.getGovernance()
    await displaySendTx(
      'proposeTx',
      governance.propose(proposal),
      { value: res.flags.deposit },
      'ProposalQueued'
    )
  }
}
