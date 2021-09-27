import styled from 'styled-components'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
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
  button: NavButtonWithSize
  index: number
  isHidden?: boolean
  disableEdit?: boolean
}

export default React.memo((props: MainNavButtonProps) => {
  const isEditMode = useEditMode()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const {flag: showingCopyConfig, toggle: toggleCopyConfig} = useToggle()

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
      <MainNavButtonConfig
        button={props.button}
        isVisible={showingCopyConfig}
        onClose={toggleCopyConfig}
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
              <Editable onEdit={toggleConfig} onCopy={toggleCopyConfig}>
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
    isHidden?: boolean
  }
>((props, ref) => {
  const {button} = props
  const {size} = button

  const widthPercent = 100 * (size / 12)

  return (
    <VisibleOnMatch rules={props.button.rules}>
      <Published component={props.button}>
        <Box
          ref={ref}
          isHidden={props.isHidden}
          {...props.draggableProps}
          data-testid="main nav button container"
          width={widthPercent}
        >
          {props.children}
        </Box>
      </Published>
    </VisibleOnMatch>
  )
})

const Box = styled.div<{
  isHidden?: boolean
  width: number
}>`
  ${(props) => (props.isHidden ? 'display: none;' : '')}
  width: ${(props) => props.width}%;
  margin-bottom: ${(props) => props.theme.spacing[2]};
  margin-left: auto;
  margin-right: auto;
`
