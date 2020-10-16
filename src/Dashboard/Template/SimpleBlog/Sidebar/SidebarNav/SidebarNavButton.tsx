import React from 'react'
import styled from 'styled-components'
import NavButton from 'Dashboard/components/NavButton'

export default React.memo((props: NavButton) => (
  <StyledNavButtonComponent
    {...props}
    ariaLabel="sidebar nav"
    textColor="#FFFFFF"
  />
))

const StyledNavButtonComponent = styled(NavButton)`
  border: 1px solid #ffffff;
  font-size: 14px;
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  margin: ${(props) => props.theme.spacing[3]} 0;
`
