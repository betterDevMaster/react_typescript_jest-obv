import {fakeEvent} from 'Event/__utils__/factory'
import {inputElementFor} from '__utils__/render'
import {fireEvent, wait} from '@testing-library/react'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should create a new dashboard', async () => {
  const event = fakeEvent({
    template: null,
  })

  const {findByText, findByLabelText} = await goToDashboardConfig({event})
  fireEvent.change(inputElementFor(await findByLabelText('dashboard select')), {
    target: {
      value: SIMPLE_BLOG,
    },
  })

  const defaultWelcomeMessage = 'WELCOME TO YOUR DASHBOARD'
  expect(await findByText(defaultWelcomeMessage)).toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.welcomeText).toBe(defaultWelcomeMessage)
})
