import React from 'react'
import styled from 'styled-components'
import NavButtonComponent, {NavButton} from 'Dashboard/components/NavButton'

export default function SidebarNav(props: {
  buttons: NavButton[]
  buttonColor: string
  component?: React.FunctionComponent<any>
}) {
  const hasButtons = props.buttons.length > 0
  if (!hasButtons) {
    return null
  }

  const Component = props.component || 'div'

  return (
    <Component>
      {props.buttons.map((button, index) => (
        <StyledNavButtonComponent
          key={index}
          {...button}
          ariaLabel="sidebar nav"
          backgroundColor={props.buttonColor}
          textColor="#FFFFFF"
        />
      ))}
    </Component>
  )
}

const StyledNavButtonComponent = styled(NavButtonComponent)`
  border: 1px solid #ffffff;
  font-size: 14px;
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  margin: ${(props) => props.theme.spacing[3]} 0;
`
