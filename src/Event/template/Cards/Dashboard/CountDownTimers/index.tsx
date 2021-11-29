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
import {useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import CountDownTimer from 'Event/template/Cards/Dashboard/CountDownTimers/CountDownTimer'
import NewCountDownTimerButton from 'Event/template/Cards/Dashboard/CountDownTimers/CountDownTimer/NewCountDownTimerButton'
import {useHasCountDownTimers} from 'lib/countdown-timers'
import {createPositions, orderedIdsByPosition} from 'lib/list'

export default function CountDownTimers(props: {className?: string}) {
  const {countDownTimers} = useCardsTemplate()
  const isEditMode = useEditMode()

  const hasTimers = useHasCountDownTimers(countDownTimers)
  const ids = orderedIdsByPosition(countDownTimers)

  const timers = ids.map((id, index) => (
    <CountDownTimer
      id={id}
      index={index}
      key={id}
      countDownTimer={countDownTimers[id]}
    />
  ))

  if (isEditMode) {
    return <Editable className={props.className}>{timers}</Editable>
  }

  if (!hasTimers) {
    return null
  }

  return <Container className={props.className}>{timers}</Container>
}

function Editable(props: {className?: string; children: React.ReactElement[]}) {
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
>((props, ref) => (
  <Box className={props.className} ref={ref} {...props}>
    <Grid container justify="center" spacing={2}>
      {props.children}
    </Grid>
  </Box>
))

function useHandleDrag() {
  const {countDownTimers} = useCardsTemplate()
  const updateTemplate = useCardsUpdate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const ids = orderedIdsByPosition(countDownTimers)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    updateTemplate({
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
