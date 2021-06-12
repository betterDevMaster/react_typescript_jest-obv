import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {
  Background,
  useBackgrounds,
  useSortBackgrounds,
} from 'organization/Event/Backgrounds/BackgroundsProvider'
import BackgroundImageRow from 'Event/template/SimpleBlog/Backgrounds/BackgroundsConfig/BackgroundImageRow'

export default function BackgroundImageTable() {
  const {backgrounds, loading} = useBackgrounds()
  const hasBackgrounds = backgrounds.length > 0
  const handleDrag = useHandleDrag()
  const {template} = useSimpleBlog()
  const {zoomBackgrounds: pageSettings} = template

  const sortedBackgrounds = useSortBackgrounds(
    pageSettings?.orderedIds,
    backgrounds,
  )

  const draggableBackgrounds = sortedBackgrounds.map((background, index) => {
    return (
      <Draggable
        draggableId={String(background.id)}
        index={index}
        key={background.id}
      >
        {(provided) => (
          <Grid
            item
            xs={12}
            key={background.id}
            ref={provided.innerRef}
            aria-label="background"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <BackgroundImageRow background={background} />
          </Grid>
        )}
      </Draggable>
    )
  })

  if (loading) {
    return (
      <Box justifyContent="center" display="flex" paddingY={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (!hasBackgrounds) {
    return (
      <Box paddingY={4}>
        <Typography align="center">No Backgrounds Available</Typography>
      </Box>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDrag(sortedBackgrounds)}>
      <Droppable droppableId="drag-and-drop-backgrounds">
        {(provided) => (
          <DroppableBox ref={provided.innerRef} {...provided.droppableProps}>
            <>
              <Grid container spacing={2}>
                {draggableBackgrounds}
                {provided.placeholder}
              </Grid>
            </>
          </DroppableBox>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function useHandleDrag() {
  const {update} = useSimpleBlog()

  return (backgrounds: Background[]) => (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(backgrounds)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    const orderedIds = moved.map((f) => f.id)
    update.object('zoomBackgrounds')('orderedIds')(orderedIds)
  }
}

const DroppableBox = styled.div`
  width: 100%;
`
