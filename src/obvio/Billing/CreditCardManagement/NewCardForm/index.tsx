import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import {PaymentMethod} from '@stripe/stripe-js'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {api} from 'lib/url'
import SaveCreditCardForm from 'lib/stripe/SaveCreditCardForm'
import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'
import {teamMemberClient} from 'obvio/obvio-client'
import React, {useState} from 'react'

type NewCardFormProps = {
  className?: string
}

export default function NewCardForm(props: NewCardFormProps) {
  const [showingForm, setShowingForm] = useState(false)

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

  return <Content {...props} />
}

function Content(props: NewCardFormProps) {
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

  return (
    <>
      <ErrorAlert onClose={clearError}>{error}</ErrorAlert>
      <SaveCreditCardForm
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

export function Loader() {
  return (
    <CircularProgress
      size={18}
      thickness={6}
      value={100}
      variant="indeterminate"
      color="primary"
    />
  )
}
