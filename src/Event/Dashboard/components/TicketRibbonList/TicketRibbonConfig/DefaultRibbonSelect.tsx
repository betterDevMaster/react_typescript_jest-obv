import {TicketRibbonConfigProps} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbonConfig'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import Select from '@material-ui/core/Select'
import {TICKET_RIBBON_IMAGE} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {onUnknownChangeHandler} from 'lib/dom'

export default function DefaultRibbonSelect(props: TicketRibbonConfigProps) {
  const {ticketRibbon, update} = props

  /**
   * Only want to show default ribbon select if a user has
   * NOT uploaded a custom ribbon.
   */
  if (Boolean(ticketRibbon.customRibbon)) {
    return null
  }

  return (
    <FormControl fullWidth>
      <Select
        value={ticketRibbon.name}
        inputProps={{
          'aria-label': 'pick ticket ribbon',
        }}
        onChange={onUnknownChangeHandler(update('name'))}
      >
        {Object.entries(TICKET_RIBBON_IMAGE).map(([name, image]) => (
          <MenuItem key={name} value={name}>
            <Image src={image} alt={name} />
            <span>{name}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
const Image = styled.img`
  margin-right: ${(props) => props.theme.spacing[2]};
  width: 40px;
`
