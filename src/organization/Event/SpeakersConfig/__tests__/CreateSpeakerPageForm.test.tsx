import faker from 'faker'
import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {ObvioEvent} from 'Event'
import {goToSpeakerConfig} from 'organization/Event/SpeakersConfig/__utils__/go-to-speaker-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should create a speaker page', async () => {
  const event = fakeEvent({speaker_page: null})
  const {findByLabelText} = await goToSpeakerConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

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

  user.type(await findByLabelText('speaker page title'), title)
  user.click(await findByLabelText('create speaker page'))

  // Shows speaker page
  expect(await findByLabelText('add speaker')).toBeInTheDocument()

  // Check submitted data
  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/speaker_page`)
  expect(data.title).toBe(title)
})
