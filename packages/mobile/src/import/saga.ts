import { mnemonicToSeedHex } from 'react-native-bip39'
import { call, put, spawn, takeLeading } from 'redux-saga/effects'
import { setBackupCompleted } from 'src/account'
import { showError } from 'src/alert/actions'
import { ErrorMessages } from 'src/app/ErrorMessages'
import { Actions, ImportBackupPhraseAction } from 'src/import/actions'
import { navigateReset } from 'src/navigator/NavigationService'
import { Screens } from 'src/navigator/Screens'
import Logger from 'src/utils/Logger'
import { assignAccountFromPrivateKey } from 'src/web3/saga'

export function* importBackupPhraseSaga(action: ImportBackupPhraseAction) {
  const { phrase } = action
  Logger.debug('@importBackupPhraseSaga', `phrase: ${phrase}`)
  const privateKey = mnemonicToSeedHex(phrase)
  Logger.debug('@importBackupPhraseSaga', `privateKey: ${privateKey}`)
  const account = yield call(assignAccountFromPrivateKey, privateKey)
  if (account) {
    yield put(setBackupCompleted())
    navigateReset(Screens.ImportContacts)
  } else {
    yield put(showError(ErrorMessages.IMPORT_BACKUP_FAILED))
  }
}

export function* watchImportBackupPhrase() {
  yield takeLeading(Actions.IMPORT_BACKUP_PHRASE, importBackupPhraseSaga)
}

export function* importSaga() {
  yield spawn(watchImportBackupPhrase)
}
