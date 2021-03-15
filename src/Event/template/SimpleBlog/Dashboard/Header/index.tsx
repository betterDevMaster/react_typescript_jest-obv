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
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export const HEADER = 'Header'

export default function Header(props: {
  primaryColor: string
  toggleMenu: () => void
  menuVisible: boolean
  'aria-label'?: string
}) {
  const {title, header} = useTemplate()

  const {event} = useEvent()

  const logo = event.logo ? event.logo.url : ''
  const backgroundColor = header.backgroundColor
  const backgroundOpacity = header.backgroundOpacity
  const backgroundImage = event.header_background
    ? event.header_background.url
    : ''
  const height = header.height
  const mobileHeight = Math.round(height * 0.7)

  const backgroundColorRgb = rgb(backgroundColor, backgroundOpacity)

  return (
    <EditComponent component={{type: HEADER}}>
      <Box backgroundImage={backgroundImage} aria-label="header">
        <ColorOverlay color={backgroundColorRgb}>
          <Container maxWidth="lg">
            <Layout
              desktopHeight={height}
              mobileHeight={mobileHeight}
              arial-label="header layout"
            >
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
        </ColorOverlay>
      </Box>
    </EditComponent>
  )
}

const Layout = styled.div<{desktopHeight: number; mobileHeight: number}>`
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
  box-shadow: 20px 20px 50px #ddd;
  margin-bottom: 60px;

  ${(props) =>
    props.backgroundImage
      ? `background-image: url(${props.backgroundImage});`
      : null}
`

const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
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
