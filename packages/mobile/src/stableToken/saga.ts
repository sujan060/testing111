import { getStableTokenContract } from '@celo/contractkit'
import BigNumber from 'bignumber.js'
import { call, put, spawn } from 'redux-saga/effects'
import { showError } from 'src/alert/actions'
import { ErrorMessages } from 'src/app/ErrorMessages'
import { ERROR_BANNER_DURATION } from 'src/config'
import { CURRENCY_ENUM } from 'src/geth/consts'
import { Actions, fetchDollarBalance, setBalance } from 'src/stableToken/actions'
import { tokenTransferFactory } from 'src/tokens/saga'
import Logger from 'src/utils/Logger'
import { getConnectedAccount } from 'src/web3/saga'
const tag = 'stableToken/saga'

export async function getStableTokenBalance(account: string) {
  Logger.debug('@getStableTokenBalance', `Sending request for ${account}`)
  const stableTokenAddress = '0x299e74bdcd90d4e10f7957ef074cee32d7e9089a'
  return fetch(
    `http://alfajores-blockscout.celo-testnet.org/api?module=account&action=tokenbalance&address=${account}&contractaddress=${stableTokenAddress}`,
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
      const balance = new BigNumber(responseJson.result).times(1e-18)
      Logger.debug('@getStableTokenBalance', `Got balance of ${balance}$`)
      if (balance.isPositive() && !balance.isNaN()) {
        return balance
      }
    })
    .catch((error) => {
      Logger.error('@getStableTokenBalance', 'Failed to fetch stable token balance', error)
      showError(ErrorMessages.NO_NETWORK_CONNECTION, ERROR_BANNER_DURATION)
    })
}

export function* stableTokenFetch() {
  const account: string = yield call(getConnectedAccount)
  const balance: BigNumber = yield call(getStableTokenBalance, account)
  if (balance) {
    Logger.debug('@stableTokenFetch', balance.toString())
    yield put(setBalance(balance.toString()))
  }
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
