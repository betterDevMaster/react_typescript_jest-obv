import {ComponentType} from 'Dashboard/components'
import {useEditMode, useEditComponent} from 'Dashboard/edit/state/edit-mode'
import EditIconButton from 'lib/ui/IconButton/EditIconButton'
import React from 'react'
import styled from 'styled-components'

export const EDIT_COMPONENT_CLASS = 'edit-component'
export const EDIT_COMPONENT_BUTTON_CLASS = 'edit-component-button'

export default function EditComponent(props: {
  children: React.ReactElement
  type: ComponentType
  id?: string
}) {
  const isEditMode = useEditMode()
  const editComponent = useEditComponent({
    type: props.type,
    id: props.id,
  })

  if (!isEditMode) {
    return props.children
  }

  return (
    <Box className={EDIT_COMPONENT_CLASS}>
      <StyledEditIconButton
        onClick={editComponent}
        className={EDIT_COMPONENT_BUTTON_CLASS}
      />
      {props.children}
    </Box>
  )
}

const StyledEditIconButton = styled(EditIconButton)`
  position: absolute;
  z-index: 2;
  right: ${(props) => props.theme.spacing[1]};
  top: ${(props) => props.theme.spacing[1]};
  display: none;

  &:hover {
    opacity: 0.8;
  }
`

const Box = styled.div`
  position: relative;

  &:hover ${StyledEditIconButton} {
    display: inline-flex;
  }
`
