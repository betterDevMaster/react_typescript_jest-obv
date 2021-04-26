import {goToPointsConfig} from 'organization/Event/PointsConfig/__utils__/go-to-points-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import faker from 'faker'
import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import axios from 'axios'
import {wait} from '@testing-library/dom'

afterEach(() => {
  jest.clearAllMocks()
})

const mockPut = axios.put as jest.Mock

it('should render actions', async () => {
  const {actions, findByText} = await goToPointsConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  for (const action of actions) {
    expect(await findByText(action.description)).toBeInTheDocument()
  }
})

it('should configure the leaderboard', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })
  const {findByLabelText} = await goToPointsConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  expect(await findByLabelText('configure leaderboard page')).toBeInTheDocument()
  user.click(await findByLabelText('configure leaderboard page'))

  const title = faker.random.words(3)
  const backToDashboardText = faker.random.words(3)

  user.type(await findByLabelText('set leaderboard page title'), title)
  user.type(
    await findByLabelText('set leaderboard page back to dashboard text'),
    backToDashboardText,
  )

  const updated = {
    ...event,
    template: {
      ...event.template,
      leaderboard: {
        title,
        backToDashboardText,
      },
    },
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template.leaderboard.title).toBe(title)
})
