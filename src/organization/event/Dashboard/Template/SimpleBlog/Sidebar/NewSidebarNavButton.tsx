import Button from '@material-ui/core/Button'
import NavButton from 'organization/event/Dashboard/components/NavButton'
import {
  useDashboard,
  useUpdateDashboard,
} from 'organization/event/Dashboard/state/DashboardProvider'
import {useEditMode} from 'editor/state/edit-mode'
import React from 'react'
import {v4 as uid} from 'uuid'

export default function NewSidebarNavButton(props: {className?: string}) {
  const isEditMode = useEditMode()
  const {sidebarNav: buttons} = useDashboard()
  const updateDashboard = useUpdateDashboard()

  if (!isEditMode) {
    return null
  }

  const addButton = () => {
    const id = uid()
    const button: NavButton = {
      text: 'Button',
      link: '',
      rules: [],
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
