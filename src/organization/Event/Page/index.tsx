import Container from '@material-ui/core/Container'
import styled from 'styled-components'
import React from 'react'
import {createGlobalStyle} from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import ConfigNav from 'organization/Event/Page/ConfigNav'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {
  OrganizationRoutes,
  useOrganization,
} from 'organization/OrganizationProvider'
import {EventRoutes, useEventRoutes} from 'organization/Event/EventRoutes'
import {useEvent} from 'Event/EventProvider'
import {ObvioEvent} from 'Event'

export default function EventPage(props: {
  children: React.ReactElement | React.ReactElement[]
  disablePadding?: boolean
}) {
  const {routes: orgRoutes} = useOrganization()
  const eventRoutes = useEventRoutes()
  const {event} = useEvent()

  useBreadcrumbs(rootEventBreadcrumbs(orgRoutes, eventRoutes, event))

  return (
    <>
      <Background />
      <StyledContainer maxWidth="lg">
        <ConfigNav />
        <Content disablePadding={props.disablePadding}>
          {props.children}
        </Content>
      </StyledContainer>
    </>
  )
}

export function rootEventBreadcrumbs(
  organizationRoutes: OrganizationRoutes,
  eventRoutes: EventRoutes,
  event: ObvioEvent,
) {
  return [
    {
      title: 'Events',
      url: organizationRoutes.events.root,
    },
    {
      title: event.name,
      url: eventRoutes.root,
    },
  ]
}

const Background = createGlobalStyle`
  html {
    background: #dfdfdf;
  }
`

const StyledContainer = withStyles({
  root: {
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
})(Container)

const Content = styled.div<{disablePadding?: boolean}>`
  background: #ffffff;
  padding: ${(props) => (props.disablePadding ? 0 : props.theme.spacing[6])};
  border-radius: 3px;
`
