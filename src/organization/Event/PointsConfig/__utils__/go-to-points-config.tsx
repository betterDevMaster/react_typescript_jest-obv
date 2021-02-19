import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {goToEvent} from 'organization/Event/__utils__/event'
import {render} from '__utils__/render'
import App from 'App'
import axios from 'axios'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {Action} from 'Event/ActionsProvider'
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock

export async function goToPointsConfig(actions?: {
  platformActions?: Action[]
  customActions?: Action[]
}) {
  const {event, areas} = goToEvent()
  const {findByLabelText, ...renderResult} = render(<App />)

  user.click(await findByLabelText(`view ${event.name}`))

  // platform actions
  const platformActions =
    actions?.platformActions ||
    Array.from({length: faker.random.number({min: 1, max: 4})}, () =>
      fakeAction({is_platform_action: true}),
    )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: platformActions}))

  // Custom actions
  const customActions =
    actions?.customActions ||
    Array.from({length: faker.random.number({min: 1, max: 4})}, () =>
      fakeAction({is_platform_action: false}),
    )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: customActions}))

  // Wait for areas to finish loading or we run into hash
  // change error
  expect(
    await findByLabelText(`view ${areas[0].name} area`),
  ).toBeInTheDocument()

  // go to area config
  user.click(await findByLabelText(`configure points`))

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(8)
  })

  return {
    event,
    findByLabelText,
    ...renderResult,
    platformActions,
    customActions,
  }
}
