import TextField from '@material-ui/core/TextField'
import {
  useDashboard,
  useUpdateDashboard,
} from 'event/Dashboard/state/DashboardProvider'
import {SimpleBlog} from 'event/Dashboard/Template/SimpleBlog'
import {onChangeStringHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'

export default function SimpleBlogConfig() {
  const dashboard = useDashboard()
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
