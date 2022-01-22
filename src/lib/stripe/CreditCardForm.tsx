import styled from 'styled-components'
import React, {FormEvent, useEffect, useState} from 'react'
import {Elements} from '@stripe/react-stripe-js'
import {
  loadStripe,
  Stripe,
  StripeCardElement,
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

export type CreditCardFormBaseProps = {
  submitLabel: string
  className?: string
}

export type CreditCardFormResult = {
  cardElement: StripeCardElement
  name: string
  stripe: Stripe
}

export type CreditCardFormProps = CreditCardFormBaseProps & {
  onSubmit: (result: CreditCardFormResult) => Promise<void>
}

export default function CreditCardForm(props: CreditCardFormProps) {
  return (
    <Elements stripe={stripe} options={options}>
      <Content {...props} />
    </Elements>
  )
}

function Content(props: CreditCardFormProps) {
  const {onSubmit} = props
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const stripe = useStripe()
  const elements = useElements()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const cardElement = elements?.getElement(CardElement)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (processing) {
      return
    }

    toggleProcessing()

    if (!stripe || !elements) {
      return
    }

    if (!cardElement) {
      return
    }

    onSubmit({cardElement, stripe, name}).catch((error) => {
      setError(error.message)
      toggleProcessing()
    })
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
