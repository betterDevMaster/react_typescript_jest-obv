import {AuthState} from 'auth'
import {User} from 'auth/user'

export const SET_USER_ACTION = 'SET_USER'
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

export const SET_LOADING_ACTION = 'SET_LOADING'
export interface SetLoadingAction {
  type: typeof SET_LOADING_ACTION
  payload: boolean
}
export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: SET_LOADING_ACTION,
  payload: isLoading,
})
export const handleSetLoading = (
  state: AuthState,
  action: SetLoadingAction,
): AuthState => {
  return {
    ...state,
    loading: action.payload,
  }
}

export type AuthAction = SetUserAction | SetLoadingAction
