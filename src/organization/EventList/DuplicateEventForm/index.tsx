import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import Page from 'organization/user/Layout/Page'
import Layout from 'organization/user/Layout'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Form from 'organization/EventList/DuplicateEventForm/Form'
import {useEvent} from 'Event/EventProvider'
import {ObvioEvent} from 'Event'
import {useHistory} from 'react-router-dom'

export default function DuplicateEventForm() {
  const {routes} = useOrganization()
  const {event} = useEvent()
  const history = useHistory()

  useBreadcrumbs([{title: 'Events', url: routes.events.root}])

  const goToCopiedEvent = (event: ObvioEvent) =>
    history.push(`${routes.events.root}/${event.slug}`)
  const backToEventsList = () => history.push(routes.events.root)

  return (
    <Layout>
      <Page>
        <Title variant="h5" align="center">
          Create a copy of {event.name} ({event.slug})
        </Title>
        <Form onComplete={goToCopiedEvent} onCancel={backToEventsList} />
      </Page>
    </Layout>
  )
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)
