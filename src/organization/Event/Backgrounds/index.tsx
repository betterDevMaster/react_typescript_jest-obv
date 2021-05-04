import React from 'react'
import Form from 'organization/Event/Backgrounds/Form'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import SelectTemplateForm from 'organization/Event/SelectTemplateForm'
import TemplateProvider from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'

export default function BackgroundsConfig() {
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
