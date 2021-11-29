import MainNavButton from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton'
import styled from 'styled-components'
import React from 'react'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import NewMainNavButton from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/NewMainNavButton'
import {
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import {createPositions, orderedIdsByPosition} from 'lib/list'

export default function MainNav(props: {className?: string}) {
  const template = useSimpleBlogTemplate()
  const {mainNav} = template
  const isEditMode = useEditMode()

  const ids = orderedIdsByPosition(mainNav)
  const buttons = ids.map((id, index) => (
    <MainNavButton id={id} index={index} key={id} button={mainNav[id]} />
  ))

  if (isEditMode) {
    return <Editable className={props.className}>{buttons}</Editable>
  }

  return <Container className={props.className}>{buttons}</Container>
}

function Editable(props: {children: JSX.Element[]; className?: string}) {
  const handleDrag = useHandleDrag()

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
              {props.children}
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
  const set = useSimpleBlogUpdate()
  const template = useSimpleBlogTemplate()
  const {mainNav: buttons} = template

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const ids = orderedIdsByPosition(buttons)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    set({
      mainNav: createPositions(ids),
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
