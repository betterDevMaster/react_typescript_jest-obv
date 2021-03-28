import {goToPointsConfig} from 'organization/Event/PointsConfig/__utils__/go-to-points-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

afterEach(() => {
  jest.clearAllMocks()
})

it('should render actions', async () => {
  const {actions, findByText} = await goToPointsConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  for (const action of actions) {
    expect(await findByText(action.description)).toBeInTheDocument()
  }
})
