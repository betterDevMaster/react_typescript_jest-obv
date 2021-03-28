import {fakeEvent} from 'Event/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

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

  const {findByText} = await goToDashboardConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  expect(await findByText(welcomeText)).toBeInTheDocument()
})
