import React from 'react'
import styled from 'styled-components'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import HasPermission from 'organization/HasPermission'
import {
  CONFIGURE_EVENTS,
  UPDATE_ATTENDEES,
} from 'organization/PermissionsProvider'
import ConfigNavItem from 'organization/Event/Page/ConfigNav/ConfigNavItem'
import TemplateConfigNavItems from 'organization/Event/Page/ConfigNav/TemplateConfigNavItems'

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
        <ConfigNavItem to={routes.waiver.root} aria-label="configure waiver">
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
        <ConfigNavItem to={routes.image_entries} aria-label="image entries">
          Image Entries
        </ConfigNavItem>
        <ConfigNavItem to={routes.webhooks} aria-label="webhooks">
          Webhooks
        </ConfigNavItem>
        <TemplateConfigNavItems />
      </>
    </HasPermission>
  )
}

const Box = styled.div`
  padding: ${(props) =>
    `${props.theme.spacing[2]} 0 ${props.theme.spacing[2]} 0 `};
`
