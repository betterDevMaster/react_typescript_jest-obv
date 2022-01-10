import React from 'react'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'

import {Grid, Typography} from '@material-ui/core'

import {Sponsor} from 'Event/SponsorPage'
import Card from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorList/Card'
import {useTemplate} from 'Event/TemplateProvider'
import {
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'

export default function SponsorList(props: {
  className?: string
  sponsors: Sponsor[]
  isEditMode?: boolean
}) {
  const sortedSponsors = useSortedSponsors(props.sponsors)
  const {sponsors} = useNiftyFiftyTemplate()

  const isEmpty = props.sponsors.length === 0
  if (isEmpty) {
    return <Typography align="center">No sponsor have been added</Typography>
  }

  const cards = sortedSponsors.map((sponsor, index) => (
    <Grid item xs={12} key={sponsor.id}>
      <Card index={index} sponsor={sponsor} isEditMode={props.isEditMode} />
    </Grid>
  ))

  if (!props.isEditMode) {
    return (
      <Grid container spacing={sponsors.sponsorsSpace}>
        {cards}
      </Grid>
    )
  }

  return (
    <DraggableList sponsors={sortedSponsors} className={props.className}>
      {cards}
    </DraggableList>
  )
}

function DraggableList(props: {
  sponsors: Sponsor[]
  children: React.ReactElement[]
  className?: string
}) {
  const handleDrag = useHandleDrag()
  const {sponsors} = useNiftyFiftyTemplate()

  return (
    <DragDropContext onDragEnd={handleDrag(props.sponsors)}>
      <Droppable droppableId="drag-and-drop-sponsors">
        {(provided) => (
          <Grid
            container
            spacing={sponsors.sponsorsSpace}
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={props.className}
          >
            <>
              {props.children}
              {provided.placeholder}
            </>
          </Grid>
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
  const update = useNiftyFiftyUpdate()

  return (sponsors: Sponsor[]) => (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(sponsors)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    const orderedIds = moved.map((f) => f.id)

    update({
      sponsors: {
        orderedIds,
      },
    })
  }
}
