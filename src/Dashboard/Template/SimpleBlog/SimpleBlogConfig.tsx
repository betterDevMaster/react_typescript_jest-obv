import TextField from '@material-ui/core/TextField'
import {setDashboard} from 'Dashboard/edit/state/actions'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import {onChangeStringHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export default function SimpleBlogConfig() {
  const dispatch = useDispatch()
  const dashboard = useSelector((state: RootState) => state.dashboardEditor)

  const update = <T extends keyof SimpleBlog>(key: T) => (
    value: SimpleBlog[T],
  ) => {
    dispatch(
      setDashboard({
        [key]: value,
      }),
    )
  }

  return (
    <>
      <TextField
        value={dashboard.logo}
        label="Logo URL"
        fullWidth
        onChange={onChangeStringHandler(update('logo'))}
        inputProps={{
          'aria-label': 'edit logo',
        }}
      />
      <ColorPicker
        label="Primary Color"
        color={dashboard.primaryColor}
        onPick={update('primaryColor')}
      />
    </>
  )
}
