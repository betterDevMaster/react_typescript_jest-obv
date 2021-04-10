import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import HiddenOnMatch from 'Event/Dashboard/component-rules/HiddenOnMatch'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable, DraggableProvidedDragHandleProps} from 'react-beautiful-dnd'
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

  /**
   * There is a lot of duplication here to check whether to include the
   * drag components. Not ideal, but not sure there is a better way
   * due to props being required at different level components.
   */

  if (!isEditMode) {
    return (
      <HiddenOnMatch rules={props.button.rules}>
        <Grid item xs={12} md={props.button.size}>
          <Published component={props.button}>
            <NavButton {...props.button} aria-label="main nav button" />
          </Published>
        </Grid>
      </HiddenOnMatch>
    )
  }

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <HiddenOnMatch rules={props.button.rules}>
          <DraggableGrid
            item
            xs={12}
            md={props.button.size}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <EditComponent
              component={{
                type: MAIN_NAV_BUTTON,
                id: props.id,
              }}
            >
              <>
                <DragHandle handleProps={provided.dragHandleProps} />
                <Published component={props.button}>
                  <NavButton {...props.button} aria-label="main nav button" />
                </Published>
              </>
            </EditComponent>
          </DraggableGrid>
        </HiddenOnMatch>
      )}
    </Draggable>
  )
})

function DragHandle(props: {handleProps?: DraggableProvidedDragHandleProps}) {
  return (
    <DragHandleBox {...props.handleProps} aria-label="item drag handle">
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

const DraggableGrid = styled(Grid)`
  position: relative;

  &:hover ${DragHandleBox} {
    display: inline-flex;
  }
`
