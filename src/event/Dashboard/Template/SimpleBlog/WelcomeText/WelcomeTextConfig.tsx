import TextField from '@material-ui/core/TextField'
import {
  useDashboard,
  useUpdateDashboard,
} from 'event/Dashboard/state/DashboardProvider'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'

export default function WelcomeTextConfig() {
  const {welcomeText: value} = useDashboard()
  const updateDashboard = useUpdateDashboard()

  const update = (newVal: string) => {
    updateDashboard({
      welcomeText: newVal,
    })
  }
  return (
    <>
      <TextField
        value={value}
        onChange={onChangeStringHandler(update)}
        fullWidth
        label="Text"
        inputProps={{
          'aria-label': 'edit welcome text',
        }}
      />
    </>
  )
}
