import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {useAsync} from 'lib/async'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback} from 'react'
import Card from 'organization/EventList/Card'
import Page from 'organization/user/Layout/Page'
import {ObvioEvent} from 'Event'
import Layout from 'organization/user/Layout'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import HasPermission from 'organization/HasPermission'
import {CREATE_EVENTS} from 'organization/PermissionsProvider'

export default function EventList() {
  const {organization, routes, client} = useOrganization()

  useBreadcrumbs([{title: 'Events', url: routes.events.root}])

  const fetch = useCallback(() => {
    const url = api(`/organizations/${organization.slug}/events`)
    return client.get<ObvioEvent[]>(url)
  }, [client, organization])

  const {data: events, loading} = useAsync(fetch)
  if (loading || !events) {
    return null
  }

  const createButton = (
    <HasPermission permission={CREATE_EVENTS}>
      <RelativeLink to={routes.events.create} disableStyles>
        <Button variant="contained" color="primary" aria-label="create event">
          Create Event
        </Button>
      </RelativeLink>
    </HasPermission>
  )

  const empty = events.length === 0
  if (empty) {
    return (
      <Layout navbarRight={createButton}>
        <EmptyBox>
          <p>No events have been created</p>
        </EmptyBox>
      </Layout>
    )
  }

  return (
    <Layout navbarRight={createButton}>
      <Page>
        <Grid>
          {events.map((e) => (
            <Card key={e.id} event={e} />
          ))}
        </Grid>
      </Page>
    </Layout>
  )
}

const EmptyBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[8]};
  text-align: center;
`

const column = `minmax(270px, auto)`

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-gap: ${(props) => props.theme.spacing[8]};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: ${column} ${column};
    grid-template-rows: auto auto;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: ${column} ${column} ${column};
    grid-template-rows: auto auto auto;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: ${column} ${column} ${column} ${column};
    grid-template-rows: auto auto auto auto;
  }
`
