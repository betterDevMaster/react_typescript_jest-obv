import faker from 'faker'
import {fakeEvent, fakeSpeaker, fakeSpeakerPage} from 'Event/__utils__/factory'
import {goToSpeakerConfig} from 'organization/Event/SpeakersConfig/__utils__/go-to-speaker-config'
afterEach(() => {
  jest.clearAllMocks()
})

it('should render speakers', async () => {
  const speakers = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSpeaker,
  )

  const event = fakeEvent({speaker_page: fakeSpeakerPage({speakers})})
  const {findAllByLabelText, findByText} = await goToSpeakerConfig({event})

  // Showing all speakers
  expect((await findAllByLabelText('speaker')).length).toBe(speakers.length)

  // Renders speaker fields
  for (const speaker of speakers) {
    expect(await findByText(speaker.name)).toBeInTheDocument()
  }
})
