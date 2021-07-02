import Button from '@material-ui/core/Button'
import {
  BLUE_RIBBON,
  TicketRibbon,
} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbon'
import React, {useState} from 'react'
import {TicketRibbonConfig} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig'

export default function AddTicketRibbonButton(props: {className?: string}) {
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
