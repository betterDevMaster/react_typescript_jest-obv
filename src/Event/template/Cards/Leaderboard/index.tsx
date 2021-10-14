import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {useAttendeeVariables} from 'Event'
import {useEntries} from 'Event/Leaderboard'
import {useCards} from 'Event/template/Cards'
import {PageTitle} from 'Event/template/Cards/Page'
import Content from 'lib/ui/form/TextEditor/Content'
import React from 'react'
import {User} from 'auth/user'
import CardsPage from 'Event/template/Cards/Page'

export default function Leaderboard(props: {user: User}) {
  const v = useAttendeeVariables()
  const {
    template: {leaderboard},
  } = useCards()
  const {entries} = useEntries()

  return (
    <CardsPage user={props.user}>
      <PageTitle>{v(leaderboard.title)}</PageTitle>
      <Content>{v(leaderboard.description)}</Content>
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
    </CardsPage>
  )
}
