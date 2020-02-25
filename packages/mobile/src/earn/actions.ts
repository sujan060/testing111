export enum Actions {
  SET_FIGURE_EIGHT_ACCOUNT = 'APP/SET_FIGURE_EIGHT_ACCOUNT',
  REFRESH_FIGURE_EIGHT_EARNED = 'APP/REFRESH_FIGURE_EIGHT_EARNED',
  SET_FIGURE_EIGHT_EARNED = 'APP/SET_FIGURE_EIGHT_EARNED',
  INITIATE_FIGURE_EIGHT_CASHOUT = 'APP/INITIATE_FIGURE_EIGHT_CASHOUT',
}

export interface SetFigureEightAccount {
  type: Actions.SET_FIGURE_EIGHT_ACCOUNT
  userId: string
}

export interface RefreshFigureEightEarned {
  type: Actions.REFRESH_FIGURE_EIGHT_EARNED
}

export interface SetFigureEightEarned {
  type: Actions.SET_FIGURE_EIGHT_EARNED
  amount: number
}

export interface InitiateFigureEightCashout {
  type: Actions.INITIATE_FIGURE_EIGHT_CASHOUT
}

export type ActionTypes =
  | SetFigureEightAccount
  | RefreshFigureEightEarned
  | SetFigureEightEarned
  | InitiateFigureEightCashout

export const setFigureEightAccount = (userId: string) => ({
  type: Actions.SET_FIGURE_EIGHT_ACCOUNT,
  userId,
})

export const setFigureEightEarned = (amount: number) => ({
  type: Actions.SET_FIGURE_EIGHT_EARNED,
  amount,
})

export const initiateFigureEightCashout = () => ({
  type: Actions.INITIATE_FIGURE_EIGHT_CASHOUT,
})

export const refreshFigureEightEarned = () => ({
  type: Actions.REFRESH_FIGURE_EIGHT_EARNED,
})
