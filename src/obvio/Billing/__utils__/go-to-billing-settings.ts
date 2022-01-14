import axios from 'axios'
import user from '@testing-library/user-event'
import {fakePaymentMethod, fakePlan} from 'obvio/Billing/__utils__/factory'
import {
  signInToObvio,
  SignInToObvioOptions,
} from 'obvio/__utils__/sign-in-to-obvio'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {PaymentMethod} from '@stripe/stripe-js'

const mockGet = axios.get as jest.Mock

export async function goToBillingSettings(
  options: SignInToObvioOptions & {
    paymentMethod?: PaymentMethod | null
    numUnpaidCredits?: number
  } = {},
) {
  const authUser =
    options.authUser ||
    fakeTeamMember({
      has_active_subscription: true,
      has_unpaid_transactions: false,
      plan: fakePlan({name: 'enterprise'}),
      is_subscribed: true,
      credits: 0, // start with 0 credits
    })

  const context = await signInToObvio({
    beforeRender: () => {
      options.beforeRender && options.beforeRender()

      mockGet.mockResolvedValueOnce({data: []}) // organizations
    },
    authUser,
  })

  user.click(await context.findByLabelText('account menu'))

  const paymentMethod =
    options.paymentMethod === undefined
      ? fakePaymentMethod()
      : options.paymentMethod

  mockGet.mockResolvedValueOnce({data: paymentMethod})

  const numUnpaidCredits = options.numUnpaidCredits || 0

  if (authUser.has_unpaid_transactions) {
    mockGet.mockResolvedValueOnce({
      data: {
        num_unpaid_credits: numUnpaidCredits,
      },
    })
  }

  user.click(await context.findByLabelText('billing settings'))

  return {...context, paymentMethod}
}
