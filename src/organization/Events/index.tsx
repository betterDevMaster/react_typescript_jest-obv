import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {client} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {Organization} from 'organization/organizations-client'
import {organizationRoutes} from 'organization/Routes'
import React, {useCallback} from 'react'
import Card from 'organization/Events/Card'
import {ObvioEvent} from 'event'

export default function Events() {
  const organization = useOrganization()
  const fetch = useCallback(() => {
    return fetchEvents(organization)
  }, [organization])

  const {data: events, loading} = useAsync(fetch)
  if (loading || !events) {
    return null
  }

  const empty = events.length === 0
  if (empty) {
    return (
      <EmptyBox>
        <p>No events have been created</p>
        <RelativeLink to={organizationRoutes.events.create} disableStyles>
          <Button variant="outlined" color="primary">
            Create Event
          </Button>
        </RelativeLink>
      </EmptyBox>
    )
  }

  return (
    <div>
      <Header>
        <RelativeLink to={organizationRoutes.events.create} disableStyles>
          <Button variant="contained" color="primary">
            Create
          </Button>
        </RelativeLink>
      </Header>
      {events.map((e) => (
        <Card key={e.id} event={e} />
      ))}
    </div>
  )
}

function fetchEvents(organization: Organization) {
  const url = api(`/organizations/${organization.slug}/events`)
  return client.get<ObvioEvent[]>(url)
}

const EmptyBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[8]};
  text-align: center;
`

const Header = styled.div`
  text-align: right;
  margin-bottom: ${(props) => props.theme.spacing[6]};
`
