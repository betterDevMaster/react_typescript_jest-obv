import {fakeEvent} from 'Event/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

afterEach(() => {
  jest.clearAllMocks()
})

it('should show the dashboard config for an event', async () => {
  const welcomeText = 'Welcome to your custom dashboard'
  const dashboard = fakeSimpleBlog({
    welcomeText,
  })
  const event = fakeEvent({
    template: dashboard,
  })

  const {findByText} = await goToDashboardConfig({event})

  expect(await findByText(welcomeText)).toBeInTheDocument()
})
