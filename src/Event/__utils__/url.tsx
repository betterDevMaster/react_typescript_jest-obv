import {appRoot} from 'env'
import App from 'App'
import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {render} from '__utils__/render'
import {act} from '@testing-library/react'
import {Attendee} from 'Event/attendee'
import {ObvioEvent} from 'Event'
import {defaultScore} from 'Event/PointsProvider'
import {Action} from 'Event/ActionsProvider'
import {Answer} from 'Event/SubmissionsProvider'
import {EVENT_TOKEN_KEY} from 'Event/auth'
import {useLocation} from 'react-router-dom'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

const mockUseLocation = useLocation as jest.Mock

export function visitEventSite(
  options: {event?: ObvioEvent; pathname?: string; search?: string} = {},
) {
  const event = options.event || fakeEvent()
  const search = options.search || ''
  const pathname = options.pathname || ''

  Object.defineProperty(window, 'location', {
    value: {
      host: `${event.slug}.${appRoot}`,
      pathname,
      search,
      hash: '',
    },
  })

  mockUseLocation.mockImplementation(() => ({
    pathname,
    search,
  }))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  return event
}

export type LoginToEventSiteOptions = {
  attendee?: Attendee
  event?: ObvioEvent
  actions?: Action[]
  beforeRender?: () => void
  beforeLogin?: () => void
  submissions?: Answer[]
  pathname?: string
  skipLogin?: boolean
  search?: string
}

export async function loginToEventSite(options: LoginToEventSiteOptions = {}) {
  const attendee =
    options.attendee ||
    fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
      has_checked_in: true,
      has_completed_tech_check: true,
    })
  const event = options.event || fakeEvent()
  visitEventSite({event, pathname: options.pathname, search: options.search})

  const actions = options.actions || []
  const submissions = options.submissions || []

  if (options.skipLogin) {
    window.localStorage.setItem(EVENT_TOKEN_KEY, 'logged_in_token')
  } else {
    mockPost.mockImplementationOnce(() =>
      Promise.resolve({data: {access_token: faker.random.alphaNumeric(8)}}),
    )
  }

  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendee}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: actions}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: submissions}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: defaultScore}))

  options.beforeRender && options.beforeRender()

  const {findByLabelText, ...otherRenderResult} = render(<App />)

  if (!options.skipLogin) {
    user.type(await findByLabelText('email'), faker.internet.email())
    user.type(await findByLabelText('password'), faker.random.alphaNumeric(8))

    options.beforeLogin && options.beforeLogin()

    await act(async () => {
      user.click(await findByLabelText('submit login'))
    })
  }

  return {
    event,
    findByLabelText,
    ...otherRenderResult,
  }
}
