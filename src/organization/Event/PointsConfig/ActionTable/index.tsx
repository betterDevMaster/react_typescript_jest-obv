import React, {useState} from 'react'
import {TableBody} from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {Action} from 'Event/ActionsProvider'
import ActiveSwitch from 'organization/Event/PointsConfig/ActionTable/ActiveSwitch'
import Description from 'organization/Event/PointsConfig/ActionTable/Description'
import PlatformActionSelect from 'organization/Event/PointsConfig/ActionTable/PlatformActionSelect'

export default function ActionsTable(props: {
  actions: Action[]
  onSelect: (action: Action) => void
}) {
  const select = (action: Action) => () => props.onSelect(action)
  const [processing, setProcessing] = useState(false)

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell align="center">Points</TableCell>
          <TableCell align="center">Max per Day</TableCell>
          <TableCell align="center">Max per Event</TableCell>
          <TableCell align="center">Min Interval (Minutes)</TableCell>
          <TableCell align="center">Platform Action</TableCell>
          <TableCell align="center">Active</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.actions.map((action) => (
          <TableRow key={action.key} aria-label="action">
            <TableCell component="th">
              <Description action={action} onClick={select(action)} />
            </TableCell>
            <TableCell align="center">{points(action)}</TableCell>
            <TableCell align="center">{action.max_per_day || '-'}</TableCell>
            <TableCell align="center">{action.max_per_event || '-'}</TableCell>
            <TableCell align="center">
              {action.min_interval_minutes || '-'}
            </TableCell>
            <TableCell align="center">
              <PlatformActionSelect
                action={action}
                processing={processing}
                setProcessing={setProcessing}
              />
            </TableCell>
            <TableCell align="center">
              <ActiveSwitch
                action={action}
                processing={processing}
                setProcessing={setProcessing}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function points(action: Action) {
  if (action.has_random_points) {
    return `${action.random_min_points} - ${action.random_max_points}`
  }

  return action.points
}
