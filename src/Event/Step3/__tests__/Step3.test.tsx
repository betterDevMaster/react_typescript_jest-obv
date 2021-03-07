import {fakeAttendee} from 'Event/auth/__utils__/factory'
import user from '@testing-library/user-event'
import {
  createPlatformActions,
  fakeEvent,
  fakeTechCheck,
} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import faker from 'faker'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

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

it('should should show join url error', async () => {
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

  const error = faker.lorem.sentence()

  const {findByLabelText, findByText} = await loginToEventSite({
    attendee,
    event,
    beforeLogin: () => {
      mockGet.mockImplementationOnce(() => Promise.reject(error))
    },
  })

  expect(await findByLabelText('start tech check')).toBeInTheDocument()

  expect(await findByText(new RegExp(error))).toBeInTheDocument()
})

it('should complete tech check', async () => {
  const action = fakeAction()

  const event = fakeEvent({
    platform_actions: createPlatformActions({complete_check_in: action}),
  })

  const beforeCheckIn = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
  })

  const afterCheckIn = {
    ...beforeCheckIn,
    tech_check_completed_at: faker.date.recent().toISOString(),
  }
  const {findByLabelText} = await loginToEventSite({
    attendee: beforeCheckIn,
    event,
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'got points'}))

  /**
   * Tech check polls, until checked in
   */
  mockGet.mockImplementationOnce(() => Promise.resolve({data: afterCheckIn}))

  await wait(
    () => {
      expect(mockPost).toHaveBeenCalledTimes(2)
    },
    {
      timeout: 30000,
    },
  )

  /**
   * Did send action on completing check in
   */
  const [url] = mockPost.mock.calls[1]
  expect(url).toMatch(`/events/${event.slug}/actions/${action.key}`)

  // Has finished tech check, and is showing dashboard
  await wait(
    async () => {
      expect(await findByLabelText('welcome')).toBeInTheDocument()
    },
    {
      timeout: 30000,
    },
  )
})
