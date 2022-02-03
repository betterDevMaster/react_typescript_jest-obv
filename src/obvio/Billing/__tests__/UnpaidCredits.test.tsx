import {fakePlan} from 'obvio/Billing/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

it('should show missing credits', async () => {
  const numUnpaidCredits = 5000

  const {findByText} = await goToBillingSettings({
    numUnpaidCredits,
    authUser: fakeTeamMember({
      has_active_subscription: true,
      has_unpaid_transactions: true, // has unpaid credits
      plan: fakePlan({name: 'enterprise'}),
      credits: 0,
    }),
  })

  expect(
    await findByText(/\*you have 5000 unpaid credits/i),
  ).toBeInTheDocument()
})
