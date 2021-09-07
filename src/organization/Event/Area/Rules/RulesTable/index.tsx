import Table from '@material-ui/core/Table'
import styled from 'styled-components'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {useRules} from 'organization/Event/Area/Rules/RulesProvider'
import Conditions from 'organization/Event/Area/Rules/RulesTable/Conditions'
import ConditionsConfig from 'organization/Event/Area/Rules/RulesTable/ConditionsConfig'
import Rooms from 'organization/Event/Area/Rules/RulesTable/Rooms'
import React from 'react'
import DeleteButton from 'organization/Event/Area/Rules/RulesTable/DeleteButton'
import RoomsConfig from 'organization/Event/Area/Rules/RulesTable/RoomsConfig'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'

export default function RulesTable() {
  const list = useRules()
  const handleDrag = useHandleDrag()

  const hasRules = list.rules.length > 0
  if (!hasRules) {
    return <p>No rules have been added</p>
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <StyledTable>
        <TableHead>
          <TableRow>
            <ConditionsCell>Conditions</ConditionsCell>
            <RoomsCell>Rooms</RoomsCell>
            <RemoveCell>{/* Delete Button */}</RemoveCell>
          </TableRow>
        </TableHead>
        <Droppable droppableId="area_rules">
          {(provided) => (
            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
              {list.rules.map((rule, index) => (
                <Draggable
                  draggableId={`${rule.id}`}
                  index={index}
                  key={rule.id}
                >
                  {(provided) => (
                    <StyledTableRow
                      aria-label="rule"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <ConditionsCell>
                        <ConditionsConfig rule={rule}>
                          <Conditions rule={rule} />
                        </ConditionsConfig>
                      </ConditionsCell>
                      <RoomsCell>
                        <RoomsConfig rule={rule}>
                          <Rooms rule={rule} />
                        </RoomsConfig>
                      </RoomsCell>
                      <RemoveCell>
                        <DeleteButton rule={rule} />
                      </RemoveCell>
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
  const {rules, setRules} = useRules()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(rules)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    setRules(moved)
  }
}

export const List = styled.ul`
  margin: 0;
  padding-left: ${(props) => props.theme.spacing[4]};
`

const StyledTable = styled(Table)`
  table-layout: fixed;
`

const StyledTableRow = styled(TableRow)`
  background: #ffffff;
`

/**
 * Cells must have explicity widths, otherwise they will
 * shrink when being 'dragged'.
 *
 * Reference: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/patterns/tables.md
 */

const ConditionsCell = styled(TableCell)`
  width: 50%;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 60%;
  }
`

const RoomsCell = styled(TableCell)`
  width: 40%;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 25%;
  }
`

const RemoveCell = styled(TableCell)`
  width: 10%;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 5%;
  }
`
