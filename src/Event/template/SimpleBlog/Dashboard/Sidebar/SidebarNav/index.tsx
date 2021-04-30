import React from 'react'
import styled from 'styled-components'
import SidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav/SidebarNavButton'
import NewSidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/NewSidebarNavButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import HiddenOnMatch from 'Event/Dashboard/component-rules/HiddenOnMatch'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
export const SIDEBAR_NAV_BUTTON = 'Sidebar Nav Button'

export default function SidebarNav() {
  const {sidebarNav} = useTemplate()
  const {ids, entities} = sidebarNav
  const handleDrag = useHandleDrag()
  const isEditMode = useEditMode()

  const hasButtons = ids.length > 0
  if (!hasButtons) {
    return (
      <EditModeOnly>
        <StyledNewSidebarNavButton />
      </EditModeOnly>
    )
  }

  const buttons = ids.map((id, index) => {
    const button = entities[id]
    return (
      <HiddenOnMatch rules={button.rules} key={id}>
        <SidebarNavButton
          {...button}
          id={id}
          backgroundColor={button.backgroundColor}
          hoverBackgroundColor={button.backgroundColor}
          textColor={button.textColor}
          borderWidth={button.borderWidth}
          borderRadius={button.borderRadius}
          borderColor={button.borderColor}
          index={index}
        />
      </HiddenOnMatch>
    )
  })

  if (!isEditMode) {
    return <Section>{buttons}</Section>
  }

  return (
    <Section>
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="sidebar_nav_buttons">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {buttons}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <StyledNewSidebarNavButton />
      </DragDropContext>
    </Section>
  )
}

function useHandleDrag() {
  const {sidebarNav: buttons} = useTemplate()
  const updateTemplate = useUpdateTemplate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(buttons.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      sidebarNav: {
        ids: moved,
        entities: {
          ...buttons.entities,
        },
      },
    })
  }
}

const StyledNewSidebarNavButton = styled(NewSidebarNavButton)`
  margin-top: ${(props) => props.theme.spacing[6]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
