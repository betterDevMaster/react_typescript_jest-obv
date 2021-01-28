import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import Icon from '@material-ui/core/Icon'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddResourceButton from 'Event/Dashboard/components/ResourceList/AddResourceButton'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import {usePoints} from 'Event/PointsProvider'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {storage} from 'lib/url'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'

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
  people: 'people',
  image: 'image',
  photoLibrary: 'photo_library',
}

export function ResourceList() {
  const isEdit = useEditMode()
  const {resourceList: list, primaryColor} = useTemplate()

  const hasResources = list.resources.length > 0
  if (!hasResources && !isEdit) {
    return null
  }

  return (
    <Section>
      <EditComponent component={{type: RESOURCE_LIST}}>
        <Heading aria-label="resources">RESOURCES:</Heading>
      </EditComponent>
      <p aria-label="resource description">{list.description}</p>
      <List>
        {list.resources.map((resource, index) => (
          <li key={index}>
            <EditComponent
              component={{
                type: RESOURCE_ITEM,
                id: index,
              }}
            >
              <Resource resource={resource} iconColor={primaryColor} />
            </EditComponent>
          </li>
        ))}
      </List>
      <EditModeOnly>
        <StyledAddResourceButton />
      </EditModeOnly>
    </Section>
  )
}

function Resource(props: {resource: Resource; iconColor?: string}) {
  const {DOWNLOADING_RESOURCE} = usePlatformActions()
  const {submit} = usePoints()

  const awardPoints = () => {
    submit(DOWNLOADING_RESOURCE)
  }

  const path = storage(`/event/resources/${props.resource.filePath}`)

  return (
    <ResourceLink
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

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

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
