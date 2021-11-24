import {Attendee} from 'Event/attendee'
import styled from 'styled-components'
import Page from 'Event/template/SimpleBlog/Page'
import React from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import {useAttendeeVariables} from 'Event'
import {PageTitle, PageDescription} from 'Event/template/SimpleBlog/Page'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import Content from 'lib/ui/form/TextEditor/Content'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEntries} from 'Event/Leaderboard'

export default function SimpleBlogLeaderboard(props: {user: Attendee}) {
  const {entries} = useEntries()
  const template = useSimpleBlogTemplate()
  const {leaderboard: leaderboardPage} = template

  const v = useAttendeeVariables()

  let description = v(leaderboardPage.description)

  return (
    <Page user={props.user}>
      <PageTitle>{leaderboardPage.title}</PageTitle>
      <PageDescription>
        <Content>{description}</Content>
      </PageDescription>
      <StyledRelativeLink
        to={eventRoutes.root}
        color={leaderboardPage.backToDashboardTextColor}
      >
        {leaderboardPage.backToDashboardText}
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
