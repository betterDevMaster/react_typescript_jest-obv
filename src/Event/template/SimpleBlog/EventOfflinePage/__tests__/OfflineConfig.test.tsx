import {fakeEvent} from 'Event/__utils__/factory'
import {goToOfflinePageConfig} from 'organization/Event/Page/__utils__/go-to-offline-page-config'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import axios from 'axios'

beforeEach(() => {
  jest.clearAllMocks()
})

const mockPut = axios.put as jest.Mock

it('should configure offline page settings', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })
  const {findByLabelText} = await goToOfflinePageConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  const header = 'This event is offline'

  user.type(await findByLabelText('offline page title'), header)
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template['offlinePage.title']).toBe(header)
})
