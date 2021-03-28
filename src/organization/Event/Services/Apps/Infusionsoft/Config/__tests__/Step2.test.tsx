import {goToInfusionsoft} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/go-to-infusionsoft'
import user from '@testing-library/user-event'
import faker from 'faker'
import {
  fakeInfusionsoftIntegration,
  fakeTag,
  tagTypes,
} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/factory'
import {Tag} from 'organization/Event/Services/Apps/Infusionsoft'
import axios from 'axios'
import {wait} from '@testing-library/dom'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPatch = axios.patch as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should save tag id', async () => {
  const linked = fakeInfusionsoftIntegration({
    is_linked: true,
    login_field_name: faker.random.word(),
    login_field_label: faker.random.word(),
  })
  const tags = tagTypes.map((type) => fakeTag({type}))

  const {findAllByLabelText, event} = await goToInfusionsoft({
    integrations: [linked],
    tags,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const id = faker.random.number({min: 10000, max: 100000})
  const name = faker.random.word()

  const targetIndex = faker.random.number({min: 0, max: tags.length - 1})

  const target = tags[targetIndex]

  const updated: Tag = {...target, infusionsoft_id: id, name}

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.type((await findAllByLabelText('tag id'))[targetIndex], String(id))
  user.click((await findAllByLabelText('save tag id'))[targetIndex])

  await wait(async () => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  expect((await findAllByLabelText('save tag id'))[targetIndex]).toBeDisabled()

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(
    `/events/${event.slug}/integrations/infusionsoft/tags/${target.id}`,
  )

  expect(data.id).toBe(String(id))
})
