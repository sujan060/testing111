import { ContractKit, newKit } from '@celo/contractkit'
import { AttestationsWrapper } from '@celo/contractkit/lib/wrappers/Attestations'
import { generateAccountAddressFromPrivateKey } from '@celo/contractkit/src/providers/celo-private-keys-subprovider'
import BigNumber from 'bignumber.js'
import { assert } from 'chai'
import { ensure0x } from '../lib/utils'
import { getContext, GethTestConfig, sleep } from './utils'

const validatorAddress = '0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95'
const accountPrivateKey = 'a42ac9c99f6ab2c96ee6cae1b40d36187f65cd878737f6623cd363fb94ba7087'
const accountAddress = ensure0x(generateAccountAddressFromPrivateKey(accountPrivateKey))
const phoneNumber = '+15555555555'

describe('attestations tests', () => {
  const gethConfig: GethTestConfig = {
    migrate: true,
    instances: [
      { name: 'validator0', validating: true, syncmode: 'full', port: 30303, rpcport: 8545 },
      { name: 'validator1', validating: true, syncmode: 'full', port: 30305, rpcport: 8547 },
      { name: 'validator2', validating: true, syncmode: 'full', port: 30307, rpcport: 8549 },
      { name: 'validator3', validating: true, syncmode: 'full', port: 30309, rpcport: 8551 },
      { name: 'validator4', validating: true, syncmode: 'full', port: 30311, rpcport: 8553 },
      {
        name: 'lightclient',
        validating: false,
        syncmode: 'ultralight',
        port: 30313,
        rpcport: 8555,
        peers: [8545, 8547, 8549, 8551, 8553],
      },
    ],
  }

  const context: any = getContext(gethConfig)
  let contractKit: ContractKit
  let Attestations: AttestationsWrapper

  before(async function(this: any) {
    this.timeout(0)
    await context.hooks.before()
  })

  after(context.hooks.after)

  const restart = async () => {
    await context.hooks.restart()
    const validatorKit = newKit('http://localhost:8545')
    validatorKit.defaultAccount = validatorAddress
    await sleep(2)
    await validatorKit.web3.eth.personal.unlockAccount(validatorAddress, '', 1000000)

    const goldToken = await validatorKit.contracts.getGoldToken()
    const stableToken = await validatorKit.contracts.getStableToken()

    await goldToken
      .transfer(accountAddress, new BigNumber(10).pow(18).toString())
      .sendAndWaitForReceipt()
    await stableToken
      .transfer(accountAddress, new BigNumber(10).pow(19).toString())
      .sendAndWaitForReceipt()

    contractKit = newKit('http://localhost:8555')
    contractKit.defaultAccount = accountAddress
    // @ts-ignore
    await contractKit.web3.eth.personal.importRawKey(accountPrivateKey, '')
    // TODO(mcortesi): magic sleep. without it unlockAccount sometimes fails
    await sleep(2)
    await contractKit.web3.eth.personal.unlockAccount(accountAddress, '', 1000000)
    Attestations = await contractKit.contracts.getAttestations()
  }

  describe('Attestations', () => {
    before(async function() {
      this.timeout(0)
      await restart()
    })

    it('requests an attestation', async function(this: any) {
      this.timeout(20000)

      console.info('isSyncing')
      console.info(new Date().toISOString())
      console.info(await contractKit.web3.eth.isSyncing())
      console.info('approve')
      const approve = await Attestations.approveAttestationFee(2)
      await approve.sendAndWaitForReceipt()
      console.info('request')
      const request = await Attestations.request(phoneNumber, 2)
      await request.sendAndWaitForReceipt()

      console.info('wait')
      await Attestations.waitForSelectingIssuers(phoneNumber, accountAddress)
      console.info('selectIssuers')
      const selectIssuers = await Attestations.selectIssuers(phoneNumber)
      await selectIssuers.sendAndWaitForReceipt()

      const stats = await Attestations.getAttestationStat(phoneNumber, accountAddress)
      assert.equal(stats.total, 2)

      const issuers = await Attestations.getAttestationIssuers(phoneNumber, accountAddress)
      assert.lengthOf(issuers, 2)
    })
  })
})
