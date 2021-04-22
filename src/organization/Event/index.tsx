import React from 'react'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {useEvent} from 'Event/EventProvider'
import {
  CONFIGURE_EVENTS,
  usePermissions,
} from 'organization/PermissionsProvider'
import Typography from '@material-ui/core/Typography'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {DATE_TIME_FORMAT, formatDate} from 'lib/date-time'
import Box from '@material-ui/core/Box'
import UpdateEventForm from 'organization/Event/UpdateEventForm'

export default function Event() {
  const {can} = usePermissions()
  const {event, url} = useEvent()

  if (can(CONFIGURE_EVENTS)) {
    return <UpdateEventForm />
  }

  return (
    <Layout>
      <Page>
        <Box mb={2}>
          <Typography variant="h4">{event.name}</Typography>
          <AbsoluteLink to={url} newTab>
            <Typography>{url}</Typography>
          </AbsoluteLink>
        </Box>
        <Box mb={1}>
          <Typography variant="h6">Times</Typography>
          <Typography>
            {formatDate(event.start, DATE_TIME_FORMAT)} -{' '}
            {formatDate(event.end, DATE_TIME_FORMAT)}
          </Typography>
        </Box>
        <Typography variant="h6">Expected Number of Attendees</Typography>
        <Typography>{event.num_attendees}</Typography>
      </Page>
    </Layout>
  )
}
