import Grid from '@material-ui/core/Grid'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import React from 'react'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {EditComponentOverlay} from 'Event/Dashboard/editor/views/EditComponent'

type CustomButtonProps = {
  id: string
  button: NavButtonWithSize
  index: number
  onEdit?: (id: string) => void
}

export default React.memo((props: CustomButtonProps) => {
  const {onEdit, id, index} = props
  const button = <NavButton {...props.button} aria-label="tech check button" />

  if (!onEdit) {
    return <Container button={props.button}>{button}</Container>
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Container
          button={props.button}
          ref={provided.innerRef}
          draggableProps={provided.draggableProps}
        >
          <DraggableOverlay>
            <EditComponentOverlay onClick={() => onEdit(id)}>
              <>
                <DragHandle handleProps={provided.dragHandleProps} />
                {button}
              </>
            </EditComponentOverlay>
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
