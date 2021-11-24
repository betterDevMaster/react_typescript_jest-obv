import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/Cards/Dashboard/Sidebar/Heading'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddResourceButton from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList/AddResourceButton'
import ResourceItem, {
  Resource,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceItem'
import Grid from '@material-ui/core/Grid'
import {useAttendeeVariables} from 'Event'

import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import {useCardsTemplate} from 'Event/template/Cards'
import {useToggle} from 'lib/toggle'
import {ResourceListConfig} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceListConfig'
import {uuid} from 'lib/uuid'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useHasVisibleItems} from 'Event/attendee-rules/matcher'
import Section from 'Event/template/Cards/Dashboard/Sidebar/Section'
import {EntityList} from 'lib/list'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'

export const RESOURCE_LIST = 'Resource List'
export interface ResourceListProps {
  id: string
  type: typeof RESOURCE_LIST
  title: string
  description: string
  resources: EntityList<Resource>
}

export const createResourceList = (): ResourceListProps => ({
  id: uuid(),
  type: RESOURCE_LIST,
  title: 'Resources',
  description: '',
  resources: {
    ids: [],
    entities: {},
  },
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
  const {sidebar} = useCardsTemplate()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  const v = useAttendeeVariables()

  const hasVisibleItems = useHasVisibleItems(Object.values(resources.entities))

  if (!hasVisibleItems && !isEdit) {
    return null
  }

  return (
    <Section>
      <EditModeOnly>
        <ResourceListConfig
          isVisible={configVisible}
          onClose={toggleConfig}
          list={props}
        />
        <RemoveResourcesButton {...props} />
      </EditModeOnly>
      <Editable onEdit={toggleConfig}>
        <Heading aria-label="resources">{v(title)}</Heading>
      </Editable>
      <Description aria-label="resource description" color={sidebar.textColor}>
        {v(description)}
      </Description>
      <Content {...props} />
      <EditModeOnly>
        <StyledAddResourceButton list={props} />
      </EditModeOnly>
    </Section>
  )
}

function RemoveResourcesButton(props: ResourceListProps) {
  const {remove: removeItem} = useEditSidebarItem()

  return (
    <RemoveButton size="large" showing onClick={removeItem}>
      Remove Resources
    </RemoveButton>
  )
}

function Content(props: ResourceListProps) {
  const isEdit = useEditMode()
  if (isEdit) {
    return <DroppableList {...props} />
  }

  return (
    <Container>
      <Resources {...props} />
    </Container>
  )
}

function DroppableList(props: ResourceListProps) {
  const handleDrag = useHandleDrag(props)

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
  const {sidebar} = useCardsTemplate()

  return (
    <>
      {props.resources.ids.map((id: string, index: number) => {
        const resource = props.resources.entities[id]
        return (
          <ResourceItem
            droppleid={`resource-item-${index}`}
            id={id}
            resource={resource}
            iconColor={sidebar.textColor}
            index={index}
            key={index}
            list={props}
          />
        )
      })}
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
  const {update} = useEditSidebarItem()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(props.resources.ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    update({
      resources: {
        ids: moved,
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
