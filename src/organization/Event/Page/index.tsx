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
import {EventRoutePaths, useEventRoutes} from 'organization/Event/EventRoutes'
import {useEvent} from 'Event/EventProvider'
import {ObvioEvent} from 'Event'
import Typography from '@material-ui/core/Typography'

export default function EventPage(props: {
  children: React.ReactElement | React.ReactElement[]
  disablePadding?: boolean
  className?: string
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
        <Content
          disablePadding={props.disablePadding}
          className={props.className}
        >
          {props.children}
        </Content>
      </StyledContainer>
    </>
  )
}

export function rootEventBreadcrumbs(
  organizationRoutes: OrganizationRoutes,
  eventRoutes: EventRoutePaths,
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

export function SectionTitle(props: {children: string}) {
  return <TitleText variant="h4">{props.children}</TitleText>
}

const TitleText = withStyles({
  root: {
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
})(Typography)

const Content = styled.div<{disablePadding?: boolean}>`
  background: #ffffff;
  padding: ${(props) => (props.disablePadding ? 0 : props.theme.spacing[6])};
  border-radius: 3px;
`

export const PreviewBox = styled.div`
  padding: ${(props) => props.theme.spacing[2]};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
`
