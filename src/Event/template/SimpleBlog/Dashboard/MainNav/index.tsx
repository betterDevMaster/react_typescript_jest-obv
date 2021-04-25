import MainNavButton from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton'
import styled from 'styled-components'
import React from 'react'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import NewMainNavButton from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/NewMainNavButton'

export default function MainNav(props: {className?: string}) {
  const {mainNav} = useTemplate()
  const isEditMode = useEditMode()
  const handleDrag = useHandleDrag()

  const {ids, entities} = mainNav

  const buttons = ids.map((id, index) => (
    <MainNavButton id={id} index={index} key={id} button={entities[id]} />
  ))

  if (!isEditMode) {
    return <Container className={props.className}>{buttons}</Container>
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="main_nav_buttons">
        {(provided) => (
          <Container
            className={props.className}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <>
              {buttons}
              {provided.placeholder}
              <StyledNewMainNavButton />
            </>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
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

function useHandleDrag() {
  const {mainNav: buttons} = useTemplate()
  const updateTemplate = useUpdateTemplate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(buttons.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      mainNav: {
        ids: moved,
        entities: {
          ...buttons.entities,
        },
      },
    })
  }
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[7]};
  margin-top: ${(props) => props.theme.spacing[7]};
  width: 100%;
`

const StyledNewMainNavButton = styled(NewMainNavButton)`
  padding-top: ${(props) => props.theme.spacing[2]}!important;
`
