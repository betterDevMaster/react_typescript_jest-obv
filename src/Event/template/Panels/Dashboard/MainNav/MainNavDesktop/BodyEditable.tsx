import React from 'react'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {usePanelsTemplate, usePanelsUpdate} from 'Event/template/Panels'
import NewMainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton/NewMainNavButton'
import MainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton'
import CountDownTimers from 'Event/template/Panels/Dashboard/CountDownTimers'
import {Container} from 'Event/template/Panels/Dashboard/MainNav/MainNavDesktop'
import {createPositions, orderedIdsByPosition} from 'lib/list'

export default function BodyEditable(props: {className?: string}) {
  const handleDrag = useHandleDrag()
  const template = usePanelsTemplate()
  const {nav} = template

  const ids = orderedIdsByPosition(nav)

  return (
    <>
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="main_nav_buttons">
          {(provided) => (
            <Container
              ref={provided.innerRef}
              {...provided.droppableProps}
              canScroll
              className={props.className}
            >
              <CountDownTimers />
              <>
                {ids.map((id, index) => (
                  <MainNavButton
                    id={id}
                    index={index}
                    key={id}
                    button={nav[id]}
                  />
                ))}
                {provided.placeholder}
                <NewButton />
              </>
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

function useHandleDrag() {
  const template = usePanelsTemplate()
  const updateTemplate = usePanelsUpdate()
  const {nav} = template

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

function NewButton() {
  const isEditMode = useEditMode()

  if (!isEditMode) {
    return null
  }

  return <NewMainNavButton />
}
