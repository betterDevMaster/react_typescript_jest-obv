import Button, {ButtonProps} from '@material-ui/core/Button'
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
  const {paymentMethod} = usePaymentMethod()

  const label = paymentMethod ? 'Change Card' : 'Add Card'
  const buttonVariant: ButtonProps['variant'] = paymentMethod
    ? 'outlined'
    : 'contained'

  if (!showingForm) {
    return (
      <Button
        variant={buttonVariant}
        onClick={() => setShowingForm(true)}
        color="primary"
      >
        {label}
      </Button>
    )
  }

  return <Content {...props} onComplete={() => setShowingForm(false)} />
}

function Content(props: NewCardFormProps & {onComplete: () => void}) {
  const {setPaymentMethod} = usePaymentMethod()
  const [error, setError] = useState<string | null>(null)
  const clearError = () => setError(null)
  const savePaymentMethod = useSavePaymentMethod()
  const {onComplete} = props

  const handlePaymentMethod = (paymentMethodId: string) => {
    clearError()

    savePaymentMethod(paymentMethodId)
      .then((paymentMethod) => {
        setPaymentMethod(paymentMethod)
        onComplete()
      })
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
