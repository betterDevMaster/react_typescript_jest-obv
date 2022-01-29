import React from 'react'
import SidebarContainer from 'Event/template/Cards/Dashboard/Sidebar/SidebarContainer'
import {useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import SidebarItem from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import AddSidebarItemButton from 'Event/template/Cards/Dashboard/Sidebar/AddSidebarItemButton'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {createPositions, orderedIdsByPosition} from 'lib/list'

export default function Sidebar() {
  const {sidebarItems} = useCardsTemplate()
  const isEditMode = useEditMode()

  const ids = orderedIdsByPosition(sidebarItems)

  const items = ids.map((id, index) => {
    const props = sidebarItems[id]

    return <SidebarItem key={id} {...props} index={index} id={id} />
  })

  if (isEditMode) {
    return <DraggableList>{items}</DraggableList>
  }

  return <SidebarContainer>{items}</SidebarContainer>
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
  const {sidebarItems} = useCardsTemplate()
  const update = useCardsUpdate()

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
