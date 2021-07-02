import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddResourceButton from 'Event/template/SimpleBlog/Dashboard/ResourceList/AddResourceButton'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import ResourceItem, {
  Resource,
} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceItem'
import Grid from '@material-ui/core/Grid'
import {useVariables} from 'Event'

import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {ResourceListConfig} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceListConfig'

export interface ResourceList {
  title: string
  description: string
  resources: Resource[]
}

export const RESOURCE_ICON = {
  pdf: 'picture_as_pdf',
  attachment: 'attachment',
  people: 'people',
  image: 'image',
  photoLibrary: 'photo_library',
}

export function ResourceList() {
  const isEdit = useEditMode()
  const {template} = useSimpleBlog()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  const {resourceList: list, sidebar} = template
  const v = useVariables()

  const hasResources = list.resources.length > 0
  if (!hasResources && !isEdit) {
    return null
  }

  return (
    <>
      <ResourceListConfig isVisible={configVisible} onClose={toggleConfig} />
      <Section>
        <Editable onEdit={toggleConfig}>
          <Heading aria-label="resources">{v(list.title)}</Heading>
        </Editable>
        <Description
          aria-label="resource description"
          color={sidebar.textColor}
        >
          {v(list.description)}
        </Description>
        <DroppableList />
        <EditModeOnly>
          <StyledAddResourceButton />
        </EditModeOnly>
      </Section>
    </>
  )
}

function DroppableList() {
  const handleDrag = useHandleDrag()

  const isEditMode = useEditMode()
  if (!isEditMode) {
    return (
      <Container>
        <Resources />
      </Container>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-resources">
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            <>
              <Resources />
              {provided.placeholder}
            </>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function Resources() {
  const {template} = useSimpleBlog()
  const {resourceList: list, sidebar} = template

  return (
    <>
      {list.resources.map((resource: Resource, index: number) => (
        <ResourceItem
          id={`resource-item-${index}`}
          resource={resource}
          iconColor={sidebar.textColor}
          index={index}
          key={index}
        />
      ))}
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
    <Grid container>{props.children}</Grid>
  </Box>
))

function useHandleDrag() {
  const updateTemplate = useDispatchUpdate()
  const {template} = useSimpleBlog()

  const {resourceList: list} = template

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(list.resources)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      resourceList: {
        ...list,
        resources: moved,
      },
    })
  }
}

const Box = styled.div`
  margin-bottom: 30px;
  width: 100%;
`

const StyledAddResourceButton = styled(AddResourceButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
  margin-top: ${(props) => props.theme.spacing[5]}!important;
`

const Description = styled.p<{color: string}>`
  color: ${(props) => props.color};
`
