import {
  createPlatformActions,
  fakeEntry,
  fakeEvent,
} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import axios from 'axios'
import {loginToEventSite} from 'Event/__utils__/url'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakePoints} from 'Event/template/SimpleBlog/Dashboard/PointsSummary/__utils__/factory'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {wait} from '@testing-library/react'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render list of entries', async () => {
  const event = fakeEvent({template: fakeSimpleBlog({points: fakePoints()})})
  const {findByLabelText, findAllByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  const entries = Array.from(
    {length: faker.random.number({min: 1, max: 10})},
    fakeEntry,
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: entries}))

  user.click(await findByLabelText('view leaderboard'))

  expect((await findAllByLabelText('entry')).length).toBe(entries.length)
})

it('should receive points', async () => {
  const action = fakeAction()

  const event = fakeEvent({
    template: fakeSimpleBlog({points: fakePoints()}),
    platform_actions: createPlatformActions({visit_leaderboard: action}),
  })
  const {findByLabelText, findByText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
    actions: [action],
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // entries

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'got points'}))

  user.click(await findByLabelText('view leaderboard'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  const [url] = mockPost.mock.calls[1]
  expect(url).toMatch(`/events/${event.slug}/actions/${action.key}`)

  // show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})
