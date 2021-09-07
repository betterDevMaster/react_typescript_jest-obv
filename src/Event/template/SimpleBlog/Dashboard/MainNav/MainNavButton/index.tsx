import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {useToggle} from 'lib/toggle'
import {MainNavButtonConfig} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'

type MainNavButtonProps = {
  id: string
  button: NavButtonWithSize
  index: number
}

export default React.memo((props: MainNavButtonProps) => {
  const isEditMode = useEditMode()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  const button = <NavButton {...props.button} aria-label="main nav button" />

  if (!isEditMode) {
    return <Container button={props.button}>{button}</Container>
  }

  return (
    <>
      <MainNavButtonConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        id={props.id}
        button={props.button}
      />
      <Draggable draggableId={props.id} index={props.index}>
        {(provided) => (
          <Container
            button={props.button}
            ref={provided.innerRef}
            draggableProps={provided.draggableProps}
          >
            <DraggableOverlay>
              <Editable onEdit={toggleConfig}>
                <>
                  <DragHandle handleProps={provided.dragHandleProps} />
                  {button}
                </>
              </Editable>
            </DraggableOverlay>
          </Container>
        )}
      </Draggable>
    </>
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
    <VisibleOnMatch rules={props.button.rules}>
      <Published component={props.button}>
        <Button ref={ref} {...props} />
      </Published>
    </VisibleOnMatch>
  )
})

const Button = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactElement
    button: NavButtonWithSize
    draggableProps?: DraggableProvidedDraggableProps
  }
>((props, ref) => {
  const lineBreak = props.button.newLine ? <SpacerGrid item xs={12} /> : null

  return (
    <>
      {lineBreak}
      <Grid
        item
        xs={12}
        md={props.button.size}
        ref={ref}
        {...props.draggableProps}
      >
        {props.children}
      </Grid>
    </>
  )
})

const SpacerGrid = styled(Grid)`
  padding: 0 !important;
`
