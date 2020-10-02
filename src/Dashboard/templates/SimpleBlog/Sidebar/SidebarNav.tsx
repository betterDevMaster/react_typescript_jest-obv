import React from 'react'
import styled from 'styled-components'
import NavButton from 'Dashboard/components/NavButton'
import {SimpleBlogDashboard} from 'Dashboard/templates/SimpleBlog'

export default function SidebarNav(props: {
  buttons: SimpleBlogDashboard['sidebarNavButtons']
  buttonColor: string
  component?: React.FunctionComponent<any>
}) {
  const hasButtons = props.buttons.ids.length > 0
  if (!hasButtons) {
    return null
  }

  const Component = props.component || 'div'

  return (
    <Component>
      {props.buttons.ids.map((id) => {
        const button = props.buttons.entities[id]

        return (
          <StyledNavButtonComponent
            key={id}
            {...button}
            id={id}
            ariaLabel="sidebar nav"
            backgroundColor={props.buttonColor}
            textColor="#FFFFFF"
          />
        )
      })}
    </Component>
  )
}

const StyledNavButtonComponent = styled(NavButton)`
  border: 1px solid #ffffff;
  font-size: 14px;
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  margin: ${(props) => props.theme.spacing[3]} 0;
`
