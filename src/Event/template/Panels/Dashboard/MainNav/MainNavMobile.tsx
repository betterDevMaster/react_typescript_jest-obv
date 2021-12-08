import styled from 'styled-components'
import React from 'react'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {usePanelsTemplate, usePanelsUpdate} from 'Event/template/Panels'
import NewMainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton/NewMainNavButton'
import MainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton'
import {createPositions, orderedIdsByPosition} from 'lib/list'

export default function MainNavMobile(props: {className?: string}) {
  const template = usePanelsTemplate()
  const {nav} = template
  const isEditMode = useEditMode()

  const ids = orderedIdsByPosition(nav)
  const buttons = ids.map((id, index) => (
    <MainNavButton id={id} index={index} key={id} button={nav[id]} />
  ))

  if (!isEditMode) {
    return <Container className={props.className}>{buttons}</Container>
  }

  return <Editable {...props}>{buttons}</Editable>
}

function Editable(props: {className?: string; children: React.ReactElement[]}) {
  const handleDrag = useHandleDrag()

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="main_nav_buttons_mobile">
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
    {props.children}
  </Box>
))

function useHandleDrag() {
  const template = usePanelsTemplate()
  const {nav} = template
  const updateTemplate = usePanelsUpdate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const ids = orderedIdsByPosition(nav)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    updateTemplate({
      nav: createPositions(ids),
    })
  }
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[7]};
  margin-top: ${(props) => props.theme.spacing[7]};
`

const StyledNewMainNavButton = styled(NewMainNavButton)`
  padding-top: ${(props) => props.theme.spacing[2]}!important;
`
