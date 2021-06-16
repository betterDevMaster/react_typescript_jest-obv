import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {Sponsor} from 'Event/SponsorPage'
import Card from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import {useTemplate} from 'Event/TemplateProvider'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export default function SponsorList(props: {
  className?: string
  sponsors: Sponsor[]
  isEditMode?: boolean
}) {
  const {template} = useSimpleBlog()
  const {sponsors: sponsorPageSettings} = template

  const handleDrag = useHandleDrag()
  const sortedSponsors = useSortedSponsors(props.sponsors)

  const isEmpty = props.sponsors.length === 0
  if (isEmpty) {
    return <Typography align="center">No sponsor have been added</Typography>
  }

  const sponsors = sortedSponsors.map((sponsor, index) => (
    <StyledCard
      index={index}
      key={sponsor.id}
      sponsor={sponsor}
      isEditMode={props.isEditMode}
      border={sponsorPageSettings?.sponsorSeparator}
    />
  ))

  if (!props.isEditMode) {
    return <Box className={props.className}>{sponsors}</Box>
  }

  return (
    <DragDropContext onDragEnd={handleDrag(sortedSponsors)}>
      <Droppable droppableId="drag-and-drop-sponsors">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={props.className}
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
  const {update: updateTemplate} = useSimpleBlog()
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

const Box = styled.div`
  width: 100%;
`

/**
 * Fixes fowarding props (isEditMode) with undefined causing
 * app to crash
 */
const StyledCard = styled((props) => <Card {...props} />)`
  &:not(:last-child) {
    padding-bottom: ${(props) => props.theme.spacing[2]};
    margin-bottom: ${(props) => props.theme.spacing[8]};
    border-bottom: ${(props) => (props.border ? '1px' : '0')} solid ${grey[300]};
  }
`
