import {Speaker} from 'Event/SpeakerPage'
import Card from 'Event/template/Panels/Dashboard/Speakers/SpeakerList/Card'
import Grid from '@material-ui/core/Grid'
import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import Typography from '@material-ui/core/Typography'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {usePanelsTemplate, usePanelsUpdate} from 'Event/template/Panels'

export default function SpeakerList(props: {
  speakers: Speaker[]
  isEditMode?: boolean
}) {
  const template = usePanelsTemplate()
  const sortedSpeakers = useSortedSpeakers(props.speakers)

  const isEmpty = props.speakers.length === 0
  if (isEmpty) {
    return <Typography align="center">No speakers have been added</Typography>
  }

  const cards = sortedSpeakers.map((speaker: Speaker, index: number) => (
    <Grid item xs={12} key={speaker.id}>
      <Card speaker={speaker} isEditMode={props.isEditMode} index={index} />
    </Grid>
  ))

  if (!props.isEditMode) {
    return (
      <Grid container spacing={template.speakers.speakersSpace}>
        {cards}
      </Grid>
    )
  }

  return <DraggableList speakers={sortedSpeakers}>{cards}</DraggableList>
}

function DraggableList(props: {
  children: React.ReactElement[]
  speakers: Speaker[]
}) {
  const handleDrag = useHandleDrag()
  const {speakers} = usePanelsTemplate()

  return (
    <DragDropContext onDragEnd={handleDrag(props.speakers)}>
      <Droppable droppableId="drag-and-drop-speaker">
        {(provided) => (
          <Grid
            container
            spacing={speakers.speakersSpace}
            ref={provided.innerRef}
            {...provided.droppableProps}
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
 * Sort speakers by a list of ordered ids in the template. Saving the order at the
 * page level allows us to save once instead of updating every Speaker model. We
 * use the list of speakers as the source of truth, and only sort on match.
 *
 * @param speakers
 * @returns
 */
function useSortedSpeakers(speakers: Speaker[]) {
  const {speakers: pageSettings} = useTemplate()

  const order = pageSettings?.orderedIds || []

  return speakers.sort((a, b) => {
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
  const update = usePanelsUpdate()

  return (speakers: Speaker[]) => (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(speakers)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    const orderedIds = moved.map((s) => s.id)

    update({
      speakers: {
        orderedIds,
      },
    })
  }
}
