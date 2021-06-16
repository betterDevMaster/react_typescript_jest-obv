import React from 'react'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import SelectTemplateForm from 'organization/Event/SelectTemplateForm'
import TemplateProvider, {useTemplate} from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import SimpleBlogBackgroundsConfig from 'Event/template/SimpleBlog/Backgrounds/BackgroundsConfig'
import PanelsBackgroundsConfig from 'Event/template/Panels/Dashboard/Resources/Backgrounds/BackgroundsConfig'

export default function Backgrounds() {
  const {event} = useEvent()

  if (!event.template) {
    return <SelectTemplateForm />
  }

  return (
    <Layout>
      <Page>
        <TemplateProvider template={event.template}>
          <TemplateConfig />
        </TemplateProvider>
      </Page>
    </Layout>
  )
}

function TemplateConfig() {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogBackgroundsConfig />
    case PANELS:
      return <PanelsBackgroundsConfig />
    default:
      throw new Error(`Missing backgrounds config for template: ${name}`)
  }
}
