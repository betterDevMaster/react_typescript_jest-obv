import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import {Plan} from 'obvio/Billing/plans'
import React from 'react'

/**
 * Min/Max number of credits a user can purchase
 * at a single time. This is only a frontend
 * limit, and not a real limitation.
 */
const MAX_NUM_CREDITS = 1000

export const MIN_NUM_CREDITS = 10

export default function CreditsSlider(props: {
  value: number
  onChange: (credits: number) => void
  plan: Plan
}) {
  const {plan} = props

  const marks = plan.creditPackages.map(({amount}) => ({
    value: amount,
    label: amount,
  }))

  return (
    <Slider
      min={MIN_NUM_CREDITS}
      max={MAX_NUM_CREDITS}
      value={props.value}
      marks={marks}
      step={10}
      valueLabelDisplay="off"
      onChange={handleChangeSlider(props.onChange)}
    />
  )
}
