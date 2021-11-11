import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import user from '@testing-library/user-event'
import {goToRoomConfig} from 'organization/Event/Room/__utils__/go-to-room-config'
import {START_ROOMS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {Room} from 'Event/room'
import {wait} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'

const mockPatch = axios.patch as jest.Mock
const mockGet = axios.get as jest.Mock

it('should start via test notice dialog', async () => {
  const startUrl = 'http://zoom/start_url'

  window.open = jest.fn()
  const mockOpen = window.open as jest.Mock

  const room = fakeRoom({
    is_online: false,
  })

  const {findByText, findByLabelText} = await goToRoomConfig({
    room,
    userPermissions: [START_ROOMS],
  })

  expect(await findByText(/start/i)).toBeDisabled()

  const online: Room = {
    ...room,
    is_online: true,
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: online}))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: {url: startUrl}}))

  user.click(await findByLabelText('toggle online'))

  user.click(await findByText(/start/i))
  user.click(await findByLabelText('confirm'))

  await wait(() => {
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })

  const [url] = mockOpen.mock.calls[0]

  expect(url).toBe(startUrl)
})

it('should start immediately for live events', async () => {
  const startUrl = 'http://zoom/start_url'

  window.open = jest.fn()
  const mockOpen = window.open as jest.Mock

  const room = fakeRoom({
    is_online: true,
  })

  const event = fakeEvent({
    is_live: true,
  })

  const {findByText} = await goToRoomConfig({
    room,
    userPermissions: [START_ROOMS],
    event,
    startUrl,
  })

  user.click(await findByText(/start/i))

  await wait(() => {
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })

  const [url] = mockOpen.mock.calls[0]

  expect(url).toBe(startUrl)
})
