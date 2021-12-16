import React, {useState} from 'react'
import Dialog from 'lib/ui/Dialog'
import MuiButton from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useToggle} from 'lib/toggle'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {PaymentMethod} from '@stripe/stripe-js'
import {Loader} from 'obvio/Billing/CreditCardManagement/NewCardForm'
import {usePurchaseCredits} from 'organization/PaymentMethodProvider'
import {confirmationText} from 'obvio/Billing/BuyCreditsPage/ConfirmDialog/SavedCardConfirmation'

export type ConfirmationProps = {
  numCredits: number
  onClose: () => void
  paymentMethod: PaymentMethod
  price: number | null
  onSuccess: () => void
}

export default function ConfirmDialog(
  props: ConfirmationProps & {
    showing: boolean
    onClose: () => void
  },
) {
  return (
    <Dialog open={props.showing} onClose={props.onClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <Content {...props} />
    </Dialog>
  )
}

function Content(props: ConfirmationProps) {
  const {price, numCredits, paymentMethod, onSuccess} = props
  const {card} = paymentMethod
  const purchaseCredits = usePurchaseCredits()
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const [error, setError] = useState<string | null>(null)
  const clearError = () => setError(null)
  const canPurchase = !processing && Boolean(price)

  if (!price) {
    return (
      <DialogContent>
        <Loader />
      </DialogContent>
    )
  }

  const purchase = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    purchaseCredits(numCredits, paymentMethod)
      .then(onSuccess)
      .catch(toggleProcessing)
      .catch((e) => setError(e.message))
  }

  return (
    <>
      <DialogContent>
        <ErrorAlert onClose={clearError}>{error}</ErrorAlert>
        <DialogContentText>
          {confirmationText(numCredits, price, card)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={props.onClose} disabled={processing}>
          Cancel
        </MuiButton>
        <MuiButton
          color="primary"
          variant="contained"
          onClick={purchase}
          autoFocus
          aria-label="confirm purchase"
          disabled={!canPurchase}
        >
          Buy Credits
        </MuiButton>
      </DialogActions>
    </>
  )
}
