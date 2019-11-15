import { database } from 'firebase-admin'

export enum RequestType {
  Faucet = 'Faucet',
  Invite = 'Invite',
  KeybaseFaucet = 'KeybaseFaucet',
}

export interface FaucetRequestConfig {
  goldAmount: string
  dollarAmount: string
}

export interface KeybaseFaucetRequestConfig {
  goldAmount: string
}

export interface InviteRequestConfig {
  goldAmount: string
  dollarAmount: string
  escrowDollarAmount: string
  expirarySeconds: number
  minAttestations: number
  twilio: {
    sid: string
    authToken: string
    phoneNumber: string
  }
}

export interface NetworkConfig {
  nodeUrl: string
  supportedRequestTypes: RequestType[]
  requestConfig: {
    [RequestType.Faucet]?: FaucetRequestConfig
    [RequestType.Invite]?: InviteRequestConfig
    [RequestType.KeybaseFaucet]?: KeybaseFaucetRequestConfig
  }
}

export async function fetchNetworkConfig(db: database.Database, network: string) {
  const snap = await db.ref(`/${network}/config`).once('value')
  const config = snap.val() as NetworkConfig
  return config
}

export function supports(config: NetworkConfig, requestType: RequestType) {
  return config.supportedRequestTypes.includes(requestType)
}
