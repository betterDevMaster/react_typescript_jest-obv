import AddTicketRibbonButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbonConfig/AddTicketRibbonButton'
import TicketRibbonItem, {
  TicketRibbon,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {
  useRemoveSidebarItem,
  useUpdateSidebarItem,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {uuid} from 'lib/uuid'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

export const TICKET_RIBBON_LIST = 'Ticket Ribbon List'
export interface TicketRibbonListProps {
  id: string
  type: typeof TICKET_RIBBON_LIST
  ribbons: TicketRibbon[]
}

export const createTicketRibbonList = (): TicketRibbonListProps => ({
  id: uuid(),
  type: TICKET_RIBBON_LIST,
  ribbons: [],
})

export default function TicketRibbons(props: TicketRibbonListProps) {
  const removeItem = useRemoveSidebarItem(props)

  return (
    <>
      <EditModeOnly>
        <RemoveButton onClick={removeItem} size="large">
          Remove Ribbons
        </RemoveButton>
        <StyledAddTicketRibbonButton list={props} />
      </EditModeOnly>
      <DroppableList {...props} />
    </>
  )
}

function DroppableList(props: TicketRibbonListProps) {
  const handleDrag = useHandleDrag(props)
  const isEdit = useEditMode()

  if (!isEdit)
    return (
      <RibbonsContainer>
        <TicketRibbonItemList {...props} />
      </RibbonsContainer>
    )

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-ticket-ribbons">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <>
              <TicketRibbonItemList {...props} />
              {provided.placeholder}
            </>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function TicketRibbonItemList(props: TicketRibbonListProps) {
  return (
    <>
      {props.ribbons.map((ticketRibbon: TicketRibbon, index: number) => (
        <HiddenOnMatch rules={ticketRibbon.rules} key={index}>
          <TicketRibbonItem
            ticketRibbon={ticketRibbon}
            index={index}
            list={props}
          />
        </HiddenOnMatch>
      ))}
    </>
  )
}

function useHandleDrag(props: TicketRibbonListProps) {
  const updateItem = useUpdateSidebarItem()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(props.ribbons)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateItem({
      ...props,
      ribbons: moved,
    })
  }
}

const RibbonsContainer = styled.div``

const StyledAddTicketRibbonButton = styled(AddTicketRibbonButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
