import {Attendee} from 'Event/attendee'
import styled from 'styled-components'
import Page from 'Event/template/SimpleBlog/Page'
import {Link} from 'react-router-dom'
import React, {useCallback, useEffect, useState} from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useAsync} from 'lib/async'
import {usePoints} from 'Event/PointsProvider'
import {useTemplate} from 'Event/TemplateProvider'
import {Entry} from 'Event/Leaderboard'
import {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
  DEFAULT_BACK_TO_DASHBOARD_TEXT,
} from 'Event/template/SimpleBlog/Leaderboard/LeaderboardConfig'
import {useVariables} from 'Event'

import {PageTitle} from 'Event/template/SimpleBlog/Page'

const replace = (key: string, value: string, text: string) => {
  const match = new RegExp(`{{${key}}}`, 'gi')
  return text.replace(match, value)
}

export default function SimpleBlogLeaderboard(props: {user: Attendee}) {
  const [entries, setEntries] = useState<Entry[]>([])
  const {data: fetched} = useEntries()
  const {score} = usePoints()
  const {points, leaderboard: leaderboardPage} = useTemplate()
  const unit = points ? points.unit : 'Points'

  const v = useVariables()

  let description = leaderboardPage?.description || DEFAULT_DESCRIPTION
  description = v(description)
  description = replace('points', `${score.points}`, description)
  description = replace('unit', unit, description)
  description = replace('position', `${score.position}`, description)

  useEffect(() => {
    if (!fetched) {
      return
    }

    setEntries(fetched)
  }, [fetched])

  return (
    <Page user={props.user}>
      <PageTitle>{leaderboardPage?.title || DEFAULT_TITLE}</PageTitle>
      <Description
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
      <Link
        to="/"
        style={{
          color:
            leaderboardPage?.backToDashboardTextColor ||
            DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
          lineHeight: 1.5,
          marginBottom: 20,
        }}
      >
        {leaderboardPage?.backToDashboardText || DEFAULT_BACK_TO_DASHBOARD_TEXT}
      </Link>
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

const Description = styled.div`
  text-align: center;
`

const Container = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
