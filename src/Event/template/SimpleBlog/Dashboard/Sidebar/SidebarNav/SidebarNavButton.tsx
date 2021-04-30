import React from 'react'
import styled from 'styled-components'
import NavButton from 'Event/Dashboard/components/NavButton'
import {SIDEBAR_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable} from 'react-beautiful-dnd'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default React.memo((props: NavButton & {id: string; index: number}) => {
  const isEditMode = useEditMode()

  const button = (
    <Published component={props}>
      <StyledNavButtonComponent
        aria-label="sidebar nav button"
        textColor="#FFFFFF"
        borderWidth={1}
        borderColor="#FFFFFF"
        {...props}
      />
    </Published>
  )

  if (!isEditMode) {
    return button
  }

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <DraggableOverlay>
            <EditComponent
              component={{
                type: SIDEBAR_NAV_BUTTON,
                id: props.id,
              }}
            >
              <>
                <DragHandle handleProps={provided.dragHandleProps} />
                {button}
              </>
            </EditComponent>
          </DraggableOverlay>
        </div>
      )}
    </Draggable>
  )
})

const StyledNavButtonComponent = styled(NavButton)`
  font-size: 14px;
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  margin: ${(props) => props.theme.spacing[3]} 0;
`
