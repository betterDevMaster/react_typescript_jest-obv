import user from '@testing-library/user-event'
import {createPlatformActions, fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import axios from 'axios'
import {wait} from '@testing-library/react'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show the user email', async () => {
  const attendee = fakeAttendee({
    tech_check_completed_at: 'now',
    waiver: 'some_waiver.png',
  })

  const {findByText, findByLabelText} = await loginToEventSite({
    attendee,
  })

  user.click(await findByLabelText('show side menu'))
  expect(await findByText(new RegExp(attendee.email))).toBeInTheDocument()
})

it('it should send points for visiting dashboard', async () => {
  const action = fakeAction()

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  const event = fakeEvent({
    platform_actions: createPlatformActions({visit_dashboard: action}),
  })

  const {findByText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  const [url] = mockPost.mock.calls[1]
  expect(url).toMatch(`/events/${event.slug}/actions/${action.key}`) // Fired dashboard ID

  // show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})
