import styled from 'styled-components'
import React, {FormEvent, useEffect, useState} from 'react'
import {Elements} from '@stripe/react-stripe-js'
import {
  ConfirmCardSetupData,
  loadStripe,
  SetupIntent,
  StripeElementsOptions,
} from '@stripe/stripe-js'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import {colors} from 'lib/ui/theme'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {useToggle} from 'lib/toggle'
import {useCallback} from 'react'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {teamMemberClient} from 'obvio/obvio-client'
import CircularProgress from '@material-ui/core/CircularProgress'

const publicKey = process.env.REACT_APP_STRIPE_PK
const stripe = loadStripe(publicKey || '')

const options: StripeElementsOptions = {
  fonts: [
    {
      cssSrc:
        'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap',
    },
  ],
}

export type CreditCardFormProps = {
  onSuccess: (paymentMethodId: string) => void
  submitLabel: string
  className?: string
}

export default function CreditCardForm(props: CreditCardFormProps) {
  console.log('stripe: ', stripe)
  return (
    <Elements stripe={stripe} options={options}>
      <Content {...props} />
    </Elements>
  )
}

function Content(props: CreditCardFormProps) {
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const stripe = useStripe()
  const elements = useElements()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const {onSuccess} = props

  const cardElement = elements?.getElement(CardElement)

  const {paymentIntent, loading} = usePaymentIntent()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (processing) {
      return
    }

    toggleProcessing()

    if (!stripe || !elements || !paymentIntent?.client_secret) {
      return
    }

    if (!cardElement) {
      return
    }

    const data: ConfirmCardSetupData = {
      payment_method: {
        card: cardElement,
        billing_details: {
          name,
        },
      },
    }

    // Use your card Element with other Stripe.js APIs
    const {setupIntent, error} = await stripe.confirmCardSetup(
      paymentIntent.client_secret,
      data,
    )

    if (error) {
      setError(error.message || 'Payment error')
      toggleProcessing()
      return
    }

    if (!setupIntent?.payment_method) {
      setError(
        'Failed to add payment method, you will not be charged. Please contact support.',
      )

      toggleProcessing()
      return
    }

    onSuccess(setupIntent?.payment_method)
  }

  useEffect(() => {
    if (!error || !cardElement) {
      return
    }

    cardElement.focus()
  }, [error, cardElement])

  const canSubmit = Boolean(stripe) && !processing

  useEffect(() => {
    if (!cardElement) {
      return
    }

    cardElement?.update({
      disabled: !canSubmit,
    })
  }, [canSubmit, cardElement])

  if (loading || !paymentIntent) {
    return <Loader />
  }

  return (
    <Box className={props.className}>
      <CardForm onSubmit={handleSubmit}>
        <ErrorAlert>{error}</ErrorAlert>
        <TextField
          variant="outlined"
          placeholder="Name"
          fullWidth
          required
          value={name}
          onChange={onChangeStringHandler(setName)}
          disabled={!canSubmit}
        />

        <CardInputBox>
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontFamily: 'Rubik, sans-serif',
                  fontSize: '18px',
                  padding: '8px',
                  ':disabled': {
                    color: 'rgba(0, 0, 0, 0.36)',
                  },
                  '::placeholder': {
                    color: 'rgba(0, 0, 0, 0.36)',
                  },
                },
                invalid: {
                  color: colors.error,
                },
              },
            }}
          />
        </CardInputBox>
        <Box mt={2}>
          <Button
            type="submit"
            fullWidth
            disabled={!canSubmit}
            color="primary"
            variant="contained"
          >
            {props.submitLabel}
          </Button>
        </Box>
      </CardForm>
    </Box>
  )
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

const CardForm = styled.form`
  max-width: 400px;
`

const CardInputBox = styled.div`
  border: 1px solid transparent;
  .CardField-child {
    display: none;
  }

  .StripeElement {
    width: 100%;
    padding: 18.5px 14px;
    border: 1px solid rgba(0, 0, 0, 0.23);
    border-radius: 4px;

    &.StripeElement--focus {
      border-color: ${colors.primary};
      border-width: 2px;
      padding: 17.5px 13px;
    }

    &.StripeElement--invalid {
      border-color: ${colors.error};
      border-width: 2px;
      padding: 17.5px 13px;
    }
  }
`

function usePaymentIntent() {
  const request = useCallback(() => {
    const url = api('/stripe/payment_intent')

    return teamMemberClient.get<SetupIntent>(url)
  }, [])

  const {data: paymentIntent, ...res} = useAsync(request)

  return {paymentIntent, ...res}
}
