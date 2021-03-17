import {goToInfusionsoft} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/go-to-infusionsoft'
import {
  fakeInsusionsoftIntegration,
  fakeTag,
  tagTypes,
} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/factory'

afterEach(() => {
  jest.clearAllMocks()
})

it('should show config', async () => {
  const linked = fakeInsusionsoftIntegration({is_linked: true})
  const tags = tagTypes.map((type) => fakeTag({type}))

  const {findAllByLabelText} = await goToInfusionsoft({
    integrations: [linked],
    tags,
  })

  expect((await findAllByLabelText('tag id')).length).toBe(tags.length)
})
