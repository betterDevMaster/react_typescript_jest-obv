import {BASIC_PLAN} from 'obvio/Billing/plans'
import {
  fakePaymentMethod,
  fakePlan,
  fakeSubscription,
} from 'obvio/Billing/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

it('should show button to change card', async () => {
  const {findByText} = await goToBillingSettings({
    paymentMethod: fakePaymentMethod(), // Has card on file
  })

  expect(await findByText(/change card/i)).toBeInTheDocument()
})

it('should show main plans', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: false, // no subscription
    has_payment_method: true,
    plan: null,
  })

  const {findByLabelText, queryByText} = await goToBillingSettings({
    authUser: teamMember,
  })

  expect(await findByLabelText(/choose basic plan/i)).toBeInTheDocument()
  expect(await findByLabelText(/choose professional plan/i)).toBeInTheDocument()
  expect(await findByLabelText(/choose enterprise plan/i)).toBeInTheDocument()

  // Assert that founder plan is missing
  expect(queryByText(/founder/i)).not.toBeInTheDocument()
})

it('should show current plan indicator and cancel button', async () => {
  const teamMemberPlan = fakePlan({name: 'professional'})
  const teamMember = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: true,
    plan: teamMemberPlan, // current
    subscriptions: [fakeSubscription({plan: teamMemberPlan})],
  })

  const {findByLabelText} = await goToBillingSettings({authUser: teamMember})

  // Shows current plan
  expect(
    await findByLabelText(/current plan professional/i),
  ).toBeInTheDocument()
  expect(await findByLabelText(/cancel professional plan/i)).toBeInTheDocument()
})

it('should show upgrade, downgrade and choose buttons', async () => {
  const teamMemberPlan = fakePlan({name: 'professional'})
  const teamMember = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: true,
    plan: teamMemberPlan, // current
    subscriptions: [fakeSubscription({plan: teamMemberPlan})],
  })

  const {findByLabelText} = await goToBillingSettings({authUser: teamMember})

  // Able to downgrade to basic, upgrade to enterprise and choose founder plan.
  expect(await findByLabelText(/downgrade basic plan/i)).toBeInTheDocument()
  expect(await findByLabelText(/upgrade enterprise plan/i)).toBeInTheDocument()
})

it('should show resume button for cancelled plan', async () => {
  const teamMemberPlan = fakePlan({name: 'professional'})
  const teamMember = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: true,
    plan: teamMemberPlan, // current
    subscriptions: [
      fakeSubscription({
        ends_at: '2030-12-17 00:00:00',
        plan: teamMemberPlan,
      }),
    ],
  })

  const {findByLabelText, queryByText} = await goToBillingSettings({
    authUser: teamMember,
  })

  expect(
    await findByLabelText(/current plan professional/i),
  ).toBeInTheDocument()
  expect(await queryByText(/ending on: 17-12-2030/i)).toBeInTheDocument()
  expect(await findByLabelText(/resume professional plan/i)).toBeInTheDocument()
})

it('should show renewing indicator for downgraded plan', async () => {
  const teamMemberPlan = fakePlan({name: 'professional'})
  const teamMember = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: true,
    plan: teamMemberPlan, // current
    subscriptions: [
      fakeSubscription({
        ends_at: '2030-12-17 00:00:00',
        plan: teamMemberPlan,
        renew_plan: BASIC_PLAN.name,
      }),
    ],
  })

  const {findByLabelText, queryByText} = await goToBillingSettings({
    authUser: teamMember,
  })

  expect(
    await findByLabelText(/current plan professional/i),
  ).toBeInTheDocument()
  expect(await queryByText(/renewing on: 17-12-2030/i)).toBeInTheDocument()
  expect(await findByLabelText(/resume professional plan/i)).toBeInTheDocument()
})

it('should show founder plan', async () => {
  const user = fakeTeamMember({
    has_active_subscription: true,
    has_unpaid_transactions: false,
    plan: fakePlan({name: 'founder'}),
  })
  const {findByText} = await goToBillingSettings({
    paymentMethod: fakePaymentMethod(), // Has card on file
    authUser: user,
  })

  // Is showing founder card
  expect(await findByText('Obvio Founders')).toBeInTheDocument()
})
