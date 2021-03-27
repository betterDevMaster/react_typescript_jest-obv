import {fakeInfusionsoftIntegration} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/factory'
import {goToServices} from 'organization/Event/Services/__utils__/go-to-services-config'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/dom'
import axios from 'axios'

const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should unlink a service', async () => {
  const infusionsoft = fakeInfusionsoftIntegration({is_linked: true})

  const {findByLabelText, queryByLabelText} = await goToServices({
    integrations: [infusionsoft],
  })
  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('unlink service'))

  await wait(() => {
    expect(queryByLabelText('unlink service')).not.toBeInTheDocument()
  })
})
