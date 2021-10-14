import Button from '@material-ui/core/Button'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import AddSidebarItemConfig from 'Event/template/Cards/Dashboard/Sidebar/AddSidebarItemButton/AddSidebarItemConfig'
import {useToggle} from 'lib/toggle'
import React from 'react'

export default function AddSidebarItemButton() {
  const {flag: showingConfig, toggle: toggleConfig} = useToggle()
  const isEditMode = useEditMode()
  if (!isEditMode) {
    return null
  }

  return (
    <>
      <AddSidebarItemConfig showing={showingConfig} onClose={toggleConfig} />
      <Button
        onClick={toggleConfig}
        fullWidth
        variant="contained"
        color="secondary"
        aria-label="add a sidebar item"
        size="large"
      >
        Add Item
      </Button>
    </>
  )
}
