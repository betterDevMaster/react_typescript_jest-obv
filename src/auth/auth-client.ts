import {setLoading, setUser} from 'auth/actions'
import {deleteToken, getToken, saveToken} from 'auth/token'
import {User} from 'auth/user'
import {client} from 'lib/api-client'
import {api} from 'lib/url'
import {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export interface AuthClientProps {
  endpoints: {
    user: string
    login: string
    register: string
  }
}

export interface RegistrationData {
  email: string
  firstName: string
  lastName: string
  password: string
  passwordConfirmation: string
}

export const useAuthClient = (props: AuthClientProps) => {
  const {endpoints} = props
  const dispatch = useDispatch()
  const {user, loading} = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const token = getToken()

    // No token, proceed as guest
    if (!token && loading) {
      dispatch(setLoading(false))
      return
    }

    // No need to try fetch authenticated user
    if (!token || !loading) {
      return
    }

    fetchUser(endpoints.user)
      .then((user) => dispatch(setUser(user)))
      .catch(() => {
        // Token expired/invalid - do nothing, and force re-login
      })
      .finally(() => dispatch(setLoading(false)))
  }, [dispatch, loading, endpoints])

  const login = useCallback(
    (email: string, password: string) =>
      attemptLogin(endpoints.login, email, password)
        .then(({access_token: token}) => {
          saveToken(token)
          return fetchUser(endpoints.user)
        })
        .then((user) => dispatch(setUser(user))),
    [dispatch, endpoints],
  )

  const register = useCallback(
    (data: RegistrationData) =>
      sendRegistrationRequest(endpoints.register, data)
        .then(({access_token: token}) => {
          saveToken(token)
          return fetchUser(endpoints.user)
        })
        .then((user) => dispatch(setUser(user))),
    [dispatch, endpoints],
  )

  const logout = useCallback(() => {
    deleteToken()
    dispatch(setUser(null))
  }, [dispatch])

  return {
    user,
    loading,
    logout,
    login,
    register,
  }
}

async function fetchUser(endpoint: string): Promise<User | null> {
  const url = api(endpoint)
  return client.get(url).then((user) => {
    return user
  })
}

export const attemptLogin = (
  endpoint: string,
  email: string,
  password: string,
) => {
  const url = api(endpoint)

  return client.post(url, {
    email,
    password,
  })
}

function sendRegistrationRequest(endpoint: string, data: RegistrationData) {
  const url = api(endpoint)
  return client.post(url, {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    password: data.password,
    password_confirmation: data.passwordConfirmation,
  })
}
