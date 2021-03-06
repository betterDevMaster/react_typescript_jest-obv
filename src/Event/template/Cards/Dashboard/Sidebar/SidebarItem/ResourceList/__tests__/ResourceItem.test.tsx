import user from '@testing-library/user-event'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeResource} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList/__utils__/factory'
import {createPlatformActions, fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import axios from 'axios'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import faker from 'faker'
import {createResourceList} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList'
import {createHashMap} from 'lib/list'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('receives points', async () => {
  // Downloading resource action id
  const action = fakeAction()

  const event = fakeEvent({
    template: fakeCards({
      sidebarItems: createHashMap([
        {
          ...createResourceList(),
          title: faker.random.word(),
          description: '',
          resources: createHashMap([fakeResource({isVisible: true})]),
        },
      ]),
    }),
    platform_actions: createPlatformActions({
      download_resource: action,
    }),
  })

  const {findByLabelText, findByText} = await loginToEventSite({
    event,
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
  expect(url).toMatch(`/events/${event.slug}/actions/${action.key}`)

  // show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})
