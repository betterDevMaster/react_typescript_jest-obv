import faker from 'faker'
import user from '@testing-library/user-event'
import {fakeEvent, fakeSpeaker} from 'Event/__utils__/factory'
import {goToSpeakerConfig} from 'organization/Event/SpeakerPageConfig/__utils__/go-to-speaker-config'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should add a new speaker', async () => {
  const speakers = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSpeaker,
  )

  const event = fakeEvent({speakers})
  const {findByLabelText, findByText, findAllByLabelText} =
    await goToSpeakerConfig({event, userPermissions: [CONFIGURE_EVENTS]})

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
