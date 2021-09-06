import React from 'react'
import styled from 'styled-components'
import {usePoints} from 'Event/PointsProvider'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {HasRules} from 'Event/visibility-rules'
import VisibleOnMatch from 'Event/visibility-rules/VisibleOnMatch'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable, DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'
import {useVariables} from 'Event'
import {Icon} from 'lib/fontawesome/Icon'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {ResourceItemConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList/ResourceItemConfig'
import {ResourceListProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'
import {useResourceUrl} from 'Event/Dashboard/components/resource'

export type Resource = Publishable &
  HasRules & {
    name: string
    filePath: string
    icon: string | null
    isUrl?: boolean
    url?: string
  }

export const RESOURCE_ITEM = 'Resource Item'
export type ResourceItemProps = {
  id: string
  resource: Resource
  iconColor?: string
  index: number
  list: ResourceListProps
}

export default React.memo((props: ResourceItemProps) => {
  const {resource, index} = props
  const isEdit = useEditMode()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  if (!isEdit)
    return (
      <Container resource={resource}>
        <ResourceItemLink resource={resource} iconColor={props.iconColor} />
      </Container>
    )

  return (
    <>
      <ResourceItemConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        resource={resource}
        index={index}
        list={props.list}
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
                  <ResourceItemLink
                    resource={resource}
                    iconColor={props.iconColor}
                  />
                </>
              </Editable>
            </DraggableOverlay>
          </Container>
        )}
      </Draggable>
    </>
  )
})

export function ResourceItemLink(props: {
  resource: Resource
  iconColor?: string
}) {
  const {downloadResource: DOWNLOADING_RESOURCE} = usePlatformActions()
  const {submit} = usePoints()
  const {template} = useSimpleBlog()
  const {sidebar} = template
  const url = useResourceUrl(props.resource)
  const v = useVariables()

  const awardPoints = () => {
    submit(DOWNLOADING_RESOURCE)
  }
  return (
    <ResourceLink
      color={sidebar.textColor}
      aria-label="event resource"
      to={url}
      onClick={awardPoints}
      newTab
    >
      <StyledIcon iconClass={props.resource.icon} color={props.iconColor} />
      <LinkText aria-label="resource link">{v(props.resource.name)}</LinkText>
    </ResourceLink>
  )
}

export const Container = React.forwardRef<
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
        <Box ref={ref} {...props.draggableProps}>
          {props.children}
        </Box>
      </Published>
    </VisibleOnMatch>
  )
})

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[2]};
  width: 100%;
`

const ResourceLink = styled(AbsoluteLink)<{color: string}>`
  align-items: center;
  min-height: 20px;
  font-size: 20px;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[1]};
  color: ${(props) => props.color}!important;

  &:hover {
    text-decoration: none;

    span {
      text-decoration: underline;
    }
  }
`

const LinkText = styled.span`
  font-weight: bold;
`

const StyledIcon = styled(Icon)`
  margin-right: ${(props) => props.theme.spacing[3]};
`
