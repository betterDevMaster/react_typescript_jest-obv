import React, {useCallback} from 'react'
import {ConfirmCardSetupData, SetupIntent} from '@stripe/stripe-js'
import CreditCardForm, {CreditCardFormResult} from 'lib/stripe/CreditCardForm'
import {Loader} from 'obvio/Billing/CreditCardManagement/NewCardForm'
import {api} from 'lib/url'
import {teamMemberClient} from 'obvio/obvio-client'
import {useAsync} from 'lib/async'

export type SaveCreditCardFormProps = {
  onSuccess: (paymentMethodId: string) => void
  submitLabel: string
  className?: string
}

export default function SaveCreditCardForm(props: SaveCreditCardFormProps) {
  const {onSuccess} = props
  const setupIntent = useSetupIntent()

  const clientSecret = setupIntent?.client_secret

  if (!clientSecret) {
    return <Loader />
  }

  const onSubmit = async ({
    cardElement,
    name,
    stripe,
  }: CreditCardFormResult) => {
    const data: ConfirmCardSetupData = {
      payment_method: {
        card: cardElement,
        billing_details: {
          name,
        },
      },
    }

    // Use your card Element with other Stripe.js APIs
    const {setupIntent: updatedIntent, error} = await stripe.confirmCardSetup(
      clientSecret,
      data,
    )

    if (error) {
      const message = error.message || 'Payment Error'
      throw new Error(message)
    }

    if (!updatedIntent?.payment_method) {
      throw new Error(
        'Failed to add payment method, you will not be charged. Please contact support.',
      )
    }

    onSuccess(updatedIntent.payment_method)
  }

  return <CreditCardForm {...props} onSubmit={onSubmit} />
}

function useSetupIntent() {
  const request = useCallback(() => {
    const url = api('/stripe/setup_intent')

    return teamMemberClient.get<SetupIntent>(url)
  }, [])

  const {data} = useAsync(request)

  return data
}
