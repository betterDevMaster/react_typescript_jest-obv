import React from 'react'
import styled from 'styled-components'
import SidebarNavButton from 'Event/Dashboard/Template/SimpleBlog/Sidebar/SidebarNav/SidebarNavButton'
import NewSidebarNavButton from 'Event/Dashboard/Template/SimpleBlog/Sidebar/NewSidebarNavButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useDashboard} from 'Event/Dashboard/state/DashboardProvider'

export const SIDEBAR_NAV_BUTTON = 'Sidebar Nav Button'

export default function SidebarNav() {
  const {sidebarNav: buttons, primaryColor} = useDashboard()

  const hasButtons = buttons.ids.length > 0
  if (!hasButtons) {
    return null
  }

  return (
    <>
      {buttons.ids.map((id) => {
        const button = buttons.entities[id]
        return (
          <SidebarNavButton
            key={id}
            {...button}
            id={id}
            backgroundColor={primaryColor}
            hoverBackgroundColor={primaryColor}
          />
        )
      })}
      <EditModeOnly>
        <StyledNewSidebarNavButton />
      </EditModeOnly>
    </>
  )
}

const StyledNewSidebarNavButton = styled(NewSidebarNavButton)`
  margin-top: ${(props) => props.theme.spacing[6]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
