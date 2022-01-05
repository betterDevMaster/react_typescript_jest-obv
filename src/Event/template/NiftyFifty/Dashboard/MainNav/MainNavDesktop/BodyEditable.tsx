import React from 'react'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'

import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'
import NewMainNavButton from 'Event/template/NiftyFifty/Dashboard/MainNav/MainNavButton/NewMainNavButton'
import MainNavButton from 'Event/template/NiftyFifty/Dashboard/MainNav/MainNavButton'
import {Container} from 'Event/template/NiftyFifty/Dashboard/MainNav/MainNavDesktop'

import {createPositions, orderedIdsByPosition} from 'lib/list'

export default function BodyEditable(props: {className?: string}) {
  const handleDrag = useHandleDrag()
  const template = useNiftyFiftyTemplate()
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
  const template = useNiftyFiftyTemplate()
  const updateTemplate = useNiftyFiftyUpdate()
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
