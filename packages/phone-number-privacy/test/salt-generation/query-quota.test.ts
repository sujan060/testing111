import fetch, { Response as FetchResponseClass } from 'node-fetch'
// import { getPerformedQueryCount } from '../../src/database/wrappers/account'
import {
  getQueryQuota,
  getTransactionCountFromAccount,
} from '../../src/salt-generation/query-quota'

const ACCOUNT = '0x78dc5D2D739606d31509C31d654056A45185ECb6'
const PHONE_NUMBER = '+1234567890'

jest.mock('node-fetch')
const mockBlockscoutFetch = fetch as jest.Mock
const FetchResponse: typeof FetchResponseClass = jest.requireActual('node-fetch').Response

const defaultResponse = {
  result: [
    {
      to: 'recipient',
      from: ACCOUNT,
      value: '1',
      blockNumber: 123,
      txHash: 'txhash',
      timestamp: 1,
    },
    {
      from: ACCOUNT,
      to: 'sender',
      value: '1',
      blockNumber: 124,
      txHash: 'txhash',
      timestamp: 1,
    },
    {
      from: 'recipient',
      to: ACCOUNT,
      value: '1',
      blockNumber: 125,
      txHash: 'txhash',
      timestamp: 1,
    },
  ],
}
const defaultResponseJson = JSON.stringify(defaultResponse)

describe(`Retrieve Transaction Count`, () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('happy path returns transaction count', async () => {
    mockBlockscoutFetch.mockImplementation(() => new FetchResponse(defaultResponseJson))
    expect(await getTransactionCountFromAccount(ACCOUNT)).toEqual(2)
  })
  it('network failure returns count of 0', async () => {
    mockBlockscoutFetch.mockImplementation(() => new FetchResponse(JSON.stringify(null)))
    expect(await getTransactionCountFromAccount(ACCOUNT)).toEqual(0)
  })
  it('network failure returns count of 0', async () => {
    mockBlockscoutFetch.mockImplementation(() => new FetchResponse(JSON.stringify({ garbage: 2 })))
    expect(await getTransactionCountFromAccount(ACCOUNT)).toEqual(0)
  })
})

describe(`Retrieve Transaction Count`, () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('happy path returns transaction count', async () => {
    jest.mock('../../src/salt-generation/query-quota', () => ({
      isVerified: jest.fn().mockReturnValue(new Promise(() => true)),
    }))
    expect(await getQueryQuota(ACCOUNT, PHONE_NUMBER)).toEqual(32)
  })
  // it('network failure returns count of 0', async () => {
  //   mockBlockscoutFetch.mockImplementation(() => new FetchResponse(JSON.stringify(null)))
  //   expect(await getTransactionCountFromAccount(ACCOUNT)).toEqual(0)
  // })
  // it('network failure returns count of 0', async () => {
  //   mockBlockscoutFetch.mockImplementation(() => new FetchResponse(JSON.stringify({"garbage": 2})))
  //   expect(await getTransactionCountFromAccount(ACCOUNT)).toEqual(0)
  // })
})
