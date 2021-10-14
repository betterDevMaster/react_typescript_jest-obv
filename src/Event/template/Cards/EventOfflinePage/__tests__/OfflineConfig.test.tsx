import {fakeEvent} from 'Event/__utils__/factory'
import {goToGeneralConfig} from 'organization/Event/GeneralConfig/__utils__/go-to-general-config'
import user from '@testing-library/user-event'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'

beforeEach(() => {
  jest.clearAllMocks()
})

const mockRxPost = mockRxJsAjax.post as jest.Mock

it('should configure offline page settings', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })
  const {findByLabelText} = await goToGeneralConfig({
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
