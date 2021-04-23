import faker from 'faker'
import {fakeEvent, fakeSpeaker, fakeSpeakerPage} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import user from '@testing-library/user-event'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {eventRoutes, EVENT_PAGES} from 'Event/Routes'

it('should render speakers', async () => {
  const speakers = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSpeaker,
  )

  const button = fakeNavButtonWithSize({
    page: EVENT_PAGES[eventRoutes.speakers],
    text: 'speakers',
  })

  const event = fakeEvent({
    speaker_page: fakeSpeakerPage({speakers}),
    template: fakeSimpleBlog({
      mainNav: createEntityList([button]),
    }),
  })

  const {findByText, findAllByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  user.click(await findByText('speakers'))

  // Showing all speakers
  expect((await findAllByLabelText('speaker')).length).toBe(speakers.length)
})
