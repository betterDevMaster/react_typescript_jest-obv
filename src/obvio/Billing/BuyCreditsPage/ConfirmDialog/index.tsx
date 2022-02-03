import React from 'react'
import Dialog from 'lib/ui/Dialog'
import {SavedCardConfirmation} from 'obvio/Billing/BuyCreditsPage/ConfirmDialog/SavedCardConfirmation'
import {PaymentMethod} from '@stripe/stripe-js'
import {useToggle} from 'lib/toggle'
import {OtherCardForm} from 'obvio/Billing/BuyCreditsPage/ConfirmDialog/OtherCardForm'

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
  const {showing: _, ...confirmationProps} = props

  return (
    <Dialog open={props.showing} onClose={props.onClose}>
      <Content {...confirmationProps} />
    </Dialog>
  )
}

function Content(props: ConfirmationProps) {
  const {flag: showingOtherCardForm, toggle: toggleOtherCardForm} = useToggle()

  if (showingOtherCardForm) {
    return <OtherCardForm {...props} onCancel={toggleOtherCardForm} />
  }

  return (
    <SavedCardConfirmation {...props} onUseOtherCard={toggleOtherCardForm} />
  )
}
