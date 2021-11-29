import faker from 'faker'
import {fakeEvent, fakeSpeaker} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import user from '@testing-library/user-event'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {createHashMap} from 'lib/list'
import {eventRoutes, EVENT_PAGES} from 'Event/Routes'
import {fakeCardsNavButton} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'

it('should render speakers', async () => {
  const speakers = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSpeaker,
  )

  const button = fakeCardsNavButton({
    page: EVENT_PAGES[eventRoutes.speakers],
    text: 'speakers',
  })

  const event = fakeEvent({
    template: fakeCards({
      mainNav: {
        buttons: createHashMap([button]),
      },
    }),
    speakers,
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
