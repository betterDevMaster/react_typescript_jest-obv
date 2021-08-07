import React from 'react'
import styled from 'styled-components'
import SidebarContainer from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {useEvent} from 'Event/EventProvider'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import SidebarItem from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import AddSidebarItemButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/AddSidebarItemButton'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function Sidebar() {
  const {
    template: {sidebarItems},
  } = useSimpleBlog()

  const isEditMode = useEditMode()

  const handleDrag = useHandleDrag()

  if (!isEditMode) {
    return (
      <SidebarContainer>
        <GylsPlayer />
        {sidebarItems.map((item, index) => (
          <SidebarItem key={item.id} {...item} index={index} />
        ))}
      </SidebarContainer>
    )
  }

  return (
    <SidebarContainer>
      <GylsPlayer />
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="sidebar_item">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sidebarItems.map((item, index) => (
                <SidebarItem key={item.id} {...item} index={index} />
              ))}
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
  const {
    template: {sidebarItems},
  } = useSimpleBlog()
  const update = useDispatchUpdate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(sidebarItems)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    update({
      sidebarItems: moved,
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
