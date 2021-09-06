import user from '@testing-library/user-event'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeResource} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/__utils__/factory'
import {
  createPlatformActions,
  fakeEvent,
  fakeLocalization,
} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import axios from 'axios'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import faker from 'faker'
import {createResourceList} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('receives points', async () => {
  // Downloading resource action id
  const action = fakeAction()

  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createResourceList(),
          title: faker.random.word(),
          description: '',
          resources: [fakeResource({isVisible: true})],
        },
      ],
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

it('should show translated url', async () => {
  const translatedUrl = 'https://bar.com/'

  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createResourceList(),
          title: faker.random.word(),
          description: '',
          resources: [fakeResource({isVisible: true, url: '{{foo}}'})],
        },
      ],
    }),
    localization: fakeLocalization({
      translationsEnabled: true,
      translations: {
        English: {
          foo: translatedUrl,
        },
      },
    }),
  })

  const {findByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  const url = ((await findByLabelText('event resource')) as HTMLAnchorElement)
    .href

  expect(url).toBe(translatedUrl)
})
