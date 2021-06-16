import {fakeEvent} from 'Event/__utils__/factory'
import {inputElementFor} from '__utils__/render'
import {fireEvent, wait} from '@testing-library/react'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should create a new dashboard', async () => {
  const event = fakeEvent({
    template: null,
  })

  const {findByLabelText} = await goToDashboardConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  fireEvent.change(inputElementFor(await findByLabelText('template select')), {
    target: {
      value: SIMPLE_BLOG,
    },
  })

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
})
