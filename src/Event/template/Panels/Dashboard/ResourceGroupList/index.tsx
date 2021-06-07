import React, {useState} from 'react'
import styled from 'styled-components'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddResourceGroupButton from 'Event/template/Panels/Dashboard/ResourceGroupList/AddResourceGroupButton'
import ResourceGroupItem, {
  ResourceGroup,
} from 'Event/template/Panels/Dashboard/ResourceGroupList/ResourceGroup'
import {usePanels} from 'Event/template/Panels'

import Grid from '@material-ui/core/Grid'

import ResourceGroupConfig from 'Event/template/Panels/Dashboard/ResourceGroupList/ResourceGroupConfig'

import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'

export const RESOURCE_GROUP = 'Resource Group'
export const GROUP_RESOURCE_ITEM = 'Group Resource Item'

export interface ResourceGroupList {
  resourceGroups: ResourceGroup[]
}

export default function ResourceGroupList() {
  const [groupEditing, setGroupEditing] = useState<null | number>(null)

  const stopGroupEdting = () => setGroupEditing(null)

  const editGroup = (index: number) => setGroupEditing(index)

  return (
    <div>
      <ResourceGroupConfig onClose={stopGroupEdting} groupId={groupEditing} />
      <DroppableGroups editGroup={editGroup} />
      <EditModeOnly>
        <StyledAddResourceGroupButton edit={editGroup} />
      </EditModeOnly>
    </div>
  )
}

function DroppableGroups(props: {editGroup: (index: number) => void}) {
  const handleDrag = useHandleDrag()
  const isEdit = useEditMode()
  const groups = <ResourceListGroups editGroup={props.editGroup} />

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

function ResourceListGroups(props: {editGroup: (index: number) => void}) {
  const {template} = usePanels()
  const groups = template.resourceGroupList

  if (!groups) {
    return null
  }

  return (
    <>
      {groups.resourceGroups.map((group: ResourceGroup, index: number) => (
        <ResourceGroupItem
          group={group}
          index={index}
          key={index}
          onEdit={props.editGroup}
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
  <Grid className={props.className} ref={ref} {...props}>
    <Grid container direction="column">
      {props.children}
    </Grid>
  </Grid>
))

function useHandleDrag() {
  const {template, update} = usePanels()
  const groups = template.resourceGroupList

  const updateTemplate = update.primitive('resourceGroupList')

  const list = groups?.resourceGroups || []

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(list)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      resourceGroups: moved,
    })
  }
}

const StyledAddResourceGroupButton = styled(AddResourceGroupButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
  margin-top: ${(props) => props.theme.spacing[5]}!important;
`
