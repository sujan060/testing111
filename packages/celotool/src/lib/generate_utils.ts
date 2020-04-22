// @ts-ignore
import { blsPrivateKeyToProcessedPrivateKey } from '@celo/utils/lib/bls'
import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bls12377js from 'bls12377js'
import { ec as EC } from 'elliptic'
import fs from 'fs'
import { range, repeat } from 'lodash'
import path from 'path'
import * as rlp from 'rlp'
import Web3 from 'web3'
import { envVar, fetchEnv, fetchEnvOrFallback, monorepoRoot } from './env-utils'
import { GENESIS_MSG_HASH } from './genesis_constants'
import { GenesisConfig } from './interfaces/genesis-config'
import { ensure0x, strip0x } from './utils'

const ec = new EC('secp256k1')

export enum AccountType {
  VALIDATOR = 0,
  LOAD_TESTING_ACCOUNT = 1,
  TX_NODE = 2,
  BOOTNODE = 3,
  FAUCET = 4,
  ATTESTATION = 5,
  PRICE_ORACLE = 6,
  PROXY = 7,
  ATTESTATION_BOT = 8,
  VOTING_BOT = 9,
}

export enum ConsensusType {
  CLIQUE = 'clique',
  ISTANBUL = 'istanbul',
}

export interface Validator {
  address: string
  blsPublicKey: string
  balance?: string
}

export interface AccountAndBalance {
  address: string
  balance: string
}

export const MNEMONIC_ACCOUNT_TYPE_CHOICES = [
  'validator',
  'load_testing',
  'tx_node',
  'bootnode',
  'faucet',
  'attestation',
  'price_oracle',
  'proxy',
  'attestation_bot',
  'voting_bot',
]

export const add0x = (str: string) => {
  return '0x' + str
}

export const coerceMnemonicAccountType = (raw: string): AccountType => {
  const index = MNEMONIC_ACCOUNT_TYPE_CHOICES.indexOf(raw)
  if (index === -1) {
    throw new Error('Invalid mnemonic account type')
  }
  return index
}

export const generatePrivateKey = (mnemonic: string, accountType: AccountType, index: number) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const node = bip32.fromSeed(seed)
  const newNode = node.derive(accountType).derive(index)

  return newNode.privateKey!.toString('hex')
}

export const generatePublicKey = (mnemonic: string, accountType: AccountType, index: number) => {
  return privateKeyToPublicKey(generatePrivateKey(mnemonic, accountType, index))
}

export const generateAddress = (mnemonic: string, accountType: AccountType, index: number) =>
  privateKeyToAddress(generatePrivateKey(mnemonic, accountType, index))

export const privateKeyToPublicKey = (privateKey: string): string => {
  const ecPrivateKey = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'))
  const ecPublicKey: string = ecPrivateKey.getPublic('hex')
  return ecPublicKey.slice(2)
}

export const privateKeyToAddress = (privateKey: string) => {
  // @ts-ignore
  return new Web3.modules.Eth().accounts.privateKeyToAccount(ensure0x(privateKey)).address
}

export const privateKeyToStrippedAddress = (privateKey: string) =>
  strip0x(privateKeyToAddress(privateKey))

const validatorZeroBalance = () =>
  fetchEnvOrFallback(envVar.VALIDATOR_ZERO_GENESIS_BALANCE, '103010030000000000000000000') // 103,010,030 CG
const validatorBalance = () =>
  fetchEnvOrFallback(envVar.VALIDATOR_GENESIS_BALANCE, '10011000000000000000000') // 10,011 CG
const faucetBalance = () =>
  fetchEnvOrFallback(envVar.FAUCET_GENESIS_BALANCE, '10011000000000000000000') // 10,011 CG
const oracleBalance = () =>
  fetchEnvOrFallback(envVar.MOCK_ORACLE_GENESIS_BALANCE, '100000000000000000000') // 100 CG
const votingBotBalance = () =>
  fetchEnvOrFallback(envVar.VOTING_BOT_BALANCE, '10000000000000000000000') // 10,000 CG

export const getPrivateKeysFor = (accountType: AccountType, mnemonic: string, n: number) =>
  range(0, n).map((i) => generatePrivateKey(mnemonic, accountType, i))

export const getAddressesFor = (accountType: AccountType, mnemonic: string, n: number) =>
  getPrivateKeysFor(accountType, mnemonic, n).map(privateKeyToAddress)

export const getStrippedAddressesFor = (accountType: AccountType, mnemonic: string, n: number) =>
  getAddressesFor(accountType, mnemonic, n).map(strip0x)

export const getValidatorsInformation = (mnemonic: string, n: number): Validator[] => {
  return getPrivateKeysFor(AccountType.VALIDATOR, mnemonic, n).map((key, i) => {
    const blsKeyBytes = blsPrivateKeyToProcessedPrivateKey(key)
    return {
      address: strip0x(privateKeyToAddress(key)),
      blsPublicKey: bls12377js.BLS.privateToPublicBytes(blsKeyBytes).toString('hex'),
      balance: i === 0 ? validatorZeroBalance() : validatorBalance(),
    }
  })
}

export const getAddressFromEnv = (accountType: AccountType, n: number) => {
  const mnemonic = fetchEnv(envVar.MNEMONIC)
  const privateKey = generatePrivateKey(mnemonic, accountType, n)
  return privateKeyToAddress(privateKey)
}

const getFaucetedAccountsFor = (
  accountType: AccountType,
  mnemonic: string,
  n: number,
  balance: string
) => {
  return getStrippedAddressesFor(accountType, mnemonic, n).map((address) => ({
    address,
    balance,
  }))
}

export const getFaucetedAccounts = (mnemonic: string) => {
  const numFaucetAccounts = parseInt(fetchEnvOrFallback(envVar.FAUCET_GENESIS_ACCOUNTS, '0'), 10)
  const faucetAccounts = getFaucetedAccountsFor(
    AccountType.FAUCET,
    mnemonic,
    numFaucetAccounts,
    faucetBalance()
  )

  const numLoadTestAccounts = parseInt(fetchEnvOrFallback(envVar.LOAD_TEST_CLIENTS, '0'), 10)
  const loadTestAccounts = getFaucetedAccountsFor(
    AccountType.LOAD_TESTING_ACCOUNT,
    mnemonic,
    numLoadTestAccounts,
    faucetBalance()
  )

  const oracleAccounts = getFaucetedAccountsFor(
    AccountType.PRICE_ORACLE,
    mnemonic,
    1,
    oracleBalance()
  )

  const numVotingBotAccounts = parseInt(fetchEnvOrFallback(envVar.VOTING_BOTS, '0'), 10)
  const votingBotAccounts = getFaucetedAccountsFor(
    AccountType.VOTING_BOT,
    mnemonic,
    numVotingBotAccounts,
    votingBotBalance()
  )

  return [...faucetAccounts, ...loadTestAccounts, ...oracleAccounts, ...votingBotAccounts]
}

export const generateGenesisFromEnv = (enablePetersburg: boolean = true) => {
  const mnemonic = fetchEnv(envVar.MNEMONIC)
  const validatorEnv = fetchEnv(envVar.VALIDATORS)
  const genesisAccountsEnv = fetchEnvOrFallback(envVar.GENESIS_ACCOUNTS, '')
  const validators = getValidatorsInformation(mnemonic, parseInt(validatorEnv, 10))

  const consensusType = fetchEnv(envVar.CONSENSUS_TYPE) as ConsensusType

  if (![ConsensusType.CLIQUE, ConsensusType.ISTANBUL].includes(consensusType)) {
    console.error('Unsupported CONSENSUS_TYPE')
    process.exit(1)
  }

  const blockTime = parseInt(fetchEnv(envVar.BLOCK_TIME), 10)
  const requestTimeout = parseInt(
    fetchEnvOrFallback(envVar.ISTANBUL_REQUEST_TIMEOUT_MS, '3000'),
    10
  )
  const epoch = parseInt(fetchEnvOrFallback(envVar.EPOCH, '30000'), 10)
  // allow 12 blocks in prod for the uptime metric
  const lookbackwindow = parseInt(fetchEnvOrFallback(envVar.LOOKBACK, '12'), 10)
  const chainId = parseInt(fetchEnv(envVar.NETWORK_ID), 10)

  const initialAccounts = getFaucetedAccounts(mnemonic)
  if (genesisAccountsEnv !== '') {
    const genesisAccountsPath = path.resolve(monorepoRoot, genesisAccountsEnv)
    const genesisAccounts = JSON.parse(fs.readFileSync(genesisAccountsPath).toString())
    for (const addr of genesisAccounts.addresses) {
      initialAccounts.push({
        address: addr,
        balance: genesisAccounts.value,
      })
    }
  }

  // Allocate voting bot account(s)
  const numVotingBotAccounts = parseInt(fetchEnvOrFallback(envVar.VOTING_BOTS, '0'), 10)
  initialAccounts.concat(
    getStrippedAddressesFor(AccountType.VOTING_BOT, mnemonic, numVotingBotAccounts).map((addr) => {
      return {
        address: addr,
        balance: fetchEnvOrFallback(envVar.VOTING_BOT_BALANCE, '100000000000000000000'),
      }
    })
  )

  return generateGenesis({
    validators,
    consensusType,
    blockTime,
    initialAccounts,
    epoch,
    lookbackwindow,
    chainId,
    requestTimeout,
    enablePetersburg,
  })
}

export const generateIstanbulExtraData = (validators: Validator[]) => {
  const istanbulVanity = GENESIS_MSG_HASH
  // Vanity prefix is 32 bytes (1 hex char/.5 bytes * 32 bytes = 64 hex chars)
  if (istanbulVanity.length !== 32 * 2) {
    throw new Error('Istanbul vanity must be 32 bytes')
  }
  const blsSignatureVanity = 96
  const ecdsaSignatureVanity = 65
  return (
    '0x' +
    istanbulVanity +
    rlp
      // @ts-ignore
      .encode([
        // Added validators
        validators.map((validator) => Buffer.from(validator.address, 'hex')),
        validators.map((validator) => Buffer.from(validator.blsPublicKey, 'hex')),
        // Removed validators
        new Buffer(0),
        // Seal
        Buffer.from(repeat('0', ecdsaSignatureVanity * 2), 'hex'),
        [
          // AggregatedSeal.Bitmap
          new Buffer(0),
          // AggregatedSeal.Signature
          Buffer.from(repeat('0', blsSignatureVanity * 2), 'hex'),
          // AggregatedSeal.Round
          new Buffer(0),
        ],
        [
          // ParentAggregatedSeal.Bitmap
          new Buffer(0),
          // ParentAggregatedSeal.Signature
          Buffer.from(repeat('0', blsSignatureVanity * 2), 'hex'),
          // ParentAggregatedSeal.Round
          new Buffer(0),
        ],
      ])
      .toString('hex')
  )
}

export const generateGenesis = ({
  validators,
}: // consensusType = ConsensusType.ISTANBUL,
// initialAccounts: otherAccounts = [],
// blockTime,
// epoch,
// lookbackwindow,
// chainId,
// requestTimeout,
// enablePetersburg = true,
GenesisConfig): string => {
  // const genesis: any = { ...TEMPLATE }

  // if (!enablePetersburg) {
  //   genesis.config = GETH_CONFIG_OLD
  // }

  // genesis.config.chainId = chainId

  // if (consensusType === ConsensusType.CLIQUE) {
  //   genesis.config.clique = {
  //     period: blockTime,
  //     epoch,
  //   }
  // } else if (consensusType === ConsensusType.ISTANBUL) {
  //   genesis.mixHash = ISTANBUL_MIX_HASH
  //   genesis.difficulty = '0x1'
  //   if (validators) {
  // genesis.extraData = generateIstanbulExtraData(validators)
  //   }
  //   genesis.config.istanbul = {
  //     // see github.com/celo-org/celo-blockchain/blob/master/consensus/istanbul/config.go#L21-L25
  //     // 0 = RoundRobin, 1 = Sticky, 2 = ShuffledRoundRobin
  //     policy: 2,
  //     blockperiod: blockTime,
  //     requesttimeout: requestTimeout,
  //     epoch,
  //     lookbackwindow,
  //   }
  // }

  // if (validators) {
  //   for (const validator of validators) {
  //     genesis.alloc[validator.address] = {
  //       balance: validator.balance,
  //     }
  //   }
  // }

  // for (const account of otherAccounts) {
  //   genesis.alloc[account.address] = {
  //     balance: account.balance,
  //   }
  // }

  // const contracts = [REGISTRY_ADDRESS]
  // const contractBuildPath = path.resolve(
  //   monorepoRoot,
  //   'packages/protocol/build/contracts/Proxy.json'
  // )

  // if (validators && validators.length > 0) {
  //   for (const contract of contracts) {
  //     genesis.alloc[contract] = {
  //       code: JSON.parse(fs.readFileSync(contractBuildPath).toString()).deployedBytecode,
  //       storage: {
  //         [CONTRACT_OWNER_STORAGE_LOCATION]: validators[0].address,
  //       },
  //       balance: '0',
  //     }
  //   }
  // }

  const genesis: any = { ...RC1GENESIS }
  genesis.timestamp = '0x5b843511'
  genesis.extraData = generateIstanbulExtraData(validators!)
  genesis.alloc = {
    ...RC1ALLOC,
  }

  genesis.alloc[validators![0].address] = {
    balance: '20000000000000000000000',
  }

  genesis.alloc['000000000000000000000000000000000000ce10'] = {
    code:
      '0x60806040526004361061004a5760003560e01c806303386ba3146101e757806342404e0714610280578063bb913f41146102d7578063d29d44ee14610328578063f7e6af8014610379575b6000600160405180807f656970313936372e70726f78792e696d706c656d656e746174696f6e00000000815250601c019050604051809103902060001c0360001b9050600081549050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610136576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f4e6f20496d706c656d656e746174696f6e20736574000000000000000000000081525060200191505060405180910390fd5b61013f816103d0565b6101b1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f496e76616c696420636f6e74726163742061646472657373000000000000000081525060200191505060405180910390fd5b60405136810160405236600082376000803683855af43d604051818101604052816000823e82600081146101e3578282f35b8282fd5b61027e600480360360408110156101fd57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561023a57600080fd5b82018360208201111561024c57600080fd5b8035906020019184600183028401116401000000008311171561026e57600080fd5b909192939192939050505061041b565b005b34801561028c57600080fd5b506102956105c1565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102e357600080fd5b50610326600480360360208110156102fa57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061060d565b005b34801561033457600080fd5b506103776004803603602081101561034b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506107bd565b005b34801561038557600080fd5b5061038e610871565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60008060007fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47060001b9050833f915080821415801561041257506000801b8214155b92505050919050565b610423610871565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104c3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f73656e64657220776173206e6f74206f776e657200000000000000000000000081525060200191505060405180910390fd5b6104cc8361060d565b600060608473ffffffffffffffffffffffffffffffffffffffff168484604051808383808284378083019250505092505050600060405180830381855af49150503d8060008114610539576040519150601f19603f3d011682016040523d82523d6000602084013e61053e565b606091505b508092508193505050816105ba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f696e697469616c697a6174696f6e2063616c6c6261636b206661696c6564000081525060200191505060405180910390fd5b5050505050565b600080600160405180807f656970313936372e70726f78792e696d706c656d656e746174696f6e00000000815250601c019050604051809103902060001c0360001b9050805491505090565b610615610871565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146106b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f73656e64657220776173206e6f74206f776e657200000000000000000000000081525060200191505060405180910390fd5b6000600160405180807f656970313936372e70726f78792e696d706c656d656e746174696f6e00000000815250601c019050604051809103902060001c0360001b9050610701826103d0565b610773576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f496e76616c696420636f6e74726163742061646472657373000000000000000081525060200191505060405180910390fd5b8181558173ffffffffffffffffffffffffffffffffffffffff167fab64f92ab780ecbf4f3866f57cee465ff36c89450dcce20237ca7a8d81fb7d1360405160405180910390a25050565b6107c5610871565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610865576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f73656e64657220776173206e6f74206f776e657200000000000000000000000081525060200191505060405180910390fd5b61086e816108bd565b50565b600080600160405180807f656970313936372e70726f78792e61646d696e000000000000000000000000008152506013019050604051809103902060001c0360001b9050805491505090565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610960576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f6f776e65722063616e6e6f74206265203000000000000000000000000000000081525060200191505060405180910390fd5b6000600160405180807f656970313936372e70726f78792e61646d696e000000000000000000000000008152506013019050604051809103902060001c0360001b90508181558173ffffffffffffffffffffffffffffffffffffffff167f50146d0e3c60aa1d17a70635b05494f864e86144a2201275021014fbf08bafe260405160405180910390a2505056fea165627a7a723058206808dd43e7d765afca53fe439122bc5eac16d708ce7d463451be5042426f101f0029',
    storage: {
      '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103': validators![0].address,
    },
    balance: '0',
  }

  return JSON.stringify(genesis, null, 2)
}

const RC1ALLOC = {
  '0x11901cf7eEae1E2644995FB2E47Ce46bC7F33246': {
    balance: '120000000000000000000000000',
  },
  '0xC1cDA18694F5B86cFB80c1B4f8Cc046B0d7E6326': {
    balance: '20000000000000000000000000',
  },
  '0xa5d40D93b01AfBafec84E20018Aff427628F645E': {
    balance: '20000000000000000000000000',
  },
  '0x8d485780E84E23437f8F6938D96B964645529127': {
    balance: '20000000000000000000000000',
  },
  '0x5F857c501b73ddFA804234f1f1418D6f75554076': {
    balance: '20000000000000000000000000',
  },
  '0xaa9064F57F8d7de4b3e08c35561E21Afd6341390': {
    balance: '20000000000000000000000000',
  },
  '0x7FA26b50b3e9a2eC8AD1850a4c4FBBF94D806E95': {
    balance: '20000000000000000000000000',
  },
  '0x08960Ce6b58BE32FBc6aC1489d04364B4f7dC216': {
    balance: '20000000000000000000000000',
  },
  '0x77B68B2e7091D4F242a8Af89F200Af941433C6d8': {
    balance: '20000000000000000000000000',
  },
  '0x75Bb69C002C43f5a26a2A620518775795Fd45ecf': {
    balance: '20000000000000000000000000',
  },
  '0x19992AE48914a178Bf138665CffDD8CD79b99513': {
    balance: '20000000000000000000000000',
  },

  '0xDe22679dCA843B424FD0BBd70A22D5F5a4B94fe4': {
    balance: '10200014000000000000000000',
  },
  '0x743D80810fe10c5C3346D2940997cC9647035B13': {
    balance: '20513322000000000000000000',
  },
  '0x8e1c4355307F1A59E7eD4Ae057c51368b9338C38': {
    balance: '7291740000000000000000000',
  },
  '0x417fe63186C388812e342c85FF87187Dc584C630': {
    balance: '20000062000000000000000000',
  },
  '0xF5720c180a6Fa14ECcE82FB1bB060A39E93A263c': {
    balance: '30000061000000000000000000',
  },
  '0xB80d1e7F9CEbe4b5E1B1Acf037d3a44871105041': {
    balance: '9581366833333333333333335',
  },
  '0xf8ed78A113cD2a34dF451Ba3D540FFAE66829AA0': {
    balance: '11218686833333333333333333',
  },
  '0x9033ff75af27222c8f36a148800c7331581933F3': {
    balance: '11218686833333333333333333',
  },
  '0x8A07541C2eF161F4e3f8de7c7894718dA26626B2': {
    balance: '11218686833333333333333333',
  },
  '0xB2fe7AFe178335CEc3564d7671EEbD7634C626B0': {
    balance: '11218686833333333333333333',
  },
  '0xc471776eA02705004C451959129bF09423B56526': {
    balance: '11218686833333333333333333',
  },
  '0xeF283eca68DE87E051D427b4be152A7403110647': {
    balance: '14375000000000000000000000',
  },
  '0x7cf091C954ed7E9304452d31fd59999505Ddcb7a': {
    balance: '14375000000000000000000000',
  },
  '0xa5d2944C32a8D7b284fF0b84c20fDcc46937Cf64': {
    balance: '14375000000000000000000000',
  },
  '0xFC89C17525f08F2Bc9bA8cb77BcF05055B1F7059': {
    balance: '14375000000000000000000000',
  },
  '0x3Fa7C646599F3174380BD9a7B6efCde90b5d129d': {
    balance: '14375000000000000000000000',
  },
  '0x989e1a3B344A43911e02cCC609D469fbc15AB1F1': {
    balance: '14375000000000000000000000',
  },
  '0xAe1d640648009DbE0Aa4485d3BfBB68C37710924': {
    balance: '20025000000000000000000000',
  },
  '0x1B6C64779F42BA6B54C853Ab70171aCd81b072F7': {
    balance: '20025000000000000000000000',
  },
}

const RC1GENESIS = {
  config: {
    homesteadBlock: 0,
    eip150Block: 0,
    eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    eip155Block: 0,
    eip158Block: 0,
    byzantiumBlock: 0,
    constantinopleBlock: 0,
    petersburgBlock: 0,
    istanbulBlock: 0,
    chainId: 42220,
    istanbul: {
      policy: 2,
      blockperiod: 5,
      requesttimeout: 3000,
      epoch: 17280,
      lookbackwindow: 12,
    },
  },
  nonce: '0x0',
  timestamp: '0x5ea06a00',
  gasLimit: '0x1312d00',
  difficulty: '0x1',
  coinbase: '0x0000000000000000000000000000000000000000',
  number: '0x0',
  gasUsed: '0x0',
  mixHash: '0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365',
  parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
}
