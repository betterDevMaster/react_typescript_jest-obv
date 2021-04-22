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
import HiddenOnMatch from 'Event/Dashboard/component-rules/HiddenOnMatch'
import {useWithAttendeeData} from 'Event/auth/data'

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
  const withAttendeeData = useWithAttendeeData()

  const hasResources = list.resources.length > 0
  if (!hasResources && !isEdit) {
    return null
  }

  return (
    <Section>
      <EditComponent component={{type: RESOURCE_LIST}}>
        <Heading aria-label="resources">{withAttendeeData(list.title)}</Heading>
      </EditComponent>
      <Description aria-label="resource description" color={sidebar.textColor}>
        {withAttendeeData(list.description)}
      </Description>
      <List>
        {list.resources.map((resource: Resource, index: number) => (
          <li key={index}>
            <HiddenOnMatch rules={resource.rules}>
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
            </HiddenOnMatch>
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

const Description = styled.p<{color: string}>`
  color: ${(props) => props.color};
`
