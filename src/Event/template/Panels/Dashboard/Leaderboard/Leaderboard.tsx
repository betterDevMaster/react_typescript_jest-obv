import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {useAttendeeVariables} from 'Event'
import {useEntries} from 'Event/Leaderboard'
import {usePanels} from 'Event/template/Panels'
import {PageTitle} from 'Event/template/Panels/Page'
import Content from 'lib/ui/form/TextEditor/Content'
import React from 'react'
import {useToggle} from 'lib/toggle'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import LeaderboardConfig from 'Event/template/Panels/Dashboard/Leaderboard/LeaderboardConfig'

export default function Leaderboard() {
  const v = useAttendeeVariables()
  const {
    template: {leaderboard},
  } = usePanels()
  const {entries} = useEntries()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <>
      <LeaderboardConfig isVisible={configVisible} onClose={toggleConfig} />
      <Editable onEdit={toggleConfig}>
        <PageTitle>{v(leaderboard.title)}</PageTitle>
      </Editable>
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
    </>
  )
}
