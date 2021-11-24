import React from 'react'
import styled from 'styled-components'
import SidebarNavButton from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/SidebarNav/SidebarNavButton'
import NewSidebarNavButton from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/SidebarNav/NewSidebarNavButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import NavButton from 'Event/Dashboard/components/NavButton'
import {EntityList} from 'lib/list'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'

export const SIDEBAR_NAV = 'Sidebar Nav'
export type SidebarNavProps = EntityList<NavButton> & {
  type: typeof SIDEBAR_NAV
}

export const createSidebarNav = (): SidebarNavProps => ({
  type: SIDEBAR_NAV,
  ids: [],
  entities: {},
})

export default function SidebarNav(props: SidebarNavProps) {
  const {ids, entities} = props
  const isEditMode = useEditMode()

  const hasButtons = ids.length > 0
  if (!hasButtons) {
    return (
      <EditModeOnly>
        <RemoveSidebarNavButton />
        <StyledNewSidebarNavButton nav={props} />
      </EditModeOnly>
    )
  }

  const buttons = ids.map((id, index) => {
    const button = entities[id]
    return (
      <VisibleOnMatch rules={button.rules} key={id}>
        <SidebarNavButton
          {...button}
          nav={props}
          id={id}
          backgroundColor={button.backgroundColor}
          hoverBackgroundColor={button.backgroundColor}
          textColor={button.textColor}
          borderWidth={button.borderWidth}
          borderRadius={button.borderRadius}
          borderColor={button.borderColor}
          index={index}
        />
      </VisibleOnMatch>
    )
  })

  if (!isEditMode) {
    return <>{buttons}</>
  }

  return (
    <>
      <DroppleList {...props}>{buttons}</DroppleList>
    </>
  )
}

function RemoveSidebarNavButton() {
  const {remove: removeItem} = useEditSidebarItem()

  return (
    <RemoveButton onClick={removeItem} size="large">
      Remove Buttons
    </RemoveButton>
  )
}

function DroppleList(
  props: SidebarNavProps & {children: React.ReactElement[]},
) {
  const handleDrag = useHandleDrag(props)

  return (
    <>
      <RemoveSidebarNavButton />
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="sidebar_nav_buttons">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {props.children}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <StyledNewSidebarNavButton nav={props} />
      </DragDropContext>
    </>
  )
}

function useHandleDrag(props: SidebarNavProps) {
  const {update} = useEditSidebarItem()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(props.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    update({
      ids: moved,
    })
  }
}

const StyledNewSidebarNavButton = styled(NewSidebarNavButton)`
  margin-top: ${(props) => props.theme.spacing[6]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
