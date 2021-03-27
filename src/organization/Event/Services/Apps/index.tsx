import styled from 'styled-components'
import React from 'react'
import Card from 'organization/Event/Services/Apps/Card'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import zapierLogo from 'organization/Event/Services/Apps/logos/zapier.jpg'
import infusionsoftLogo from 'organization/Event/Services/Apps/logos/infusionsoft.jpg'
import {
  INFUSIONSOFT,
  ZAPIER,
} from 'organization/Event/Services/ServicesProvider'

export const APPS = 'Apps'

export default function Apps() {
  const routes = useEventRoutes()

  return (
    <Grid>
      <Card service={ZAPIER} link={routes.services.zapier} logo={zapierLogo} />
      <Card
        service={INFUSIONSOFT}
        link={routes.services.infusionsoft}
        logo={infusionsoftLogo}
      />
    </Grid>
  )
}

const column = `minmax(270px, auto)`

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-gap: ${(props) => props.theme.spacing[8]};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: ${column} ${column};
    grid-template-rows: auto auto;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: ${column} ${column} ${column};
    grid-template-rows: auto auto auto;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: ${column} ${column} ${column} ${column};
    grid-template-rows: auto auto auto auto;
  }
`
