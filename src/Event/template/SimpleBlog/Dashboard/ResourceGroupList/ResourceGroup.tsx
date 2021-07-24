import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddGroupResourceButton from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/AddGroupResourceButton'
import ResourceItem from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/ResourceGroupItem'
import {Resource} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceItem'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {useVariables} from 'Event'
import {ResourceList as ResourceListType} from 'Event/template/SimpleBlog/Dashboard/ResourceList'
import {Draggable} from 'react-beautiful-dnd'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import Published from 'Event/Dashboard/editor/views/Published'
import {HasRules} from 'Event/visibility-rules'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {ResourceGroupConfig} from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/ResourceGroupConfig'

import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'

export type ResourceGroup = Publishable & HasRules & ResourceListType

export default function ResourceGroup(props: {
  group: ResourceGroup
  index: number
}) {
  const isEdit = useEditMode()
  const {group, index} = props
  const {
    template: {sidebar},
  } = useSimpleBlog()
  const v = useVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  const hasResources = group.resources.length > 0
  if (!hasResources && !isEdit) {
    return null
  }
  if (!isEdit) {
    return (
      <HiddenOnMatch rules={group.rules}>
        <Published component={group}>
          <ResourceGroupContainer group={group} index={index} />
        </Published>
      </HiddenOnMatch>
    )
  }
  return (
    <>
      <ResourceGroupConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        resourceGroup={group}
        index={index}
      />
      <Draggable draggableId={`resource-group-${index}`} index={index}>
        {(GroupProvided) => (
          <div ref={GroupProvided.innerRef} {...GroupProvided.draggableProps}>
            <DraggableOverlay>
              <DragHandle handleProps={GroupProvided.dragHandleProps} />
              <Editable onEdit={toggleConfig}>
                <>
                  <Heading aria-label="rouresce group title">
                    {v(group.title)}
                  </Heading>
                  <Description
                    aria-label="resource group description"
                    color={sidebar.textColor}
                  >
                    {v(group.description)}
                  </Description>
                </>
              </Editable>
            </DraggableOverlay>
            <DroppableList index={index} />
            <EditModeOnly>
              <StyledAddResourceButton groupIndex={index} />
            </EditModeOnly>
          </div>
        )}
      </Draggable>
    </>
  )
}

function DroppableList(props: {index: number}) {
  const resources = <ResourceList index={props.index} />
  const handleDrag = useHandleDrag(props.index)
  const isEdit = useEditMode()
  if (!isEdit) {
    return <Container>{resources}</Container>
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-resource-group">
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

function ResourceList(props: {index: number}) {
  const {
    template: {sidebar, resourceGroupList: groups},
  } = useSimpleBlog()

  const list = groups?.groups[props.index]

  return (
    <>
      {list.resources.map((resource: Resource, index: number) => (
        <ResourceItem
          id={`resource-item-${index}`}
          groupId={props.index}
          resource={resource}
          iconColor={sidebar.textColor}
          index={index}
          key={index}
        />
      ))}
    </>
  )
}

function ResourceGroupContainer(props: {group: ResourceGroup; index: number}) {
  const {group, index} = props
  const {
    template: {sidebar},
  } = useSimpleBlog()
  const v = useVariables()

  return (
    <div>
      <Heading aria-label="resource group title">{v(group.title)}</Heading>
      <Description
        aria-label="resource group description"
        color={sidebar.textColor}
      >
        {v(group.description)}
      </Description>
      <DroppableList index={index} />
    </div>
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

function useHandleDrag(i: number) {
  const updateTemplate = useDispatchUpdate()

  const {
    template: {resourceGroupList: list},
  } = useSimpleBlog()
  if (typeof list === 'undefined') {
    throw new Error('error!')
  }

  const items = list.groups[i]

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(items.resources)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    const updatedList = {
      ...items,
      resources: moved,
    }

    const updatedResourceGroup = list.groups.map((rg, index) => {
      if (index === i) {
        return updatedList
      }
      return rg
    })

    updateTemplate({
      resourceGroupList: {
        groups: updatedResourceGroup,
      },
    })
  }
}

const Box = styled.div`
  margin-bottom: 15px;
  width: 100%;
`

const StyledAddResourceButton = styled(AddGroupResourceButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const Description = styled.p<{color: string}>`
  color: ${(props) => props.color};
`
