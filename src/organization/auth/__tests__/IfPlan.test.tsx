import React from 'react'
import IfPlan from 'organization/auth/IfPlan'
import {PROFESSIONAL, ENTERPRISE, Plan} from 'obvio/Billing/plans'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakePlan} from 'obvio/Billing/__utils__/factory'
import {render} from '__utils__/render'
import {TeamMember} from 'auth/user'
import {BrowserRouter, Route} from 'react-router-dom'

function userWithPlan(plan: Plan): TeamMember {
  return fakeTeamMember({
    has_active_subscription: true,
    has_unpaid_transactions: false,
    plan: plan,
    credits: 0, // start with 0 credits
  })
}

it('should not render contents when required plan is not met', async () => {
  const authUser = userWithPlan(fakePlan({name: PROFESSIONAL}))

  const {queryByText} = render(
    <IfPlan plan={ENTERPRISE}>
      <div>success contents</div>
    </IfPlan>,
    {owner: authUser},
  )

  expect(await queryByText('success contents')).not.toBeInTheDocument()
})

it('should render contents when required plan or lower is met', async () => {
  const authUser = userWithPlan(fakePlan({name: PROFESSIONAL}))

  const {findByText} = render(
    <IfPlan plan={ENTERPRISE} orLower>
      <div>success contents</div>
    </IfPlan>,
    {owner: authUser},
  )

  expect(await findByText('success contents')).toBeInTheDocument()
})

it('should render contents when required plan or higher is met', async () => {
  const authUser = userWithPlan(fakePlan({name: ENTERPRISE}))

  const {findByText} = render(
    <IfPlan plan={PROFESSIONAL} orHigher>
      <div>success contents</div>
    </IfPlan>,
    {owner: authUser},
  )

  expect(await findByText('success contents')).toBeInTheDocument()
})

it('should redirect when required plan is not met', async () => {
  const authUser = userWithPlan(fakePlan({name: PROFESSIONAL}))

  const {findByText} = render(
    <BrowserRouter>
      <IfPlan plan={ENTERPRISE} redirect="/somewhere">
        <div>success contents</div>
      </IfPlan>
      <Route path="/somewhere">Somewhere Content</Route>
    </BrowserRouter>,
    {
      owner: authUser,
    },
  )

  expect(await findByText('Somewhere Content')).toBeInTheDocument()
})
