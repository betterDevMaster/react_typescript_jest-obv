import React from 'react'
import {Grid, Button, withStyles} from '@material-ui/core'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import {spacing} from 'lib/ui/theme'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {Form} from 'organization/Event/FormsProvider'

type FormItemProps = {
  form: Form
  index: number
  edit: () => void
}

export default React.memo((props: FormItemProps) => {
  return (
    <Draggable draggableId={`${props.form.id}`} index={props.index}>
      {(provided) => (
        <Container
          ref={provided.innerRef}
          draggableProps={provided.draggableProps}
        >
          <DraggableOverlay>
            <DragHandle handleProps={provided.dragHandleProps} />
            <StyledFormItem
              fullWidth
              size="large"
              aria-label="form item"
              onClick={props.edit}
            >
              {props.form.name}
            </StyledFormItem>
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
    draggableProps?: DraggableProvidedDraggableProps
  }
>((props, ref) => {
  return <NewLine ref={ref} {...props} />
})

const NewLine = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactElement
    draggableProps?: DraggableProvidedDraggableProps
  }
>((props, ref) => {
  return (
    <Grid item xs={12} ref={ref} {...props.draggableProps}>
      {props.children}
    </Grid>
  )
})

const StyledFormItem = withStyles({
  root: {
    marginTop: spacing[2],
  },
})(Button)
