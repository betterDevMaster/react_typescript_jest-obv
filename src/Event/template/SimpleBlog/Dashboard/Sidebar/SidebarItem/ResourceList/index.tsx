import React from 'react'
import styled from 'styled-components'
import HeadingText from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
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
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {ResourceListConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceListConfig'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {useHasVisibleItems} from 'Event/attendee-rules/matcher'
import {createPositions, HashMap, Ordered, orderedIdsByPosition} from 'lib/list'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'

export const RESOURCE_LIST = 'Resource List'
export interface ResourceListProps extends Ordered {
  type: typeof RESOURCE_LIST
  title: string
  description: string
  resources: HashMap<Resource>
}

export const createResourceList = (): ResourceListProps => ({
  type: RESOURCE_LIST,
  title: 'Resources',
  description: '',
  resources: {},
})

export const RESOURCE_ICON = {
  pdf: 'picture_as_pdf',
  attachment: 'attachment',
  people: 'people',
  image: 'image',
  photoLibrary: 'photo_library',
}

export function ResourceList(props: ResourceListProps) {
  const isEditMode = useEditMode()
  const {resources} = props
  const hasVisibleItems = useHasVisibleItems(Object.values(resources))

  if (isEditMode) {
    return <EditableList {...props} />
  }

  if (!hasVisibleItems) {
    return null
  }

  return (
    <Section>
      <Heading {...props} />
      <Description {...props} />
      <Container>
        <Resources {...props} />
      </Container>
    </Section>
  )
}

function EditableList(props: ResourceListProps) {
  const handleDrag = useHandleDrag(props)
  const {remove: removeItem} = useEditSidebarItem()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  useRemoveIfEmpty(removeItem, props)

  return (
    <Section>
      <ResourceListConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        list={props}
      />
      <RemoveButton size="large" showing onClick={removeItem}>
        Remove Resources
      </RemoveButton>
      <Editable onEdit={toggleConfig}>
        <Heading {...props} />
      </Editable>
      <Description {...props} />
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
      <StyledAddResourceButton list={props} />
    </Section>
  )
}

function Heading(props: ResourceListProps) {
  const {title} = props
  const v = useAttendeeVariables()

  return <HeadingText aria-label="resources">{v(title)}</HeadingText>
}

function Description(props: ResourceListProps) {
  const {description} = props
  const v = useAttendeeVariables()
  const {sidebar} = useSimpleBlogTemplate()

  return (
    <DescriptionText
      aria-label="resource description"
      color={sidebar.textColor}
    >
      {v(description)}
    </DescriptionText>
  )
}

function Resources(props: ResourceListProps) {
  const {resources} = props
  const template = useSimpleBlogTemplate()
  const {sidebar} = template

  const ids = orderedIdsByPosition(resources)

  return (
    <>
      {ids.map((id: string, index: number) => {
        const resource = resources[id]

        return (
          <ResourceItem
            id={id}
            resource={resource}
            iconColor={sidebar.textColor}
            index={index}
            key={id}
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

    const ids = orderedIdsByPosition(props.resources)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    update({
      resources: createPositions(ids),
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

const DescriptionText = styled.p<{color: string}>`
  color: ${(props) => props.color};
`
