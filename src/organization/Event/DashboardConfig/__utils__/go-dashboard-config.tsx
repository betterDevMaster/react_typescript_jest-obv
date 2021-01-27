import {ObvioEvent} from 'Event'
import {fakeEvent} from 'Event/__utils__/factory'
import axios from 'axios'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {render} from '__utils__/render'
import App from 'App'
import React from 'react'
import user from '@testing-library/user-event'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'

const mockGet = axios.get as jest.Mock

export async function goToDashboardConfig(options: {event?: ObvioEvent} = {}) {
  const event = options.event || fakeEvent()

  signInToOrganization({events: [event]})

  const {findByText, findByLabelText, ...otherRes} = render(<App />)

  // Go to event
  expect(await findByText(event.name)).toBeInTheDocument()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  // Dashboard requests
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // Areas
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [fakeAction()]})) // Platform actions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // Custom actions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: defaultScore})) // Custom actions

  user.click(await findByLabelText(`view ${event.name}`))
  // Configure dashboard
  user.click(await findByLabelText('configure dashboard'))

  return {findByText, findByLabelText, ...otherRes}
}
