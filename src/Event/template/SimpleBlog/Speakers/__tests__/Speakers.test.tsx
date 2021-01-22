import faker from 'faker'
import {fakeEvent, fakeSpeaker, fakeSpeakerPage} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import user from '@testing-library/user-event'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

it('should render speakers', async () => {
  const speakers = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSpeaker,
  )

  const event = fakeEvent({speaker_page: fakeSpeakerPage({speakers})})

  const {findByLabelText, findAllByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  user.click(await findByLabelText('show side menu'))
  user.click(await findByLabelText('view speakers'))

  // Showing all speakers
  expect((await findAllByLabelText('speaker')).length).toBe(speakers.length)
})

it('should hide speaker link', async () => {
  const withoutSpeakerPage = fakeEvent({speaker_page: null})

  const {queryByLabelText, findByLabelText} = await loginToEventSite({
    event: withoutSpeakerPage,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  user.click(await findByLabelText('show side menu'))
  expect(queryByLabelText('view speakers')).not.toBeInTheDocument()
})
