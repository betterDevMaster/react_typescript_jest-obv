import TextField from '@material-ui/core/TextField'
import {setDashboard} from 'Dashboard/edit/state/actions'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export default function WelcomeTextConfig() {
  const dispatch = useDispatch()
  const value = useSelector(
    (state: RootState) => state.dashboardEditor.welcomeText,
  )

  const update = (newVal: string) => {
    dispatch(
      setDashboard({
        welcomeText: newVal,
      }),
    )
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
