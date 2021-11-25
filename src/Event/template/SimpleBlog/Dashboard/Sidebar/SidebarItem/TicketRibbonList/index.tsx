import AddTicketRibbonButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbonConfig/AddTicketRibbonButton'
import TicketRibbonItem, {
  TicketRibbon,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {useHasVisibleItems} from 'Event/attendee-rules/matcher'
import {EntityList} from 'lib/list'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

export const TICKET_RIBBON_LIST = 'Ticket Ribbon List'
export interface TicketRibbonListProps {
  type: typeof TICKET_RIBBON_LIST
  ribbons: EntityList<TicketRibbon>
}

export const createTicketRibbonList = (): TicketRibbonListProps => ({
  type: TICKET_RIBBON_LIST,
  ribbons: {
    ids: [],
    entities: {},
  },
})

export default function TicketRibbons(props: TicketRibbonListProps) {
  const {remove: removeItem} = useEditSidebarItem()
  const {ribbons} = props
  const isEditMode = useEditMode()

  const hasVisibleItems = useHasVisibleItems(Object.values(ribbons.entities))
  if (!hasVisibleItems && !isEditMode) {
    return null
  }

  return (
    <Section>
      <EditModeOnly>
        <RemoveButton onClick={removeItem} showing size="large">
          Remove Ribbons
        </RemoveButton>
        <StyledAddTicketRibbonButton list={props} />
      </EditModeOnly>
      <DroppableList {...props} />
    </Section>
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
      {props.ribbons.ids.map((id, index) => {
        const ticketRibbon = props.ribbons.entities[id]
        return (
          <VisibleOnMatch rules={ticketRibbon.rules} key={id}>
            <TicketRibbonItem
              ticketRibbon={ticketRibbon}
              index={index}
              list={props}
              id={id}
            />
          </VisibleOnMatch>
        )
      })}
    </>
  )
}

function useHandleDrag(props: TicketRibbonListProps) {
  const {update} = useEditSidebarItem()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(props.ribbons.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    update({
      ribbons: {
        ids: moved,
      },
    })
  }
}

const RibbonsContainer = styled.div``

const StyledAddTicketRibbonButton = styled(AddTicketRibbonButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
