import {Attendee} from 'Event/attendee'
import styled from 'styled-components'
import Page from 'Event/template/SimpleBlog/Page'
import React from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
  DEFAULT_BACK_TO_DASHBOARD_TEXT,
} from 'Event/template/SimpleBlog/Leaderboard/LeaderboardConfig'
import {useVariables} from 'Event'
import {PageTitle} from 'Event/template/SimpleBlog/Page'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import Content from 'lib/ui/form/TextEditor/Content'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEntries} from 'Event/Leaderboard'

export default function SimpleBlogLeaderboard(props: {user: Attendee}) {
  const {entries} = useEntries()
  const {template} = useSimpleBlog()
  const {leaderboard: leaderboardPage} = template

  const v = useVariables()

  let description = v(leaderboardPage?.description || DEFAULT_DESCRIPTION)

  return (
    <Page user={props.user}>
      <PageTitle>{leaderboardPage?.title || DEFAULT_TITLE}</PageTitle>
      <Description>{description}</Description>
      <StyledRelativeLink
        to={eventRoutes.root}
        color={
          leaderboardPage?.backToDashboardTextColor ||
          DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR
        }
      >
        {leaderboardPage?.backToDashboardText || DEFAULT_BACK_TO_DASHBOARD_TEXT}
      </StyledRelativeLink>
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

const Description = styled(Content)`
  text-align: center;
`

const Container = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const StyledRelativeLink = styled((props) => {
  const {color, ...otherProps} = props

  return <RelativeLink {...otherProps} />
})`
  line-height: 1.5;
  margin-bottom: 20px;
  color: ${(props) => props.color};
`
