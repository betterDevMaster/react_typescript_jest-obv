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
import {
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'
import {
  Background,
  useBackgrounds,
  useSortBackgrounds,
} from 'organization/Event/Backgrounds/BackgroundsProvider'
import BackgroundImageRow from 'Event/template/NiftyFifty/Dashboard/Resources/Backgrounds/BackgroundsConfig/BackgroundImageRow'

export default function BackgroundImageTable() {
  const {backgrounds, loading} = useBackgrounds()
  const hasBackgrounds = backgrounds.length > 0
  const {zoomBackgrounds: pageSettings} = useNiftyFiftyTemplate()

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

  return !hasBackgrounds ? (
    <Box paddingY={4}>
      <Typography align="center">No Backgrounds Available</Typography>
    </Box>
  ) : (
    <DraggableContent sortedBackgrounds={sortedBackgrounds}>
      {draggableBackgrounds}
    </DraggableContent>
  )
}

const DraggableContent = (props: {
  sortedBackgrounds: Background[]
  children: React.ReactElement[]
}) => {
  const handleDrag = useHandleDrag()

  return (
    <DragDropContext onDragEnd={handleDrag(props.sortedBackgrounds)}>
      <Droppable droppableId="drag-and-drop-backgrounds">
        {(provided) => (
          <DroppableBox ref={provided.innerRef} {...provided.droppableProps}>
            <>
              <Grid container spacing={2}>
                {props.children}
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
  const update = useNiftyFiftyUpdate()

  return (backgrounds: Background[]) => (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(backgrounds)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    const orderedIds = moved.map((f) => f.id)
    update({zoomBackgrounds: {orderedIds: orderedIds}})
  }
}

const DroppableBox = styled.div`
  width: 100%;
`
