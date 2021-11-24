import {fakeAttendee} from 'Event/auth/__utils__/factory'
import faker from 'faker'
import {submitWaiver} from 'Event/Step2/__utils__/submit-waiver'
import {fakeEvent, fakeTechCheck, fakeWaiver} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {act} from 'react-dom/test-utils'
import axios from 'axios'
import {wait} from '@testing-library/react'
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

it('should render with attendee data', async () => {
  const groupUrl = faker.internet.url()

  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
    groups: {
      groupUrl,
    },
    has_completed_tech_check: false,
    tech_check_completed_at: null,
    has_checked_in: false,
  })

  const groupLinkButton = fakeNavButtonWithSize({
    link: '{{groupUrl}}',
    text: 'custom group button',
  })

  const buttons = [groupLinkButton]

  const event = fakeEvent({
    waiver: fakeWaiver({
      body: `<html><h1>{{first name}}'s waiver</h1></html>`,
    }),
    tech_check: fakeTechCheck({
      body: `<html><h1>{{last name}}'s tech check</h1></html>`,
    }),
    template: fakeSimpleBlog({
      welcomeText: 'welcome {{email}}',
      mainNav: createEntityList(buttons),
    }),
  })

  const context = await loginToEventSite({attendee, event})

  const {findByText, findByLabelText} = context

  // Replaced first name in waiver
  expect(
    await findByText(`${attendee.first_name}'s waiver`),
  ).toBeInTheDocument()

  mockGet.mockImplementation(() => Promise.resolve({data: attendee}))

  const withWaiver = {
    ...attendee,
    waiver: 'mywaiver.pdf',
  }

  await act(async () => {
    await submitWaiver({...context, attendee: withWaiver})
  })

  expect(await findByLabelText('start tech check')).toBeInTheDocument()

  // Replaced last name in tech check
  expect(
    await findByText(`${attendee.last_name}'s tech check`),
  ).toBeInTheDocument()

  const completedTechCheck: Attendee = {
    ...withWaiver,
    tech_check_completed_at: faker.date.recent().toISOString(),
    has_completed_tech_check: true,
  }

  mockGet.mockImplementation(() => Promise.resolve({data: completedTechCheck}))

  await wait(
    () => {
      expect(mockPost).toHaveBeenCalledTimes(2)
    },
    {
      timeout: 30000,
    },
  )

  mockPut.mockImplementationOnce(() =>
    Promise.resolve({data: {...completedTechCheck, has_checked_in: true}}),
  )

  await wait(
    () => {
      expect(mockPut).toHaveBeenCalledTimes(1)
    },
    {
      timeout: 30000,
    },
  )

  // Has finished tech check, and is showing dashboard
  await wait(async () => {
    expect(await findByLabelText('welcome')).toBeInTheDocument()
  })

  // replaced welcome text with email
  expect(await findByText(`welcome ${attendee.email}`)).toBeInTheDocument()

  // Did replace custom group value
  expect(
    (await findByText('custom group button')).parentElement?.getAttribute(
      'href',
    ),
  ).toBe(groupUrl)
})

it('should replace multiple groups', async () => {
  const group1 = 'first'
  const group2 = 'second'

  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
    groups: {
      group1,
      group2,
    },
  })

  const groupLinkButton = fakeNavButtonWithSize({
    link: '{{group1}}{{group2}}',
    text: '',
  })

  const buttons = [groupLinkButton]

  const event = fakeEvent({
    waiver: fakeWaiver({
      body: '{{group1}} {{group2}}',
    }),
    template: fakeSimpleBlog({
      welcomeText: 'welcome {{email}}',
      mainNav: createEntityList(buttons),
    }),
  })

  const context = await loginToEventSite({attendee, event})

  const {findByText} = context

  // Replaced first name in waiver
  expect(await findByText(`${group1} ${group2}`)).toBeInTheDocument()
})
