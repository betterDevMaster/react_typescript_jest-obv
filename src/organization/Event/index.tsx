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
import {formatDate} from 'lib/date-time'
import Box from '@material-ui/core/Box'
import {useLocalization} from 'lib/LocalizationProvider'
import UpdateEventForm from 'organization/Event/EventSettings'

export default function Event() {
  const {can} = usePermissions()
  const {event, url} = useEvent()
  const {dateTimeFormat} = useLocalization()

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
            {formatDate(event.start, dateTimeFormat)} -{' '}
            {formatDate(event.end, dateTimeFormat)}
          </Typography>
        </Box>
        <Typography variant="h6">Expected Number of Attendees</Typography>
        <Typography>{event.num_expected_attendees}</Typography>
      </Page>
    </Layout>
  )
}
