import TextField from '@material-ui/core/TextField'
import {useUpdateDashboard} from 'Dashboard/edit/state/edit-mode'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import {onChangeStringHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

export default function SimpleBlogConfig() {
  const dashboard = useSelector((state: RootState) => state.dashboardEditor)
  const updateDashboard = useUpdateDashboard()

  const update = <T extends keyof SimpleBlog>(key: T) => (
    value: SimpleBlog[T],
  ) => {
    updateDashboard({
      [key]: value,
    })
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
