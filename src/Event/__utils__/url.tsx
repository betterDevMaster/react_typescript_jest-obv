import App, {appRoot} from 'App'
import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {emptyActions, render} from '__utils__/render'
import {act} from '@testing-library/react'
import {Attendee} from 'Event/attendee'
import {ObvioEvent} from 'Event'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

export function visitEventSite(options: {event?: ObvioEvent} = {}) {
  const event = options.event || fakeEvent()

  Object.defineProperty(window, 'location', {
    value: {
      host: `${event.slug}.${appRoot}`,
    },
  })
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  return event
}

export async function loginToEventSite(
  options: {
    attendee?: Attendee
    event?: ObvioEvent
    beforeLogin?: () => void
  } = {},
) {
  const attendee = options.attendee || fakeAttendee()
  const event = options.event || fakeEvent()
  visitEventSite({event})

  const platformActions = Array.from(
    {length: faker.random.number({min: 3, max: 5})},
    () => fakeAction({is_platform_action: true}),
  )

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: faker.random.alphaNumeric(8)}}),
  )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendee}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: platformActions}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: defaultScore}))

  const {findByLabelText, ...otherRenderResult} = render(<App />)

  user.type(await findByLabelText('email'), faker.internet.email())
  user.type(await findByLabelText('password'), faker.random.alphaNumeric(8))

  options.beforeLogin && options.beforeLogin()

  await act(async () => {
    user.click(await findByLabelText('submit login'))
  })

  return {
    event,
    findByLabelText,
    ...otherRenderResult,
  }
}
