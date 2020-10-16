import TextField from '@material-ui/core/TextField'
import {useUpdateDashboard} from 'Dashboard/edit/state/edit-mode'
import {onChangeHandler} from 'lib/dom'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

export default function WelcomeTextConfig() {
  const value = useSelector(
    (state: RootState) => state.dashboardEditor.welcomeText,
  )
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
        onChange={onChangeHandler(update)}
        fullWidth
        label="Text"
        inputProps={{
          'aria-label': 'edit welcome text',
        }}
      />
    </>
  )
}
