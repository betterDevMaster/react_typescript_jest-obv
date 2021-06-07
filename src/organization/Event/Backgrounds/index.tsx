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

export function HasBackgroundConfig(props: {children: React.ReactElement}) {
  /**
   * Can't use useTemplate() because at this point the event might not
   * have selected one yet.
   */
  const {
    event: {template},
  } = useEvent()

  if (!template) {
    return null
  }

  if (template.disableBackgroundConfig) {
    return null
  }

  return props.children
}
