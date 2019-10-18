import { DEFAULT_SYNC_MODE, DEFAULT_TESTNET } from 'src/config'
import { GethSyncMode } from 'src/geth/consts'

export enum Testnets {
  integration = 'integration',
  alfajoresstaging = 'alfajoresstaging',
  alfajores = 'alfajores',
  baklavastaging = 'baklavastaging',
  pilot = 'pilot',
  pilotstaging = 'pilotstaging',
}

interface NetworkConfig {
  nodeDir: string
  syncMode: GethSyncMode
  blockchainApiUrl: string
}

const networkConfigs: { [testnet: string]: NetworkConfig } = {
  [Testnets.integration]: {
    nodeDir: `.${Testnets.integration}`,
    syncMode: DEFAULT_SYNC_MODE,
    blockchainApiUrl: 'https://integration-dot-celo-testnet.appspot.com/',
  },
  [Testnets.alfajoresstaging]: {
    nodeDir: `.${Testnets.alfajoresstaging}`,
    syncMode: DEFAULT_SYNC_MODE,
    blockchainApiUrl: 'https://alfajoresstaging-dot-celo-testnet.appspot.com/',
  },
  [Testnets.alfajores]: {
    nodeDir: `.${Testnets.alfajores}`,
    syncMode: DEFAULT_SYNC_MODE,
    blockchainApiUrl: 'https://alfajores-dot-celo-testnet-production.appspot.com/',
  },
  [Testnets.baklavastaging]: {
    nodeDir: `.${Testnets.baklavastaging}`,
    syncMode: DEFAULT_SYNC_MODE,
    blockchainApiUrl: 'https://baklavastaging-dot-celo-testnet.appspot.com/',
  },
  [Testnets.pilot]: {
    nodeDir: `.${Testnets.pilot}`,
    syncMode: DEFAULT_SYNC_MODE,
    blockchainApiUrl: 'https://pilot-dot-celo-testnet-production.appspot.com/',
  },
  [Testnets.pilotstaging]: {
    nodeDir: `.${Testnets.pilotstaging}`,
    syncMode: DEFAULT_SYNC_MODE,
    blockchainApiUrl: 'https://pilotstaging-dot-celo-testnet.appspot.com/',
  },
}

export default networkConfigs[DEFAULT_TESTNET]
