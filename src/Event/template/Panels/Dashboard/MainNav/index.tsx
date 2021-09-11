import styled from 'styled-components'
import React from 'react'
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

export default function MainNav(props: {className?: string}) {
  const {template} = usePanels()
  const {nav} = template
  const isEditMode = useEditMode()
  const handleDrag = useHandleDrag()

  const {ids, entities} = nav

  const buttons = ids.map((id, index) => (
    <MainNavButton id={id} index={index} key={id} button={entities[id]} />
  ))

  if (!isEditMode) {
    return <Container className={props.className}>{buttons}</Container>
  }

  return (
    <>
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
      <StyledGridContainer container justify="center" spacing={2}>
        {props.children}
      </StyledGridContainer>
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
  overflow-y: auto;
  width: 100%;
  position: relative;

  /* Make child full height on desktop without height: 100% which
   * breaks scroll (can't see top of container).
   */
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    display: flex;
  }
`

const ScrollContainer = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;

  /**
   * Fix scrollbar appearing in mobile resolution
   */
  padding: ${(props) => props.theme.spacing[2]} 0;

  /* Only want to enable inner scroll in desktop layout */
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    /**
     * Center buttons vertically
     */
    display: flex;
    align-items: center;
  }
`

const StyledNewMainNavButton = styled(NewMainNavButton)`
  padding-top: ${(props) => props.theme.spacing[2]}!important;
`

const StyledGridContainer = styled(Grid)`
  /**
   * Fix vertical scroll not showing top when align-center.
   * reference: https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container
 */
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    margin: auto;
  }
`
