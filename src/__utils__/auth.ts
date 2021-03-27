import faker from 'faker'
import mockAxios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'

const mockGet = mockAxios.get as jest.Mock

export const authenticate = () => {
  const token = faker.random.alphaNumeric()
  window.localStorage.setItem(TEAM_MEMBER_TOKEN_KEY, token)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))

  return {token}
}
