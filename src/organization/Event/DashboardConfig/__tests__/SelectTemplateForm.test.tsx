import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {inputElementFor} from '__utils__/render'
import {fireEvent, wait} from '@testing-library/react'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should create a new dashboard', async () => {
  const event = fakeEvent({
    template: null,
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  fireEvent.change(inputElementFor(await findByLabelText('template select')), {
    target: {
      value: SIMPLE_BLOG,
    },
  })

  user.click(await findByText(/create/i))

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  expect(data.template.name).toBe(SIMPLE_BLOG)
})
