import Grid from '@material-ui/core/Grid'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import React from 'react'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'

export const MAIN_NAV_BUTTON = 'Main Nav Button'
type MainNavButtonProps = {
  id: string
  button: NavButtonWithSize
  index: number
  onEdit: (index: number) => void
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
            <Editable onEdit={() => props.onEdit(props.index)}>
              <>
                <DragHandle handleProps={provided.dragHandleProps} />
                {button}
              </>
            </Editable>
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
  return (
    <Grid item xs={12} ref={ref} {...props.draggableProps}>
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
})
