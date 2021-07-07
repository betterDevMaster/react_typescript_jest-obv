import axios from 'axios'
import user from '@testing-library/user-event'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should export submissions for a form', async () => {
  const {areas, findByLabelText, findByText} = await goToAreas({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const target = areas[0]

  // Get area
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))
  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  user.click(await findByLabelText(`view ${target.name} area`))

  const message = 'received export request'
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {message}}))

  user.click(await findByLabelText('export attendees'))

  expect(await findByText(message)).toBeInTheDocument()
})
