import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddResourceButton from 'Event/Dashboard/components/ResourceList/AddResourceButton'
import {useTemplate} from 'Event/TemplateProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import ResourceItem, {
  Resource,
} from 'Event/Dashboard/components/ResourceList/ResourceItem'
import Published from 'Event/Dashboard/editor/views/Published'

export interface ResourceList {
  title: string
  description: string
  resources: Resource[]
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
  const {resourceList: list, sidebar} = useTemplate()

  const hasResources = list.resources.length > 0
  if (!hasResources && !isEdit) {
    return null
  }

  return (
    <Section>
      <EditComponent component={{type: RESOURCE_LIST}}>
        <Heading aria-label="resources">{list.title}</Heading>
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
              <Published component={resource}>
                <ResourceItem
                  resource={resource}
                  iconColor={sidebar.textColor}
                />
              </Published>
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

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const StyledAddResourceButton = styled(AddResourceButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
  margin-top: ${(props) => props.theme.spacing[5]}!important;
`
