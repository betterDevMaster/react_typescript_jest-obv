import MainNavButton from 'Event/template/Cards/Dashboard/MainNav/MainNavButton'
import styled from 'styled-components'
import React from 'react'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import NewMainNavButton from 'Event/template/Cards/Dashboard/MainNav/MainNavButton/NewMainNavButton'
import MainNavConfig from 'Event/template/Cards/Dashboard/MainNav/MainNavConfig'
import Button from '@material-ui/core/Button'
import {useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useToggle} from 'lib/toggle'
import Grid from '@material-ui/core/Grid'

export default function MainNav() {
  const template = useCardsTemplate()
  const {mainNav} = template

  const isEditMode = useEditMode()

  const {flag: visible, toggle: toggleConfig} = useToggle()
  const {
    ids,
    entities,
    width: mainNavWidth,
    buttonHeight,
    borderRadius: configBorderRadius,
  } = mainNav

  const oneRowButtons = ids.filter((id) => entities[id].row === 1)
  const twoRowButtons = ids.filter((id) => entities[id].row === 2)
  const rows = [oneRowButtons, twoRowButtons]

  /**
   * Border radius hides hover-edit buttons so we'll disable
   * radius when in edit mode.
   */
  const borderRadius = isEditMode ? 0 : configBorderRadius

  /**
   * It could have more 2 rows later, though cards template has only 2 rows.
   */
  const buttons = rows.map((row) => {
    return row.map((id, index) => (
      <MainNavButton
        id={id}
        index={index}
        key={id}
        button={entities[id]}
        height={buttonHeight}
      />
    ))
  })

  return (
    <>
      <NavButtonContainer width={mainNavWidth} borderRadius={borderRadius}>
        <RowButtons
          buttons={buttons[0]}
          droppableId="row_1_main_nav_buttons"
          rowId={1}
        />
        <RowButtons
          buttons={buttons[1]}
          droppableId="row_2_main_nav_buttons"
          rowId={2}
        />
      </NavButtonContainer>
      <EditModeOnly>
        <MainNavConfig isVisible={visible} onClose={toggleConfig} />
        <Grid container spacing={4} justify="center">
          <Grid item md={6} sm={6}>
            <NewMainNavButton />
          </Grid>
          <Grid item md={6} sm={6}>
            <Button
              onClick={toggleConfig}
              fullWidth
              size="large"
              variant="contained"
              color="secondary"
              aria-label="edit main nav"
            >
              Edit Main Nav
            </Button>
          </Grid>
        </Grid>
      </EditModeOnly>
    </>
  )
}

export function RowButtons(props: {
  className?: string
  buttons: JSX.Element[]
  droppableId: string
  rowId: number
}) {
  const isEditMode = useEditMode()
  if (!isEditMode) {
    return <Container className={props.className}>{props.buttons}</Container>
  }

  return <DraggableList {...props} />
}

function DraggableList(props: {
  className?: string
  buttons: JSX.Element[]
  droppableId: string
  rowId: number
}) {
  const handleDrag = useHandleDrag(props.rowId)

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId={props.droppableId} direction="horizontal">
        {(provided) => (
          <Container
            className={props.className}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <>
              {props.buttons}
              {provided.placeholder}
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

function useHandleDrag(rowIndex: number) {
  const template = useCardsTemplate()
  const {mainNav: buttons} = template
  const updateTemplate = useCardsUpdate()

  const buttonsInRow = buttons.ids.filter(
    (id) => buttons.entities[id].row === rowIndex,
  )
  const buttonsInAnother = buttons.ids.filter(
    (id) => buttons.entities[id].row !== rowIndex,
  )

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(buttonsInRow)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      mainNav: {
        ids: moved.concat(buttonsInAnother),
      },
    })
  }
}

const NavButtonContainer = styled.div<{width: number; borderRadius: number}>`
  margin-bottom: ${(props) => props.theme.spacing[7]};
  margin-top: ${(props) => props.theme.spacing[7]};
  width: ${(props) => props.width}%;
  border-radius: ${(props) => props.borderRadius}px;
  overflow: hidden;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 90%;
  }
`

const Box = styled.div`
  display: flex;
  flex-wrap: nowrap;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`
