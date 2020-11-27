import Button from '@material-ui/core/Button'
import {TICKET_RIBBON_TYPE} from 'Event/Dashboard/components/TicketRibbon'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import React from 'react'
import {useDispatch} from 'react-redux'

export default function SetTicketRibbonButton(props: {className?: string}) {
  const dispatch = useDispatch()
  const setTicketRibbon = () => {
    dispatch(
      setConfig({
        type: TICKET_RIBBON_TYPE,
      }),
    )
  }
  return (
    <Button
      aria-label="set ticket ribbon"
      fullWidth
      size="large"
      variant="outlined"
      color="primary"
      onClick={setTicketRibbon}
      className={props.className}
    >
      Set Ticket Ribbon
    </Button>
  )
}
