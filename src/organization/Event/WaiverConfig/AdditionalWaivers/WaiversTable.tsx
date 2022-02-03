import {
  AdditionalWaiver,
  useAdditionalWaivers,
} from 'organization/Event/WaiverConfig/AdditionalWaivers'
import styled from 'styled-components'
import React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import TableCell from '@material-ui/core/TableCell'
import Table from '@material-ui/core/Table'
import TableRow, {TableRowProps} from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import {useEvent} from 'Event/EventProvider'
import RuleList from 'organization/Event/RuleList'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'

export default function WaiversTable(props: {
  onClick: (waiver: AdditionalWaiver) => void
}) {
  const {waivers} = useAdditionalWaivers()
  const handleDrag = useHandleDrag()
  const {event} = useEvent()

  const empty = waivers.length === 0
  if (empty) {
    return <p>No additional waivers have been added</p>
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <StyledTable>
        <TableHead>
          <TableRow>
            <PriorityCell>Priority</PriorityCell>
            <TitleCell>Title</TitleCell>
            <RulesCell>Rules</RulesCell>
          </TableRow>
        </TableHead>
        <Droppable droppableId="additional_waivers">
          {(provided) => (
            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
              {waivers.map((waiver, index) => (
                <Draggable
                  draggableId={`${waiver.id}`}
                  index={index}
                  key={waiver.id}
                >
                  {(provided, snapshot) => (
                    <StyledTableRow
                      aria-label="additional waiver"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      onClick={() => props.onClick(waiver)}
                      isDragging={snapshot.isDragging}
                    >
                      <PriorityCell>{index + 1}</PriorityCell>
                      <TitleCell>{waiver.title || event.name}</TitleCell>
                      <RulesCell>
                        <RuleList rules={waiver.rules || []} />
                      </RulesCell>
                    </StyledTableRow>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </StyledTable>
    </DragDropContext>
  )
}

function useHandleDrag() {
  const {waivers, setWaivers} = useAdditionalWaivers()
  const {client} = useOrganization()
  const {event} = useEvent()

  const url = api(`/events/${event.slug}/additional_waivers`)

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(waivers)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    // Save sort order
    client.patch(url, {
      waivers: moved,
    })

    setWaivers(moved)
  }
}

const StyledTable = styled(Table)`
  table-layout: fixed;
`

const StyledTableRow = styled(
  React.forwardRef<
    HTMLTableRowElement,
    {
      isDragging?: boolean
    } & TableRowProps
  >(({isDragging: _, ...otherProps}, ref) => (
    <TableRow {...otherProps} ref={ref} />
  )),
)`
  background: #ffffff;
  cursor: pointer;

  display: ${(props) => (props.isDragging ? 'table' : 'table-row')};
`

/**
 * Cells must have explicity widths, otherwise they will
 * shrink when being 'dragged'. Also need to set row
 * display to 'table' while dragging.
 *
 * Reference: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/patterns/tables.md
 */

const PriorityCell = styled(TableCell)`
  width: 20%;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 10%;
  }
`

const TitleCell = styled(TableCell)`
  width: 30%;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 40%;
  }
`

const RulesCell = styled(TableCell)`
  width: 50%;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 50%;
  }
`
