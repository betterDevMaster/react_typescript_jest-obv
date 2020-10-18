import Button from '@material-ui/core/Button'
import NavButton from 'Dashboard/components/NavButton'
import {useEditMode, useUpdateDashboard} from 'Dashboard/edit/state/edit-mode'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import {v4 as uid} from 'uuid'

export default function NewSidebarNavButton(props: {className?: string}) {
  const isEditMode = useEditMode()
  const buttons = useSelector(
    (state: RootState) => state.dashboardEditor.sidebarNav,
  )
  const updateDashboard = useUpdateDashboard()

  if (!isEditMode || !buttons) {
    return null
  }

  const addButton = () => {
    const id = uid()
    const button: NavButton = {
      text: 'Button',
      link: '',
    }
    const entities = {
      ...buttons.entities,
      [id]: button,
    }
    const ids = [...buttons.ids, id]

    updateDashboard({
      sidebarNav: {
        entities,
        ids,
      },
    })
  }
  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add sidebar nav button"
      onClick={addButton}
      className={props.className}
    >
      New Button
    </Button>
  )
}
