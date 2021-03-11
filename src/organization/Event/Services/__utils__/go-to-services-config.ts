import {goToEventConfig} from 'organization/Event/__utils__/event'
import {ObvioEvent} from 'Event'
import user from '@testing-library/user-event'
import axios from 'axios'
import {Integration} from 'organization/Event/Services/ServicesProvider'

const mockGet = axios.get as jest.Mock

export async function goToServices(
  overrides: {event?: ObvioEvent; integrations?: Integration[]} = {},
) {
  const context = await goToEventConfig(overrides)

  // integrations
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: overrides.integrations || []}),
  )

  // Access tokens
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  user.click(await context.findByLabelText('services'))

  return context
}
