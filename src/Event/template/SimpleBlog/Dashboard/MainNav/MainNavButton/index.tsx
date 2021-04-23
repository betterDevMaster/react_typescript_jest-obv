import Grid from '@material-ui/core/Grid'
import HiddenOnMatch from 'Event/Dashboard/component-rules/HiddenOnMatch'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'

export const MAIN_NAV_BUTTON = 'Main Nav Button'
type MainNavButtonProps = {
  id: string
  button: NavButtonWithSize
  index: number
}

export default React.memo((props: MainNavButtonProps) => {
  const isEditMode = useEditMode()

  const button = <NavButton {...props.button} aria-label="main nav button" />

  if (!isEditMode) {
    return <Container button={props.button}>{button}</Container>
  }

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <Container
          button={props.button}
          ref={provided.innerRef}
          draggableProps={provided.draggableProps}
        >
          <DraggableOverlay>
            <EditComponent
              component={{
                type: MAIN_NAV_BUTTON,
                id: props.id,
              }}
            >
              <>
                <DragHandle handleProps={provided.dragHandleProps} />
                {button}
              </>
            </EditComponent>
          </DraggableOverlay>
        </Container>
      )}
    </Draggable>
  )
})

const Container = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactElement
    button: NavButtonWithSize
    draggableProps?: DraggableProvidedDraggableProps
  }
>((props, ref) => {
  return (
    <HiddenOnMatch rules={props.button.rules}>
      <Published component={props.button}>
        <NewLine ref={ref} {...props} />
      </Published>
    </HiddenOnMatch>
  )
})

const NewLine = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactElement
    button: NavButtonWithSize
    draggableProps?: DraggableProvidedDraggableProps
  }
>((props, ref) => {
  if (props.button.newLine) {
    return (
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid
            item
            xs={12}
            md={props.button.size}
            {...props.draggableProps}
            ref={ref}
          >
            {props.children}
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid
      item
      xs={12}
      md={props.button.size}
      ref={ref}
      {...props.draggableProps}
    >
      {props.children}
    </Grid>
  )
})
