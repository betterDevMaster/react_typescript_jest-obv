import axios from 'axios'
import user from '@testing-library/user-event'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {wait} from '@testing-library/react'

const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should send a request to clear rooms', async () => {
  const {area, findByLabelText, findByText} = await goToArea({
    userPermissions: [CONFIGURE_EVENTS],
  })

  mockDelete.mockImplementation(() => Promise.resolve({data: ''}))

  user.click(await findByText(/clear room assignments/i))
  user.click(await findByLabelText('confirm'))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const [url] = mockDelete.mock.calls[0]

  expect(url).toMatch(`/areas/${area.id}/room_assignments`)
})
