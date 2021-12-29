import {fakeEvent} from 'Event/__utils__/factory'
import {goToOfflinePageConfig} from 'organization/Event/Page/__utils__/go-to-offline-page-config'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure offline page settings', async () => {
  const event = fakeEvent({
    template: fakeNiftyFifty(),
  })

  const {findByLabelText} = await goToOfflinePageConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  const header = 'This event is offline'

  await user.type(await findByLabelText('offline page title'), header)
  await user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template['offlinePage.title']).toBe(header)
})
