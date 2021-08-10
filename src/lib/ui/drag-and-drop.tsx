import styled from 'styled-components'
import React from 'react'
import {DraggableProvidedDragHandleProps} from 'react-beautiful-dnd'
import DragHandleIcon from '@material-ui/icons/DragHandle'

export function DragHandle(props: {
  handleProps?: DraggableProvidedDragHandleProps
  className?: string
}) {
  return (
    <DragHandleBox
      {...props.handleProps}
      aria-label="button drag handle"
      className={props.className}
    >
      <DragHandleIcon />
    </DragHandleBox>
  )
}

const DragHandleBox = styled.div`
  position: absolute;
  top: ${(props) => props.theme.spacing[1]};
  right: ${(props) => props.theme.spacing[10]};
  z-index: 2;
  background: #ffffff;
  display: none;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }

  svg {
    color: ${(props) => props.theme.colors.primary};
  }
`

/**
 * Handle the show drag handle on hover
 */

export const DraggableOverlay = styled.div`
  position: relative;

  &:hover ${DragHandleBox} {
    display: inline-flex;
  }
`
