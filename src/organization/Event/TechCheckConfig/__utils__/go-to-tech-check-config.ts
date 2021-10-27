import faker from 'faker'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {Area} from 'organization/Event/AreasProvider'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import axios from 'axios'
import user from '@testing-library/user-event'

const mockGet = axios.get as jest.Mock

export async function goToTechCheckConfig(
  overrides: EventOverrides & {areas?: Area[]} = {},
) {
  const context = await goToEventConfig(overrides)

  const areas =
    overrides.areas ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeArea)

  // areas
  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))

  user.click(await context.findByLabelText('configure tech check'))

  return {...context, areas}
}
