import IconButton from 'lib/ui/IconButton'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import {TicketRibbon} from 'Event/template/Panels/Dashboard/TicketRibbonList/TicketRibbon'
import React, {useState} from 'react'
import TicketRibbonConfig from 'Event/template/Panels/Dashboard/TicketRibbonList/TicketRibbonConfig'
import styled from 'styled-components'
import {colors} from 'lib/ui/theme'
import {DeepRequired} from 'lib/type-utils'

export const DEFAULT_TICKET_RIBBON: DeepRequired<TicketRibbon> = {
  backgroundColor: colors.primary,
  letter: '',
  letterUpload: null,
  hoverText: '',
  hoverUpload: null,
  textColor: '#ffffff',
  rules: [],
  hoverImageWidth: 106,
  hoverTextFontStyles: [],
}

export default function AddTicketRibbonButton(props: {className?: string}) {
  const [
    ticketRibbon,
    setTicketRibbon,
  ] = useState<DeepRequired<TicketRibbon> | null>(null)

  const add = () => {
    setTicketRibbon({...DEFAULT_TICKET_RIBBON})
  }
  return (
    <>
      <NewTicketRibbonConfig
        ticketRibbon={ticketRibbon}
        onClose={() => setTicketRibbon(null)}
      />
      <StyledIconButton
        aria-label="add ticket ribbon"
        onClick={add}
        className={props.className}
      >
        <AddIcon />
      </StyledIconButton>
    </>
  )
}

function NewTicketRibbonConfig(props: {
  ticketRibbon: DeepRequired<TicketRibbon> | null
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

const StyledIconButton = styled(IconButton)`
  background: rgba(255, 255, 255, 0.3);
  height: 100% !important;
  display: flex;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`
const AddIcon = styled(AddOutlinedIcon)`
  color: white;
`
