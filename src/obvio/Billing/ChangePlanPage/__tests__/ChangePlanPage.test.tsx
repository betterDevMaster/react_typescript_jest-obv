import axios from 'axios'
import user from '@testing-library/user-event'
import {useLocation} from 'react-router-dom'
import {TeamMember} from 'auth/user'
import {
  fakePaymentMethod,
  fakePlan,
  fakeSubscription,
} from 'obvio/Billing/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'
import {PlanName} from 'obvio/Billing/plans'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

const mockPost = axios.post as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show add card button', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: false, // no subscription
    has_payment_method: false,
    plan: null,
  })

  const plan: PlanName = 'basic'

  const {findByText, findAllByText} = await goToBillingSettings({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/',
        search: `?plan=${plan}`,
      }))
    },
    authUser: teamMember,
    paymentMethod: null,
  })

  // select first (basic) plan
  user.click((await findAllByText(/choose plan/i))[0])

  expect(await findByText(/add card/i)).toBeInTheDocument()
})

it('should create a subscription', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: false, // no subscription
    has_payment_method: true,
    plan: null,
  })

  const paymentMethod = fakePaymentMethod()

  const plan: PlanName = 'professional'

  const {findByText, findByLabelText, queryByText} = await goToBillingSettings({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/',
        search: `?plan=${plan}`,
      }))
    },
    authUser: teamMember,
    paymentMethod,
  })

  user.click(await findByLabelText(/choose professional plan/i))

  const subscribedUser: TeamMember = {
    ...teamMember,
    has_active_subscription: true,
  }

  mockPost.mockResolvedValueOnce({data: subscribedUser})

  user.click(await findByText(/subscribe/i))

  expect(await findByText(/plan upgraded/i)).toBeInTheDocument()

  user.click(await findByText(/close/i))

  // back at root billing page
  expect(await findByText('Billing & Subscription')).toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch('/subscribe')
  expect(data.payment_method_id).toBe(paymentMethod.id)
  expect(data.plan).toBe(plan)

  // Assert that founder is missing
  expect(queryByText(/founder/i)).not.toBeInTheDocument()
})

it('should upgrade a subscription', async () => {
  const teamMemberPlan = fakePlan({name: 'professional'})
  const teamMember = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: true,
    plan: teamMemberPlan,
    subscriptions: [fakeSubscription({plan: teamMemberPlan})],
  })

  const newPlan: PlanName = 'enterprise'

  // Need payment method to upgrade
  const paymentMethod = fakePaymentMethod()

  const {findByText, findByLabelText} = await goToBillingSettings({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/',
        search: `?plan=${newPlan}`,
      }))
    },
    authUser: teamMember,
    paymentMethod,
  })

  // Shows current plan
  expect(
    await findByLabelText(/current plan professional/i),
  ).toBeInTheDocument()
  expect(await findByLabelText(/cancel professional plan/i)).toBeInTheDocument()

  // Upgrade to enterprise plan
  user.click(await findByLabelText(/upgrade enterprise plan/i))

  const upgradedUser: TeamMember = {
    ...teamMember,
    has_active_subscription: true,
    plan: fakePlan({name: 'enterprise'}),
  }

  mockPost.mockResolvedValueOnce({data: upgradedUser})

  user.click(await findByText(/subscribe/i))

  expect(await findByText(/plan upgraded/i)).toBeInTheDocument()

  user.click(await findByText(/close/i))

  // back at root billing page
  expect(await findByText('Billing & Subscription')).toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch('/subscribe')
  expect(data.plan).toBe(newPlan)
})

it('should downgrade a subscription', async () => {
  const teamMemberPlan = fakePlan({name: 'professional'})
  const teamMember = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: true,
    plan: teamMemberPlan, // current
    subscriptions: [fakeSubscription({plan: teamMemberPlan})],
  })

  const newPlan: PlanName = 'basic'

  // Need payment method to upgrade
  const paymentMethod = fakePaymentMethod()

  const {findByText, findByLabelText} = await goToBillingSettings({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/',
        search: `?plan=${newPlan}&downgrade`,
      }))
    },
    authUser: teamMember,
    paymentMethod,
  })

  // Shows current plan
  expect(
    await findByLabelText(/current plan professional/i),
  ).toBeInTheDocument()
  expect(await findByLabelText(/cancel professional plan/i)).toBeInTheDocument()

  // Downgrade to basic plan
  user.click(await findByLabelText(/downgrade basic plan/i))

  const downgradedUser: TeamMember = {
    ...teamMember,
    has_active_subscription: true,
    plan: fakePlan({name: 'basic'}),
  }

  mockPost.mockResolvedValueOnce({data: downgradedUser})

  user.click(await findByText(/downgrade/i))

  expect(await findByText(/plan downgraded/i)).toBeInTheDocument()

  user.click(await findByText(/close/i))

  // back at root billing page
  expect(await findByText('Billing & Subscription')).toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch('/subscribe')
  expect(data.plan).toBe(newPlan)
})
