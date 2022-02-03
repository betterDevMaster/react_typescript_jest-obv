import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

afterEach(() => {
  jest.clearAllMocks()
})

it('should render a header', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })

  const {findByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      waiver: 'somewaiver.pdf',
      tech_check_completed_at: 'now',
    }),
  })

  expect(await findByLabelText('show side menu')).toBeInTheDocument()
})
