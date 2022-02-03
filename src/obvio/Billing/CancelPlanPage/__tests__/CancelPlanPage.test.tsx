import axios from 'axios'
import user from '@testing-library/user-event'
import {useLocation} from 'react-router-dom'
import {fakePlan, fakeSubscription} from 'obvio/Billing/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'
import {PlanName} from 'obvio/Billing/plans'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should cancel a subscription', async () => {
  const teamMemberPlan = fakePlan({name: 'professional'})
  const teamMember = fakeTeamMember({
    has_active_subscription: true, // no subscription
    has_payment_method: true,
    plan: teamMemberPlan, // current
    subscriptions: [fakeSubscription({plan: teamMemberPlan})],
  })

  const {findByText, findByLabelText} = await goToBillingSettings({
    beforeRender: () => {
      mockUseLocation.mockImplementation(() => ({
        pathname: '/billing/cancel_plan',
        search: `?plan=professional`,
      }))

      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    authUser: teamMember,
  })

  // Shows current plan
  expect(
    await findByLabelText(/current plan professional/i),
  ).toBeInTheDocument()

  user.click(await findByLabelText(/cancel professional plan/i))

  mockDelete.mockResolvedValueOnce({data: teamMember})

  user.click(await findByText(/cancel subscription/i))

  expect(await findByText(/plan cancelled/i)).toBeInTheDocument()

  user.click(await findByText(/close/i))

  // back at root billing page
  expect(await findByText('Billing & Subscription')).toBeInTheDocument()

  const [url] = mockDelete.mock.calls[0]
  expect(url).toMatch('/subscribe')
})
