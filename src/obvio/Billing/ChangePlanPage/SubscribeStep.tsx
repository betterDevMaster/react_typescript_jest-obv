import React, {FormEvent} from 'react'
import {PlanName} from 'obvio/Billing/plans'
import {PaymentMethod} from '@stripe/stripe-js'
import SuccessDialog from 'lib/ui/Dialog/SuccessDialog'
import Button from '@material-ui/core/Button'
import {obvioRoutes} from 'obvio/Routes'
import {useHistory} from 'react-router-dom'
import {usePlan} from 'obvio/Billing/PlanProvider'
import {useSubscribe} from 'obvio/Billing/subscribe'
import {useToggle} from 'lib/toggle'

export default function SubscribeStep(props: {
  plan: PlanName
  paymentMethod: PaymentMethod
  onError: (error: string) => void
}) {
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const {plan, paymentMethod, onError} = props
  const subscribe = useSubscribe()
  const {flag: showingSuccess, toggle: toggleSuccessDialog} = useToggle()
  const {isCurrent} = usePlan()
  const history = useHistory()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (processing) {
      return
    }

    toggleProcessing()

    subscribe(plan, paymentMethod)
      .then(toggleSuccessDialog)
      .catch((error) => {
        onError(error.message)
        toggleProcessing()
      })
  }
  const canSubmit = !processing && !isCurrent(plan)

  const handleSuccess = () => {
    history.push(obvioRoutes.billing.root)
  }

  return (
    <>
      <SuccessDialog showing={showingSuccess} onClose={handleSuccess}>
        Plan Upgraded!
      </SuccessDialog>
      <Button
        type="submit"
        fullWidth
        disabled={!canSubmit}
        color="primary"
        variant="contained"
        onClick={handleSubmit}
      >
        Subscribe
      </Button>
    </>
  )
}
