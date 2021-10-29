import Button from '@material-ui/core/Button'
import {PaymentMethod} from '@stripe/stripe-js'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {api} from 'lib/url'
import CreditCardForm from 'obvio/Billing/CreditCardManagement/CreditCardForm/Form'
import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'
import {teamMemberClient} from 'obvio/obvio-client'
import React, {useState} from 'react'

export default function NewCardForm(props: {className?: string}) {
  const [showingForm, setShowingForm] = useState(false)
  const {setPaymentMethod} = usePaymentMethod()

  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const savePaymentMethod = useSavePaymentMethod()

  const handlePaymentMethod = (paymentMethodId: string) => {
    clearError()

    savePaymentMethod(paymentMethodId)
      .then(setPaymentMethod)
      .catch((e) => setError(e.message))
  }

  if (!showingForm) {
    return (
      <Button
        variant="contained"
        onClick={() => setShowingForm(true)}
        color="primary"
      >
        Add Card
      </Button>
    )
  }

  return (
    <>
      <ErrorAlert onClose={clearError}>{error}</ErrorAlert>
      <CreditCardForm
        className={props.className}
        submitLabel="Save Card"
        onSuccess={handlePaymentMethod}
      />
    </>
  )
}

function useSavePaymentMethod() {
  return (paymentMethodId: string) => {
    const url = api('/stripe/payment_method')

    return teamMemberClient.put<PaymentMethod>(url, {
      payment_method_id: paymentMethodId,
    })
  }
}
