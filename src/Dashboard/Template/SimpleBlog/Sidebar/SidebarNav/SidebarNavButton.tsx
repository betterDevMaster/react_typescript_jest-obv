import React from 'react'
import styled from 'styled-components'
import NavButton from 'Dashboard/components/NavButton'
import {SIDEBAR_NAV_BUTTON} from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import EditComponent from 'Dashboard/edit/views/EditComponent'

export default React.memo((props: NavButton & {id: string}) => (
  <EditComponent type={SIDEBAR_NAV_BUTTON} id={props.id}>
    <StyledNavButtonComponent
      {...props}
      ariaLabel="sidebar nav button"
      textColor="#FFFFFF"
      borderWidth={1}
      borderColor="#FFFFFF"
    />
  </EditComponent>
))

const StyledNavButtonComponent = styled(NavButton)`
  border: 1px solid #ffffff;
  font-size: 14px;
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  margin: ${(props) => props.theme.spacing[3]} 0;
`
