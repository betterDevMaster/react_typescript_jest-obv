import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddResourceButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/AddResourceButton'
import ResourceItem, {
  Resource,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceItem'
import Grid from '@material-ui/core/Grid'
import {useAttendeeVariables} from 'Event'

import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {ResourceListConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceListConfig'
import {uuid} from 'lib/uuid'
import {
  useRemoveSidebarItem,
  useUpdateSidebarItem,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

export const RESOURCE_LIST = 'Resource List'
export interface ResourceListProps {
  id: string
  type: typeof RESOURCE_LIST
  title: string
  description: string
  resources: Resource[]
}

export const createResourceList = (): ResourceListProps => ({
  id: uuid(),
  type: RESOURCE_LIST,
  title: 'Resources',
  description: '',
  resources: [],
})

export const RESOURCE_ICON = {
  pdf: 'picture_as_pdf',
  attachment: 'attachment',
  people: 'people',
  image: 'image',
  photoLibrary: 'photo_library',
}

export function ResourceList(props: ResourceListProps) {
  const isEdit = useEditMode()
  const {resources, description, title} = props
  const {
    template: {sidebar},
  } = useSimpleBlog()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const removeItem = useRemoveSidebarItem(props)

  const v = useAttendeeVariables()

  const hasResources = resources.length > 0
  if (!hasResources && !isEdit) {
    return null
  }

  return (
    <>
      <ResourceListConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        list={props}
      />
      <EditModeOnly>
        <RemoveButton size="large" showing onClick={removeItem}>
          Remove Resources
        </RemoveButton>
      </EditModeOnly>
      <Editable onEdit={toggleConfig}>
        <Heading aria-label="resources">{v(title)}</Heading>
      </Editable>
      <Description aria-label="resource description" color={sidebar.textColor}>
        {v(description)}
      </Description>
      <DroppableList {...props} />
      <EditModeOnly>
        <StyledAddResourceButton list={props} />
      </EditModeOnly>
    </>
  )
}

function DroppableList(props: ResourceListProps) {
  const handleDrag = useHandleDrag(props)

  const isEditMode = useEditMode()
  if (!isEditMode) {
    return (
      <Container>
        <Resources {...props} />
      </Container>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-resources">
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            <>
              <Resources {...props} />
              {provided.placeholder}
            </>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function Resources(props: ResourceListProps) {
  const {template} = useSimpleBlog()
  const {sidebar} = template

  return (
    <>
      {props.resources.map((resource: Resource, index: number) => (
        <ResourceItem
          id={`resource-item-${index}`}
          resource={resource}
          iconColor={sidebar.textColor}
          index={index}
          key={index}
          list={props}
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

function useHandleDrag(props: ResourceListProps) {
  const updateItem = useUpdateSidebarItem()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(props.resources)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateItem({
      ...props,
      resources: moved,
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
