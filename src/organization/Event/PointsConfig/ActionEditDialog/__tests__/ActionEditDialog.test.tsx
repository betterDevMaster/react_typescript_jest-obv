import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {goToPointsConfig} from 'organization/Event/PointsConfig/__utils__/go-to-points-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPatch = axios.patch as jest.Mock
const mockDelete = axios.delete as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('edit an action', async () => {
  const {findByLabelText, actions, event} = await goToPointsConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const target = faker.random.arrayElement(actions)

  user.click(await findByLabelText(new RegExp(target.description)))

  const description = faker.lorem.sentence()
  user.type(await findByLabelText('action description'), description)

  const points = faker.random.number({min: 1, max: 100})
  user.type(await findByLabelText('action points'), String(points))

  const minInterval = faker.random.number({min: 1, max: 100})
  user.type(await findByLabelText('action min interval'), String(minInterval))

  const hasMaxPerDay = faker.random.boolean()

  const shouldToggleMaxPerDay = hasMaxPerDay && !target.max_per_day
  if (shouldToggleMaxPerDay) {
    user.click(await findByLabelText('toggle has max per day'))
  }

  const numTimesPerDay = faker.random.number({min: 1, max: 5})
  if (hasMaxPerDay) {
    user.type(
      await findByLabelText('action max per day'),
      String(numTimesPerDay),
    )
  }

  const hasMaxPerEvent = faker.random.boolean()

  const shouldToggleMaxPerEvent = hasMaxPerEvent && !target.max_per_event
  if (shouldToggleMaxPerEvent) {
    user.click(await findByLabelText('toggle has max per event'))
  }

  const numTimesPerEvent = faker.random.number({min: 10, max: 30})
  if (hasMaxPerEvent) {
    user.type(
      await findByLabelText('action max per event'),
      String(numTimesPerEvent),
    )
  }

  user.click(await findByLabelText('save action'))

  await wait(() => {
    expect(mockPatch).toBeCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/actions/${target.key}`)

  expect(data.description).toBe(description)
  expect(data.points).toBe(String(points))
  expect(data.min_interval_minutes).toBe(String(minInterval))

  if (hasMaxPerDay) {
    expect(data.max_per_day).toBe(String(numTimesPerDay))
  }

  if (hasMaxPerEvent) {
    expect(data.max_per_event).toBe(String(numTimesPerEvent))
  }
})

it('removes an action', async () => {
  const {
    findByLabelText,
    actions,
    findAllByLabelText,
    event,
  } = await goToPointsConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const numOriginal = actions.length

  const target = faker.random.arrayElement(actions)
  user.click(await findByLabelText(new RegExp(target.description)))

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('remove action'))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  expect((await findAllByLabelText('action')).length).toBe(numOriginal - 1)

  const [url] = mockDelete.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/actions/${target.key}`)
})
