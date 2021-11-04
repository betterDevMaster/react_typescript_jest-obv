import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import user from '@testing-library/user-event'
import axios from 'axios'
import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import {useLocation} from 'react-router-dom'
import {fakePaymentMethod} from 'obvio/Billing/__utils__/factory'
import {TeamMember} from 'auth/user'
import {PlanName} from 'obvio/Billing/plans'

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
    plan: null,
  })

  const plan: PlanName = 'basic'

  const {findByText, findAllByText, findByLabelText} = await signInToObvio({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/',
        search: `?plan=${plan}`,
      }))

      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    user: teamMember,
  })

  // Has no paymetn method
  mockGet.mockResolvedValueOnce({data: null})

  user.click(await findByLabelText('account menu'))
  user.click(await findByLabelText('billing settings'))

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

  const plan: PlanName = 'basic'

  const {findByText, findAllByText, findByLabelText} = await signInToObvio({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/',
        search: `?plan=${plan}`,
      }))

      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    user: teamMember,
  })

  // Mock payment method (ie. user already has a card) because we're not able
  // to cleanly mock stripe's elements API, nor do we want to in case they
  // change it. So we'll just assume Stripe works / leave for E2E tests.
  mockGet.mockResolvedValueOnce({data: paymentMethod})

  user.click(await findByLabelText('account menu'))
  user.click(await findByLabelText('billing settings'))

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
})

it('should upgrade a subscription', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: true,
    plan: 'professional', // current
  })

  const newPlan: PlanName = 'enterprise'

  const {findByText, findByLabelText, findAllByText} = await signInToObvio({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/',
        search: `?plan=${newPlan}`,
      }))

      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    user: teamMember,
  })

  user.click(await findByLabelText('account menu'))

  // Need payment method to upgrade
  const paymentMethod = fakePaymentMethod()
  mockGet.mockResolvedValueOnce({data: paymentMethod})

  user.click(await findByLabelText('billing settings'))

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
    plan: 'enterprise',
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