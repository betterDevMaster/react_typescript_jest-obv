import {fakeAttendee} from 'Event/auth/__utils__/factory'
import user from '@testing-library/user-event'
import {loginToEventSite} from 'Event/__utils__/url'
import axios from 'axios'
import {act} from 'react-dom/test-utils'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {wait} from '@testing-library/react'
import {createPlatformActions, fakeEvent} from 'Event/__utils__/factory'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show step 1 on login', async () => {
  const attendee = fakeAttendee({
    has_password: false,
  })

  const event = fakeEvent({
    template: fakeFiftyBlog(),
  })
  const {findByLabelText} = await loginToEventSite({attendee, event})

  expect(await findByLabelText('password input')).toBeInTheDocument()
})

it('should set an attendee password', async () => {
  const attendee = fakeAttendee({
    has_password: false,
  })

  const updatedAttendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })
  const event = fakeEvent({
    template: fakeFiftyBlog(),
  })

  const {findByLabelText} = await loginToEventSite({attendee, event})

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: updatedAttendee,
    }),
  )

  const password = 'secretpw'
  await act(async () => {
    user.type(await findByLabelText('password input'), password)
    user.type(await findByLabelText('confirm password input'), password)
    user.click(await findByLabelText('submit set password form'))
  })

  expect(await findByLabelText('signature canvas')).toBeInTheDocument()

  expect(mockPost.mock.calls[1][1]['password']).toBe(password)
  expect(mockPost.mock.calls[1][1]['password_confirmation']).toBe(password)
})

it('should receive points', async () => {
  const attendee = fakeAttendee({
    has_password: false,
  })

  const updatedAttendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })

  // Set password = ID #1
  const action = fakeAction()

  const event = fakeEvent({
    platform_actions: createPlatformActions({create_password: action}),
    template: fakeFiftyBlog(),
  })

  const {findByLabelText, findByText} = await loginToEventSite({
    attendee,
    actions: [action],
    event,
  })

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: updatedAttendee,
    }),
  )

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: 'got points',
    }),
  )

  const password = 'secretpw'
  await act(async () => {
    user.type(await findByLabelText('password input'), password)
    user.type(await findByLabelText('confirm password input'), password)
    user.click(await findByLabelText('submit set password form'))
  })

  await wait(() => {
    expect(mockPost).toBeCalledTimes(3)
  })

  const [url] = mockPost.mock.calls[2]
  expect(url).toMatch(`/events/${event.slug}/actions/${action.key}`)

  // show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})

it('should skip step 1 if pw is not required', async () => {
  const attendee = fakeAttendee({
    has_password: false, // no pw set
  })

  const withoutSetPassword = fakeEvent({
    requires_attendee_password: false,
    template: fakeFiftyBlog(),
  })

  const {findByLabelText} = await loginToEventSite({
    attendee,
    event: withoutSetPassword,
  })

  expect(await findByLabelText('signature canvas')).toBeInTheDocument()
})
