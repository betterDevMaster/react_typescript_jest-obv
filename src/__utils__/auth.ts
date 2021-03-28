import faker from 'faker'
import mockAxios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'
import {User} from 'auth/user'

const mockGet = mockAxios.get as jest.Mock

export const authenticate = (user?: User) => {
  const token = faker.random.alphaNumeric()
  window.localStorage.setItem(TEAM_MEMBER_TOKEN_KEY, token)
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: user || fakeUser()}),
  )

  return {token}
}
