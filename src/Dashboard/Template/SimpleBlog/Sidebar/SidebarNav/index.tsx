import React from 'react'
import styled from 'styled-components'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import SidebarNavButton from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarNav/SidebarNavButton'
import {useCurrent} from 'Dashboard/edit/state/edit-mode'
import NewSidebarNavButton from 'Dashboard/Template/SimpleBlog/Sidebar/NewSidebarNavButton'
import EditModeOnly from 'Dashboard/edit/views/EditModeOnly'

export const SIDEBAR_NAV_BUTTON = 'Sidebar Nav Button'

export default function SidebarNav(props: {
  buttons: SimpleBlog['sidebarNavButtons']
  primaryColor: string
  container?: React.FunctionComponent<any>
}) {
  const buttons = useCurrent(
    (state) => state.dashboardEditor.sidebarNavButtons,
    props.buttons,
  )

  const buttonColor = useCurrent(
    (state) => state.dashboardEditor.primaryColor,
    props.primaryColor,
  )

  const hasButtons = buttons.ids.length > 0
  if (!hasButtons) {
    return null
  }

  const Component = props.container || 'div'

  return (
    <Component>
      {buttons.ids.map((id) => {
        const button = buttons.entities[id]
        return (
          <SidebarNavButton
            key={id}
            {...button}
            id={id}
            backgroundColor={buttonColor}
            hoverBackgroundColor={buttonColor}
          />
        )
      })}
      <EditModeOnly>
        <StyledNewSidebarNavButton />
      </EditModeOnly>
    </Component>
  )
}

const StyledNewSidebarNavButton = styled(NewSidebarNavButton)`
  margin-top: ${(props) => props.theme.spacing[6]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
