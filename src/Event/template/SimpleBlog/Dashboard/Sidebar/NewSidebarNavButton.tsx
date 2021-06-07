import Button from '@material-ui/core/Button'
import NavButton from 'Event/Dashboard/components/NavButton'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import React from 'react'
import {v4 as uid} from 'uuid'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export default function NewSidebarNavButton(props: {className?: string}) {
  const isEditMode = useEditMode()
  const {template} = useSimpleBlog()
  const {sidebarNav: buttons} = template
  const updateTemplate = useDispatchUpdate()

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
    }
    const entities = {
      ...buttons.entities,
      [id]: button,
    }
    const ids = [...buttons.ids, id]

    updateTemplate({
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
