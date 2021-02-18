import styled from 'styled-components'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React from 'react'
import Card from 'organization/Event/Services/Card'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import zapierLogo from 'organization/Event/Services/logos/zapier.jpg'
import {useServices, ZAPIER} from 'organization/Event/Services/ServicesProvider'
import AccessTokens from 'organization/Event/Services/AccessTokens'

export default function Services() {
  const routes = useEventRoutes()
  const {isConnected} = useServices()

  return (
    <Layout>
      <Page>
        <AccessTokens />
        <Grid>
          <Card
            service={ZAPIER}
            link={routes.services.zapier}
            logo={zapierLogo}
            isConnected={isConnected(ZAPIER)}
          />
        </Grid>
      </Page>
    </Layout>
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
