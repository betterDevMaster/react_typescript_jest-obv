import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'
import axios from 'axios'
import {goToCheckInPageConfig} from 'organization/Event/Page/__utils__/go-to-check-in-page-config'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure check in page settings', async () => {
  const event = fakeEvent({
    template: fakeFiftyBlog(),
  })

  const {findByLabelText, findAllByLabelText} = await goToCheckInPageConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  const color = '#666666'

  user.type(await findByLabelText('check in right panel text color'), color)

  const btnSaves = await findAllByLabelText('save')
  expect(btnSaves.length).toBe(1)
})
