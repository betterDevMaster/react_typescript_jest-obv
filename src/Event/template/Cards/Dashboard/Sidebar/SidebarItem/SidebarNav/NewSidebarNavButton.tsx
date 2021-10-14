import Button from '@material-ui/core/Button'
import NavButton from 'Event/Dashboard/components/NavButton'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import React from 'react'
import {v4 as uid} from 'uuid'
import {SidebarNavProps} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/SidebarNav'
import {useUpdateSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'

export default function NewSidebarNavButton(props: {
  className?: string
  nav: SidebarNavProps
}) {
  const isEditMode = useEditMode()
  const {nav} = props
  const updateItem = useUpdateSidebarItem()

  if (!isEditMode) {
    return null
  }

  const addButton = () => {
    const id = uid()
    const button: NavButton = {
      text: 'Button',
      link: '',
      rules: [],
      isAreaButton: false,
      areaId: null,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
      isImageUpload: false,
      mailchimpTag: null,
    }
    const entities = {
      ...nav.entities,
      [id]: button,
    }
    const ids = [...nav.ids, id]

    updateItem({
      ...nav,
      entities,
      ids,
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
