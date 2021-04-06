import React from 'react'
import Layout from 'organization/user/Layout'
import {useEvent} from 'Event/EventProvider'
import {ObvioEvent} from 'Event'
import Page from 'organization/Event/Page'
import TemplateProvider from 'Event/TemplateProvider'
import SelectTemplateForm from 'organization/Event/DashboardConfig/SelectTemplateForm'
import Form from 'organization/Event/TechCheckConfig/Form'

export interface TechCheckData {
  body: string
  start: string
  is_enabled: boolean
  template: ObvioEvent['template']
}

export default function TechCheckConfig() {
  const {event} = useEvent()
  if (!event.template) {
    return <SelectTemplateForm />
  }

  return (
    <Layout>
      <Page>
        <TemplateProvider template={event.template}>
          <Form />
        </TemplateProvider>
      </Page>
    </Layout>
  )
}
