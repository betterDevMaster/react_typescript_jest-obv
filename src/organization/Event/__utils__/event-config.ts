import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'
import {signInToOrganization} from 'organization/__utils__/authenticate'

const mockGet = axios.get as jest.Mock

export function goToEventConfig(overrides: {event?: ObvioEvent} = {}) {
  const event = overrides.event || fakeEvent()

  const orgData = signInToOrganization({events: [event]})

  // Fetch target event
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  return {event, ...orgData}
}
