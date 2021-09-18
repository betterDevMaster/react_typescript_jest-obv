import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import Card from 'Event/template/Panels/Dashboard/Sponsors/SponsorList/Card'
import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {usePanels} from 'Event/template/Panels'

export default function SponsorList(props: {
  className?: string
  sponsors: Sponsor[]
  isEditMode?: boolean
}) {
  const handleDrag = useHandleDrag()
  const {template} = usePanels()
  const {perRow} = template.sponsors

  const sortedSponsors = useSortedSponsors(props.sponsors)

  const isEmpty = props.sponsors.length === 0
  if (isEmpty) {
    return <Typography align="center">No sponsor have been added</Typography>
  }

  const sponsors = sortedSponsors.map((sponsor, index) => (
    <Card
      key={sponsor.id}
      index={index}
      sponsor={sponsor}
      isEditMode={props.isEditMode}
    />
  ))

  if (!props.isEditMode) {
    return <Box perRow={perRow}>{sponsors}</Box>
  }

  return (
    <DragDropContext onDragEnd={handleDrag(sortedSponsors)}>
      <Droppable droppableId="drag-and-drop-sponsors" direction="horizontal">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={props.className}
            perRow={perRow}
          >
            <>
              {sponsors}
              {provided.placeholder}
            </>
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  )
}

/**
 *
 * Sort sponsors by a list of ordered ids in the template. Saving the order at the
 * page level allows us to save once instead of updating every Sponsor model. We
 * use the list of sponsors as the source of truth, and only sort on match.
 *
 * @param sponsors
 * @returns
 */
function useSortedSponsors(sponsors: Sponsor[]) {
  const {sponsors: pageSettings} = useTemplate()

  const order = pageSettings?.orderedIds || []

  return sponsors.sort((a, b) => {
    const aPosition = order.indexOf(a.id)
    const bPosition = order.indexOf(b.id)

    if (aPosition < bPosition) {
      return -1
    }

    if (aPosition > bPosition) {
      return 1
    }

    // Index not found, any order is fine
    return 0
  })
}

function useHandleDrag() {
  const {update: updateTemplate} = usePanels()
  const update = updateTemplate.object('sponsors')

  return (sponsors: Sponsor[]) => (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(sponsors)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    const orderedIds = moved.map((f) => f.id)
    update('orderedIds')(orderedIds)
  }
}

const Box = styled.div<{perRow: number}>`
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: 1fr;

  grid-gap: 16px;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(${(props) => props.perRow}, 1fr);
  }
`
