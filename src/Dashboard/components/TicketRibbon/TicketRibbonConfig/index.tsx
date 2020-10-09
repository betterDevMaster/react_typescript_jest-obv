import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import {TICKET_RIBBON} from 'Dashboard/components/TicketRibbon'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import MenuItem from '@material-ui/core/MenuItem'
import {onChangeHandler} from 'lib/dom'
import {setDashboard} from 'Dashboard/edit/state/actions'

export default function TicketRibbonConfig() {
  const dispatch = useDispatch()
  const ticketRibbon = useSelector(
    (state: RootState) => state.dashboardEditor.ticketRibbon,
  )

  if (ticketRibbon === undefined) {
    throw new Error('Missing ticket ribbon; was dashboard set correctly?')
  }

  const update = (ticketRibbon: string) => {
    dispatch(
      setDashboard({
        ticketRibbon,
      }),
    )
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
          onChange={onChangeHandler(update)}
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
