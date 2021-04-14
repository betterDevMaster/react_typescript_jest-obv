import {
  useEditMode,
  useEditComponent,
} from 'Event/Dashboard/editor/state/edit-mode'
import {ComponentConfig} from 'Event/Dashboard/editor/views/DashboardEditDialog/ComponentConfig'
import EditIconButton from 'lib/ui/IconButton/EditIconButton'
import React from 'react'
import styled from 'styled-components'

export const EDIT_COMPONENT_CLASS = 'edit-component'
export const EDIT_COMPONENT_BUTTON_CLASS = 'edit-component-button'

export default function EditComponent(
  props: {component: ComponentConfig} & {children: React.ReactElement},
) {
  const isEditMode = useEditMode()

  const editComponent = useEditComponent(props.component)
  if (!isEditMode) {
    return props.children
  }

  return (
    <EditComponentOverlay onClick={editComponent}>
      {props.children}
    </EditComponentOverlay>
  )
}

export function EditComponentOverlay(props: {
  onClick: () => void
  children: React.ReactElement
  disableChildInteraction?: boolean
}) {
  return (
    <Box className={EDIT_COMPONENT_CLASS}>
      <InteractionOverlay disable={props.disableChildInteraction} />
      <StyledEditIconButton
        onClick={props.onClick}
        className={EDIT_COMPONENT_BUTTON_CLASS}
        type="button"
        aria-label="edit component"
      />
      {props.children}
    </Box>
  )
}

const InteractionOverlay = styled.div<{disable?: boolean}>`
  display: ${(props) => (props.disable ? 'block' : 'none')};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`

const StyledEditIconButton = styled(EditIconButton)`
  position: absolute;
  z-index: 3;
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
