import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import HiddenOnMatch from 'Event/Dashboard/component-rules/HiddenOnMatch'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import Published from 'Event/Dashboard/editor/views/Published'
import {
  Draggable,
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

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

function DragHandle(props: {handleProps?: DraggableProvidedDragHandleProps}) {
  return (
    <DragHandleBox {...props.handleProps} aria-label="button drag handle">
      <DragHandleIcon />
    </DragHandleBox>
  )
}

const DragHandleBox = styled.div`
  position: absolute;
  left: ${(props) => props.theme.spacing[1]};
  top: ${(props) => props.theme.spacing[1]};
  z-index: 2;
  background: #ffffff;
  display: none;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }

  svg {
    color: ${(props) => props.theme.colors.primary};
  }
`

/**
 * Handle the show drag handle on hover
 */

const DraggableOverlay = styled.div`
  position: relative;

  &:hover ${DragHandleBox} {
    display: inline-flex;
  }
`
