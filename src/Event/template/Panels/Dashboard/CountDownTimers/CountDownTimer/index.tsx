import React from 'react'
import Grid from '@material-ui/core/Grid'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import CountDownTimer, {
  CountDownTimer as CountDownTimerConfig,
} from 'Event/Dashboard/components/CountDownTimer'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {useToggle} from 'lib/toggle'
import TimerConfig from 'Event/template/Panels/Dashboard/CountDownTimers/CountDownTimer/TimerConfig'

type CountDownTimerProps = {
  id: string
  countDownTimer: CountDownTimerConfig
  index: number
  onRender?: () => void
}

export default React.memo((props: CountDownTimerProps) => {
  const isEditMode = useEditMode()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  const countDownTimer = (
    <CountDownTimer
      {...props.countDownTimer}
      aria-label="count down timer"
      isEditMode={isEditMode}
      onRender={props.onRender}
    />
  )

  if (!isEditMode) {
    return (
      <CountDownTimerContainer countDownTimer={props.countDownTimer}>
        {countDownTimer}
      </CountDownTimerContainer>
    )
  }

  return (
    <>
      <TimerConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        id={props.id}
        countDownTimer={props.countDownTimer}
      />
      <Draggable draggableId={props.id} index={props.index}>
        {(provided) => (
          <CountDownTimerContainer
            countDownTimer={props.countDownTimer}
            ref={provided.innerRef}
            draggableProps={provided.draggableProps}
          >
            <DraggableOverlay>
              <Editable onEdit={toggleConfig}>
                <>
                  <DragHandle handleProps={provided.dragHandleProps} />
                  {countDownTimer}
                </>
              </Editable>
            </DraggableOverlay>
          </CountDownTimerContainer>
        )}
      </Draggable>
    </>
  )
})

const CountDownTimerContainer = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactElement
    countDownTimer: CountDownTimerConfig
    draggableProps?: DraggableProvidedDraggableProps
  }
>((props, ref) => {
  return (
    <>
      <Grid item xs={12} ref={ref} {...props.draggableProps}>
        {props.children}
      </Grid>
    </>
  )
})
