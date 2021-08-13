import {setLoading, setToken, setUser} from 'auth/actions'
import {deleteToken, getToken, saveToken} from 'auth/token'
import {User} from 'auth/user'
import {client} from 'lib/api-client'
import {api} from 'lib/url'
import {useOrganizationUrl} from 'organization/url'
import {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export interface AuthClientSettings {
  tokenKey: string
  endpoints: {
    user: string
    login: string
    register: string
  }
}

interface TokenResponse {
  access_token: string
  expires_in: string
  token_type: string
}

export interface RegistrationData {
  email: string
  firstName: string
  lastName: string
  password: string
  passwordConfirmation: string
  token?: string
}

export interface ForgotPasswordRequestData {
  form_url?: string
  email: string
}

export interface ResetPasswordRequestData {
  token?: string
  email: string
  password: string
  password_confirmation: string
}

export const useAuthClient = (settings: AuthClientSettings) => {
  const {endpoints, tokenKey} = settings
  const dispatch = useDispatch()
  /**
   * Loading here is the global app loading state, it should only be
   * ever set once on initial user fetch.
   */
  const {user, loading} = useSelector((state: RootState) => state.auth)
  const {slug: organizationSlug} = useOrganizationUrl()
  const token = getToken(tokenKey)

  const fetch = useCallback(() => {
    // No need to try fetch authenticated user
    if (!token) {
      return Promise.resolve()
    }

    return fetchUser(tokenKey, endpoints.user)
      .then((user) => {
        dispatch(setUser(user))
        dispatch(setToken(token))
      })
      .catch(() => {
        // Token expired/invalid
        deleteToken(tokenKey)
      })
  }, [dispatch, endpoints, token, tokenKey])

  // Initial Load
  useEffect(() => {
    // Already finished init
    if (!loading) {
      return
    }

    // No token, proceed as guest
    if (!token && loading) {
      dispatch(setLoading(false))
      return
    }

    fetch().finally(() => dispatch(setLoading(false)))
  }, [fetch, token, dispatch, loading, organizationSlug]) // Explicitly re-fetch when organization changes

  const login = useCallback(
    (credentials: LoginCredentials) => {
      return attemptLogin(endpoints.login, credentials)
        .then(({access_token: token}) => {
          saveToken(tokenKey, token)
          dispatch(setToken(token))
          return fetchUser(tokenKey, endpoints.user)
        })
        .then((user) => {
          dispatch(setUser(user))
        })
    },
    [dispatch, endpoints, tokenKey],
  )

  const register = useCallback(
    (data: RegistrationData) =>
      sendRegistrationRequest(endpoints.register, data)
        .then(({access_token: token}) => {
          saveToken(tokenKey, token)
          return fetchUser(tokenKey, endpoints.user)
        })
        .then((user) => dispatch(setUser(user))),
    [dispatch, endpoints, tokenKey],
  )

  const logout = useCallback(() => {
    deleteToken(tokenKey)
    dispatch(setUser(null))
    dispatch(setToken(null))
  }, [dispatch, tokenKey])

  return {
    user,
    loading,
    logout,
    login,
    register,
    refresh: fetch,
  }
}

async function fetchUser(
  tokenKey: string,
  endpoint: string,
): Promise<User | null> {
  const url = api(endpoint)
  return client.get<any>(url, {
    tokenKey,
  })
}

export type LoginCredentials = Record<string, string>

export const attemptLogin = (
  endpoint: string,
  credentials: Record<string, string>,
) => {
  const url = api(endpoint)
  return client.post<TokenResponse>(url, credentials)
}

function sendRegistrationRequest(endpoint: string, data: RegistrationData) {
  const url = api(endpoint)
  return client.post<TokenResponse>(url, {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    password: data.password,
    password_confirmation: data.passwordConfirmation,
    token: data.token,
  })
}
