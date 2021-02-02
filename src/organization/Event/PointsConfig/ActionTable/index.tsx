import React, {useState} from 'react'
import {TableBody} from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {Action} from 'Event/ActionsProvider'
import ActiveSwitch from 'organization/Event/PointsConfig/ActionTable/ActiveSwitch'
import Description from 'organization/Event/PointsConfig/ActionTable/Description'

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
          <TableCell align="right">Points</TableCell>
          <TableCell align="right">Max per Day</TableCell>
          <TableCell align="right">Max per Event</TableCell>
          <TableCell align="right">Active</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.actions.map((action) => (
          <TableRow key={action.id} aria-label="action">
            <TableCell component="th">
              <Description action={action} onClick={select(action)} />
            </TableCell>
            <TableCell align="right">{action.points}</TableCell>
            <TableCell align="right">{action.max_per_day || '-'}</TableCell>
            <TableCell align="right">{action.max_per_event || '-'}</TableCell>
            <TableCell align="right">
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
