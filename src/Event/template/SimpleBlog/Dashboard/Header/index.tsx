import React from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import {useTemplate} from 'Event/TemplateProvider'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import {rgb} from 'lib/color'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

export type Header = {
  backgroundColor: string
  backgroundOpacity: number
  height: number
  script: string | null
  isCollapsed?: boolean
  disableShadow?: boolean
}

export default function Header(props: {
  toggleMenu: () => void
  menuVisible: boolean
  'aria-label'?: string
}) {
  return (
    <EditComponent component={{type: SIMPLE_BLOG}}>
      <CollapsableBackground>
        <CollapsableColorOverlay>
          <Container maxWidth="lg">
            <Layout>
              <Side>
                <MenuIconButton
                  active={props.menuVisible}
                  onClick={props.toggleMenu}
                  aria-label="show side menu"
                />
              </Side>
              <Middle>
                <RelativeLink to={eventRoutes.root} disableStyles>
                  <CollapsableLogo />
                </RelativeLink>
              </Middle>
              <Side />
            </Layout>
          </Container>
        </CollapsableColorOverlay>
      </CollapsableBackground>
    </EditComponent>
  )
}

function CollapsableBackground(props: {children: React.ReactElement}) {
  const {event} = useEvent()
  const {header} = useTemplate()
  const backgroundImage = event.header_background
    ? event.header_background.url
    : ''

  if (header.isCollapsed) {
    return props.children
  }

  return <Box backgroundImage={backgroundImage}>{props.children}</Box>
}

function CollapsableLogo() {
  const {event} = useEvent()
  const {title, header} = useTemplate()
  const logo = event.logo ? event.logo.url : ''

  if (header.isCollapsed) {
    return null
  }
  return <Logo src={logo} alt={title} aria-label="logo" />
}

function Layout(props: {children: React.ReactElement | React.ReactElement[]}) {
  const {header} = useTemplate()

  const height = header.height
  const mobileHeight = Math.round(height * 0.7)

  return (
    <LayoutBox
      desktopHeight={height}
      mobileHeight={mobileHeight}
      arial-label="header layout"
    >
      {props.children}
    </LayoutBox>
  )
}

function CollapsableColorOverlay(props: {children: React.ReactElement}) {
  const {header} = useTemplate()
  const backgroundColorRgb = rgb(
    header.backgroundColor,
    header.backgroundOpacity,
  )

  if (header.isCollapsed) {
    return props.children
  }

  return (
    <ColorOverlay
      color={backgroundColorRgb}
      disableShadow={header.disableShadow}
      aria-label="header"
    >
      {props.children}
    </ColorOverlay>
  )
}

const LayoutBox = styled.div<{desktopHeight: number; mobileHeight: number}>`
  height: ${(props) => props.mobileHeight}px;
  display: flex;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: ${(props) => props.desktopHeight}px;
  }
`

const Side = styled.div`
  width: 42px;
`

const Box = styled.div<{
  backgroundImage: string | null
}>`
  ${(props) =>
    props.backgroundImage
      ? `background-image: url(${props.backgroundImage});`
      : null}

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

const ColorOverlay = styled.div<{
  color: string
  disableShadow?: boolean
}>`
  background-color: ${(props) => props.color};
  ${(props) =>
    props.disableShadow ? '' : `box-shadow: 20px 20px 20px ${props.color};`}
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
