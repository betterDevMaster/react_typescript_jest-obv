import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakePaymentMethod, fakePlan} from 'obvio/Billing/__utils__/factory'

const mockGet = axios.get as jest.Mock

it('should show missing credits', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: true,
    is_subscribed: true,
    has_unpaid_transactions: true,
    plan: fakePlan({name: 'enterprise'}),
    credits: 0, // start with 0 credits
  })

  const {findByText, findByLabelText} = await signInToObvio({
    beforeRender: () => {
      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    user: teamMember,
  })

  user.click(await findByLabelText('account menu'))

  mockGet.mockResolvedValueOnce({data: fakePaymentMethod()})

  const numUnpaidCredits = 5000
  mockGet.mockResolvedValueOnce({
    data: {
      num_unpaid_credits: numUnpaidCredits,
    },
  })

  user.click(await findByLabelText('billing settings'))

  expect(
    await findByText(/\*you have 5000 unpaid credits/i),
  ).toBeInTheDocument()
})
