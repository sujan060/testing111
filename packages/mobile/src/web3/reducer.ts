import networkConfig from 'src/geth/networkConfig'
import { getRehydratePayload, REHYDRATE, RehydrateAction } from 'src/redux/persist-helper'
import { Actions, ActionTypes, SIGNING_METHOD, Web3SyncProgress } from 'src/web3/actions'

export interface State {
  syncProgress: Web3SyncProgress
  latestBlockNumber: number
  account: string | null
  accountInWeb3Keystore: string | null
  commentKey: string | null
  fornoMode: boolean
  signingMethod: SIGNING_METHOD
  ledgerDeviceId: string | null
}

const initialState: State = {
  syncProgress: {
    startingBlock: 0,
    currentBlock: 0,
    highestBlock: 0,
  },
  latestBlockNumber: 0,
  account: null,
  accountInWeb3Keystore: null,
  commentKey: null,
  fornoMode: networkConfig.initiallyForno,
  signingMethod: SIGNING_METHOD.LIGHT_NODE,
  ledgerDeviceId: null,
}

export const reducer = (
  state: State | undefined = initialState,
  action: ActionTypes | RehydrateAction
): State => {
  switch (action.type) {
    case REHYDRATE: {
      // Ignore some persisted properties
      return {
        ...state,
        ...getRehydratePayload(action, 'web3'),
        syncProgress: {
          startingBlock: 0,
          currentBlock: 0,
          highestBlock: 0,
        },
        latestBlockNumber: 0,
        fornoMode: true,
      }
    }
    case Actions.SET_ACCOUNT:
      return {
        ...state,
        account: action.address.toLowerCase(),
        signingMethod: action.signingMethod ? action.signingMethod : state.signingMethod,
        ledgerDeviceId: action.ledgerDeviceId ? action.ledgerDeviceId : state.ledgerDeviceId,
      }
    case Actions.SET_ACCOUNT_IN_WEB3_KEYSTORE:
      return {
        ...state,
        accountInWeb3Keystore: action.address,
      }
    case Actions.SET_IS_FORNO:
      return {
        ...state,
        fornoMode: action.fornoMode,
      }
    case Actions.SET_COMMENT_KEY:
      return {
        ...state,
        commentKey: action.commentKey,
      }
    case Actions.COMPLETE_WEB3_SYNC:
      return {
        ...state,
        syncProgress: {
          startingBlock: state.syncProgress.startingBlock,
          currentBlock: action.latestBlockNumber,
          highestBlock: action.latestBlockNumber,
        },
        latestBlockNumber: action.latestBlockNumber,
      }
    case Actions.UPDATE_WEB3_SYNC_PROGRESS:
      return {
        ...state,
        syncProgress: action.payload,
      }
    default:
      return state
  }
}
