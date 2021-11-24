import React from 'react'
import styled from 'styled-components'
import SidebarContainer from 'Event/template/Cards/Dashboard/Sidebar/SidebarContainer'
import {useEvent} from 'Event/EventProvider'
import {useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import SidebarItem from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import AddSidebarItemButton from 'Event/template/Cards/Dashboard/Sidebar/AddSidebarItemButton'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function Sidebar() {
  const {sidebarItems} = useCardsTemplate()
  const isEditMode = useEditMode()

  const items = sidebarItems.ids.map((id, index) => {
    const item = sidebarItems.entities[id]
    return <SidebarItem key={id} {...item} index={index} id={id} />
  })

  if (isEditMode) {
    return <DraggableList>{items}</DraggableList>
  }

  return (
    <SidebarContainer>
      <GylsPlayer />
      {items}
    </SidebarContainer>
  )
}

function DraggableList(props: {children: React.ReactElement[]}) {
  const handleDrag = useHandleDrag()

  return (
    <SidebarContainer>
      <GylsPlayer />
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

/**
 * TEMP - hardcode player for gyls event
 * @returns
 */
function GylsPlayer() {
  const {event} = useEvent()

  const isTargetEvent = event.slug === 'gyls'
  if (!isTargetEvent) {
    return null
  }

  return (
    <GylsPlayerBox>
      <p
        style={{
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '15px',
          textAlign: 'center',
          paddingTop: '10px',
        }}
      >
        JOIN AUDIO - Click the Play button below every day before you join the
        Main Stage! This is important so you can hear us during the breakout
        sessions. Please wait for full instructions given on Day 1.
      </p>
      <iframe
        title="gyls player iframe"
        src="https://mixlr.com/users/8574169/embed?autoplay=true"
        width="100%"
        height="150px"
        scrolling="no"
        frameBorder="no"
        marginHeight={0}
        marginWidth={0}
      ></iframe>
    </GylsPlayerBox>
  )
}

const GylsPlayerBox = styled.div`
  margin: 50px 0;
`
