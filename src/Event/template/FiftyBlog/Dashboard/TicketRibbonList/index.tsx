import React from 'react'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {withDefaults} from 'lib/object'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'
import 'Event/template/FiftyBlog/Dashboard/LeftPanel'
import AddTicketRibbonButton, {
  DEFAULT_TICKET_RIBBON,
} from 'Event/template/FiftyBlog/Dashboard/TicketRibbonList/AddTicketRibbonButton'
import TicketRibbon, {
  LETTER_WIDTH,
} from 'Event/template/FiftyBlog/Dashboard/TicketRibbonList/TicketRibbon'

export default function TicketRibbonList() {
  return (
    <Box>
      <Content />
    </Box>
  )
}

function Content() {
  const isEditMode = useEditMode()

  if (isEditMode) {
    return (
      <>
        <StyledAddTicketRibbonButton />
        <DraggableItems />
      </>
    )
  }

  return <Items />
}

function DraggableItems() {
  const handleDrag = useHandleDrag()

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="ticket_ribbons" direction="horizontal">
        {(provided) => (
          <DroppableBox ref={provided.innerRef} {...provided.droppableProps}>
            <Items />
            {provided.placeholder}
          </DroppableBox>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function Items() {
  const {ticketRibbons} = useFiftyBlogTemplate()

  const filled = ticketRibbons.map((tr) =>
    withDefaults(DEFAULT_TICKET_RIBBON, tr),
  )

  return (
    <>
      {filled.map((tr, index) => (
        <VisibleOnMatch rules={tr.rules} key={index}>
          <StyledTicketRibbon ticketRibbon={tr} index={index} />
        </VisibleOnMatch>
      ))}
    </>
  )
}

function useHandleDrag() {
  const updateTemplate = useFiftyBlogUpdate()
  const {ticketRibbons} = useFiftyBlogTemplate()

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

const Box = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: right;
  margin-right: 24px;
`

const StyledAddTicketRibbonButton = styled(AddTicketRibbonButton)`
  width: ${LETTER_WIDTH}px;
  justify-content: center;
`

const StyledTicketRibbon = styled(TicketRibbon)`
  margin-left: 10px;
`

const DroppableBox = styled.div`
  display: flex;
`
