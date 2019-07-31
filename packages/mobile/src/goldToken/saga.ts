import { getGoldTokenContract } from '@celo/contractkit'
import BigNumber from 'bignumber.js'
import { call, put, spawn } from 'redux-saga/effects'
import { CURRENCY_ENUM } from 'src/geth/consts'
import { Actions, fetchGoldBalance, setBalance } from 'src/goldToken/actions'
import { tokenTransferFactory } from 'src/tokens/saga'
import Logger from 'src/utils/Logger'
import { getConnectedAccount } from 'src/web3/saga'

const tag = 'goldToken/saga'

export async function getGoldTokenBalance() {
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
      Logger.debug('@getGoldTokenBalance', `Got balance of ${balance}$`)
      return balance
    })
    .catch((error) => {
      Logger.error('@getGoldTokenBalance', 'Failed to fetch gold token balance', error)
    })
}

export function* goldFetch() {
  const balance: BigNumber = yield call(getGoldTokenBalance)
  Logger.debug('@stableTokenFetch', balance.toString())
  yield put(setBalance(balance.toString()))
}

export const goldTransfer = tokenTransferFactory({
  actionName: Actions.TRANSFER,
  contractGetter: getGoldTokenContract,
  tag,
  currency: CURRENCY_ENUM.GOLD,
  fetchAction: fetchGoldBalance,
})

export function* goldTokenSaga() {
  yield spawn(goldFetch)
  yield spawn(goldTransfer)
}
