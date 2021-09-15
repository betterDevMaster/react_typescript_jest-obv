import styled from 'styled-components'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import NavButton from 'Event/Dashboard/components/NavButton'
import React from 'react'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useToggle} from 'lib/toggle'
import MainNavButtonConfig from 'Event/template/Panels/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'

export const MAIN_NAV_BUTTON = 'Main Nav Button'
type MainNavButtonProps = {
  id: string
  button: NavButton
  index: number
  isHidden?: boolean
  disableEdit?: boolean
}

export default React.memo((props: MainNavButtonProps) => {
  const isEditMode = useEditMode()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  const button = <NavButton {...props.button} aria-label="main nav button" />

  if (!isEditMode || props.disableEdit) {
    return (
      <Container button={props.button} isHidden={props.isHidden}>
        {button}
      </Container>
    )
  }

  return (
    <>
      <MainNavButtonConfig
        button={props.button}
        id={props.id}
        isVisible={configVisible}
        onClose={toggleConfig}
      />
      <Draggable draggableId={props.id} index={props.index}>
        {(provided) => (
          <Container
            button={props.button}
            ref={provided.innerRef}
            draggableProps={provided.draggableProps}
            isHidden={props.isHidden}
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
    button: NavButton
    draggableProps?: DraggableProvidedDraggableProps
    isHidden?: boolean
  }
>((props, ref) => {
  return (
    <VisibleOnMatch rules={props.button.rules}>
      <Published component={props.button}>
        <Box
          ref={ref}
          isHidden={props.isHidden}
          {...props.draggableProps}
          data-testid="main nav button container"
        >
          {props.children}
        </Box>
      </Published>
    </VisibleOnMatch>
  )
})

const Box = styled.div<{
  isHidden?: boolean
}>`
  ${(props) => (props.isHidden ? 'display: none;' : '')}
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`
