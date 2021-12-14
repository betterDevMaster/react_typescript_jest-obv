import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import {PlanInfo} from 'obvio/Billing/plans'
import React from 'react'

/**
 * Min/Max number of credits a user can purchase
 * at a single time. This is only a frontend
 * limit, and not a real limitation.
 */
export const MAX_NUM_CREDITS = 100000

const MAX_NUM_CREDITS_SLIDER = 1000

export const MIN_NUM_CREDITS = 10

export default function CreditsSlider(props: {
  value: number
  onChange: (credits: number) => void
  plan: PlanInfo
}) {
  const {plan} = props

  const marks = plan.creditPackages.map(({amount}) => ({
    value: amount,
    label: amount,
  }))

  return (
    <Slider
      min={MIN_NUM_CREDITS}
      max={MAX_NUM_CREDITS_SLIDER}
      value={props.value}
      marks={marks}
      step={10}
      valueLabelDisplay="off"
      onChange={handleChangeSlider(props.onChange)}
    />
  )
}
