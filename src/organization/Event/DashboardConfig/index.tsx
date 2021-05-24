import {useOrganizationAuth} from 'organization/auth'
import styled from 'styled-components'
import Dashboard from 'Event/Dashboard'
import React from 'react'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {OrganizationActionsProvider} from 'Event/ActionsProvider'

export default function DashboardConfig() {
  const {user} = useOrganizationAuth()

  if (!user) {
    throw new Error('Missing user')
  }

  return (
    <Layout>
      <Page disablePadding>
        <OrganizationActionsProvider
          loader={<LoadingText>loading...</LoadingText>}
        >
          <Dashboard user={user} isEditMode={true} />
        </OrganizationActionsProvider>
      </Page>
    </Layout>
  )
}

const LoadingText = styled.div`
  padding: ${(props) => props.theme.spacing[6]};
`
