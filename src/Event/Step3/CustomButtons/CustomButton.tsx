import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import React from 'react'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {EditComponentOverlay} from 'Event/Dashboard/editor/views/EditComponent'
import {useToggle} from 'lib/toggle'
import {EntityList} from 'lib/list'
import ButtonConfig from 'Event/Step3/CustomButtons/ButtonConfig'

type CustomButtonProps = {
  id: string
  button: NavButtonWithSize
  buttons: EntityList<NavButtonWithSize>
  index: number
  update?: (buttons: EntityList<NavButtonWithSize>) => void
  add?: (button: NavButtonWithSize) => void
}

export default React.memo((props: CustomButtonProps) => {
  const {id, index, update, buttons, button, add} = props
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  const duplicate = () => {
    if (!add) {
      throw new Error('Missing button add function')
    }
    add(button)
  }

  const removeButton = () => {
    if (!update) {
      throw new Error('Missing button update function')
    }

    const {[id]: target, ...otherButtons} = buttons.entities

    const removed = {
      ids: buttons.ids.filter((i) => i !== id),
      entities: {...otherButtons},
    }

    toggleConfig()
    update(removed)
  }

  const handleUpdate = (button: NavButtonWithSize) => {
    if (!update) {
      throw new Error('Missing button update function')
    }

    const updated = {
      ids: [...buttons.ids],
      entities: {
        ...buttons.entities,
        [id]: button,
      },
    }

    update(updated)
  }

  const buttonComponent = (
    <NavButton {...props.button} aria-label="tech check button" />
  )

  if (!update) {
    return <Container button={props.button}>{buttonComponent}</Container>
  }

  return (
    <>
      <ButtonConfig
        isVisible={configVisible}
        id={id}
        button={props.button}
        buttons={buttons}
        onClose={toggleConfig}
        onRemove={removeButton}
        onUpdate={handleUpdate}
      />
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <Container
            button={props.button}
            ref={provided.innerRef}
            draggableProps={provided.draggableProps}
          >
            <DraggableOverlay>
              <EditComponentOverlay onClick={toggleConfig} onCopy={duplicate}>
                <>
                  <DragHandle handleProps={provided.dragHandleProps} />
                  {buttonComponent}
                </>
              </EditComponentOverlay>
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
