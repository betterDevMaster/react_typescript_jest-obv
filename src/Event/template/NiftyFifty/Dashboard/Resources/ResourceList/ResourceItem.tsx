import React from 'react'
import styled from 'styled-components'
import {usePoints} from 'Event/PointsProvider'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import Grid from '@material-ui/core/Grid'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'
import {useAttendeeVariables} from 'Event'
import {Resource} from 'Event/template/NiftyFifty/Dashboard/Resources/ResourceList'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import {useResourceUrl} from 'Event/Dashboard/components/resource'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import {rgba} from 'lib/color'
import {useToggle} from 'lib/toggle'
import ResourceItemConfig from 'Event/template/NiftyFifty/Dashboard/Resources/ResourceList/ResourceItemConfig'

type ResourceItemProps = {
  id: string
  resource: Resource
  index: number
}

export default React.memo((props: ResourceItemProps) => {
  const {resource, index} = props
  const isEdit = useEditMode()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  if (!isEdit)
    return (
      <Container resource={resource}>
        <ResourceItemCard resource={resource} />
      </Container>
    )

  return (
    <>
      <ResourceItemConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        resource={resource}
        targetIndex={index}
      />
      <Draggable draggableId={props.id} index={index}>
        {(provided) => (
          <Container
            resource={resource}
            ref={provided.innerRef}
            draggableProps={provided.draggableProps}
          >
            <DraggableOverlay>
              <Editable onEdit={toggleConfig}>
                <>
                  <DragHandle handleProps={provided.dragHandleProps} />
                  <ResourceItemCard resource={resource} />
                </>
              </Editable>
            </DraggableOverlay>
          </Container>
        )}
      </Draggable>
    </>
  )
})

function ResourceItemCard(props: {resource: Resource}) {
  const {downloadResource: DOWNLOADING_RESOURCE} = usePlatformActions()
  const {submit} = usePoints()
  const url = useResourceUrl(props.resource)
  const v = useAttendeeVariables()

  const {resourceList} = useNiftyFiftyTemplate()

  const {
    cardBackgroundColor,
    cardBackgroundOpacity: backgroundOpacity,
    linkColor,
  } = resourceList

  const awardPoints = () => {
    submit(DOWNLOADING_RESOURCE)
  }

  const backgroundColor = rgba(cardBackgroundColor, backgroundOpacity / 100)

  const isLink = Boolean(props.resource.url)
  const defaultText = isLink ? 'Go to Link' : 'Download'
  const text = v(props.resource.linkText || defaultText)

  return (
    <StyledCard
      variant="outlined"
      backgroundColor={backgroundColor}
      borderRadius={10}
      color={resourceList.color}
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
          <LinkText aria-label="resource link" color={linkColor}>
            {text}
          </LinkText>
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

const LinkText = styled.span<{color: string}>`
  font-weight: bold;
  text-transform: uppercase;
  color: ${(props) => props.color} !important;
`

const StyledCard = styled((props) => {
  const {
    backgroundColor: _1,
    borderRadius: _2,
    color: _3,
    ...otherProps
  } = props
  return <Card {...otherProps} />
})`
  background-color: ${(props) => props.backgroundColor} !important;
  border-radius: ${(props) => props.borderRadius}px !important;
  color: ${(props) => props.color} !important;
  margin-bottom: 15px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`
