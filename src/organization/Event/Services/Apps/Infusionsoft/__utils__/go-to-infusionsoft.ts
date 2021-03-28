import user from '@testing-library/user-event'
import {goToServices} from 'organization/Event/Services/__utils__/go-to-services-config'
import {Integration} from 'organization/Event/Services/ServicesProvider'
import {Tag} from 'organization/Event/Services/Apps/Infusionsoft'
import axios from 'axios'
import {EventOverrides} from 'organization/Event/__utils__/event'

const mockGet = axios.get as jest.Mock

export async function goToInfusionsoft(
  overrides: EventOverrides & {
    integrations?: Integration[]
    tags?: Tag[]
  } = {},
) {
  const context = await goToServices(overrides)

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: overrides.tags || []}),
  )

  user.click(await context.findByLabelText(/infusionsoft/i))

  return context
}
