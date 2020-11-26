import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {
  useDashboard,
  useUpdateDashboard,
} from 'Event/Dashboard/state/DashboardProvider'
import React from 'react'
import {v4 as uid} from 'uuid'

export default function NewMainNavButton() {
  const {mainNav: buttons} = useDashboard()
  const updateDashboard = useUpdateDashboard()

  if (!buttons) {
    return null
  }

  const addButton = () => {
    const id = uid()
    const button: NavButtonWithSize = {
      text: 'Button',
      link: '',
      size: 12,
      rules: [],
    }
    const entities = {
      ...buttons.entities,
      [id]: button,
    }
    const ids = [...buttons.ids, id]

    updateDashboard({
      mainNav: {
        entities,
        ids,
      },
    })
  }
  return (
    <Grid item xs={12}>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        color="primary"
        aria-label="add main nav button"
        onClick={addButton}
      >
        New Button
      </Button>
    </Grid>
  )
}
