import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddResourceButton from 'Event/Dashboard/components/ResourceList/AddResourceButton'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import ResourceItem, {
  Resource,
} from 'Event/Dashboard/components/ResourceList/ResourceItem'
import {useWithAttendeeData} from 'Event/auth/data'
import Grid from '@material-ui/core/Grid'

import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'

export interface ResourceList {
  title: string
  description: string
  resources: Resource[]
}

export const RESOURCE_LIST = 'Resource List'

export const RESOURCE_ITEM = 'Resource Item'

export const RESOURCE_ICON = {
  pdf: 'picture_as_pdf',
  attachment: 'attachment',
  people: 'people',
  image: 'image',
  photoLibrary: 'photo_library',
}

export function ResourceList() {
  const isEdit = useEditMode()
  const {resourceList: list, sidebar} = useTemplate()
  const withAttendeeData = useWithAttendeeData()

  const hasResources = list.resources.length > 0
  if (!hasResources && !isEdit) {
    return null
  }

  return (
    <Section>
      <EditComponent component={{type: RESOURCE_LIST}}>
        <Heading aria-label="resources">{withAttendeeData(list.title)}</Heading>
      </EditComponent>
      <Description aria-label="resource description" color={sidebar.textColor}>
        {withAttendeeData(list.description)}
      </Description>
      <DroppableList />
      <EditModeOnly>
        <StyledAddResourceButton />
      </EditModeOnly>
    </Section>
  )
}

function DroppableList() {
  const resources = ResourceItemList()
  const handleDrag = useHandleDrag()
  const isEdit = useEditMode()

  if (!isEdit) return <Container>{resources}</Container>

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-resources">
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            <>
              {resources}
              {provided.placeholder}
            </>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function ResourceItemList() {
  const {resourceList: list, sidebar} = useTemplate()

  const resources = list.resources.map((resource: Resource, index: number) => (
    <ResourceItem
      id={`resource-item-${index}`}
      resource={resource}
      iconColor={sidebar.textColor}
      index={index}
      key={index}
    />
  ))
  return resources
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
  const updateTemplate = useUpdateTemplate()
  const {resourceList: list} = useTemplate()

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
