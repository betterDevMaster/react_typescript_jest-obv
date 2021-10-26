import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToEventConfig} from 'organization/Event/__utils__/event'

const mockPost = mockRxJsAjax.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update progress bar color', async () => {
  const event = fakeEvent()
  const {findByLabelText} = await goToEventConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('progress bar'))

  const color = '#e7e7e7'
  user.type(await findByLabelText('bar color'), color)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.progressBar.barColor).toBe(color)
})
