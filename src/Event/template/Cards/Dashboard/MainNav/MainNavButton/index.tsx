import styled from 'styled-components'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {useToggle} from 'lib/toggle'
import {MainNavButtonConfig} from 'Event/template/Cards/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'
import CardsNavButton, {
  CardsNavButtonProps,
} from 'Event/template/Cards/Dashboard/CardsNavButton'

type MainNavButtonProps = {
  id: string
  button: CardsNavButtonProps
  index: number
}

export default React.memo((props: MainNavButtonProps) => {
  const isEditMode = useEditMode()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const {flag: configCopyVisible, toggle: toggleCopyConfig} = useToggle()

  if (!isEditMode) {
    return (
      <Container button={props.button}>
        <Button {...props} />
      </Container>
    )
  }

  return (
    <>
      <MainNavButtonConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        id={props.id}
        button={props.button}
      />
      {/* Duplicate config for 'copying', note the missing ID prop. */}
      <MainNavButtonConfig
        isVisible={configCopyVisible}
        onClose={toggleCopyConfig}
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
              <Editable onEdit={toggleConfig} onCopy={toggleCopyConfig}>
                <>
                  <DragHandle handleProps={provided.dragHandleProps} />
                  <Button {...props} />
                </>
              </Editable>
            </DraggableOverlay>
          </Container>
        )}
      </Draggable>
    </>
  )
})

function Button(props: {button: CardsNavButtonProps}) {
  return (
    <CardsNavButton
      {...props.button}
      aria-label="main nav button"
      iconSize={65}
      iconStacked
    />
  )
}

const Container = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactElement
    button: CardsNavButtonProps
    draggableProps?: DraggableProvidedDraggableProps
  }
>((props, ref) => {
  return (
    <VisibleOnMatch rules={props.button.rules}>
      <Published component={props.button}>
        <Box ref={ref} {...props} {...props.draggableProps} />
      </Published>
    </VisibleOnMatch>
  )
})

const Box = styled.div`
  flex: 1;
  padding: 1px;

  /**
   * Fix case where the MainNavHeight is smaller than the intrinsic
   * button height, which would result in various button heights
   * in a single row.
   */

  display: flex;
  flex-direction: column;

  /* Not ideal, but we know .drag-handle is the only child div that shouldn't be 100% height */
  div:not(.drag-handle) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  a {
    flex: 1;
  }
`
