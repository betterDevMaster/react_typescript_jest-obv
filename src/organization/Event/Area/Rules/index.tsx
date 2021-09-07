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
import Alert from '@material-ui/lab/Alert'
import Button from 'lib/ui/Button'
import {useClearRoomAssignments} from 'organization/Event/Area/ClearRoomAssignmentsButton'

export default function Rules() {
  const {routes: orgRoutes} = useOrganization()
  const {event} = useEvent()
  const eventRoutes = useEventRoutes()
  const areaRoutes = useAreaRoutes()
  const {area} = useArea()
  const {error, clearError, setError} = useRules()

  const {processing, clear} = useClearRoomAssignments(clearError, setError)

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
        <StyledAlert severity="info">
          Any rule changes will not affect previously assigned attendees. Click{' '}
          <StyledButton variant="text" onClick={clear} disabled={processing}>
            here
          </StyledButton>{' '}
          to clear all room assignments.
        </StyledAlert>
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

const StyledAlert = styled(Alert)`
  margin-top: ${(props) => props.theme.spacing[4]};
`

const StyledButton = styled(Button)`
  font-weight: bold;
`
