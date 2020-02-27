import Web3 from 'web3'
import { WebsocketProvider as Provider } from 'web3-core'
import { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers'

class DebugProvider {
  constructor(private provider: Provider) {}

  send(payload: JsonRpcPayload, callback: (error: Error, response: JsonRpcResponse) => void): any {
    console.log('rpc: -> %O', payload)

    const callbackDecorator = (error: Error, result: JsonRpcResponse) => {
      console.log('rpc: <- %O', payload)
      callback(error as any, result)
    }
    return this.provider.send(payload, callbackDecorator as any)
  }
}

export function wrap(provider: Provider) {
  return (new DebugProvider(provider) as any) as Provider
}

export function injectDebugProvider(web3: Web3) {
  web3.setProvider(wrap((web3.currentProvider as any) as Provider))
}
