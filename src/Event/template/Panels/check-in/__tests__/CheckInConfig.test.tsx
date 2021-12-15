import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import axios from 'axios'
import {goToCheckInPageConfig} from 'organization/Event/Page/__utils__/go-to-check-in-page-config'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure check in page settings', async () => {
  const event = fakeEvent({
    template: fakePanels(),
  })

  const {findByLabelText} = await goToCheckInPageConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  const title = 'Check In Left Panel title'

  user.type(await findByLabelText('check in left panel title'), title)
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template.checkInTitle).toBe(title)
})
