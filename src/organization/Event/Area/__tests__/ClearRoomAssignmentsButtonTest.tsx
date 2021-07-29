import axios from 'axios'
import user from '@testing-library/user-event'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should send a request to clear rooms', async () => {
  const {areas, findByLabelText, findByText} = await goToAreas({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const target = areas[0]

  // Get area
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))
  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  user.click(await findByLabelText(`view ${target.name} area`))

  mockDelete.mockImplementation(() => Promise.resolve({data: ''}))

  user.click(await findByText(/clear room assignments/i))
  user.click(await findByLabelText('confirm'))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const [url] = mockDelete.mock.calls[0]

  expect(url).toMatch(`/areas/${target.id}/room_assignments`)
})
