import React from 'react'
import styled from 'styled-components'
import Heading from 'event/Dashboard/Template/SimpleBlog/Sidebar/Heading'
import Icon from '@material-ui/core/Icon'
import EditComponent from 'event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'event/Dashboard/editor/views/EditModeOnly'
import AddResourceButton from 'event/Dashboard/components/ResourceList/AddResourceButton'
import {useDashboard} from 'event/Dashboard/state/DashboardProvider'

export interface ResourceList {
  description: string
  resources: Resource[]
}

export interface Resource {
  name: string
  filePath: string
  icon: string
}

export const RESOURCE_LIST = 'Resource List'

export const RESOURCE_ITEM = 'Resource Item'

/**
 * Material Design icon names
 * https://material.io/resources/icons/
 */
export const RESOURCE_ICON = {
  pdf: 'picture_as_pdf',
  attachment: 'attachment',
}

export function ResourceList() {
  const isEdit = useEditMode()
  const {resourceList: list, primaryColor} = useDashboard()

  const hasResources = list.resources.length > 0
  if (!hasResources && !isEdit) {
    return null
  }

  return (
    <>
      <EditComponent type={RESOURCE_LIST}>
        <Heading aria-label="resources">RESOURCES:</Heading>
      </EditComponent>
      <p aria-label="resource description">{list.description}</p>
      <List>
        {list.resources.map((resource, index) => (
          <li key={index}>
            <EditComponent type={RESOURCE_ITEM} id={index}>
              <Resource resource={resource} iconColor={primaryColor} />
            </EditComponent>
          </li>
        ))}
      </List>
      <EditModeOnly>
        <StyledAddResourceButton />
      </EditModeOnly>
    </>
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
      <LinkText aria-label="resource link">{props.resource.name}</LinkText>
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

const StyledAddResourceButton = styled(AddResourceButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
  margin-top: ${(props) => props.theme.spacing[5]}!important;
`
