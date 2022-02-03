import Button from '@material-ui/core/Button'
import {
  BLUE_RIBBON,
  TicketRibbonProps,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import React, {useState} from 'react'
import {TicketRibbonConfig} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbonConfig'

export default function AddTicketRibbonButton(props: {className?: string}) {
  const [ticketRibbon, setTicketRibbon] = useState<TicketRibbonProps | null>(
    null,
  )

  const add = () => {
    const newRibbon: TicketRibbonProps = {
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
  ticketRibbon: TicketRibbonProps | null
  onClose: () => void
}) {
  if (!props.ticketRibbon) {
    return null
  }

  return (
    <TicketRibbonConfig
      ticketRibbon={props.ticketRibbon}
      onClose={props.onClose}
      isVisible
    />
  )
}
