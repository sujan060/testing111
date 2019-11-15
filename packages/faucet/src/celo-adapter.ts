import { ContractKit, newKit } from '@celo/contractkit'

export class CeloAdapter {
  readonly kit: ContractKit

  constructor(nodeUrl: string, pk: string) {
    this.kit = newKit(nodeUrl)
    const privateKey = this.kit.web3.utils.isHexStrict(pk) ? pk : '0x' + pk
    this.kit.addAccount(privateKey)
    this.kit.defaultAccount = this.kit.web3.eth.accounts.privateKeyToAccount(privateKey).address
  }

  async transferReserveGold(to: string, amount: string) {
    const reserve = await this.kit.contracts.getReserve()
    return reserve.transferGold(to, amount).send()
  }

  async transferGold(to: string, amount: string) {
    const goldToken = await this.kit.contracts.getGoldToken()
    return goldToken.transfer(to, amount).send()
  }

  async transferDollars(to: string, amount: string) {
    const stableToken = await this.kit.contracts.getStableToken()
    return stableToken.transfer(to, amount).send()
  }

  async escrowDollars(
    phoneHash: string,
    tempWallet: string,
    amount: string,
    expirarySeconds: number,
    minAttestations: number
  ) {
    const stableToken = await this.kit.contracts.getStableToken()
    const escrow = await this.kit.contracts.getEscrow()

    await stableToken.approve(escrow.address, amount).sendAndWaitForReceipt()

    return escrow
      .transfer(
        phoneHash,
        stableToken.address,
        amount,
        expirarySeconds,
        tempWallet,
        minAttestations
      )
      .send()
  }

  async getDollarsBalance(accountAddress: string = this.kit.defaultAccount) {
    const stableToken = await this.kit.contracts.getStableToken()
    return stableToken.balanceOf(accountAddress)
  }
  async getGoldBalance(accountAddress: string = this.kit.defaultAccount) {
    const goldToken = await this.kit.contracts.getGoldToken()
    return goldToken.balanceOf(accountAddress)
  }

  /**
   * Generates a temporary account and invite code.
   */
  generateInviteCode(): {
    address: string
    inviteCode: string
  } {
    const tempAccount = this.kit.web3.eth.accounts.create()
    const address = tempAccount.address
    const temporaryPrivateKey = tempAccount.privateKey
    // Buffer.from doesn't expect a 0x for hex input
    const inviteCode = Buffer.from(temporaryPrivateKey.substring(2), 'hex').toString('base64')
    return { address, inviteCode }
  }
}
