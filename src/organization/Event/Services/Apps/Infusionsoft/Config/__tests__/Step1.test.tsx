import {goToInfusionsoft} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/go-to-infusionsoft'
import user from '@testing-library/user-event'
import faker from 'faker'
import {
  fakeInfusionsoftIntegration,
  fakeTag,
  tagTypes,
} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/factory'
import {
  InfusionsoftIntegration,
  Tag,
} from 'organization/Event/Services/Apps/Infusionsoft'
import axios from 'axios'
import {wait} from '@testing-library/dom'

const mockPatch = axios.patch as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should save login field id', async () => {
  const linked = fakeInfusionsoftIntegration({
    is_linked: true,
  })
  const tags = tagTypes.map((type) => fakeTag({type}))

  const {findAllByLabelText, event, findByLabelText} = await goToInfusionsoft({
    integrations: [linked],
    tags,
  })

  const id = faker.random.number({min: 10000, max: 100000})
  const name = faker.random.word()

  const updated: InfusionsoftIntegration = {
    ...linked,
    login_field_id: id,
    login_field_name: name,
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.type(await findByLabelText('login field id'), String(id))
  user.click(await findByLabelText('save login field id'))

  await wait(async () => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  expect(await findByLabelText('save login field id')).toBeDisabled()

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(
    `/events/${event.slug}/integrations/infusionsoft/login_field`,
  )

  expect(data.id).toBe(String(id))

  // is showing tags in config
  expect((await findAllByLabelText('tag id')).length).toBe(tags.length)
})
