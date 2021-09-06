import React from 'react'
import styled from 'styled-components'
import {usePoints} from 'Event/PointsProvider'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import VisibleOnMatch from 'Event/visibility-rules/VisibleOnMatch'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'
import {useVariables} from 'Event'
import {Resource} from 'Event/template/Panels/Dashboard/Resources/ResourceList'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import {useResourceUrl} from 'Event/Dashboard/components/resource'

type ResourceItemProps = {
  id: string
  resource: Resource
  index: number
  cardBackgroundColor?: string
  onEdit: (index: number) => void
}

export default React.memo((props: ResourceItemProps) => {
  const {resource, index} = props
  const isEdit = useEditMode()

  if (!isEdit)
    return (
      <Container resource={resource}>
        <ResourceItemCard
          resource={resource}
          cardBackgroundColor={props.cardBackgroundColor}
        />
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
                <ResourceItemCard
                  resource={resource}
                  cardBackgroundColor={props.cardBackgroundColor}
                />
              </>
            </Editable>
          </DraggableOverlay>
        </Container>
      )}
    </Draggable>
  )
})

function ResourceItemCard(props: {
  resource: Resource
  cardBackgroundColor?: string
}) {
  const {downloadResource: DOWNLOADING_RESOURCE} = usePlatformActions()
  const {submit} = usePoints()
  const url = useResourceUrl(props.resource)
  const v = useVariables()

  const awardPoints = () => {
    submit(DOWNLOADING_RESOURCE)
  }

  const isLink = Boolean(props.resource.url)
  const text = isLink ? 'Go to Link' : 'Download'

  return (
    <StyledCard
      variant="outlined"
      backgroundColor={props.cardBackgroundColor}
      borderRadius={10}
    >
      <CardContent>
        <Typography variant="h5" component="h2">
          {v(props.resource.name)}
        </Typography>
        <Typography aria-label="resource description">
          {v(props.resource.description || '')}
        </Typography>
      </CardContent>
      <CardActions>
        <ResourceLink
          aria-label="event resource"
          to={url}
          onClick={awardPoints}
          newTab
        >
          <LinkText aria-label="resource link">{text}</LinkText>
        </ResourceLink>
      </CardActions>
    </StyledCard>
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
  return (
    <VisibleOnMatch rules={props.resource.rules}>
      <Published component={props.resource}>
        <Item ref={ref} {...props} />
      </Published>
    </VisibleOnMatch>
  )
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
    <Grid item xs={12} md={12}>
      <Grid container>
        <Grid item xs={12} md={12} {...props.draggableProps} ref={ref}>
          {props.children}
        </Grid>
      </Grid>
    </Grid>
  )
})

const ResourceLink = styled(AbsoluteLink)`
  align-items: center;
  font-size: 20px;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[1]};

  &:hover {
    text-decoration: none;

    span {
      text-decoration: underline;
    }
  }
`

const LinkText = styled.span`
  font-weight: bold;
  text-transform: uppercase;
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
