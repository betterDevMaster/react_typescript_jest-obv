import React from 'react'
import styled from 'styled-components'
import SidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav/SidebarNavButton'
import NewSidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/NewSidebarNavButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useTemplate} from 'Event/TemplateProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import HiddenOnMatch from 'Event/Dashboard/component-rules/HiddenOnMatch'
export const SIDEBAR_NAV_BUTTON = 'Sidebar Nav Button'

export default function SidebarNav() {
  const {sidebarNav: buttons} = useTemplate()
  const hasButtons = buttons.ids.length > 0
  if (!hasButtons) {
    return (
      <EditModeOnly>
        <StyledNewSidebarNavButton />
      </EditModeOnly>
    )
  }

  return (
    <Section>
      {buttons.ids.map((id) => {
        const button = buttons.entities[id]
        return (
          <HiddenOnMatch rules={button.rules} key={id}>
            <SidebarNavButton
              {...button}
              id={id}
              backgroundColor={button.backgroundColor}
              hoverBackgroundColor={button.backgroundColor}
              textColor={button.textColor}
              borderWidth={button.borderWidth}
              borderRadius={button.borderRadius}
              borderColor={button.borderColor}
            />
          </HiddenOnMatch>
        )
      })}
      <EditModeOnly>
        <StyledNewSidebarNavButton />
      </EditModeOnly>
    </Section>
  )
}

const StyledNewSidebarNavButton = styled(NewSidebarNavButton)`
  margin-top: ${(props) => props.theme.spacing[6]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
