import {fakeAttendee} from 'Event/auth/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeEvent, fakeTechCheck} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import faker from 'faker'
import axios from 'axios'
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock

it('should start tech check', async () => {
  const windowOpen = (global.open = jest.fn())
  const attendee = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
  })

  const content = faker.lorem.paragraph()
  const body = `<p>${content}</p>`
  const event = fakeEvent({
    tech_check: fakeTechCheck({body}),
  })

  const techCheckUrl = faker.internet.url()

  const {findByLabelText, findByText} = await loginToEventSite({
    attendee,
    event,
    beforeLogin: () => {
      mockGet.mockImplementationOnce(() =>
        Promise.resolve({data: {url: techCheckUrl}}),
      )
    },
  })

  expect(await findByLabelText('start tech check')).toBeInTheDocument()

  expect(await findByText(content)).toBeInTheDocument()

  user.click(await findByLabelText('start tech check'))

  await wait(() => {
    expect(windowOpen).toHaveBeenCalledTimes(1)
  })

  const [joinUrl] = windowOpen.mock.calls[0]
  expect(joinUrl).toBe(techCheckUrl)
})

it('should show dashboard if completed tech check', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: faker.date.recent().toISOString(),
  })
  const {findByLabelText} = await loginToEventSite({attendee})

  // Has welcome text
  expect(await findByLabelText('welcome')).toBeInTheDocument()
})

it('should skip step 3 if disabled', async () => {
  const completedStep2 = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
  })

  const withTechCheckDisabled = fakeEvent({
    tech_check: fakeTechCheck({is_enabled: false}),
  })

  const {findByLabelText} = await loginToEventSite({
    attendee: completedStep2,
    event: withTechCheckDisabled,
  })

  // Has welcome text
  expect(await findByLabelText('welcome')).toBeInTheDocument()
})

it('should skip step 3 without config', async () => {
  const completedStep2 = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
  })

  const withoutTechCheckConfig = fakeEvent({
    tech_check: null,
  })

  const {findByLabelText} = await loginToEventSite({
    attendee: completedStep2,
    event: withoutTechCheckConfig,
  })

  // Has welcome text
  expect(await findByLabelText('welcome')).toBeInTheDocument()
})
