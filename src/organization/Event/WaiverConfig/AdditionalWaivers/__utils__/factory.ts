import {fakeWaiver} from 'Event/__utils__/factory'
import faker from 'faker'
import {AdditionalWaiver} from 'organization/Event/WaiverConfig/AdditionalWaivers'

export const fakeAdditionalWaiver = (
  overrides?: Partial<AdditionalWaiver>,
): AdditionalWaiver => ({
  ...fakeWaiver(),
  id: faker.random.number({min: 1000, max: 10000}),
  ...overrides,
})
