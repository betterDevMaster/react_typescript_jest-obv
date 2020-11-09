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
  }
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
    (email: string, password: string) => {
      return attemptLogin(endpoints.login, email, password)
        .then(({access_token: token}) => {
          saveToken(token)
          return fetchUser(endpoints.user)
        })
        .then((user) => dispatch(setUser(user)))
    },
    [dispatch, endpoints],
  )

  return {
    user,
    loading,
    logout,
    login,
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

export function logout() {
  deleteToken()
}
