import React, {useState} from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/Panels/Dashboard/Heading'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddResourceButton from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/AddResourceButton'
import ResourceItem from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/ResourceItem'
import {Resource} from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/ResourceItem'

import Grid from '@material-ui/core/Grid'
import {useVariables} from 'Event'

import {Draggable} from 'react-beautiful-dnd'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'

import {Publishable} from 'Event/Dashboard/editor/views/Published'
import Published from 'Event/Dashboard/editor/views/Published'

import {HasRules} from 'Event/visibility-rules'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import {usePanels} from 'Event/template/Panels'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ResourceItemConfig from 'Event/template/Panels/Dashboard/Resources/ResourceGroupList/ResourceItemConfig'

import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'

export type ResourceGroup = Publishable &
  HasRules & {
    title: string
    resources: Resource[]
    description: string
    fontSize?: number
    color?: number
    cardBackgroundColor?: string
  }

export default function ResourceGroup(props: {
  group: ResourceGroup
  index: number
  onEdit: (index: number) => void
}) {
  const isEdit = useEditMode()
  const {group, index} = props
  const v = useVariables()

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
    <Draggable draggableId={`resource-group-${index}`} index={index}>
      {(GroupProvided) => (
        <div ref={GroupProvided.innerRef} {...GroupProvided.draggableProps}>
          <StyledCard
            backgroundColor={group.cardBackgroundColor}
            borderRadius={10}
          >
            <CardContent>
              <DraggableOverlay>
                <DragHandle handleProps={GroupProvided.dragHandleProps} />
                <Editable onEdit={() => props.onEdit(index)}>
                  <>
                    <Heading aria-label="resource group title">
                      {v(group.title)}
                    </Heading>
                    <Description
                      aria-label="resource group description"
                      color="#000000"
                    >
                      {v(group.description)}
                    </Description>
                  </>
                </Editable>
              </DraggableOverlay>
              <DroppableList index={index} />
            </CardContent>
          </StyledCard>
        </div>
      )}
    </Draggable>
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
  const {template} = usePanels()
  const groups = template.resourceGroupList

  const list = groups?.resourceGroups[props.index]

  const [itemEditing, setItemEditing] = useState<null | number>(null)
  const stopItemEditing = () => setItemEditing(null)
  const editItem = (index: number) => {
    setItemEditing(index)
  }

  return (
    <>
      <ResourceItemConfig
        itemId={itemEditing}
        groupId={props.index}
        onClose={stopItemEditing}
      />

      {list.resources.map((resource: Resource, index: number) => (
        <ResourceItem
          id={`resource-item-${index}`}
          groupId={props.index}
          resource={resource}
          index={index}
          key={index}
          onEdit={editItem}
        />
      ))}
      <Grid container>
        <EditModeOnly>
          <StyledAddResourceButton groupId={props.index} edit={editItem} />
        </EditModeOnly>
      </Grid>
    </>
  )
}

function ResourceGroupContainer(props: {group: ResourceGroup; index: number}) {
  const {group} = props
  const v = useVariables()
  const resources = <ResourceList index={props.index} />

  return (
    <StyledCard backgroundColor={group.cardBackgroundColor} borderRadius={10}>
      <CardContent>
        <Heading aria-label="resource group title">{v(group.title)}</Heading>
        <Description aria-label="resource group description" color="#000000">
          {v(group.description)}
        </Description>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={3}
        >
          {resources}
        </Grid>
      </CardContent>
    </StyledCard>
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
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      spacing={3}
    >
      {props.children}
    </Grid>
  </Box>
))

function useHandleDrag(i: number) {
  const {template, update} = usePanels()
  const groups = template.resourceGroupList

  const updateTemplate = update.primitive('resourceGroupList')

  if (typeof groups === 'undefined') {
    throw new Error('error!')
  }
  const list = groups.resourceGroups[i]

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(list.resources)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    const updatedList = {
      ...list,
      resources: moved,
    }

    const updatedResourceGroup = groups.resourceGroups.map((tr, index) => {
      if (index === i) {
        return updatedList
      }
      return tr
    })

    updateTemplate({
      resourceGroups: updatedResourceGroup,
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

const StyledCard = styled((props) => {
  const {backgroundColor, borderRadius, ...otherProps} = props
  return <Card {...otherProps} />
})`
  background-color: ${(props) => props.backgroundColor} !important;
  border-radius: ${(props) => props.borderRadius}px !important;
  margin-bottom: 15px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`
