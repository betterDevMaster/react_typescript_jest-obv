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
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {Attendee} from 'Event/attendee'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show dashboard if completed tech check', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: faker.date.recent().toISOString(),
  })
  const {findByLabelText} = await loginToEventSite({attendee})

  // Has welcome image
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

  // Has welcome image
  expect(await findByLabelText('welcome')).toBeInTheDocument()
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
    has_completed_tech_check: false,
  })

  const afterCheckIn: Attendee = {
    ...beforeCheckIn,
    tech_check_completed_at: faker.date.recent().toISOString(),
    has_completed_tech_check: true,
  }
  const {findByLabelText} = await loginToEventSite({
    attendee: beforeCheckIn,
    event,
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'got points'}))

  /**
   * Tech check polls, until checked in
   */
  mockGet.mockImplementation(() => Promise.resolve({data: afterCheckIn}))

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

it('should complete self-checkin', async () => {
  const beforeCheckIn = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
    has_completed_tech_check: false,
  })

  const buttonText = 'Check Myself In'
  const button = fakeNavButtonWithSize({
    page: '/tech_check',
    text: buttonText,
  })

  const buttons = createEntityList([button])

  const event = fakeEvent({
    template: fakeSimpleBlog({
      techCheck: {
        hasCustomButtons: true,
        buttons,
      },
    }),
  })

  const afterCheckIn: Attendee = {
    ...beforeCheckIn,
    tech_check_completed_at: faker.date.recent().toISOString(),
    has_completed_tech_check: true,
  }

  const {findByLabelText, findByText} = await loginToEventSite({
    attendee: beforeCheckIn,
    event,
  })

  mockPut.mockImplementationOnce(() => Promise.resolve({data: afterCheckIn}))

  user.click(await findByText(buttonText))

  // Has finished tech check, and is showing dashboard
  await wait(async () => {
    expect(await findByLabelText('welcome')).toBeInTheDocument()
  })
})

it('should skip step 3 for certain 10xbootcamp attendees', async () => {
  const completedStep2 = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
    groups: {
      Preview: 'Yes',
    },
  })

  const event = fakeEvent({
    tech_check: fakeTechCheck({is_enabled: true}),
    template: fakeSimpleBlog(),
    slug: '10xbootcamp',
  })

  const {findByLabelText} = await loginToEventSite({
    attendee: completedStep2,
    event,
  })

  // Has welcome image
  expect(await findByLabelText('welcome')).toBeInTheDocument()
})

it('should show a custom button that joins the tech check area', async () => {
  const area_key = 'tcareakey'

  const beforeCheckIn = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
    has_completed_tech_check: false,
  })

  const button = fakeNavButtonWithSize({
    page: '/tech_check',
    text: 'Join TC from custom button',
    isAreaButton: true, // is join TC area button
  })

  const event = fakeEvent({
    tech_check: fakeTechCheck({
      area_key,
    }),
    template: fakeSimpleBlog({
      techCheck: {
        hasCustomButtons: true,
        buttons: createEntityList([button]),
      },
    }),
  })

  const {findByText} = await loginToEventSite({
    attendee: beforeCheckIn,
    event,
  })

  const buttonEl = await findByText(button.text)

  const link = buttonEl.parentElement?.getAttribute('href')
  expect(link).toMatch(area_key)
})

it('should skip tech check on rules match', async () => {
  const tag = 'some tag'

  const completedStep2 = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
    groups: {
      Preview: 'Yes',
    },
    has_completed_tech_check: false,
    tags: [tag],
  })

  const event = fakeEvent({
    tech_check: fakeTechCheck({is_enabled: true}),
    template: fakeSimpleBlog({
      skipTechCheckRules: [
        {
          source: 'Tags',
          condition: 'And',
          type: 'include',
          target: tag,
        },
      ],
    }),
  })

  const {findByLabelText} = await loginToEventSite({
    attendee: completedStep2,
    event,
  })

  // Has welcome image
  expect(await findByLabelText('welcome')).toBeInTheDocument()
})
