import {TicketRibbonConfigProps} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import Select from '@material-ui/core/Select'
import {TICKET_RIBBON_IMAGE} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbon'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {onUnknownChangeHandler} from 'lib/dom'
import {Controller} from 'react-hook-form'

export default function DefaultRibbonSelect(props: TicketRibbonConfigProps) {
  const {ticketRibbon, control, customRibbon} = props

  /**
   * Only want to show default ribbon select if a user has
   * NOT uploaded a custom ribbon.
   */
  if (Boolean(customRibbon)) {
    return null
  }

  return (
    <FormControl fullWidth>
      <Controller
        control={control}
        name="name"
        defaultValue={ticketRibbon.name || ''}
        render={({value, onChange}) => (
          <Select
            value={value}
            inputProps={{
              'aria-label': 'pick ticket ribbon',
            }}
            onChange={onUnknownChangeHandler(onChange)}
          >
            {Object.entries(TICKET_RIBBON_IMAGE).map(([name, image]) => (
              <MenuItem key={name} value={name}>
                <Image src={image} alt={name} />
                <span>{name}</span>
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  )
}
const Image = styled.img`
  margin-right: ${(props) => props.theme.spacing[2]};
  width: 40px;
`
