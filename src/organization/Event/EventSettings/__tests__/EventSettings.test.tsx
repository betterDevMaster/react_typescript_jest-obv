import {goToEventConfig} from 'organization/Event/__utils__/event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import faker from 'faker'
import user from '@testing-library/user-event'
import {act, fireEvent, wait} from '@testing-library/react'
import axios from 'axios'

const mockPut = axios.put as jest.Mock
const mockPost = axios.post as jest.Mock

it('should update event values', async () => {
  window.URL.createObjectURL = jest.fn()

  const {event, findByLabelText, findByText} = await goToEventConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const name = faker.random.words(2)

  await act(async () => {
    user.type(await findByLabelText('event name'), name)
  })

  const updated = {...event, name}
  mockPut.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('submit'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.name).toBe(name)

  expect(await findByText(name)).toBeInTheDocument()

  /**
   * Add favicon
   */

  const favicon = new File([], 'favicon.png')
  const faviconInput = await findByLabelText('favicon input')
  Object.defineProperty(faviconInput, 'files', {
    value: [favicon],
  })
  fireEvent.change(faviconInput)

  const withFavicon = {
    ...updated,
    favicon: {
      url: faker.internet.url(),
      name: 'favicon.png',
    },
  }

  mockPost.mockImplementationOnce(() => Promise.resolve({data: withFavicon}))

  user.click(await findByLabelText('submit'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [_, postData] = mockPost.mock.calls[0]
  expect(postData.get('favicon')).toBe(favicon)

  fireEvent.click(await findByLabelText('remove favicon'))

  const removedFavicon = {
    ...withFavicon,
    favicon: null,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: removedFavicon}))

  user.click(await findByLabelText('submit'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(2)
  })

  const [removeUrl, removeFavicon] = mockPut.mock.calls[1]
  expect(removeFavicon.favicon).toBe(null)
})
