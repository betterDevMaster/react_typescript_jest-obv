import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {Room} from 'Event/room'
import {wait} from '@testing-library/react'
import {START_ROOMS} from 'organization/PermissionsProvider'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {fakeEvent} from 'Event/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
})

it('should show test mode notice', async () => {
  const event = fakeEvent({has_paid: false})
  const room = fakeRoom()

  const {findByLabelText, findByText} = await goToArea({
    userPermissions: [START_ROOMS],
    rooms: [room],
    event,
  })

  // Start url
  const url = faker.internet.url()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {url}}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // metrics

  // go to room config
  user.click(await findByLabelText(`view ${room.number} room`))

  const updated: Room = {
    ...room,
    is_online: !room.is_online,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('toggle online'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(/your event has not started/i)).toBeInTheDocument()
})
