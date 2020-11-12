import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import {TICKET_RIBBON} from 'organization/event/Dashboard/components/TicketRibbon'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {onUnknownChangeHandler} from 'lib/dom'
import {
  useDashboard,
  useUpdateDashboard,
} from 'organization/event/Dashboard/state/DashboardProvider'

export default function TicketRibbonConfig() {
  const {ticketRibbon} = useDashboard()
  const updateDashboard = useUpdateDashboard()

  if (ticketRibbon === undefined) {
    throw new Error('Missing ticket ribbon; was dashboard set correctly?')
  }

  const update = (ticketRibbon: string) => {
    updateDashboard({
      ticketRibbon,
    })
  }

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Pick a ticket</InputLabel>
        <Select
          value={ticketRibbon || ''}
          inputProps={{
            'aria-label': 'pick ticket ribbon',
          }}
          onChange={onUnknownChangeHandler(update)}
        >
          {Object.values(TICKET_RIBBON).map((tr) => (
            <MenuItem key={tr.name} value={tr.name}>
              <Image src={tr.image} alt={tr.name} />
              <span>{tr.name}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

const Image = styled.img`
  margin-right: ${(props) => props.theme.spacing[2]};
  width: 40px;
`
