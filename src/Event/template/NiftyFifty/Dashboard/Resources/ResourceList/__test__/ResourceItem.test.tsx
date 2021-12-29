import user from '@testing-library/user-event'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'
import {fakeResource} from 'Event/template/NiftyFifty/Dashboard/Resources/ResourceList/__utils__/factory'
import {
  createPlatformActions,
  fakeEvent,
  fakeLocalization,
} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import axios from 'axios'
import {loginToEventSite} from 'Event/__utils__/url'
// import {fakeAttendee} from 'Event/auth/__utils__/factory'
import faker from 'faker'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('receive points', async () => {
  // Downloading resource action id
  const action = fakeAction()

  const event = fakeEvent({
    template: fakeNiftyFifty({
      resourceList: {
        title: faker.random.word(),
        resources: [fakeResource({isVisible: true})],
      },
    }),
    platform_actions: createPlatformActions({
      download_resource: action,
    }),
  })

  const {findByLabelText, findByText} = await loginToEventSite({
    event,
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('panels tab resources'))

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
    template: fakeNiftyFifty({
      resourceList: {
        title: faker.random.word(),
        resources: [
          fakeResource({isVisible: true, url: '{{foo}}', isUrl: true}),
        ],
      },
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
  })

  user.click(await findByLabelText('panels tab resources'))

  const url = ((await findByLabelText('event resource')) as HTMLAnchorElement)
    .href

  expect(url).toBe(translatedUrl)
})
