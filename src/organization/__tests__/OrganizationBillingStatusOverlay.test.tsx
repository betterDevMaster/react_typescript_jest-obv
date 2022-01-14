import React from 'react'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {render} from '__utils__/render'
import App from 'App'
import {fakePlan} from 'obvio/Billing/__utils__/factory'

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show invalid subscription', async () => {
  const authUser = fakeTeamMember({
    has_active_subscription: false, // no subscription
    has_payment_method: false,
    plan: null,
  })

  signInToOrganization({authUser})
  const {findByText} = render(<App />)

  expect(await findByText(/inactive subscription/i)).toBeInTheDocument()
})

it('should show unpaid transactions', async () => {
  const authUser = fakeTeamMember({
    has_active_subscription: true,
    has_payment_method: false,
    has_unpaid_transactions: true,
    plan: null,
  })

  signInToOrganization({authUser})
  const {findByText} = render(<App />)

  expect(await findByText(/unpaid credit transactions/i)).toBeInTheDocument()
})

it('should show credit card required', async () => {
  const authUser = fakeTeamMember({
    has_active_subscription: true,
    has_payment_method: false, // no card
    has_unpaid_transactions: false,
    plan: fakePlan(), // but has plan
  })

  signInToOrganization({authUser, owner: authUser})
  const {findByText} = render(<App />)

  expect(await findByText(/credit card required/i)).toBeInTheDocument()
})

it('should show owner has inactive subscription', async () => {
  const authUser = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: false,
    plan: null,
  })

  const owner = fakeTeamMember({
    has_active_subscription: false,
  })

  signInToOrganization({authUser, owner})
  const {findByText} = render(<App />)

  expect(
    await findByText(
      /The owner of this event does not have an active subscription/i,
    ),
  ).toBeInTheDocument()
})

it('should show owner has unpaid transactions', async () => {
  const authUser = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: false,
    plan: null,
  })

  const owner = fakeTeamMember({
    has_active_subscription: true,
    has_unpaid_transactions: true,
  })

  signInToOrganization({authUser, owner})
  const {findByText} = render(<App />)

  expect(
    await findByText(/The owner of this event needs to add more credits/i),
  ).toBeInTheDocument()
})

it('should show owner requires credit card', async () => {
  const authUser = fakeTeamMember({
    has_active_subscription: true,
    has_payment_method: true,
    plan: fakePlan(),
  })

  const owner = fakeTeamMember({
    has_active_subscription: true,
    has_unpaid_transactions: false,
    has_payment_method: false,
  })

  signInToOrganization({authUser, owner})
  const {findByText} = render(<App />)

  expect(
    await findByText(/The owner of this event needs to add a credit card/i),
  ).toBeInTheDocument()
})
