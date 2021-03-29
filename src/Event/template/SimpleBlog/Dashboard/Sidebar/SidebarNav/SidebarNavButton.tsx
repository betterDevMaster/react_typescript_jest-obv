import React from 'react'
import styled from 'styled-components'
import NavButton from 'Event/Dashboard/components/NavButton'
import {SIDEBAR_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'

export default React.memo((props: NavButton & {id: string}) => (
  <EditComponent
    component={{
      type: SIDEBAR_NAV_BUTTON,
      id: props.id,
    }}
  >
    <Published component={props}>
      <StyledNavButtonComponent
        aria-label="sidebar nav button"
        textColor="#FFFFFF"
        borderWidth={1}
        borderColor="#FFFFFF"
        {...props}
      />
    </Published>
  </EditComponent>
))

const StyledNavButtonComponent = styled(NavButton)`
  font-size: 14px;
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  margin: ${(props) => props.theme.spacing[3]} 0;
`
