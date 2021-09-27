import styled from 'styled-components'
import React from 'react'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useLocation} from 'react-router-dom'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import HasPermission from 'organization/HasPermission'
import {
  CONFIGURE_EVENTS,
  UPDATE_ATTENDEES,
} from 'organization/PermissionsProvider'

export default function ConfigNav() {
  const routes = useEventRoutes()
  return (
    <Box>
      <ConfigNavItem to={routes.areas.root} aria-label="areas">
        Areas
      </ConfigNavItem>
      <HasPermission permission={UPDATE_ATTENDEES}>
        <ConfigNavItem to={routes.attendees} aria-label="attendee management">
          Attendees
        </ConfigNavItem>
      </HasPermission>
      <ConfigureEventPages />
    </Box>
  )
}

function ConfigureEventPages() {
  const routes = useEventRoutes()

  return (
    <HasPermission permission={CONFIGURE_EVENTS}>
      <>
        <ConfigNavItem to={routes.waiver} aria-label="configure waiver">
          Waiver
        </ConfigNavItem>
        <ConfigNavItem to={routes.forms.root} aria-label="configure forms">
          Forms
        </ConfigNavItem>
        <ConfigNavItem to={routes.tech_check} aria-label="configure tech check">
          Tech Check
        </ConfigNavItem>
        <ConfigNavItem to={routes.dashboard} aria-label="configure dashboard">
          Dashboard
        </ConfigNavItem>
        <ConfigNavItem to={routes.points} aria-label="configure points">
          Points
        </ConfigNavItem>
        <ConfigNavItem to={routes.speakers} aria-label="configure speakers">
          Speakers
        </ConfigNavItem>
        <ConfigNavItem to={routes.sponsors} aria-label="configure sponsors">
          Sponsors
        </ConfigNavItem>
        <ConfigNavItem to={routes.faqs} aria-label="configure faqs">
          FAQ
        </ConfigNavItem>
        <ConfigNavItem
          to={routes.emoji.settings}
          aria-label="configure emoji page"
        >
          Emoji Page
        </ConfigNavItem>
        <ConfigNavItem to={routes.general} aria-label="general config">
          General
        </ConfigNavItem>
        <ConfigNavItem
          to={routes.localization}
          aria-label="configure localization"
        >
          Localization
        </ConfigNavItem>
        <ConfigNavItem to={routes.services.root} aria-label="services">
          Services
        </ConfigNavItem>
        <ConfigNavItem
          to={routes.name_appendage}
          aria-label="attendee label page"
        >
          Attendee label
        </ConfigNavItem>
        <ConfigNavItem to={routes.reports} aria-label="reports config">
          Reports
        </ConfigNavItem>
        <ConfigNavItem to={routes.backgrounds} aria-label="backgrounds">
          Zoom Backgrounds
        </ConfigNavItem>
      </>
    </HasPermission>
  )
}

function ConfigNavItem(props: {
  to: string
  'aria-label': string
  children: string
  newTab?: boolean
}) {
  const {to} = props
  const isSubpath = useIsSubpath()

  const location = useLocation()
  const eventRoutes = useEventRoutes()

  const isActive =
    props.to === location.pathname ||
    isSubpath(to === eventRoutes.areas.root, 'areas') ||
    isSubpath(to === eventRoutes.services.root, 'services') ||
    isSubpath(to === eventRoutes.forms.root, 'forms')

  return (
    <ConfigLink
      to={props.to}
      active={isActive}
      aria-label={props['aria-label']}
      newTab={props.newTab}
    >
      {props.children}
    </ConfigLink>
  )
}

/**
 * Check if the current URL location is a child of the config nav
 * item. ie. If we're viewing a nested area, we'd like to
 * highlight the 'areas' link.
 *
 * @returns
 */
function useIsSubpath() {
  const location = useLocation()
  const paths = location.pathname.split('/')

  return (isLink: boolean, key: string) => {
    const isLocation = Boolean(paths.find((p) => p === key))
    return isLocation && isLink
  }
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
