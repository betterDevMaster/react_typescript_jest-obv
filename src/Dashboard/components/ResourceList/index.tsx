import React from 'react'
import styled from 'styled-components'
import Heading from 'Dashboard/Template/SimpleBlog/Sidebar/Heading'
import Icon from '@material-ui/core/Icon'

export interface ResourceList {
  description: string
  resources: Resource[]
}

export interface Resource {
  name: string
  filePath: string
  icon: string
}

/**
 * Material Design icon names
 * https://material.io/resources/icons/
 */
export const RESOURCE_ICON = {
  pdf: 'picture_as_pdf',
  attachment: 'attachment',
}

export function ResourceList(props: {
  list: ResourceList
  component?: React.FunctionComponent<any>
  iconColor?: string
}) {
  const hasResources = props.list.resources.length > 0
  if (!hasResources) {
    return null
  }

  const Component = props.component || 'div'

  return (
    <Component className="resource-list">
      <Heading>RESOURCES:</Heading>
      <p>{props.list.description}</p>
      <List>
        {props.list.resources.map((resource, index) => (
          <li key={index}>
            <Resource resource={resource} iconColor={props.iconColor} />
          </li>
        ))}
      </List>
    </Component>
  )
}

function Resource(props: {resource: Resource; iconColor?: string}) {
  return (
    <ResourceLink aria-label="event resource" href={props.resource.filePath}>
      <StyledIcon
        className="resource-icon"
        component="i"
        color={props.iconColor}
      >
        {props.resource.icon}
      </StyledIcon>
      <LinkText>{props.resource.name}</LinkText>
    </ResourceLink>
  )
}

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const ResourceLink = styled.a`
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
`

const StyledIcon = styled((props) => {
  const {className, color, ...otherProps} = props
  return <Icon className={className} {...otherProps} />
})`
  color: ${(props) => props.color || '#000'};
  margin-right: ${(props) => props.theme.spacing[2]};
`
