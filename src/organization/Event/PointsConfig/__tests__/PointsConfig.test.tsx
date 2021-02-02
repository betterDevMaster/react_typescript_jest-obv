import {goToPointsConfig} from 'organization/Event/PointsConfig/__utils__/go-to-points-config'

afterEach(() => {
  jest.clearAllMocks()
})

it('configure event points', async () => {
  const {platformActions, customActions, findByText} = await goToPointsConfig()

  // Renders all actions
  const actions = [...platformActions, ...customActions]
  for (const action of actions) {
    expect(await findByText(action.description)).toBeInTheDocument()
  }
})
