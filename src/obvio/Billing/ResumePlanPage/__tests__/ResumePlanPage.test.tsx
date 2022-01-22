import axios from 'axios'
import user from '@testing-library/user-event'
import {useLocation} from 'react-router-dom'
import {fakePlan, fakeSubscription} from 'obvio/Billing/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'
import {PlanName} from 'obvio/Billing/plans'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPut = axios.put as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should resume a subscription', async () => {
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

  const resumedPlan: PlanName = 'professional'

  const {findByText, findByLabelText} = await goToBillingSettings({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/billing/resume_plan',
        search: `?plan=professional`,
      }))

      mockGet.mockResolvedValueOnce({data: []})
    },
    authUser: teamMember,
  })

  // Shows current plan
  expect(
    await findByLabelText(/current plan professional/i),
  ).toBeInTheDocument()

  // Resume professional plan
  user.click(await findByLabelText(/resume professional plan/i))

  mockPut.mockResolvedValueOnce({data: teamMember})

  user.click(await findByText(/resume subscription/i))

  expect(await findByText(/plan resumed/i)).toBeInTheDocument()

  user.click(await findByText(/close/i))

  // back at root billing page
  expect(await findByText('Billing & Subscription')).toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch('/subscribe')
  expect(data.plan).toBe(resumedPlan)
})
