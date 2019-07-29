import { RootState } from 'src/redux/reducers'

export const currentAccountSelector = (state: RootState) => state.web3.account
export const currentAccountWithPrivateKeySelector = (state: RootState) =>
  state.web3.accountWithPrivateKey

export const privateCommentKeySelector = (state: RootState) => state.web3.commentKey
