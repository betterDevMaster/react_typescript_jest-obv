import SetTicketRibbonButton from 'Dashboard/components/TicketRibbon/TicketRibbonConfig/SetTicketRibbonButton'
import EditModeOnly from 'Dashboard/edit/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import APN_RIBBON from './ribbon/APN.png'
import DIAMOND_RIBBON from './ribbon/DIAMOND.png'
import GOLD_RIBBON from './ribbon/GOLD.png'
import GUEST_RIBBON from './ribbon/GUEST.png'
import MASTERMIND_RIBBON from './ribbon/MASTERMIND.png'

export interface TicketRibbon {
  name: string
  image: string
}

export const TICKET_RIBBON_TYPE = 'Ticket Ribbon'

export const TICKET_RIBBON: Record<string, TicketRibbon> = {
  APN: {
    name: 'APN',
    image: APN_RIBBON,
  },
  DIAMOND: {
    name: 'Diamond',
    image: DIAMOND_RIBBON,
  },
  GOLD: {
    name: 'Gold',
    image: GOLD_RIBBON,
  },
  GUEST: {
    name: 'Guest',
    image: GUEST_RIBBON,
  },
  MASTERMIND: {
    name: 'Mastermind',
    image: MASTERMIND_RIBBON,
  },
}

export const ALL_TICKET_RIBBONS = Object.values(TICKET_RIBBON)

export default function TicketRibbon(props: {ribbon: TicketRibbon | null}) {
  if (!props.ribbon) {
    return (
      <EditModeOnly>
        <StyledSetTicketRibbonButton />
      </EditModeOnly>
    )
  }

  const label = `${props.ribbon.name} ticket`
  return (
    <Box aria-label={label}>
      <Ribbon src={props.ribbon.image} alt={label} />
    </Box>
  )
}

const Box = styled.div`
  margin: ${(props) =>
    `-${props.theme.spacing[6]} 0 ${props.theme.spacing[8]}`};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    margin: ${(props) =>
      `-${props.theme.spacing[6]} -${props.theme.spacing[13]} ${props.theme.spacing[8]}`};
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    margin: ${(props) =>
      `-${props.theme.spacing[6]} -${props.theme.spacing[16]} ${props.theme.spacing[8]}`};
  }
`

const Ribbon = styled.img`
  width: 100%;
  height: 100%;
`
const StyledSetTicketRibbonButton = styled(SetTicketRibbonButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
