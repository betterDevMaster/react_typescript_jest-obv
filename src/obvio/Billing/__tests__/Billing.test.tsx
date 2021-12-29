import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import user from '@testing-library/user-event'
import axios from 'axios'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'

const mockDelete = axios.delete as jest.Mock

it('should remove a credit card', async () => {
  const {findByText} = await goToBillingSettings()

  mockDelete.mockResolvedValueOnce({data: 'deleted card'})

  user.click(await findByText(/remove card/i))

  // Shows add card because we still have a current subscription
  expect(await findByText(/add card/i)).toBeInTheDocument()

  const [url] = mockDelete.mock.calls[0]
  expect(url).toMatch('/stripe/payment_method')
})
