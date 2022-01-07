import React from 'react'
import styled from 'styled-components'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'

import {useAttendeeVariables} from 'Event'
import {useEntries} from 'Event/Leaderboard'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import {PageTitle} from 'Event/template/NiftyFifty/Page'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import LeaderboardConfig from 'Event/template/NiftyFifty/Dashboard/Leaderboard/LeaderboardConfig'

import {useToggle} from 'lib/toggle'
import Content from 'lib/ui/form/TextEditor/Content'

export default function Leaderboard() {
  const v = useAttendeeVariables()
  const {leaderboard} = useNiftyFiftyTemplate()
  const {entries} = useEntries()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Paper isXSMobile={isXSMobile}>
      <EditModeOnly>
        <LeaderboardConfig isVisible={configVisible} onClose={toggleConfig} />
      </EditModeOnly>
      <Editable onEdit={toggleConfig}>
        <PageTitle aria-label="config points tab page config">
          {v(leaderboard.title)}
        </PageTitle>
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
    </Paper>
  )
}

const Paper = styled.div<{
  isXSMobile: boolean
}>`
  padding: 0
    ${(props) =>
      props.isXSMobile ? props.theme.spacing[8] : props.theme.spacing[12]};
`
