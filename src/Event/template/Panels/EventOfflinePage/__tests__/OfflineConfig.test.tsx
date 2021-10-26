import {fakeEvent} from 'Event/__utils__/factory'
import {goToOfflinePageConfig} from 'organization/Event/Page/__utils__/go-to-offline-page-config'
import user from '@testing-library/user-event'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'

const mockRxPost = mockRxJsAjax.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure offline page settings', async () => {
  const event = fakeEvent({
    template: fakePanels(),
  })

  const {findByLabelText} = await goToOfflinePageConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  const header = 'This event is offline'

  user.type(await findByLabelText('offline page title'), header)

  await wait(() => {
    expect(mockRxPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockRxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template.offlinePage.title).toBe(header)
})
