import Button from '@material-ui/core/Button'
import {useEventRoutes} from 'event'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'organization/Events/EventProvider'
import Page from 'organization/user/Layout/Page'
import React from 'react'

export default function EventConfig() {
  const routes = useEventRoutes()
  const event = useEvent()

  return (
    <Page>
      <h2>{event.name}</h2>
      <RelativeLink disableStyles to={routes.dashboard}>
        <Button variant="contained" color="primary">
          Configure Dashboard
        </Button>
      </RelativeLink>
    </Page>
  )
}
