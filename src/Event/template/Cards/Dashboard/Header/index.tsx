import React from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'
import {rgba} from 'lib/color'
import {useCards} from 'Event/template/Cards'
import {useToggle} from 'lib/toggle'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {CardsConfig} from 'Event/template/Cards/CardsConfig'
import Hero from 'Event/template/Cards/Dashboard/Hero'
import {useRandomBackground} from 'Event/template/Cards/Login/Page'

export default function Header(props: {
  toggleMenu: () => void
  menuVisible: boolean
  'aria-label'?: string
  hideLogo?: boolean
  isDashboardHeader: boolean
}) {
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const {template} = useCards()
  const {menu} = template
  const {iconColor} = menu

  return (
    <>
      <CardsConfig isVisible={configVisible} onClose={toggleConfig} />
      <Editable onEdit={toggleConfig}>
        <CollapsableBackground isDashboardHeader={props.isDashboardHeader}>
          <CollapsableColorOverlay>
            <LayoutContiner maxWidth="lg">
              <Side>
                <MenuIconButton
                  active={props.menuVisible}
                  onClick={props.toggleMenu}
                  aria-label="show side menu"
                  iconColor={iconColor}
                />
              </Side>
              <Middle>
                <RelativeLink to={eventRoutes.root} disableStyles>
                  <CollapsableLogo hideLogo={props.hideLogo} />
                </RelativeLink>
                <Hero />
              </Middle>
              <Side />
            </LayoutContiner>
          </CollapsableColorOverlay>
        </CollapsableBackground>
      </Editable>
    </>
  )
}

function CollapsableBackground(props: {
  children: React.ReactElement
  isDashboardHeader: boolean
}) {
  const headerBackground = useRandomBackground()

  const backgroundImage = props.isDashboardHeader ? '' : headerBackground

  return (
    <Box backgroundImage={backgroundImage} disableMB={!props.isDashboardHeader}>
      {props.children}
    </Box>
  )
}

function CollapsableLogo(props: {hideLogo?: boolean}) {
  const {event} = useEvent()
  const {template} = useCards()
  const {title, header} = template
  const logo = event.logo ? event.logo.url : ''

  if (header.isCollapsed || props.hideLogo === true) {
    return null
  }
  return (
    <Logo
      src={logo}
      alt={title}
      aria-label="logo"
      width={template.header.logoSize}
    />
  )
}

function CollapsableColorOverlay(props: {children: React.ReactElement}) {
  const {template} = useCards()
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

const Side = styled.div`
  width: 42px;
`

const Box = styled.div<{
  backgroundImage: string | null
  disableMB: boolean
}>`
  ${(props) =>
    props.backgroundImage
      ? `background-image: url(${props.backgroundImage});`
      : null}

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: ${(props) => (props.disableMB ? '0' : props.theme.spacing[8])};
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
const Logo = styled.img<{width: number}>`
  margin-top: ${(props) => props.theme.spacing[7]};
  width: ${(props) => props.width}%;
  max-height: 100%;
  max-width: 100%;
`

const LayoutContiner = styled(Container)`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 50px;
`
