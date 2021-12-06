import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakePaymentMethod, fakePlan} from 'obvio/Billing/__utils__/factory'
import {PlanName} from 'obvio/Billing/plans'
import {ajax} from 'rxjs/ajax'
import {act} from 'react-dom/test-utils'
import {TeamMember} from 'auth/user'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
const mockAjax = ajax.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

jest.mock('rxjs/ajax')

it('should purchase selected credits', async () => {
  const plan: PlanName = 'founder'

  const teamMember = fakeTeamMember({
    has_active_subscription: true,
    plan: fakePlan({name: plan}),
    credits: 0, // start with 0 credits
    is_founder: true,
  })

  const {findByText, findByLabelText, findAllByLabelText} = await signInToObvio(
    {
      beforeRender: () => {
        // Need to mock requests BEFORE signing in, because the requests are sent immediately,
        // so we'll do it here. We just happen to know that the first request is to fetch
        // the user's organizations on organization list.
        mockGet.mockResolvedValueOnce({data: []}) // organizations
      },
      user: teamMember,
    },
  )

  // Open user drop-down menu in app/tool bar
  user.click(await findByLabelText('account menu'))

  // Mock - Need registered card to buy credits, so we'll mock it here BEFORE we access the page. This
  // is a common pattern. Mock requests, do action, verify mocks were called.
  const paymentMethod = fakePaymentMethod()
  mockGet.mockResolvedValueOnce({data: paymentMethod})

  // Action - Go to billing page
  user.click(await findByLabelText('billing settings'))

  // Mock - return the price that the slider will return
  const initialPrice = 20
  mockAjax.mockResolvedValueOnce({
    response: {
      price: initialPrice,
    },
  })

  user.click(await findByText(/purchase credits/i))

  expect(await findByText(`$${initialPrice}.00`)).toBeInTheDocument()

  const updatedPrice = 400
  mockAjax.mockResolvedValueOnce({
    response: {
      price: updatedPrice,
    },
  })

  // Action - Update slider to select credits
  const purchaseAmount = 200
  await act(async () => {
    user.click(await findByText(`${purchaseAmount}`))
  })

  // Verify - Check that the UI is returning our mocked price value
  expect(await findByText(`$${updatedPrice}.00`)).toBeInTheDocument()

  // Mock - after purchase we'll return a user with the credits attached
  const withCredits: TeamMember = {
    ...teamMember,
    credits: purchaseAmount,
  }

  // Purchase went through - received credits
  mockPost.mockResolvedValueOnce({data: withCredits})

  // Slider resets shows initial price again
  mockAjax.mockResolvedValueOnce({
    response: {
      price: initialPrice,
    },
  })

  // Action - Perform purchase
  user.click(await findByLabelText('confirm purchase'))

  // Verify - UI shows what we're expecing
  expect(
    await findByText(/credits successfully purchased/i),
  ).toBeInTheDocument()

  // Verify - requests
  // Assert sent correct request with payment id. We can't actually
  // test the sent num credit value since Mui slider relies on
  // dom coordinates, which jest doesn't have.
  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch('/purchase_credits')
  expect(data.payment_method_id).toBe(paymentMethod.id)

  // Action - close dialog
  user.click(await findByText(/close/i))

  // Verify - Showing the purchased credits
  expect((await findAllByLabelText('credit balance'))[0].textContent).toBe(
    `${purchaseAmount}`,
  )
})

it('should require a payment method', async () => {
  const plan: PlanName = 'founder'

  const teamMember = fakeTeamMember({
    has_active_subscription: true,
    plan: fakePlan({name: plan}),
    credits: 0, // start with 0 credits
    is_subscribed: true,
  })

  const {findByText, findByLabelText} = await signInToObvio({
    beforeRender: () => {
      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    user: teamMember,
  })

  user.click(await findByLabelText('account menu'))

  // No payment method was returned
  mockGet.mockResolvedValueOnce({data: null})

  user.click(await findByLabelText('billing settings'))

  // Was redirected back to billing root
  expect(await findByText('Billing & Subscription')).toBeInTheDocument()
})

it('should require a plan', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: true,
    plan: null, // no plan
    credits: 0,
    is_subscribed: true,
  })

  const {findByText, findByLabelText} = await signInToObvio({
    beforeRender: () => {
      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    user: teamMember,
  })

  user.click(await findByLabelText('account menu'))

  mockGet.mockResolvedValueOnce({data: fakePaymentMethod()})

  user.click(await findByLabelText('billing settings'))

  // Was redirected back to billing root
  expect(await findByText('Billing & Subscription')).toBeInTheDocument()
})
