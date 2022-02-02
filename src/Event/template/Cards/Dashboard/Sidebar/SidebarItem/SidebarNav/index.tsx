import React from 'react'
import styled from 'styled-components'
import SidebarNavButton from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/SidebarNav/SidebarNavButton'
import NewSidebarNavButton from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/SidebarNav/NewSidebarNavButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {HashMap, orderedIdsByPosition, createPositions, Ordered} from 'lib/list'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import {useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {NavButtonProps} from 'Event/Dashboard/components/NavButton'

export const SIDEBAR_NAV = 'Sidebar Nav'
export type SidebarNavProps = Ordered & {
  type: typeof SIDEBAR_NAV
  buttons: HashMap<NavButtonProps>
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
        <RemoveSidebarNavButton {...props} />
        <StyledNewSidebarNavButton />
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
    return <Box>{buttonComponents}</Box>
  }

  return (
    <Box>
      <DroppleList {...props}>{buttonComponents}</DroppleList>
    </Box>
  )
}

function RemoveSidebarNavButton(props: SidebarNavProps) {
  const {remove: removeItem} = useEditSidebarItem()
  useRemoveIfEmpty(removeItem, props)

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
        <StyledNewSidebarNavButton />
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
    const ids = orderedIdsByPosition(props.buttons)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    update({
      buttons: createPositions(ids),
    })
  }
}

const StyledNewSidebarNavButton = styled(NewSidebarNavButton)`
  margin-top: ${(props) => props.theme.spacing[6]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`

const Box = styled.div`
  margin-bottom: 30px;
  width: 100%;
  padding: 0 ${(props) => props.theme.spacing[8]};
`
