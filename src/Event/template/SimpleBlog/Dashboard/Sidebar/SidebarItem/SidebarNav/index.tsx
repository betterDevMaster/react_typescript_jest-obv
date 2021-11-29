import React from 'react'
import styled from 'styled-components'
import SidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav/SidebarNavButton'
import NewSidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav/NewSidebarNavButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import NavButton from 'Event/Dashboard/components/NavButton'
import {createPositions, HashMap, orderedIdsByPosition} from 'lib/list'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {useSimpleBlogUpdate} from 'Event/template/SimpleBlog'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'

export const SIDEBAR_NAV = 'Sidebar Nav'
export type SidebarNavProps = {
  type: typeof SIDEBAR_NAV
  position?: number
  buttons: HashMap<NavButton>
}

export const createSidebarNav = (): SidebarNavProps => ({
  type: SIDEBAR_NAV,
  buttons: {},
})

export default function SidebarNav(props: SidebarNavProps) {
  const isEditMode = useEditMode()
  const {buttons} = props

  const hasButtons = Object.keys(buttons).length > 0
  if (!hasButtons) {
    return (
      <EditModeOnly>
        <EmptyConfig {...props} />
      </EditModeOnly>
    )
  }

  const ids = orderedIdsByPosition(buttons)
  const buttonComponents = ids.map((id, index) => {
    const button = buttons[id]
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
    return <>{buttonComponents}</>
  }

  return <DraggableList {...props}>{buttonComponents}</DraggableList>
}

function EmptyConfig(props: SidebarNavProps) {
  return (
    <>
      <RemoveSidebarNavButton {...props} />
      <StyledNewSidebarNavButton nav={props} />
    </>
  )
}
function DraggableList(
  props: SidebarNavProps & {children: React.ReactElement[]},
) {
  const handleDrag = useHandleDrag(props)

  return (
    <>
      <RemoveSidebarNavButton {...props} />
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

function RemoveSidebarNavButton(props: SidebarNavProps) {
  const {remove} = useEditSidebarItem()

  useRemoveIfEmpty(remove, props)

  return (
    <RemoveButton onClick={remove} size="large">
      Remove Buttons
    </RemoveButton>
  )
}

function useHandleDrag(props: SidebarNavProps) {
  const update = useSimpleBlogUpdate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const ids = orderedIdsByPosition(props.buttons)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    update({
      sidebarItems: createPositions(ids),
    })
  }
}

const StyledNewSidebarNavButton = styled(NewSidebarNavButton)`
  margin-top: ${(props) => props.theme.spacing[6]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
