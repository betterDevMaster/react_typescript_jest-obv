import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {NavButtonWithSize} from 'Dashboard/components/NavButton'
import {useEditMode, useUpdateDashboard} from 'Dashboard/edit/state/edit-mode'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import {v4 as uid} from 'uuid'

export default function NewMainNavButton() {
  const isEditMode = useEditMode()
  const buttons = useSelector(
    (state: RootState) => state.dashboardEditor.mainNavButtons,
  )
  const updateDashboard = useUpdateDashboard()

  if (!isEditMode || !buttons) {
    return null
  }

  const addButton = () => {
    const id = uid()
    const button: NavButtonWithSize = {
      text: 'Button',
      link: '',
      size: 12,
    }
    const entities = {
      ...buttons.entities,
      [id]: button,
    }
    const ids = [...buttons.ids, id]

    updateDashboard({
      mainNavButtons: {
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
