import React from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'
import {rgba} from 'lib/color'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {SimpleBlogConfig} from 'Event/template/SimpleBlog/SimpleBlogConfig'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function Header(props: {
  toggleMenu: () => void
  menuVisible: boolean
  'aria-label'?: string
}) {
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const template = useSimpleBlogTemplate()
  const {menu} = template
  const {iconColor} = menu
  const isEditMode = useEditMode()

  const content = (
    <CollapsableBackground>
      <CollapsableColorOverlay>
        <Container maxWidth="lg">
          <Layout>
            <Side>
              <MenuIconButton
                active={props.menuVisible}
                onClick={props.toggleMenu}
                aria-label="show side menu"
                iconColor={iconColor}
              />
            </Side>
            <Middle>
              <LogoContainer to={eventRoutes.root} disableStyles>
                <CollapsableLogo />
              </LogoContainer>
            </Middle>
            <Side />
          </Layout>
        </Container>
      </CollapsableColorOverlay>
    </CollapsableBackground>
  )

  if (!isEditMode) {
    return content
  }

  return (
    <>
      <SimpleBlogConfig isVisible={configVisible} onClose={toggleConfig} />
      <Editable onEdit={toggleConfig}>{content}</Editable>
    </>
  )
}

function CollapsableBackground(props: {children: React.ReactElement}) {
  const {event} = useEvent()
  const template = useSimpleBlogTemplate()
  const {header} = template
  const backgroundImage = header.isCollapsed
    ? ''
    : event.header_background
    ? event.header_background.url
    : ''
  return (
    <Box
      backgroundImage={backgroundImage}
      disableShadow={header.disableShadow || header.isCollapsed}
    >
      {props.children}
    </Box>
  )
}

function CollapsableLogo() {
  const {event} = useEvent()
  const template = useSimpleBlogTemplate()
  const {title, header} = template
  const logo = event.logo ? event.logo.url : ''

  if (header.isCollapsed) {
    return null
  }
  return <Logo src={logo} alt={title} aria-label="logo" />
}

function Layout(props: {children: React.ReactElement | React.ReactElement[]}) {
  const template = useSimpleBlogTemplate()
  const {header} = template

  const height = header.isCollapsed ? 50 : header.height
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
  const template = useSimpleBlogTemplate()
  const {header} = template
  const backgroundColorRgb = rgba(
    header.backgroundColor,
    header.backgroundOpacity,
  )

  if (header.isCollapsed) {
    return props.children
  }

  return (
    <ColorOverlay color={backgroundColorRgb} aria-label="header">
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
  disableShadow?: boolean
}>`
  ${(props) =>
    props.backgroundImage
      ? `background-image: url(${props.backgroundImage});`
      : null}

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: ${(props) => props.theme.spacing[8]};
  ${(props) => (props.disableShadow ? '' : `box-shadow: 20px 20px 50px #ddd;`)}
`

const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
`

const Middle = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Logo = styled.img`
  max-height: 100%;
  max-width: 100%;
  padding: 20px 0;
`
const LogoContainer = styled(RelativeLink)`
  display: flex;
  justify-content: center;
  align-items: center;
`
