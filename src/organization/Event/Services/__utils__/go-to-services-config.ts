import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import user from '@testing-library/user-event'
import axios from 'axios'
import {Integration} from 'organization/Event/Services/ServicesProvider'
import {AccessToken} from 'organization/Event/Services/AccessTokens/AccessTokensProvider'

const mockGet = axios.get as jest.Mock

export type ServicesConfigOptions = {
  integrations?: Integration[]
  tokens?: AccessToken[]
} & EventOverrides

export async function goToServices(options: ServicesConfigOptions = {}) {
  const context = await goToEventConfig(options)

  // integrations
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: options.integrations || []}),
  )

  // Access tokens
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: options.tokens || []}),
  )

  user.click(await context.findByLabelText('services'))

  return context
}
