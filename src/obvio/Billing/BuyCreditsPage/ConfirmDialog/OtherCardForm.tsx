import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {ConfirmationProps} from 'obvio/Billing/BuyCreditsPage/ConfirmDialog'
import React, {useCallback, useState} from 'react'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {PaymentIntent} from '@stripe/stripe-js'
import {teamMemberClient} from 'obvio/obvio-client'
import {Loader} from 'obvio/Billing/CreditCardManagement/NewCardForm'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {usePurchaseCredits} from 'obvio/Billing/purchase-credits'
import {useToggle} from 'lib/toggle'
import SingleUseCreditCardForm from 'lib/stripe/SingleUseCreditCardForm'

type OtherCardFormProps = ConfirmationProps & {
  onCancel: () => void
}

export function OtherCardForm(props: OtherCardFormProps) {
  return (
    <>
      <DialogTitle id="alert-dialog-title">
        Pay with different card!
      </DialogTitle>
      <Content {...props} />
    </>
  )
}

function Content(props: OtherCardFormProps) {
  const {onCancel, numCredits, onSuccess} = props
  const [error, setError] = useState<string | null>(null)
  const clearError = () => setError(null)
  const paymentIntent = usePaymentIntent(numCredits)
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const purchaseCredits = usePurchaseCredits()

  const paymentIntentId = paymentIntent?.id
  if (!paymentIntentId) {
    return (
      <DialogContent>
        <Loader />
      </DialogContent>
    )
  }

  const purchase = (paymentMethodId: string) => {
    if (processing) {
      return
    }

    toggleProcessing()

    purchaseCredits({
      numCredits,
      paymentIntentId,
      paymentMethodId,
    })
      .then(onSuccess)
      .catch(toggleProcessing)
      .catch((e) => setError(e.message))
  }

  return (
    <>
      <StyledDialogContent>
        <ErrorAlert onClose={clearError}>{error}</ErrorAlert>
        <SingleUseCreditCardForm
          submitLabel="Buy Credits"
          onSuccess={purchase}
        />
      </StyledDialogContent>
      <StyledDialogActions>
        <Button
          onClick={onCancel}
          aria-label="cancel different card"
          fullWidth
          disabled={processing}
        >
          Cancel
        </Button>
      </StyledDialogActions>
    </>
  )
}

function usePaymentIntent(numCredits: number) {
  const request = useCallback(() => {
    const url = api('/stripe/payment_intent')

    return teamMemberClient.post<PaymentIntent>(url, {
      num_credits: numCredits,
    })
  }, [numCredits])

  const {data} = useAsync(request)

  return data
}

const StyledDialogContent = styled(DialogContent)`
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    min-width: 450px;
  }
`

const StyledDialogActions = styled(DialogActions)`
  padding: ${(props) =>
    `0 ${props.theme.spacing[6]} ${props.theme.spacing[2]}`};
`
