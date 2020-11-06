import {setUser} from 'auth/actions'
import {getToken, saveToken} from 'auth/client'
import {User} from 'auth/user'
import {client} from 'lib/api-client'
import {api} from 'lib/url'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'

export const useTokenAuth = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = getToken()

    if (!token) {
      return
    }

    fetchUser(token).then((user) => dispatch(setUser(user)))
  }, [dispatch])
}

async function fetchUser(token: string): Promise<User | null> {
  const url = api('/team/user')
  return client
    .get(url)
    .then((user) => {
      return user
    })
    .catch(() => {
      return null
    })
}

export const login = async (email: string, password: string) => {
  const url = api('/team/login')

  const {access_token: token} = await client.post(url, {
    email,
    password,
  })

  saveToken(token)
  return fetchUser(token)
}
