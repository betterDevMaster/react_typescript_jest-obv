import user from '@testing-library/user-event'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeResource} from 'Event/Dashboard/components/ResourceList/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import axios from 'axios'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('receive points', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      resourceList: {
        description: '',
        resources: [fakeResource()],
      },
    }),
  })

  // Downloading resource action id #4
  const action = fakeAction({id: 4, is_platform_action: true})
  const platformActions = [action]

  const {findByLabelText, findByText} = await loginToEventSite({
    event,
    platformActions,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('event resource'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  const [url] = mockPost.mock.calls[1]
  expect(url).toMatch(`/events/${event.slug}/actions/4`)

  // show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})