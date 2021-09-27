import React from 'react'
import styled from 'styled-components'
import {EntityList} from 'lib/list'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import CustomButton from 'Event/Step3/CustomButtons/CustomButton'
import NewCustomButton from 'Event/Step3/CustomButtons/NewCustomButton'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {v4 as uid} from 'uuid'

type CustomButtonsProps = {
  buttons: EntityList<NavButtonWithSize>
  className?: string
  update?: (buttons: EntityList<NavButtonWithSize>) => void
}

export default function CustomButtons(props: CustomButtonsProps) {
  const {buttons, update} = props
  const {ids, entities} = buttons

  if (!update) {
    return (
      <Container className={props.className}>
        {ids.map((id, index) => (
          <CustomButton
            buttons={buttons}
            id={id}
            index={index}
            key={index}
            button={entities[id]}
          />
        ))}
      </Container>
    )
  }

  return <Editable {...props} update={update} />
}

function Editable(
  props: CustomButtonsProps & {
    update: (buttons: EntityList<NavButtonWithSize>) => void
  },
) {
  const {buttons, update} = props
  const {ids, entities} = buttons
  const handleDrag = useHandleDrag(update, buttons)

  const addButton = (button: NavButtonWithSize) => {
    const id = uid()

    const entities = {
      ...buttons.entities,
      [id]: button,
    }
    const ids = [...buttons.ids, id]

    update({
      entities,
      ids,
    })
  }

  return (
    <>
      <NewButtonBox>
        <NewCustomButton onAdd={addButton} />
      </NewButtonBox>
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="tech_check_buttons">
          {(provided) => (
            <Container
              className={props.className}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <>
                {ids.map((id, index) => (
                  <CustomButton
                    update={update}
                    buttons={buttons}
                    id={id}
                    index={index}
                    key={index}
                    button={entities[id]}
                    add={addButton}
                  />
                ))}
                {provided.placeholder}
              </>
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

const Container = React.forwardRef<
  HTMLDivElement,
  {
    className?: string
    children: React.ReactElement | React.ReactElement[]
  } & Partial<DroppableProvidedProps>
>((props, ref) => (
  <Box className={props.className} ref={ref} {...props}>
    <Grid container justify="center" spacing={2}>
      {props.children}
    </Grid>
  </Box>
))

function useHandleDrag(
  update: (buttons: EntityList<NavButtonWithSize>) => void,
  buttons: EntityList<NavButtonWithSize>,
) {
  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(buttons.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    update({
      ids: moved,
      entities: {...buttons.entities},
    })
  }
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[7]};
  margin-top: ${(props) => props.theme.spacing[7]};
  width: 100%;
`

const NewButtonBox = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`
