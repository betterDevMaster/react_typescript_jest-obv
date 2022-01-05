import styled from 'styled-components'
import React from 'react'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'
import CountDownTimer from 'Event/template/NiftyFifty/Dashboard/CountDownTimers/CountDownTimer'
import NewCountDownTimerButton from 'Event/template/NiftyFifty/Dashboard/CountDownTimers/CountDownTimer/NewCountDownTimerButton'
import {useHasCountDownTimers} from 'lib/countdown-timers'
import {createPositions, orderedIdsByPosition} from 'lib/list'

export default function CountDownTimers(props: {
  className?: string
  onRender?: () => void
}) {
  const template = useNiftyFiftyTemplate()
  const {countDownTimers} = template
  const isEditMode = useEditMode()

  const hasTimers = useHasCountDownTimers(countDownTimers)
  const ids = orderedIdsByPosition(countDownTimers)

  const timers = ids.map((id, index) => (
    <CountDownTimer
      id={id}
      index={index}
      key={id}
      countDownTimer={countDownTimers[id]}
      onRender={props.onRender}
    />
  ))

  if (!isEditMode) {
    return (
      hasTimers && <Container className={props.className}>{timers}</Container>
    )
  }

  return <DraggableList className={props.className}>{timers}</DraggableList>
}

function DraggableList(props: {
  className?: string
  children: React.ReactElement[]
}) {
  const handleDrag = useHandleDrag()

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="countdown_timers">
        {(provided) => (
          <Container
            className={props.className}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <>
              {props.children}
              {provided.placeholder}
              <StyledNewCountDownTimer />
            </>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const Container = React.forwardRef<
  HTMLDivElement,
  {
    className?: string
    children: React.ReactElement | React.ReactElement[]
  } & Partial<DroppableProvidedProps>
>((props, ref) => {
  const template = useNiftyFiftyTemplate()
  const {countDownTimers} = template
  const ids = orderedIdsByPosition(countDownTimers)

  const hasTimers = ids.length > 0
  const isEditMode = useEditMode()

  /**
   * Fix case where empty container has margin
   */
  const hideEmptyContainer = !hasTimers && !isEditMode
  if (hideEmptyContainer) {
    return null
  }

  return (
    <Box className={props.className} ref={ref} {...props}>
      <Grid container justify="center" spacing={2}>
        {props.children}
      </Grid>
    </Box>
  )
})

function useHandleDrag() {
  const template = useNiftyFiftyTemplate()
  const {countDownTimers} = template

  const update = useNiftyFiftyUpdate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const ids = orderedIdsByPosition(countDownTimers)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    update({
      countDownTimers: createPositions(ids),
    })
  }
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[7]};
  margin-top: ${(props) => props.theme.spacing[7]};
  width: 100%;
`

const StyledNewCountDownTimer = styled(NewCountDownTimerButton)`
  padding-top: ${(props) => props.theme.spacing[2]}!important;
`
