import {AuthState} from 'auth'
import {User} from 'auth/user'

export const SET_USER_ACTION = 'SET_USER_ACTION'
export interface SetUserAction {
  type: typeof SET_USER_ACTION
  payload: User | null
}
export const setUser = (user: User | null): SetUserAction => ({
  type: SET_USER_ACTION,
  payload: user,
})
export const handleSetUser = (
  state: AuthState,
  action: SetUserAction,
): AuthState => {
  return {
    ...state,
    user: action.payload,
  }
}

export type AuthAction = SetUserAction
