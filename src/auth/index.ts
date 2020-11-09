import {
  AuthAction,
  handleSetLoading,
  handleSetUser,
  SET_LOADING_ACTION,
  SET_USER_ACTION,
} from 'auth/actions'
import {User} from 'auth/user'

export interface AuthState {
  user: User | null
  loading: boolean
}

const defaultState: AuthState = {
  user: null,
  loading: true,
}

export function authReducer(
  state: AuthState = defaultState,
  action: AuthAction,
) {
  switch (action.type) {
    case SET_USER_ACTION:
      return handleSetUser(state, action)
    case SET_LOADING_ACTION:
      return handleSetLoading(state, action)
    default: {
      return state
    }
  }
}
