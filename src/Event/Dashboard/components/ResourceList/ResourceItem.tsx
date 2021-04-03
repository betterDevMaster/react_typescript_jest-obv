import React from 'react'
import styled from 'styled-components'
import Icon from '@material-ui/core/Icon'
import {usePoints} from 'Event/PointsProvider'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {storage} from 'lib/url'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {useTemplate} from 'Event/TemplateProvider'

export type Resource = Publishable & {
  name: string
  filePath: string
  icon: string
}

export const RESOURCE_ITEM = 'Resource Item'

export default function ResourceItem(props: {
  resource: Resource
  iconColor?: string
}) {
  const {downloadResource: DOWNLOADING_RESOURCE} = usePlatformActions()
  const {submit} = usePoints()
  const {sidebar} = useTemplate()

  const awardPoints = () => {
    submit(DOWNLOADING_RESOURCE)
  }

  const path = storage(`/event/resources/${props.resource.filePath}`)

  return (
    <ResourceLink
      color={sidebar.textColor}
      aria-label="event resource"
      to={path}
      onClick={awardPoints}
      newTab
    >
      <StyledIcon
        className="resource-icon"
        component="i"
        color={props.iconColor}
      >
        {props.resource.icon}
      </StyledIcon>
      <LinkText aria-label="resource link">{props.resource.name}</LinkText>
    </ResourceLink>
  )
}

const ResourceLink = styled(AbsoluteLink)<{color: string}>`
  align-items: center;
  font-size: 20px;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[1]};
  color: ${(props) => props.color};

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

const StyledIcon = styled((props) => {
  const {className, color, ...otherProps} = props
  return <Icon className={className} {...otherProps} />
})`
  color: ${(props) => props.color || '#000'};
  margin-right: ${(props) => props.theme.spacing[2]};
`
