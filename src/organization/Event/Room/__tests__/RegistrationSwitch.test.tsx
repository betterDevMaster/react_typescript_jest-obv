import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {Room} from 'Event/room'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS, START_ROOMS} from 'organization/PermissionsProvider'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock
const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
})

it('should configure room registration', async () => {
  const area = fakeArea({
    is_tech_check: false,
  })

  const room = fakeRoom({
    has_registration: false,
    is_online: false,
  })

  const {findByLabelText, queryByLabelText} = await goToArea({
    area,
    rooms: [room],
    userPermissions: [CONFIGURE_EVENTS, START_ROOMS],
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // metrics

  // Go to room
  user.click(await findByLabelText(`view ${room.number} room`))
  expect(await findByLabelText('room description')).toBeInTheDocument()

  expect(
    ((await findByLabelText('toggle registration')) as HTMLInputElement)
      .checked,
  ).toBe(room.has_registration)

  const registrationUrl = faker.internet.url()

  const enabled: Room = {
    ...room,
    has_registration: true,
    registration_url: registrationUrl,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: enabled}))

  //  Enable registration
  user.click(await findByLabelText('toggle registration'))

  const [patchUrl] = mockPatch.mock.calls[0]
  expect(patchUrl).toMatch(`/rooms/${room.id}/registration`)

  //copy an access token
  jest.spyOn(navigator.clipboard, 'writeText')
  user.click(await findByLabelText('copy registration url'))
  await wait(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(registrationUrl)
  })

  const disabled: Room = {
    ...room,
    has_registration: false,
    registration_url: null,
  }
  mockDelete.mockImplementationOnce(() => Promise.resolve({data: disabled}))

  // Disable registration
  user.click(await findByLabelText('toggle registration'))

  await wait(async () => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(queryByLabelText('copy registration url'))
  })

  const [deleteUrl] = mockDelete.mock.calls[0]
  expect(deleteUrl).toMatch(`/rooms/${room.id}/registration`)
})
