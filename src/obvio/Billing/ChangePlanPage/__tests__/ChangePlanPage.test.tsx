import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import user from '@testing-library/user-event'
import axios from 'axios'
import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import {useLocation} from 'react-router-dom'
import {fakePaymentMethod, fakePlan} from 'obvio/Billing/__utils__/factory'
import {TeamMember} from 'auth/user'
import {PlanName} from 'obvio/Billing/plans'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'

const mockGet = axios.get as jest.Mock
const mockPut = axios.put as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show add card button', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: false, // no subscription
    has_payment_method: false,
    is_subscribed: true,
    plan: null,
  })

  const plan: PlanName = 'basic'

  const {
    findByText,
    findAllByText,
    findByLabelText,
  } = await goToBillingSettings({
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
    is_subscribed: true,
  })

  const paymentMethod = fakePaymentMethod()

  const plan: PlanName = 'basic'

  const {
    findByText,
    findAllByText,
    findByLabelText,
    queryByText,
  } = await goToBillingSettings({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/',
        search: `?plan=${plan}`,
      }))
    },
    authUser: teamMember,
    paymentMethod,
  })

  // select first (basic) plan

  user.click((await findAllByText(/choose plan/i))[0])

  const subscribedUser: TeamMember = {
    ...teamMember,
    has_active_subscription: true,
  }

  mockPut.mockResolvedValueOnce({data: subscribedUser})

  user.click(await findByText(/subscribe/i))

  expect(await findByText(/plan upgraded/i)).toBeInTheDocument()

  user.click(await findByText(/close/i))

  // back at root billing page
  expect(await findByText('Billing & Subscription')).toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch('/subscribe')
  expect(data.payment_method_id).toBe(paymentMethod.id)
  expect(data.plan).toBe(plan)

  // Assert that founder is missing
  expect(queryByText(/founder/i)).not.toBeInTheDocument()
})

it('should upgrade a subscription', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: true,
    plan: fakePlan({name: 'professional'}), // current
    is_subscribed: true,
  })

  const newPlan: PlanName = 'enterprise'

  // Need payment method to upgrade
  const paymentMethod = fakePaymentMethod()

  const {findByText, findAllByText} = await goToBillingSettings({
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
  expect(await findByText(/current/i)).toBeInTheDocument()

  // Assert only a single choose plan, because we're already on professional,
  // and can't select a lower plan
  expect((await findAllByText(/choose plan/i))[0]).toBeDisabled()

  // Upgrade to enterprise plan
  user.click((await findAllByText(/choose plan/i))[1])

  const upgradedUser: TeamMember = {
    ...teamMember,
    has_active_subscription: true,
    plan: fakePlan({name: 'enterprise'}),
  }

  mockPut.mockResolvedValueOnce({data: upgradedUser})

  user.click(await findByText(/subscribe/i))

  expect(await findByText(/plan upgraded/i)).toBeInTheDocument()

  user.click(await findByText(/close/i))

  // back at root billing page
  expect(await findByText('Billing & Subscription')).toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch('/subscribe')
  expect(data.plan).toBe(newPlan)
})

it('should show founder plan', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: false, // no subscription
    has_payment_method: false,
    is_subscribed: false,
    is_founder: true,
    plan: null,
  })

  const plan: PlanName = 'basic'

  const {findByText} = await goToBillingSettings({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/',
        search: `?plan=${plan}`,
      }))
    },
    authUser: teamMember,
    paymentMethod: null,
  })

  // Can see founder plan
  expect(await findByText(/founder/i)).toBeInTheDocument()
})
