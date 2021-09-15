import faker from 'faker'
import {fakeEvent, fakeSpeaker} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import user from '@testing-library/user-event'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {eventRoutes, EVENT_PAGES} from 'Event/Routes'

it('should render speakers', async () => {
  const speakers = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeSpeaker,
  )

  const button = fakeNavButton({
    page: EVENT_PAGES[eventRoutes.speakers],
    text: 'speaker button',
  })

  const event = fakeEvent({
    template: fakePanels({
      nav: createEntityList([button]),
    }),
    speakers,
  })

  const {findAllByText, findAllByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  user.click((await findAllByText(button.text))[0])

  // Showing all speakers
  expect((await findAllByLabelText('speaker')).length).toBe(speakers.length)
})
