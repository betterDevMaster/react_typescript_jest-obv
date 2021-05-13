import AddTicketRibbonButton from 'Event/Dashboard/components/TicketRibbonList/TicketRibbonConfig/AddTicketRibbonButton'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import TicketRibbonItem, {
  TicketRibbon,
} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'

export default () => {
  return (
    <>
      <EditModeOnly>
        <StyledSetTicketRibbonButton />
      </EditModeOnly>
      <DroppableList />
    </>
  )
}

function DroppableList() {
  const ticketRibbons = TicketRibbonItemList()
  const handleDrag = useHandleDrag()
  const isEdit = useEditMode()

  if (!isEdit) return <RibbonsContainer>{ticketRibbons}</RibbonsContainer>

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-ticket-ribbons">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <>
              {ticketRibbons}
              {provided.placeholder}
            </>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function TicketRibbonItemList() {
  const {ticketRibbons} = useTemplate()

  const list = ticketRibbons.map(
    (ticketRibbon: TicketRibbon, index: number) => (
      <HiddenOnMatch rules={ticketRibbon.rules} key={index}>
        <TicketRibbonItem ticketRibbon={ticketRibbon} index={index} />
      </HiddenOnMatch>
    ),
  )
  return list
}

function useHandleDrag() {
  const updateTemplate = useUpdateTemplate()
  const {ticketRibbons} = useTemplate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(ticketRibbons)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      ticketRibbons: moved,
    })
  }
}

const RibbonsContainer = styled.div``

const StyledSetTicketRibbonButton = styled(AddTicketRibbonButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
