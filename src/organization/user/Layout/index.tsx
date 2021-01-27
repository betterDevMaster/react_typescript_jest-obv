import Container from '@material-ui/core/Container'
import styled from 'styled-components'
import NavBar from 'lib/ui/layout/NavBar'
import AppBar from 'organization/user/Layout/AppBar'
import React from 'react'

export default function Layout(props: {
  children: React.ReactElement
  navbarRight?: React.ReactElement
}) {
  return (
    <>
      <AppBar />
      <StyledNavBar navbarRight={props.navbarRight} />
      <Container maxWidth={false} disableGutters>
        {props.children}
      </Container>
    </>
  )
}

const StyledNavBar = styled(NavBar)`
  padding-top: ${(props) => props.theme.spacing[16]};
`
