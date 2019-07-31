import { getStableTokenContract } from '@celo/contractkit'
import { call, spawn } from 'redux-saga/effects'
import { CURRENCY_ENUM } from 'src/geth/consts'
import { Actions, fetchDollarBalance, setBalance } from 'src/stableToken/actions'
import { tokenTransferFactory } from 'src/tokens/saga'
import Logger from 'src/utils/Logger'

const tag = 'stableToken/saga'

export function* stableTokenFetch() {
  const balance: any = yield call(
    fetch,
    'https://alfajores-blockscout.celo-testnet.org/api?module=account&action=balance&address=0xe167029b1a56c6cba74c35c472e9db3c9e2402ff',
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  )
  Logger.debug('@stableTokenFetch', balance)
  // Logger.debug('@stableTokenFetch', balance.json().stringify())
  Logger.debug('@stableTokenFetch', JSON.stringify(balance.json()))
}

/*tokenFetchFactory({
  actionName: Actions.FETCH_BALANCE,
  contractGetter: getStableTokenContract,
  actionCreator: setBalance,
  tag,
})
*/

export const stableTokenTransfer = tokenTransferFactory({
  actionName: Actions.TRANSFER,
  contractGetter: getStableTokenContract,
  tag,
  currency: CURRENCY_ENUM.DOLLAR,
  fetchAction: fetchDollarBalance,
})

export function* stableTokenSaga() {
  yield spawn(stableTokenFetch)
  yield spawn(stableTokenTransfer)
}
