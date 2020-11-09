const tokenKey = '__obvio_user_token__'

type AuthToken = string

export function getToken(): AuthToken | null {
  return window.localStorage.getItem(tokenKey)
}

export function saveToken(token: string) {
  return window.localStorage.setItem(tokenKey, token)
}

export function deleteToken() {
  return window.localStorage.removeItem(tokenKey)
}
