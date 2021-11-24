import React from 'react'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {usePanelsTemplate, usePanelsUpdate} from 'Event/template/Panels'
import NewMainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton/NewMainNavButton'
import MainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton'
import CountDownTimers from 'Event/template/Panels/Dashboard/CountDownTimers'
import {Container} from 'Event/template/Panels/Dashboard/MainNav/MainNavDesktop'

export default function BodyEditable(props: {className?: string}) {
  const handleDrag = useHandleDrag()
  const template = usePanelsTemplate()
  const {
    nav: {ids, entities},
  } = template

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
                    button={entities[id]}
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
  const {nav: buttons} = template

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
      },
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
