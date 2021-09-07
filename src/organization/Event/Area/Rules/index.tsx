import {useEvent} from 'Event/EventProvider'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useAreaRoutes} from 'organization/Event/Area/AreaRoutes'
import SaveButton from 'organization/Event/Area/Rules/SaveButton'
import {useRules} from 'organization/Event/Area/Rules/RulesProvider'
import RulesTable from 'organization/Event/Area/Rules/RulesTable'
import AddRuleButton from 'organization/Event/Area/Rules/RulesTable/AddRuleButton'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React from 'react'
import styled from 'styled-components'

export default function Rules() {
  const {routes: orgRoutes} = useOrganization()
  const {event} = useEvent()
  const eventRoutes = useEventRoutes()
  const areaRoutes = useAreaRoutes()
  const {area} = useArea()
  const {error, clearError} = useRules()

  useBreadcrumbs([
    {
      title: 'Events',
      url: orgRoutes.events.root,
    },
    {
      title: event.name,
      url: eventRoutes.root,
    },
    {title: area.name, url: areaRoutes.root},
    {
      title: 'Rules',
      url: areaRoutes.rules,
    },
  ])

  return (
    <Layout>
      <Page>
        <Actions>
          <AddRuleButton />
          <SaveButton />
        </Actions>
        <StyledErrorAlert onClose={clearError}>{error}</StyledErrorAlert>
        <RulesTable />
      </Page>
    </Layout>
  )
}

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledErrorAlert = styled(ErrorAlert)`
  width: 100%;
  margin-top: ${(props) => props.theme.spacing[4]};
`
