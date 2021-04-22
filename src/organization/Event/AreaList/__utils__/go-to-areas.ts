import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import faker from 'faker'
import user from '@testing-library/user-event'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {Area} from 'organization/Event/AreasProvider'
import axios from 'axios'

const mockGet = axios.get as jest.Mock

export async function goToAreas(
  overrides: EventOverrides & {areas?: Area[]} = {},
) {
  const areas =
    overrides.areas ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeArea)

  const context = await goToEventConfig(overrides)

  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))

  user.click(await context.findByLabelText('areas'))

  return {...context, areas}
}
