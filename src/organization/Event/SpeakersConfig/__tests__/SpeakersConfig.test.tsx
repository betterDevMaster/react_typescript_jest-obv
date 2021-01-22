import faker from 'faker'
import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'
import {goToSpeakerConfig} from 'organization/Event/SpeakersConfig/__utils__/go-to-speaker-config'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show create speaker page form', async () => {
  const event = fakeEvent({speaker_page: null})
  const {findByLabelText, queryByLabelText} = await goToSpeakerConfig({event})

  const title = faker.random.words(3)

  const withSpeakerPage: ObvioEvent = {
    ...event,
    speaker_page: {
      title,
      speakers: [],
    },
  }

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: withSpeakerPage}),
  )

  // Shows create speaker page form
  expect(await findByLabelText('speaker page title')).toBeInTheDocument()
  expect(queryByLabelText('add speaker')).not.toBeInTheDocument()
})
