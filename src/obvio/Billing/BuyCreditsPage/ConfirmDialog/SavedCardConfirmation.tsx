import MuiButton from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {formatPrice} from 'lib/currency'
import {useToggle} from 'lib/toggle'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {ConfirmationProps} from 'obvio/Billing/BuyCreditsPage/ConfirmDialog'
import {Loader} from 'obvio/Billing/CreditCardManagement/NewCardForm'
import {usePurchaseCredits} from 'obvio/Billing/purchase-credits'
import React, {useState} from 'react'
import CustomButton from 'lib/ui/Button/CustomButton'

type SavedCardConfirmationProps = ConfirmationProps & {
  onUseOtherCard: () => void
}

export function SavedCardConfirmation(props: SavedCardConfirmationProps) {
  return (
    <>
      <DialogTitle>Are you sure?</DialogTitle>
      <Content {...props} />
    </>
  )
}

function Content(props: SavedCardConfirmationProps) {
  const {onUseOtherCard, paymentMethod, price, onSuccess, numCredits} = props
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

  const purchaseWithSavedCard = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    purchaseCredits({numCredits, paymentMethodId: paymentMethod.id})
      .then(onSuccess)
      .catch(toggleProcessing)
      .catch((e) => setError(e.message))
  }

  return (
    <>
      <DialogContent>
        <ErrorAlert onClose={clearError}>{error}</ErrorAlert>
        <DialogContentText>
          You're about to purchase {props.numCredits} credits for $
          {formatPrice(price)} on the {card?.brand} on file ending in{' '}
          {card?.last4}.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={props.onClose} disabled={processing}>
          Cancel
        </MuiButton>
        <MuiButton
          color="primary"
          variant="contained"
          onClick={purchaseWithSavedCard}
          autoFocus
          aria-label="confirm purchase"
          disabled={!canPurchase}
        >
          Buy Credits
        </MuiButton>
      </DialogActions>
      <DialogActions>
        <CustomButton
          variant="text"
          onClick={onUseOtherCard}
          aria-label="use a different card"
          disabled={processing}
        >
          Use a Different Card
        </CustomButton>
      </DialogActions>
    </>
  )
}
