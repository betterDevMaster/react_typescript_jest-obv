import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {Action} from 'Event/ActionsProvider'
import {wait} from '@testing-library/react'
import {goToPointsConfig} from 'organization/Event/PointsConfig/__utils__/go-to-points-config'

const mockPatch = axios.patch as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('toggles a custom action', async () => {
  const actions = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    () => fakeAction({is_active: false}),
  )

  const {findAllByLabelText, event} = await goToPointsConfig({
    actions,
  })

  const targetIndex = faker.random.number({
    min: 0,
    max: actions.length - 1,
  })
  const target = actions[targetIndex]

  const activated: Action = {...target, is_active: true}

  mockPatch.mockImplementation(() => Promise.resolve({data: activated}))

  user.click((await findAllByLabelText('toggle action active'))[targetIndex])

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [activateUrl] = mockPatch.mock.calls[0]
  expect(activateUrl).toMatch(`/events/${event.slug}/actions/${target.key}`)

  const deactivated = {
    ...activated,
    is_active: false,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: deactivated}))

  user.click((await findAllByLabelText('toggle action active'))[targetIndex])

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(2)
  })

  const [deactivateUrl] = mockPatch.mock.calls[1]
  expect(deactivateUrl).toMatch(`/events/${event.slug}/actions/${target.key}`)
})
