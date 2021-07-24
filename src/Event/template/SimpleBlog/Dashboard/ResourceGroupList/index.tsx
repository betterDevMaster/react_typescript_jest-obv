import React from 'react'
import styled from 'styled-components'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddResourceGroupButton from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/AddResourceGroupButton'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import ResourceGroupItem, {
  ResourceGroup,
} from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/ResourceGroup'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'

/**
 * Nest resource groups in a top-level object to allow defining configs
 * that can be shared between groups in the future such as style,
 * download options, etc.
 */
export interface ResourceGroupList {
  groups: ResourceGroup[]
}

export default function ResourceGroupList() {
  return (
    <Section>
      <DroppableGroups />
      <EditModeOnly>
        <StyledAddResourceGroupButton />
      </EditModeOnly>
    </Section>
  )
}

function DroppableGroups() {
  const handleDrag = useHandleDrag()
  const isEdit = useEditMode()
  const groups = <ResourceListGroups />

  if (!isEdit) return <Container>{groups}</Container>

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-resource-groups">
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            <>
              {groups}
              {provided.placeholder}
            </>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function ResourceListGroups() {
  const {
    template: {resourceGroupList: list},
  } = useSimpleBlog()

  if (!list) {
    return null
  }

  return (
    <>
      {list.groups.map((group: ResourceGroup, index: number) => (
        <ResourceGroupItem group={group} index={index} key={index} />
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
    {props.children}
  </Box>
))

function useHandleDrag() {
  const updateTemplate = useDispatchUpdate()
  const {
    template: {resourceGroupList: list},
  } = useSimpleBlog()

  const items = list?.groups || []

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(items)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      resourceGroupList: {
        groups: moved,
      },
    })
  }
}

const Box = styled.div`
  width: 100%;
  margin-bottom: 30px;
`

const StyledAddResourceGroupButton = styled(AddResourceGroupButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
  margin-top: ${(props) => props.theme.spacing[5]}!important;
`
