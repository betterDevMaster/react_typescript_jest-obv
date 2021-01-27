import Container from '@material-ui/core/Container'
import styled from 'styled-components'
import AppBar from 'obvio/user/Layout/AppBar'
import NavBar from 'lib/ui/layout/NavBar'
import React from 'react'

export default function Layout(props: {
  children: React.ReactElement | React.ReactElement[]
  navbarRight?: React.ReactElement
}) {
  return (
    <>
      <AppBar />
      <StyledNavBar navbarRight={props.navbarRight} />
      <Container maxWidth="lg">{props.children}</Container>
    </>
  )
}

const StyledNavBar = styled(NavBar)`
  padding-top: ${(props) => props.theme.spacing[16]};
  margin-bottom: ${(props) => props.theme.spacing[9]};
`
