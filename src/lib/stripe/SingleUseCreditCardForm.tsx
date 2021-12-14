import React from 'react'
import {CreatePaymentMethodData} from '@stripe/stripe-js'
import CreditCardForm, {
  CreditCardFormBaseProps,
  CreditCardFormResult,
} from 'lib/stripe/CreditCardForm'

export type SingleUseCreditCardFormProps = CreditCardFormBaseProps & {
  onSuccess: (paymentMethodId: string) => void
}

export default function SingleUseCreditCardForm(
  props: SingleUseCreditCardFormProps,
) {
  const {onSuccess} = props

  const onSubmit = async ({
    cardElement,
    name,
    stripe,
  }: CreditCardFormResult) => {
    const data: CreatePaymentMethodData = {
      type: 'card',
      card: cardElement,
      billing_details: {
        name,
      },
    }

    const {paymentMethod, error} = await stripe.createPaymentMethod(data)

    if (error) {
      const message = error.message || 'Create Payment Method Error'
      throw new Error(message)
    }

    if (!paymentMethod) {
      throw new Error(
        'Failed to create payment method, you will not be charged. Please contact support.',
      )
    }

    onSuccess(paymentMethod.id)
  }

  return <CreditCardForm {...props} onSubmit={onSubmit} />
}
