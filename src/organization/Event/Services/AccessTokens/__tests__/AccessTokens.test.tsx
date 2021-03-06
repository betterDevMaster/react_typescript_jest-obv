import {fakeAccessToken} from 'organization/Event/Services/AccessTokens/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {wait} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToServices} from 'organization/Event/Services/__utils__/go-to-services-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock
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

  const numTokens = faker.random.number({min: 10, max: 100})
  const tokens = Array.from({length: numTokens}, fakeAccessToken)

  const {findByLabelText, findAllByLabelText} = await goToServices({
    event,
    tokens,
    userPermissions: [CONFIGURE_EVENTS],
  })

  // create an access token
  const newToken = fakeAccessToken()

  mockPost.mockImplementationOnce(() => Promise.resolve({data: newToken}))
  user.click(await findByLabelText('create access token'))

  const [postUrl] = mockPost.mock.calls[0]
  expect(postUrl).toMatch(`/events/${event.slug}/access_tokens`)

  expect((await findAllByLabelText('access-token-list-item')).length).toBe(
    numTokens,
  )

  //copy an access token
  jest.spyOn(navigator.clipboard, 'writeText')
  user.click((await findAllByLabelText('copy'))[numTokens]) // Last token
  await wait(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(newToken.value)
  })

  // delete any one
  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))
  user.click((await findAllByLabelText('delete'))[numTokens])

  await wait(async () => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const [deleteUrl] = mockDelete.mock.calls[0]
  expect(deleteUrl).toMatch(
    `/events/${event.slug}/access_tokens/${newToken.id}`,
  )
})
