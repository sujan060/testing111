import { getStableTokenContract } from '@celo/contractkit'
import BigNumber from 'bignumber.js'
import { call, put, spawn } from 'redux-saga/effects'
import { CURRENCY_ENUM } from 'src/geth/consts'
import { Actions, fetchDollarBalance, setBalance } from 'src/stableToken/actions'
import { tokenTransferFactory } from 'src/tokens/saga'
import Logger from 'src/utils/Logger'
import { getConnectedAccount } from 'src/web3/saga'

const tag = 'stableToken/saga'

export async function getStableTokenBalance() {
  const account = await getConnectedAccount()
  fetch(
    `http://alfajores-blockscout.celo-testnet.org/api?module=account&action=balance&address=${account}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => {
      return response.json()
    })
    .then((responseJson) => {
      const balance = new BigNumber(responseJson.result).times(1e-19)
      Logger.debug('@getStableTokenBalance', `Got balance of ${balance}$`)
      return balance
    })
    .catch((error) => {
      Logger.error('@getStableTokenBalance', 'Failed to fetch stable token balance', error)
    })
}

export function* stableTokenFetch() {
  const balance: BigNumber = yield call(getStableTokenBalance)
  Logger.debug('@stableTokenFetch', balance.toString())
  yield put(setBalance(balance.toString()))
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
