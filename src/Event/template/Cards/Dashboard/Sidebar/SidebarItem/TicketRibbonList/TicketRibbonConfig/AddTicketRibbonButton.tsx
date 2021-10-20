import Button from '@material-ui/core/Button'
import {
  BLUE_RIBBON,
  TicketRibbon,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import React, {useState} from 'react'
import {TicketRibbonConfig} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbonConfig'
import {TicketRibbonListProps} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList'

export default function AddTicketRibbonButton(props: {
  className?: string
  list: TicketRibbonListProps
}) {
  const [ticketRibbon, setTicketRibbon] = useState<TicketRibbon | null>(null)

  const add = () => {
    const newRibbon: TicketRibbon = {
      name: BLUE_RIBBON,
      text: '',
      color: '#ffffff',
      rules: [],
    }

    setTicketRibbon(newRibbon)
  }
  return (
    <>
      <NewTicketRibbonConfig
        ticketRibbon={ticketRibbon}
        onClose={() => setTicketRibbon(null)}
        list={props.list}
      />
      <Button
        aria-label="add ticket ribbon"
        fullWidth
        size="large"
        variant="outlined"
        color="primary"
        onClick={add}
        className={props.className}
      >
        Add Ticket Ribbon
      </Button>
    </>
  )
}

function NewTicketRibbonConfig(props: {
  ticketRibbon: TicketRibbon | null
  onClose: () => void
  list: TicketRibbonListProps
}) {
  if (!props.ticketRibbon) {
    return null
  }

  return (
    <TicketRibbonConfig
      ticketRibbon={props.ticketRibbon}
      onClose={props.onClose}
      list={props.list}
      isVisible
    />
  )
}