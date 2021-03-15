import {Attendee} from 'Event/attendee'
import styled from 'styled-components'
import Page from 'Event/template/SimpleBlog/Page'

import React, {useCallback, useEffect, useState} from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useAsync} from 'lib/async'
import {useAttendee} from 'Event/auth'
import {usePoints} from 'Event/PointsProvider'
import {useTemplate} from 'Event/TemplateProvider'
import {Entry} from 'Event/Leaderboard'

export default function SimpleBlogLeaderboard(props: {user: Attendee}) {
  const [entries, setEntries] = useState<Entry[]>([])
  const {data: fetched} = useEntries()
  const attendee = useAttendee()
  const {score} = usePoints()
  const {points} = useTemplate()

  const unit = points ? points.unit : 'Points'

  useEffect(() => {
    if (!fetched) {
      return
    }

    setEntries(fetched)
  }, [fetched])

  return (
    <Page user={props.user}>
      <Title>Leaderboard</Title>
      <Description>
        <DescriptionText>
          {attendee.first_name}, you have earned{' '}
          <strong>
            {score.points} {unit}
          </strong>
          , and you are currently number <strong>{score.position}</strong>.
          Great Job!
        </DescriptionText>
        <DescriptionText em>
          The list below is the top 200 point earners! If you don’t see your
          name listed, there’s still time!
        </DescriptionText>
      </Description>
      <Container>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="right" size="small">
                Points
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index} aria-label="entry">
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="left">
                  {entry.attendee.first_name} {entry.attendee.last_name}
                </TableCell>
                <TableCell align="right">{entry.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </Page>
  )
}

function useEntries() {
  const {client, event} = useEvent()
  const url = api(`/events/${event.slug}/leaderboard`)

  const request = useCallback(() => client.get<Entry[]>(url), [client, url])

  return useAsync(request)
}

const Title = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`

const Container = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Description = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`

const DescriptionText = styled.p<{em?: boolean}>`
  color: #000;
  font-size: 21px;
  line-height: 1.5;
  text-align: center;
  font-style: ${(props) => (props.em ? 'italic' : 'normal')};
`
