import TextField from '@material-ui/core/TextField'
import {
  useDashboard,
  useUpdateDashboard,
} from 'Event/Dashboard/state/DashboardProvider'
import {WELCOME_TEXT} from 'Event/Dashboard/Template/SimpleBlog/WelcomeText'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'

export type WelcomeTextConfig = {
  type: typeof WELCOME_TEXT
}

export function WelcomeTextConfig() {
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
