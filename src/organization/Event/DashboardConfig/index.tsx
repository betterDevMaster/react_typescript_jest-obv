import {useOrganizationAuth} from 'organization/auth'
import Dashboard from 'Event/Dashboard'
import {useEvent} from 'Event/EventProvider'
import React from 'react'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import CreateTemplateForm from 'organization/Event/DashboardConfig/CreateDashboardForm'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'

export default function DashboardConfig() {
  const {event} = useEvent()
  const {user} = useOrganizationAuth()

  if (!user) {
    throw new Error('Missing user')
  }

  if (!event.template) {
    return <CreateTemplateForm />
  }

  return (
    <Layout>
      <Page disablePadding>
        <AttendeeProfileProvider groups={{}} tags={[]}>
          <Dashboard user={user} isEditMode={true} />
        </AttendeeProfileProvider>
      </Page>
    </Layout>
  )
}
