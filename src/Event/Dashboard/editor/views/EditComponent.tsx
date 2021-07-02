import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditIconButton from 'lib/ui/IconButton/EditIconButton'
import React from 'react'
import styled from 'styled-components'

export const EDIT_COMPONENT_CLASS = 'edit-component'
export const EDIT_COMPONENT_BUTTON_CLASS = 'edit-component-button'

/**
 * A more generic version of EditComponent where handling the edit/config
 * dialog rendering is handled by the parent.
 *
 * @param props
 * @returns
 */
export function Editable(props: {
  children: React.ReactElement
  onEdit: () => void
}) {
  const isEditMode = useEditMode()
  if (!isEditMode) {
    return props.children
  }

  return (
    <EditComponentOverlay onClick={props.onEdit}>
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
