import styled from 'styled-components'
import React, {useState} from 'react'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {usePanels} from 'Event/template/Panels'
import NewMainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton/NewMainNavButton'
import MainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton'
import MainNavButtonConfig from 'Event/template/Panels/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'

export default function MainNav(props: {className?: string}) {
  const {template} = usePanels()
  const {nav} = template
  const isEditMode = useEditMode()
  const handleDrag = useHandleDrag()

  const [editing, setEditing] = useState<null | number>(null)
  const edit = (index: number) => setEditing(index)
  const stopEditing = () => setEditing(null)

  const {ids, entities} = nav

  const buttons = ids.map((id, index) => (
    <MainNavButton
      id={id}
      index={index}
      key={id}
      button={entities[id]}
      onEdit={edit}
    />
  ))

  if (!isEditMode) {
    return <Container className={props.className}>{buttons}</Container>
  }

  return (
    <>
      <MainNavButtonConfig editing={editing} onClose={stopEditing} />
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
                <StyledNewMainNavButton edit={setEditing} />
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
    <ScrollContainer>
      <Grid container justify="center" spacing={2}>
        {props.children}
      </Grid>
    </ScrollContainer>
  </Box>
))

function useHandleDrag() {
  const {template} = usePanels()
  const {nav: buttons} = template
  const updateTemplate = useDispatchUpdate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(buttons.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      nav: {
        ids: moved,
        entities: {
          ...buttons.entities,
        },
      },
    })
  }
}

const Box = styled.div`
  flex: 1;
  margin-bottom: ${(props) => props.theme.spacing[7]};
  margin-top: ${(props) => props.theme.spacing[7]};
  width: 100%;
  position: relative;
`

const ScrollContainer = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /* Only want to enable inner scroll in desktop layout */
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    position: absolute;
    overflow: auto;
  }
`

const StyledNewMainNavButton = styled(NewMainNavButton)`
  padding-top: ${(props) => props.theme.spacing[2]}!important;
`
