import styled from 'styled-components'
import React from 'react'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import CountDownTimer from 'Event/template/SimpleBlog/Dashboard/CountDownTimers/CountDownTimer'
import NewCountDownTimerButton from 'Event/template/SimpleBlog/Dashboard/CountDownTimers/CountDownTimer/NewCountDownTimerButton'

export default function CountDownTimers(props: {className?: string}) {
  const {template} = useSimpleBlog()
  const {countDownTimers} = template
  const isEditMode = useEditMode()
  const handleDrag = useHandleDrag()

  const {ids, entities} = countDownTimers

  const timers = ids.map((id, index) => (
    <CountDownTimer
      id={id}
      index={index}
      key={id}
      countDownTimer={entities[id]}
    />
  ))

  if (!isEditMode) {
    return <Container className={props.className}>{timers}</Container>
  }

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
              {timers}
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
  const {template} = useSimpleBlog()
  const {countDownTimers} = template
  const updateTemplate = useDispatchUpdate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(countDownTimers.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      countDownTimers: {
        ids: moved,
        entities: {
          ...countDownTimers.entities,
        },
      },
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
