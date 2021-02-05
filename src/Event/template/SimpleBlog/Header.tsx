import React from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'

export default function Header(props: {
  primaryColor: string
  toggleMenu: () => void
  menuVisible: boolean
  'aria-label'?: string
}) {
  const {title} = useTemplate()

  const {event} = useEvent()

  const logo = event.logo ? event.logo.url : ''
  const headerBackground = event.header_background
    ? event.header_background.url
    : ''

  return (
    <Box aria-label={props['aria-label']} background={headerBackground}>
      <Container maxWidth="lg">
        <Layout>
          <Side>
            <MenuIconButton
              color={props.primaryColor}
              active={props.menuVisible}
              onClick={props.toggleMenu}
              aria-label="show side menu"
            />
          </Side>
          <Middle>
            <RelativeLink to={eventRoutes.root} disableStyles>
              <Logo src={logo} alt={title} aria-label="logo" />
            </RelativeLink>
          </Middle>
          <Side />
        </Layout>
      </Container>
    </Box>
  )
}

const Layout = styled.div`
  height: 115px;
  display: flex;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 150px;
  }
`

const Side = styled.div`
  width: 42px;
`

const Box = styled.div<{background: string | null}>`
  box-shadow: 20px 20px 50px #ddd;
  margin-bottom: 60px;
  background: ${(props) =>
    props.background
      ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(2, 0, 0, 0.6)), url(${props.background})`
      : '#FFFFFF'};
`

const Middle = styled.div`
  flex: 1;
  text-align: center;
`
const Logo = styled.img`
  max-height: 100%;
  max-width: 100%;
  padding: 20px 0;
`
