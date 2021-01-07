import React, {useState, useEffect, useCallback} from 'react'
import styled from 'styled-components'
import Layout from 'organization/user/Layout'
import Page from 'organization/user/Layout/Page'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {Attendee} from 'Event/attendee'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import {useAsync} from 'lib/async'
import {ResponseError} from 'lib/api-client'
import {formatDate} from 'lib/date-time'

export default function AttendeeList() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const {data: fetchedAttendees} = useAttendees()
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [error, setError] = useState<ResponseError | null>(null)

  useEffect(() => {
    if (!fetchedAttendees) {
      return
    }

    setAttendees(fetchedAttendees)
  }, [fetchedAttendees])

  const updateAttendee = (target: Attendee) => {
    const updated = attendees.map((a) => {
      const isTarget = a.id === target.id
      if (isTarget) {
        return target
      }

      return a
    })

    setAttendees(updated)
  }

  const completeCheckIn = (attendee: Attendee) => () => {
    setError(null)

    const url = api(
      `/events/${event.slug}/attendees/${attendee.id}/complete_tech_check`,
    )

    client.patch<Attendee>(url, {}).then(updateAttendee).catch(setError)
  }

  return (
    <Layout>
      <Page>
        <Title variant="h5">Attendee Management</Title>
        <Error>{error}</Error>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Checked-In On</TableCell>
              <TableCell align="right">Check In</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees.map((attendee: Attendee) => (
              <TableRow key={attendee.id}>
                <TableCell component="th" scope="row" aria-label="name">
                  {`${attendee.first_name} ${attendee.last_name}`}
                </TableCell>
                <TableCell align="right" aria-label="email">
                  {attendee.email}
                </TableCell>
                <TableCell align="right">
                  <CheckedInAt>{attendee.tech_check_completed_at}</CheckedInAt>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    aria-label="mark as completed tech check"
                    onClick={completeCheckIn(attendee)}
                  >
                    Check-In
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Page>
    </Layout>
  )
}

function useAttendees() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/attendees`)

  const request = useCallback(() => client.get<Attendee[]>(url), [client, url])
  return useAsync(request)
}

function CheckedInAt(props: {children: Attendee['tech_check_completed_at']}) {
  const label = 'date of completing tech check'

  if (!props.children) {
    return <span aria-label={label}>Not Checked-In</span>
  }

  return <span aria-label={label}>{formatDate(props.children)}</span>
}

function Error(props: {children: ResponseError | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText>{props.children.message}</ErrorText>
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.error};
  border: 1px solid ${(props) => props.theme.colors.error};
  padding: ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
