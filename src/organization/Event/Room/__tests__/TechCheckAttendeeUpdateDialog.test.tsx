import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {now} from 'lib/date-time'
import {Attendee} from 'Event/attendee'
import {CHECK_IN_ATTENDEES} from 'organization/PermissionsProvider'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should check in an attendee', async () => {
  const area = fakeArea({is_tech_check: true})

  const {findByLabelText, findByText} = await goToAreas({
    userPermissions: [CHECK_IN_ATTENDEES],
    areas: [area],
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const room = fakeRoom()

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [room]}))

  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  // Room to be configured
  mockGet.mockImplementationOnce(() => Promise.resolve({data: room}))
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

  // go to room config
  user.click(await findByLabelText(`view ${room.name} room`))

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
