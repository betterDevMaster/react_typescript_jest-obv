import faker from 'faker'
import user from '@testing-library/user-event'
import {fakeEvent, fakeSpeaker, fakeSpeakerPage} from 'Event/__utils__/factory'
import {goToSpeakerConfig} from 'organization/Event/SpeakersConfig/__utils__/go-to-speaker-config'
import axios from 'axios'
import {wait} from '@testing-library/react'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should add a new speaker', async () => {
  const speakers = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSpeaker,
  )

  const event = fakeEvent({speaker_page: fakeSpeakerPage({speakers})})
  const {
    findByLabelText,
    findByText,
    findAllByLabelText,
  } = await goToSpeakerConfig({event})

  const speaker = fakeSpeaker()
  mockPost.mockImplementationOnce(() => Promise.resolve({data: speaker}))

  user.click(await findByLabelText('add speaker'))

  // Shows correct number of speakers
  await wait(async () => {
    const withNewSpeaker = speakers.length + 1
    expect((await findAllByLabelText('speaker')).length).toBe(withNewSpeaker)
  })

  // Renders new speaker
  expect(await findByText(speaker.name)).toBeInTheDocument()
})
