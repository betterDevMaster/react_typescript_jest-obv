import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/dom'

const mockDelete = axios.delete as jest.Mock
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should remove a room', async () => {
  const target = fakeRoom()
  const otherRoom = fakeRoom()

  const {
    findByLabelText,
    findByText,
    queryByText,
    findAllByLabelText,
  } = await goToArea({
    userPermissions: [CONFIGURE_EVENTS],
    rooms: [target, otherRoom],
    event: fakeEvent({
      has_started: false, // can delete
    }),
  })

  expect(await findByText(String(target.number))).toBeInTheDocument()

  // go to room config
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // metrics
  user.click(await findByLabelText(`view ${target.number} room`))

  /**
   * Delete room
   */

  mockDelete.mockImplementation(() => Promise.resolve({data: 'ok'}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // area metrics (redirected)
  user.click(await findByText(/delete/i))
  user.click(await findByText(/confirm/i))

  // Room removed from list
  await wait(() => {
    expect(queryByText(String(target.number))).not.toBeInTheDocument()
  })

  expect((await findAllByLabelText('room')).length).toBe(1)
})
