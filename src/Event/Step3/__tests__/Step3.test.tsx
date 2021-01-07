import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeEvent, fakeTechCheck} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import faker from 'faker'

it('should show tech check page', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
  })

  const content = faker.lorem.paragraph()
  const body = `<p>${content}</p>`
  const event = fakeEvent({tech_check: fakeTechCheck({body})})

  const {findByLabelText, findByText} = await loginToEventSite({
    attendee,
    event,
  })

  expect(await findByLabelText('start tech check')).toBeInTheDocument()

  expect(await findByText(content)).toBeInTheDocument()
})

it('should show dashboard', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: faker.date.recent().toISOString(),
  })
  const {findByLabelText} = await loginToEventSite({attendee})

  // Has welcome text
  expect(await findByLabelText('welcome')).toBeInTheDocument()
})
