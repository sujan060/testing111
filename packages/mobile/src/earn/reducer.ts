import { Actions, ActionTypes } from 'src/earn/actions'
import { RootState } from 'src/redux/reducers'

export interface State {
  figureEightUserId: string | null
  figureEightEarned: number | null
}

const initialState = {
  figureEightUserId: null,
  figureEightEarned: null,
}

export const earnReducer = (
  state: State | undefined = initialState,
  action: ActionTypes
): State => {
  switch (action.type) {
    case Actions.SET_FIGURE_EIGHT_ACCOUNT:
      return {
        ...state,
        figureEightUserId: action.userId,
      }
    case Actions.SET_FIGURE_EIGHT_EARNED:
      return {
        ...state,
        figureEightEarned: action.amount,
      }
    default:
      return state
  }
}

export const figureEightUserIdSelector = (state: RootState) => state.earn.figureEightUserId
export const figureEightEarnedSelector = (state: RootState) => state.earn.figureEightEarned
