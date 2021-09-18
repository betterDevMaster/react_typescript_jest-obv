import axios from 'axios'
import faker from 'faker'
import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {Sponsor} from 'Event/SponsorPage'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {fakeSponsor} from 'Event/__utils__/factory'

afterEach(() => {
  jest.clearAllMocks()
})

const mockGet = axios.get as jest.Mock

export async function goToSponsorConfig(
  overrides: EventOverrides & {
    sponsors?: Sponsor[]
  } = {},
) {
  const result = await goToEventConfig(overrides)

  const sponsors =
    overrides.sponsors ||
    Array.from({length: faker.random.number({min: 1, max: 3})}, fakeSponsor)

  const areas = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeArea,
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: sponsors}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [fakeAction()]}))

  user.click(await result.findByLabelText('configure sponsors'))

  return {...result, sponsors}
}
