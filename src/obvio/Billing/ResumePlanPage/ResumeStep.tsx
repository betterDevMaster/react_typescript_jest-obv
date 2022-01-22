import React, {FormEvent} from 'react'
import {PlanInfo} from 'obvio/Billing/plans'
import SuccessDialog from 'lib/ui/Dialog/SuccessDialog'
import Button from '@material-ui/core/Button'
import {obvioRoutes} from 'obvio/Routes'
import {useHistory} from 'react-router-dom'
import {usePlan} from 'obvio/Billing/PlanProvider'
import {useResume} from 'obvio/Billing/subscribe'
import {useToggle} from 'lib/toggle'

export default function ResumeStep(props: {
  plan: PlanInfo
  onError: (error: string) => void
}) {
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const {plan, onError} = props
  const resume = useResume()
  const {flag: showingSuccess, toggle: toggleSuccessDialog} = useToggle()
  const {isCurrent} = usePlan()
  const history = useHistory()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (processing) {
      return
    }

    toggleProcessing()

    resume(plan)
      .then(toggleSuccessDialog)
      .catch((error) => {
        onError(error.message)
        toggleProcessing()
      })
  }
  const canSubmit = !processing && isCurrent(plan)

  const handleSuccess = () => {
    history.push(obvioRoutes.billing.root)
  }

  return (
    <>
      <SuccessDialog showing={showingSuccess} onClose={handleSuccess}>
        Plan Resumed!
      </SuccessDialog>
      <Button
        type="submit"
        fullWidth
        disabled={!canSubmit}
        variant="contained"
        onClick={handleSubmit}
        color="primary"
      >
        Resume Subscription
      </Button>
    </>
  )
}
