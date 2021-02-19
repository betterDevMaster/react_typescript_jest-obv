import styled from 'styled-components'
import React from 'react'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useLocation} from 'react-router-dom'
import {useEventRoutes} from 'organization/Event/EventRoutes'

export default function ConfigNav() {
  const routes = useEventRoutes()
  return (
    <Box>
      <ConfigNavItem to={routes.root} aria-label="areas">
        Areas
      </ConfigNavItem>
      <ConfigNavItem to={routes.waiver} aria-label="configure waiver">
        Waiver
      </ConfigNavItem>
      <ConfigNavItem to={routes.dashboard} aria-label="configure dashboard">
        Dashboard
      </ConfigNavItem>
      <ConfigNavItem to={routes.tech_check} aria-label="configure tech check">
        Tech Check
      </ConfigNavItem>
      <ConfigNavItem to={routes.attendees} aria-label="attendee management">
        Attendees
      </ConfigNavItem>
      <ConfigNavItem to={routes.points} aria-label="configure points">
        Points
      </ConfigNavItem>
      <ConfigNavItem to={routes.speakers} aria-label="configure speakers">
        Speakers
      </ConfigNavItem>
      <ConfigNavItem to={routes.emoji} aria-label="view emoji page">
        Emoji Page
      </ConfigNavItem>
      <ConfigNavItem to={routes.general} aria-label="general config">
        General
      </ConfigNavItem>
      <ConfigNavItem to={routes.services.root} aria-label="services">
        Services
      </ConfigNavItem>
    </Box>
  )
}

function ConfigNavItem(props: {
  to: string
  'aria-label': string
  children: string
}) {
  const location = useLocation()
  const paths = location.pathname.split('/')
  const eventRoutes = useEventRoutes()

  const isAreasLocation = Boolean(paths.find((p) => p === 'areas'))
  const isAreasLink = props.to === eventRoutes.root
  const isAreasSubpath = isAreasLink && isAreasLocation

  const isServicesLocation = Boolean(paths.find((p) => p === 'services'))
  const isServicesLink = props.to === eventRoutes.services.root
  const isServicesSubpath = isServicesLocation && isServicesLink

  const isActive =
    props.to === location.pathname || isAreasSubpath || isServicesSubpath

  return (
    <ConfigLink
      to={props.to}
      active={isActive}
      aria-label={props['aria-label']}
    >
      {props.children}
    </ConfigLink>
  )
}

const Box = styled.div`
  padding: ${(props) =>
    `${props.theme.spacing[2]} 0 ${props.theme.spacing[2]} 0 `};
`

const ConfigLink = styled((props) => {
  const {active, ...otherProps} = props
  return <RelativeLink {...otherProps} />
})<{active: boolean}>`
  margin-right: ${(props) => props.theme.spacing[5]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  color: ${(props) => (props.active ? '#000000' : '#707070')};
  display: inline-block;
`
