import App, {appRoot} from 'App'
import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {render} from '__utils__/render'
import {act} from '@testing-library/react'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

export function visitEventSite() {
  const event = fakeEvent()
  Object.defineProperty(window, 'location', {
    value: {
      host: `${event.slug}.${appRoot}`,
    },
  })
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  return event
}

export async function loginToEventSite() {
  const event = visitEventSite()

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: faker.random.alphaNumeric(8)}}),
  )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeAttendee()}))

  const {findByLabelText, ...otherRenderResult} = render(<App />)

  user.type(await findByLabelText('email'), faker.internet.email())
  user.type(await findByLabelText('password'), faker.random.alphaNumeric(8))

  await act(async () => {
    user.click(await findByLabelText('submit login'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  return {
    event,
    findByLabelText,
    ...otherRenderResult,
  }
}
