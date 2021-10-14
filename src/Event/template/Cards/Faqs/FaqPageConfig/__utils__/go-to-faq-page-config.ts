import axios from 'axios'
import faker from 'faker'
import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {FAQ} from 'Event/FaqPage'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {fakeFaq} from 'Event/__utils__/factory'

afterEach(() => {
  jest.clearAllMocks()
})

const mockGet = axios.get as jest.Mock

export async function goToFaqConfig(
  overrides: EventOverrides & {
    faqs?: FAQ[]
  } = {},
) {
  const result = await goToEventConfig(overrides)

  const faqs =
    overrides.faqs ||
    Array.from({length: faker.random.number({min: 1, max: 3})}, fakeFaq)

  const areas = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeArea,
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: faqs}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [fakeAction()]}))

  user.click(await result.findByLabelText('configure faqs'))

  return {...result, faqs}
}
