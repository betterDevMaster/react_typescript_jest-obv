import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {Speaker} from 'Event/SpeakerPage'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {fakeSpeaker} from 'Event/__utils__/factory'
import faker from 'faker'
import axios from 'axios'

afterEach(() => {
  jest.clearAllMocks()
})

const mockGet = axios.get as jest.Mock

export async function goToSpeakerConfig(
  overrides: EventOverrides & {
    speakers?: Speaker[]
  } = {},
) {
  const result = await goToEventConfig(overrides)

  const speakers =
    overrides.speakers ||
    Array.from({length: faker.random.number({min: 1, max: 3})}, fakeSpeaker)

  const areas = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeArea,
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: speakers}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [fakeAction()]}))

  user.click(await result.findByLabelText('configure speakers'))

  return {...result, speakers}
}
