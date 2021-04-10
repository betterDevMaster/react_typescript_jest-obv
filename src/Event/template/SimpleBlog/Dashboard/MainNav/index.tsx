import MainNavButton from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton'
import NewMainNavButton from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/NewMainNavButton'
import React from 'react'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function MainNav(props: {className?: string}) {
  const {mainNav: buttons} = useTemplate()
  const isEditMode = useEditMode()
  const handleDrag = useHandleDrag()

  if (!isEditMode) {
    return (
      <div className={props.className}>
        <Grid container spacing={2} justify="center">
          {buttons.ids.map((id, index) => (
            <MainNavButton
              id={id}
              index={index}
              key={id}
              button={buttons.entities[id]}
            />
          ))}
        </Grid>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="main_nav_buttons">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={props.className}
          >
            <Grid container spacing={2} justify="center">
              {buttons.ids.map((id, index) => (
                <MainNavButton
                  id={id}
                  index={index}
                  key={id}
                  button={buttons.entities[id]}
                />
              ))}
              {provided.placeholder}
              <NewMainNavButton />
            </Grid>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

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
