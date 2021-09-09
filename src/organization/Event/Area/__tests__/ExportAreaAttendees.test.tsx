import axios from 'axios'
import user from '@testing-library/user-event'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should export submissions for a form', async () => {
  const {findByLabelText, findByText} = await goToArea({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const message = 'received export request'
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {message}}))

  user.click(await findByLabelText('export attendees'))

  expect(await findByText(message)).toBeInTheDocument()
})
