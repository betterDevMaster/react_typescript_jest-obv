import {fakeAccessToken} from 'organization/Event/Services/AccessTokens/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {wait} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToServices} from 'organization/Event/Services/__utils__/go-to-services-config'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
})

it('should render an access token', async () => {
  const event = fakeEvent()
  const {findByLabelText, findAllByLabelText} = await goToServices({event})

  const countTokens = faker.random.number({min: 10, max: 100})
  const tokens = Array.from({length: countTokens}, fakeAccessToken)
  await wait(() => {
    mockGet.mockImplementationOnce(() => Promise.resolve({data: tokens}))
  })
  const [url] = mockGet.mock.calls[mockGet.mock.calls.length - 1]
  expect(url).toMatch(`/events/${event.slug}/access_tokens`)

  //crate an access token
  const newToken = fakeAccessToken()

  await wait(() => {
    mockPost.mockImplementationOnce(() => Promise.resolve({data: newToken}))
  })
  user.click(await findByLabelText('create access token'))

  const [postUrl] = mockPost.mock.calls[0]
  expect(postUrl).toMatch(`/events/${event.slug}/access_tokens`)

  expect((await findAllByLabelText('access-token-list-item')).length).toBe(1)

  //copy an access token
  const selectedToken = 0
  jest.spyOn(navigator.clipboard, 'writeText')
  user.click((await findAllByLabelText('copy'))[selectedToken])
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(newToken.value)

  // delete any one

  await wait(() => {
    mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))
  })
  user.click((await findAllByLabelText('delete'))[selectedToken])

  const [deleteUrl] = mockDelete.mock.calls[0]
  expect(deleteUrl).toMatch(
    `/events/${event.slug}/access_tokens/${newToken.id}`,
  )
})
