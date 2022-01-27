import AddTicketRibbonButton from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbonConfig/AddTicketRibbonButton'
import TicketRibbonItem, {
  TicketRibbonProps,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useHasVisibleItems} from 'Event/attendee-rules/matcher'
import Section from 'Event/template/Cards/Dashboard/Sidebar/Section'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import {HashMap, orderedIdsByPosition, createPositions, Ordered} from 'lib/list'
import {useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {HasRules} from 'Event/attendee-rules'

export const TICKET_RIBBON_LIST = 'Ticket Ribbon List'
export interface TicketRibbonListProps extends Ordered, HasRules {
  type: typeof TICKET_RIBBON_LIST
  ribbons: HashMap<TicketRibbonProps>
  position?: number
}

export const createTicketRibbonList = (): TicketRibbonListProps => ({
  type: TICKET_RIBBON_LIST,
  ribbons: {},
})

export default function TicketRibbons(props: TicketRibbonListProps) {
  const isEditMode = useEditMode()
  const {ribbons} = props
  const hasVisibleItems = useHasVisibleItems(Object.values(ribbons))
  if (!hasVisibleItems && !isEditMode) {
    return null
  }

  return (
    <Section>
      <EditModeOnly>
        <RemoveTicketRibbonsButton {...props} />
      </EditModeOnly>
      <Content {...props} />
      <EditModeOnly>
        <StyledAddTicketRibbonButton />
      </EditModeOnly>
    </Section>
  )
}

function RemoveTicketRibbonsButton(props: TicketRibbonListProps) {
  const {remove: removeItem} = useEditSidebarItem()
  useRemoveIfEmpty(removeItem, props)

  return (
    <RemoveButton onClick={removeItem} showing size="large">
      Remove Ribbons
    </RemoveButton>
  )
}

function Content(props: TicketRibbonListProps) {
  const isEdit = useEditMode()
  if (isEdit) {
    return <DroppableList {...props} />
  }

  return (
    <div>
      <TicketRibbonItemList {...props} />
    </div>
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
      {ids.map((id: string, index: number) => {
        const ticketRibbon = props.ribbons[id]

        return (
          <VisibleOnMatch rules={ticketRibbon.rules} key={index}>
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
