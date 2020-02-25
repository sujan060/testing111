import { CURRENCY_ENUM } from '@celo/utils/src/currencies'
import { call, put, select, spawn, takeLatest } from 'redux-saga/effects'
import { TokenTransactionType } from 'src/apollo/types'
import { Actions, SetFigureEightAccount, setFigureEightEarned } from 'src/earn/actions'
import { figureEightEarnedSelector, figureEightUserIdSelector } from 'src/earn/reducer'
import {
  doRefreshFigureEightEarned,
  initiateFigureEightCashout,
  setFigureEightUserId,
} from 'src/firebase/firebase'
import { addStandbyTransaction } from 'src/transactions/actions'
import { TransactionStatus } from 'src/transactions/reducer'
import { currentAccountSelector } from 'src/web3/selectors'

function* setFigureEightUserIdSaga({ userId }: SetFigureEightAccount) {
  const account = yield select(currentAccountSelector)
  yield call(setFigureEightUserId, userId, account)
}

function* initiateFigureEightCashoutSaga() {
  const userId = yield select(figureEightUserIdSelector)
  const account = yield select(currentAccountSelector)
  const amountEarned = yield select(figureEightEarnedSelector)
  const date = Date.now()
  const txId = userId + date.toString()
  yield put(
    addStandbyTransaction({
      id: txId,
      type: TokenTransactionType.Earn,
      comment: '',
      status: TransactionStatus.Pending,
      value: amountEarned.toString(),
      symbol: CURRENCY_ENUM.DOLLAR,
      timestamp: date,
      address: '',
    })
  )
  yield call(initiateFigureEightCashout, userId, account, amountEarned, txId)
}

function* refreshFigureEightEarnedSaga() {
  const userId = yield select(figureEightUserIdSelector)
  const earned = yield call(doRefreshFigureEightEarned, userId)
  yield put(setFigureEightEarned(earned))
}

export function* watchFigureEightAccount() {
  yield takeLatest(Actions.SET_FIGURE_EIGHT_ACCOUNT, setFigureEightUserIdSaga)
}

export function* watchFigureEightEarned() {
  yield takeLatest(Actions.REFRESH_FIGURE_EIGHT_EARNED, refreshFigureEightEarnedSaga)
}

export function* watchFigureEightCashout() {
  yield takeLatest(Actions.INITIATE_FIGURE_EIGHT_CASHOUT, initiateFigureEightCashoutSaga)
}

export function* earnSaga() {
  yield spawn(watchFigureEightAccount)
  yield spawn(watchFigureEightEarned)
  yield spawn(watchFigureEightCashout)
}
