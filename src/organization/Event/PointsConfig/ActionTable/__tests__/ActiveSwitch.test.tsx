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

it('toggles a platform action', async () => {
  const platformActions = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    () => fakeAction({is_active: false, is_platform_action: true}),
  )
  const {findAllByLabelText, event} = await goToPointsConfig({
    platformActions,
  })

  const targetIndex = faker.random.number({
    min: 0,
    max: platformActions.length - 1,
  })
  const target = platformActions[targetIndex]

  const activated: Action = {...target, is_active: true}

  mockPost.mockImplementation(() => Promise.resolve({data: activated}))

  user.click((await findAllByLabelText('toggle action active'))[targetIndex])

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [activateUrl] = mockPost.mock.calls[0]
  expect(activateUrl).toMatch(
    `/events/${event.slug}/actions/platform/${target.id}/activate`,
  )

  const deactivated = {
    ...activated,
    is_active: false,
  }
  mockDelete.mockImplementationOnce(() => Promise.resolve({data: deactivated}))

  user.click((await findAllByLabelText('toggle action active'))[targetIndex])

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const [deactivateUrl] = mockDelete.mock.calls[0]
  expect(deactivateUrl).toMatch(
    `events/${event.slug}/actions/platform/${target.id}/deactivate`,
  )
})

it('toggles a custom action', async () => {
  const customActions = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    () => fakeAction({is_active: false, is_platform_action: false}),
  )
  const {findAllByLabelText, event, platformActions} = await goToPointsConfig({
    customActions,
  })

  const targetIndex = faker.random.number({
    min: 0,
    max: customActions.length - 1,
  })
  const target = customActions[targetIndex]

  const elIndex = platformActions.length + targetIndex

  const activated: Action = {...target, is_active: true}

  mockPatch.mockImplementation(() => Promise.resolve({data: activated}))

  user.click((await findAllByLabelText('toggle action active'))[elIndex])

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [activateUrl] = mockPatch.mock.calls[0]
  expect(activateUrl).toMatch(`/events/${event.slug}/actions/${target.id}`)

  const deactivated = {
    ...activated,
    is_active: false,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: deactivated}))

  user.click((await findAllByLabelText('toggle action active'))[elIndex])

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(2)
  })

  const [deactivateUrl] = mockPatch.mock.calls[1]
  expect(deactivateUrl).toMatch(`/events/${event.slug}/actions/${target.id}`)
})
