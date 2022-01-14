import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditIconButton from 'lib/ui/IconButton/EditIconButton'
import CopyIconButton from 'lib/ui/IconButton/DuplicateIconButton'
import React from 'react'
import styled from 'styled-components'

export const EDIT_COMPONENT_CLASS = 'edit-component'
export const EDIT_COMPONENT_BUTTON_CLASS = 'edit-component-button'

export const DUPLICATE_COMPONENT_CLASS = 'duplicate-component'
export const DUPLICATE_COMPONENT_BUTTON_CLASS = 'duplicate-component-button'

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
  onCopy?: () => void
  className?: string
  ['aria-label']?: string
}) {
  const isEditMode = useEditMode()
  if (!isEditMode) {
    return props.children
  }

  return (
    <EditComponentOverlay
      onClick={props.onEdit}
      onCopy={props.onCopy}
      className={props.className}
      aria-label={props['aria-label']}
    >
      {props.children}
    </EditComponentOverlay>
  )
}

export function EditComponentOverlay(props: {
  onClick: () => void
  onCopy?: () => void
  children: React.ReactElement
  disableChildInteraction?: boolean
  className?: string
  ['aria-label']?: string
}) {
  const className = `${EDIT_COMPONENT_CLASS} ${props.className}`
  const label = props['aria-label'] ?? 'edit component'

  return (
    <Box className={className}>
      <InteractionOverlay disable={props.disableChildInteraction} />
      <StyledCopyIconButton
        onClick={props.onCopy}
        className={DUPLICATE_COMPONENT_BUTTON_CLASS}
        showing={Boolean(props.onCopy)}
        type="button"
        aria-label="duplicate component"
      />
      <StyledEditIconButton
        onClick={props.onClick}
        className={EDIT_COMPONENT_BUTTON_CLASS}
        type="button"
        aria-label={label}
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

const StyledCopyIconButton = styled(CopyIconButton)`
  position: absolute;
  z-index: 4;
  right: ${(props) => props.theme.spacing[19]};
  top: ${(props) => props.theme.spacing[1]};
  display: none;

  &:hover {
    opacity: 0.8;
  }
`

const Box = styled.div`
  position: relative;

  &:hover > ${StyledEditIconButton} {
    display: inline-flex;
  }
  &:hover > ${StyledCopyIconButton} {
    display: inline-flex;
  }
`
