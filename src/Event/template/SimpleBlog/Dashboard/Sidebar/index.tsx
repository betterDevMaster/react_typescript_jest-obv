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

export default function Sidebar() {
  const {sidebarItems} = useSimpleBlogTemplate()

  const isEditMode = useEditMode()

  const items = sidebarItems.ids.map((id, index) => {
    const item = sidebarItems.entities[id]
    return <SidebarItem id={id} key={id} {...item} index={index} />
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

    const moved = Array.from(sidebarItems.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    update({
      sidebarItems: {
        ids: moved,
      },
    })
  }
}
