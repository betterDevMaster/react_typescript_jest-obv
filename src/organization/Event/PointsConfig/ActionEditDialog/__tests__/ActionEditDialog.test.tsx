import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {Action} from 'Event/ActionsProvider'
import {wait} from '@testing-library/react'
import {goToPointsConfig} from 'organization/Event/PointsConfig/__utils__/go-to-points-config'

const mockPost = axios.post as jest.Mock
const mockPatch = axios.patch as jest.Mock
const mockDelete = axios.delete as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('edit an action', async () => {
  const {
    findByLabelText,
    customActions,
    findAllByLabelText,
    event,
  } = await goToPointsConfig()

  const target = faker.random.arrayElement(customActions)

  user.click(await findByLabelText(new RegExp(target.description)))

  const description = faker.lorem.sentence()
  user.type(await findByLabelText('action description'), description)

  const points = faker.random.number({min: 1, max: 100})
  user.type(await findByLabelText('action points'), String(points))

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
  expect(url).toMatch(`/events/${event.slug}/actions/${target.id}`)

  expect(data.description).toBe(description)
  expect(data.points).toBe(String(points))

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
    platformActions,
    customActions,
    findAllByLabelText,
    event,
  } = await goToPointsConfig()

  const numOriginal = platformActions.length + customActions.length

  const target = faker.random.arrayElement(customActions)
  user.click(await findByLabelText(new RegExp(target.description)))

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('remove action'))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  expect((await findAllByLabelText('action')).length).toBe(numOriginal - 1)

  const [url] = mockDelete.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/actions/${target.id}`)
})
