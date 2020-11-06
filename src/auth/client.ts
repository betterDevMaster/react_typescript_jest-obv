import {useSelector} from 'react-redux'
import {RootState} from 'store'

const tokenKey = '__obvio_user_token__'

export const useUser = () => {
  return useSelector((state: RootState) => state.auth.user)
}

type AuthToken = string

export function getToken(): AuthToken | null {
  return window.localStorage.getItem(tokenKey)
}

export function saveToken(token: string) {
  return window.localStorage.setItem(tokenKey, token)
}

export function logout() {
  deleteToken()
}

function deleteToken() {
  return window.localStorage.removeItem(tokenKey)
}
