import {goToInfusionsoft} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/go-to-infusionsoft'
import {fakeInfusionsoftIntegration} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/factory'

afterEach(() => {
  jest.clearAllMocks()
})

it('should show config', async () => {
  const linked = fakeInfusionsoftIntegration({is_linked: true})

  const {findByLabelText} = await goToInfusionsoft({
    integrations: [linked],
  })

  expect(await findByLabelText('login field id')).toBeInTheDocument()
})
