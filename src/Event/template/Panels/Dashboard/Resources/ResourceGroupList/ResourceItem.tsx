import React from 'react'
import styled from 'styled-components'
import {usePoints} from 'Event/PointsProvider'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {storage} from 'lib/url'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import ZoomBackgroundImage from 'assets/images/Zoom.png'

export type Resource = {
  name: string
  filePath: string
  isUrl?: boolean
  url?: string
}
type ResourceItemProps = {
  id: string
  resource: Resource
  index: number
  groupId: number
  onEdit: (index: number) => void
}

export default React.memo((props: ResourceItemProps) => {
  const {resource, index} = props
  const isEdit = useEditMode()

  if (!isEdit)
    return (
      <Container resource={resource}>
        <ResourceItemLink resource={resource} />
      </Container>
    )

  return (
    <Draggable draggableId={props.id} index={index}>
      {(provided) => (
        <Container
          resource={resource}
          ref={provided.innerRef}
          draggableProps={provided.draggableProps}
        >
          <DraggableOverlay>
            <Editable onEdit={() => props.onEdit(index)}>
              <>
                <DragHandle handleProps={provided.dragHandleProps} />
                <ResourceItemLink resource={resource} />
              </>
            </Editable>
          </DraggableOverlay>
        </Container>
      )}
    </Draggable>
  )
})

function ResourceItemLink(props: {resource: Resource; iconColor?: string}) {
  const {downloadResource: DOWNLOADING_RESOURCE} = usePlatformActions()
  const {submit} = usePoints()
  const url = resourceUrl(props.resource)

  const awardPoints = () => {
    submit(DOWNLOADING_RESOURCE)
  }
  return (
    <ResourceLink
      color="#555555"
      aria-label="event grouped resource"
      to={url}
      onClick={awardPoints}
      newTab
    >
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="140"
            image={url}
            title="Contemplative Reptile"
          />
        </CardActionArea>
      </Card>
    </ResourceLink>
  )
}

const Container = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactElement
    resource: Resource
    draggableProps?: DraggableProvidedDraggableProps
  }
>((props, ref) => {
  return <Item ref={ref} {...props} />
})

const Item = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactElement
    resource: Resource
    draggableProps?: DraggableProvidedDraggableProps
  }
>((props, ref) => {
  return (
    <Grid item xs={12} md={4}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} {...props.draggableProps} ref={ref}>
          {props.children}
        </Grid>
      </Grid>
    </Grid>
  )
})

function resourceUrl(resource: Resource): string {
  if (resource.url) {
    return resource.url
  }

  if (resource.filePath) {
    return storage(`/event/resources/${resource.filePath}`)
  }

  return ZoomBackgroundImage
}

const ResourceLink = styled(AbsoluteLink)<{color: string}>`
  align-items: center;
  font-size: 20px;
  margin-bottom: ${(props) => props.theme.spacing[1]};
  color: ${(props) => props.color}!important;

  &:hover {
    text-decoration: none;
  }
`
