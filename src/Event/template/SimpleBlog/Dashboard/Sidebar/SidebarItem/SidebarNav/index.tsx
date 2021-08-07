import React from 'react'
import styled from 'styled-components'
import SidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav/SidebarNavButton'
import NewSidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav/NewSidebarNavButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import NavButton from 'Event/Dashboard/components/NavButton'
import {EntityList} from 'lib/list'
import {
  useRemoveSidebarItem,
  useUpdateSidebarItem,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {uuid} from 'lib/uuid'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

export const SIDEBAR_NAV = 'Sidebar Nav'
export type SidebarNavProps = EntityList<NavButton> & {
  id: string
  type: typeof SIDEBAR_NAV
}

export const createSidebarNav = (): SidebarNavProps => ({
  id: uuid(),
  type: SIDEBAR_NAV,
  ids: [],
  entities: {},
})

export default function SidebarNav(props: SidebarNavProps) {
  const {ids, entities} = props
  const handleDrag = useHandleDrag(props)
  const isEditMode = useEditMode()
  const removeItem = useRemoveSidebarItem(props)

  const hasButtons = ids.length > 0
  if (!hasButtons) {
    return (
      <EditModeOnly>
        <RemoveButton onClick={removeItem} size="large">
          Remove Buttons
        </RemoveButton>
        <StyledNewSidebarNavButton nav={props} />
      </EditModeOnly>
    )
  }

  const buttons = ids.map((id, index) => {
    const button = entities[id]
    return (
      <HiddenOnMatch rules={button.rules} key={id}>
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
      </HiddenOnMatch>
    )
  })

  if (!isEditMode) {
    return <>{buttons}</>
  }

  return (
    <>
      <RemoveButton onClick={removeItem} size="large">
        Remove Buttons
      </RemoveButton>
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="sidebar_nav_buttons">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {buttons}
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
  const updateItem = useUpdateSidebarItem()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(props.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateItem({
      ...props,
      ids: moved,
      entities: {
        ...props.entities,
      },
    })
  }
}

const StyledNewSidebarNavButton = styled(NewSidebarNavButton)`
  margin-top: ${(props) => props.theme.spacing[6]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
