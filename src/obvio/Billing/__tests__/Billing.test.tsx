import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakePaymentMethod} from 'obvio/Billing/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('should remove a credit card', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: true,
    plan: 'enterprise',
    credits: 0, // start with 0 credits
  })

  const {findByText, findByLabelText} = await signInToObvio({
    beforeRender: () => {
      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    user: teamMember,
  })

  user.click(await findByLabelText('account menu'))

  // No payment method was returned
  mockGet.mockResolvedValueOnce({data: fakePaymentMethod()})

  user.click(await findByLabelText('billing settings'))

  mockDelete.mockResolvedValueOnce({data: 'deleted card'})

  user.click(await findByText(/remove card/i))

  // Shows add card because we still have a current subscription
  expect(await findByText(/add card/i)).toBeInTheDocument()

  const [url] = mockDelete.mock.calls[0]
  expect(url).toMatch('/stripe/payment_method')
})
