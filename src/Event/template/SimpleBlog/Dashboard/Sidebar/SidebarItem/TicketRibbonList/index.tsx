import AddTicketRibbonButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbonConfig/AddTicketRibbonButton'
import TicketRibbonItem, {
  TicketRibbon,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/Ribbon'
import React from 'react'
import styled from 'styled-components'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {useHasVisibleItems} from 'Event/attendee-rules/matcher'
import {createPositions, HashMap, Ordered, orderedIdsByPosition} from 'lib/list'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {HasRules} from 'Event/attendee-rules'

export const TICKET_RIBBON_LIST = 'Ticket Ribbon List'
export interface TicketRibbonListProps extends Ordered, HasRules {
  type: typeof TICKET_RIBBON_LIST
  position?: number
  ribbons: HashMap<TicketRibbon>
}

export const createTicketRibbonList = (): TicketRibbonListProps => ({
  type: TICKET_RIBBON_LIST,
  ribbons: {},
})

export default function TicketRibbons(props: TicketRibbonListProps) {
  const {ribbons} = props
  const isEditMode = useEditMode()

  const hasVisibleItems = useHasVisibleItems(Object.values(ribbons))
  if (!hasVisibleItems && !isEditMode) {
    return null
  }

  if (!isEditMode)
    return (
      <Section>
        <div>
          <TicketRibbonItemList {...props} />
        </div>
      </Section>
    )

  return (
    <Section>
      <RemoveRibbonsButton {...props} />
      <StyledAddTicketRibbonButton list={props} />
      <DroppableList {...props} />
    </Section>
  )
}

function RemoveRibbonsButton(props: TicketRibbonListProps) {
  const {remove: removeItem} = useEditSidebarItem()
  useRemoveIfEmpty(removeItem, props)

  return (
    <RemoveButton onClick={removeItem} showing size="large">
      Remove Ribbons
    </RemoveButton>
  )
}

function DroppableList(props: TicketRibbonListProps) {
  const handleDrag = useHandleDrag(props)

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
  const ids = orderedIdsByPosition(props.ribbons)
  return (
    <>
      {ids.map((id, index) => {
        const ticketRibbon = props.ribbons[id]
        return (
          <VisibleOnMatch rules={ticketRibbon.rules} key={id}>
            <TicketRibbonItem
              ticketRibbon={ticketRibbon}
              index={index}
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

    const ids = orderedIdsByPosition(props.ribbons)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    update({
      ribbons: createPositions(ids),
    })
  }
}

const StyledAddTicketRibbonButton = styled(AddTicketRibbonButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
