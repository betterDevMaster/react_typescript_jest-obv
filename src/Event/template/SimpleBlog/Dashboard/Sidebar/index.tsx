import React from 'react'
import SidebarContainer from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import SidebarItem from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import AddSidebarItemButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/AddSidebarItemButton'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {createPositions, orderedIdsByPosition} from 'lib/list'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'

export default function Sidebar() {
  const {sidebarItems} = useSimpleBlogTemplate()

  const isEditMode = useEditMode()

  const ids = orderedIdsByPosition(sidebarItems)
  const items = ids.map((id, index) => {
    const props = sidebarItems[id]

    return (
      <VisibleOnMatch rules={props.rules} key={id}>
        <SidebarItem {...props} index={index} id={id} />
      </VisibleOnMatch>
    )
  })

  if (!isEditMode) {
    return <SidebarContainer>{items}</SidebarContainer>
  }

  return <DraggableList>{items}</DraggableList>
}

function DraggableList(props: {children: React.ReactElement[]}) {
  const handleDrag = useHandleDrag()

  return (
    <SidebarContainer>
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="sidebar_item">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {props.children}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <AddSidebarItemButton />
    </SidebarContainer>
  )
}

function useHandleDrag() {
  const {sidebarItems} = useSimpleBlogTemplate()
  const update = useSimpleBlogUpdate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const ids = orderedIdsByPosition(sidebarItems)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    update({
      sidebarItems: createPositions(ids),
    })
  }
}
