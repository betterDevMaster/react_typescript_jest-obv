import {goToPointsConfig} from 'organization/Event/PointsConfig/__utils__/go-to-points-config'

afterEach(() => {
  jest.clearAllMocks()
})

it('configure event points', async () => {
  const {actions, findByText} = await goToPointsConfig()

  for (const action of actions) {
    expect(await findByText(action.description)).toBeInTheDocument()
  }
})
