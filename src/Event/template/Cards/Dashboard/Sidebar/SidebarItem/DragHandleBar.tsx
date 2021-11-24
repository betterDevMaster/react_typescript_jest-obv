import React from 'react'
import styled from 'styled-components'
import {DraggableProvidedDragHandleProps} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useCardsTemplate} from 'Event/template/Cards'

export default function DragHandleBar(props: {
  handleProps?: DraggableProvidedDragHandleProps
}) {
  const isEditMode = useEditMode()
  const {sidebar} = useCardsTemplate()
  if (!isEditMode) {
    return null
  }

  return (
    <Box>
      <Handle {...props.handleProps}>
        <Bar color={sidebar.textColor} />
        <Bar color={sidebar.textColor} />
      </Handle>
    </Box>
  )
}

const Box = styled.div`
  padding: ${(props) => props.theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
`

const Handle = styled.div`
  &:hover {
    opacity: 0.8;
  }
`

const Bar = styled.div<{
  color: string
}>`
  width: 20px;
  background: ${(props) => props.color};
  border-radius: 4px;
  height: 2px;
  margin: 4px 0;
`
