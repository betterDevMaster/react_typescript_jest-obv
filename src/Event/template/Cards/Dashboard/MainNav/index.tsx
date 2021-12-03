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
import {createPositions, orderedIdsByPosition} from 'lib/list'
import {HashMap} from 'lib/list'
import {CardsNavButtonProps} from '../CardsNavButton'

export default function MainNav() {
  const template = useCardsTemplate()
  const {mainNav} = template

  const isEditMode = useEditMode()

  const {flag: visible, toggle: toggleConfig} = useToggle()
  const {width: mainNavWidth, borderRadius: configBorderRadius} = mainNav

  /**
   * Border radius hides hover-edit buttons so we'll disable
   * radius when in edit mode.
   */
  const borderRadius = isEditMode ? 0 : configBorderRadius

  return (
    <>
      <NavButtonContainer width={mainNavWidth} borderRadius={borderRadius}>
        <RowButtons row={1} />
        <RowButtons row={2} />
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
  row: CardsNavButtonProps['row']
}) {
  const {row} = props
  const {mainNav} = useCardsTemplate()
  const rowButtons = useRowButtons(row)
  const ids = orderedIdsByPosition(rowButtons)

  const buttons = ids.map((id, index) => (
    <MainNavButton
      id={id}
      key={id}
      index={index}
      button={mainNav.buttons[id]}
    />
  ))

  const isEditMode = useEditMode()
  if (!isEditMode) {
    return <Container className={props.className}>{buttons}</Container>
  }

  return <DraggableList {...props}>{buttons}</DraggableList>
}

function DraggableList(props: {
  className?: string
  children: JSX.Element[]
  row: CardsNavButtonProps['row']
}) {
  const {row} = props
  const handleDrag = useHandleDrag(row)

  const droppableId = `main_nav_row_${row}`

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId={droppableId} direction="horizontal">
        {(provided) => (
          <Container
            className={props.className}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <>
              {props.children}
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

function useHandleDrag(row: CardsNavButtonProps['row']) {
  const updateTemplate = useCardsUpdate()
  const buttons = useRowButtons(row)

  return (result: DropResult) => {
    const {destination, source} = result
    if (!destination) {
      return
    }
    const ids = orderedIdsByPosition(buttons)

    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    updateTemplate({
      mainNav: {
        buttons: createPositions(ids),
      },
    })
  }
}

function useRowButtons(row: CardsNavButtonProps['row']) {
  const {
    mainNav: {buttons},
  } = useCardsTemplate()

  return Object.entries(buttons)
    .filter(([id, button]) => button.row === row)
    .reduce((acc, [id, button]) => {
      acc[id] = button
      return acc
    }, {} as HashMap<CardsNavButtonProps>)
}

const NavButtonContainer = styled.div<{width: number; borderRadius: number}>`
  margin-bottom: ${(props) => props.theme.spacing[7]};
  margin-top: ${(props) => props.theme.spacing[7]};
  width: ${(props) => props.width}%;
  border-radius: ${(props) => props.borderRadius}px;
  overflow: hidden;
  display: table;

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
