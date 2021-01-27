import Container from '@material-ui/core/Container'
import styled from 'styled-components'
import React from 'react'
import {createGlobalStyle} from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import ConfigNav from 'organization/Event/Page/ConfigNav'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useEvent} from 'Event/EventProvider'

export default function EventPage(props: {
  children: React.ReactElement | React.ReactElement[]
  disablePadding?: boolean
}) {
  const {routes: orgRoutes} = useOrganization()
  const eventRoutes = useEventRoutes()
  const {event} = useEvent()

  useBreadcrumbs([
    {
      title: 'Events',
      url: orgRoutes.events.root,
    },
    {
      title: event.name,
      url: eventRoutes.root,
    },
  ])

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
