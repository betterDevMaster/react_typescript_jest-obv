import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {CHECK_IN_ATTENDEES, START_ROOMS} from 'organization/PermissionsProvider'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should check in an attendee', async () => {
  const area = fakeArea({is_tech_check: true})
  const room = fakeRoom()

  const {findByLabelText, findByText} = await goToArea({
    userPermissions: [CHECK_IN_ATTENDEES, START_ROOMS],
    area,
    rooms: [room],
  })

  // Start url
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        url: 'https://zoomstarturl.com',
      },
    }),
  )

  const attendee = fakeAttendee()

  const assignment = {
    attendee,
    room,
  }

  mockGet.mockImplementationOnce(() => Promise.resolve({data: [assignment]}))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // metrics

  // go to room config
  user.click(await findByLabelText(`view ${room.number} room`))

  // Edit attendee
  user.click(await findByText(`${attendee.first_name} ${attendee.last_name}`))

  const newLastName = 'JohnsonSmithWilliams'

  user.type(await findByLabelText('last name'), newLastName)

  mockPatch.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        ...attendee,
        last_name: newLastName,
      },
    }),
  )

  user.click(await findByText(/save/i))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]
  expect(url).toMatch(`/attendees/${attendee.id}`)
  expect(data.last_name).toBe(newLastName)

  expect(
    await findByText(`${attendee.first_name} ${newLastName}`),
  ).toBeInTheDocument()
})
