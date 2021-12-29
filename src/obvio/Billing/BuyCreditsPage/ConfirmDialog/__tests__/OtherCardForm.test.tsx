import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'
import React from 'react'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakePaymentMethod, fakePlan} from 'obvio/Billing/__utils__/factory'
import {PlanName} from 'obvio/Billing/plans'
import {ajax} from 'rxjs/ajax'
import {act} from 'react-dom/test-utils'
import {TeamMember} from 'auth/user'
import SingleUseCreditCardForm from 'lib/stripe/SingleUseCreditCardForm'
import {hideConsoleErrors} from 'setupTests'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
const mockAjax = ajax.get as jest.Mock

hideConsoleErrors()

beforeEach(() => {
  jest.clearAllMocks()
})

jest.mock('rxjs/ajax')
jest.mock('lib/stripe/SingleUseCreditCardForm')

const MockSingleUseCreditCardForm = SingleUseCreditCardForm as jest.Mock

it('should purchase selected credits', async () => {
  const plan: PlanName = 'founder'

  const teamMember = fakeTeamMember({
    has_active_subscription: true,
    plan: fakePlan({name: plan}),
    credits: 0, // start with 0 credits
    is_founder: true,
  })

  const paymentMethod = fakePaymentMethod()

  const paymentMethodId = 'somepaymentid'

  MockSingleUseCreditCardForm.mockImplementation(
    (props: {
      submitLabel: string
      onSuccess: (paymentMethodId: string) => void
    }) => {
      return (
        <button
          onClick={() => {
            props.onSuccess(paymentMethodId)
          }}
          aria-label="mock submit card form"
        >
          {props.submitLabel}
        </button>
      )
    },
  )

  const {findByText, findByLabelText} = await goToBillingSettings({
    authUser: teamMember,
    paymentMethod,
  })

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

  const purchaseAmount = 200
  await act(async () => {
    user.click(await findByText(`${purchaseAmount}`))
  })

  expect(await findByText(`$${updatedPrice}.00`)).toBeInTheDocument()

  const withCredits: TeamMember = {
    ...teamMember,
    credits: purchaseAmount,
  }

  const paymentIntentId = 'paymentintentid'

  mockPost.mockResolvedValueOnce({
    data: {
      id: paymentIntentId,
    },
  })

  mockPost.mockResolvedValueOnce({data: withCredits})

  mockAjax.mockResolvedValueOnce({
    response: {
      price: initialPrice,
    },
  })

  user.click(await findByLabelText('buy credits'))
  user.click(await findByLabelText('use a different card'))
  user.click(await findByLabelText('mock submit card form'))

  expect(
    await findByText(/credits successfully purchased/i),
  ).toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[1]
  expect(url).toMatch('/purchase_credits')
  expect(data.payment_method_id).toBe(paymentMethodId)
  expect(data.payment_intent_id).toBe(paymentIntentId)
})
