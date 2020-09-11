import React from 'react'
import styled from 'styled-components'

export interface TicketRibbon {
  name: string
  image: string
}

export default function TicketRibbon(props: {ribbon: TicketRibbon | null}) {
  if (!props.ribbon) {
    return null
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
