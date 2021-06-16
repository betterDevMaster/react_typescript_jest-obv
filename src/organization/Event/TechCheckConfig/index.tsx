import React from 'react'
import Layout from 'organization/user/Layout'
import {ObvioEvent} from 'Event'
import Page from 'organization/Event/Page'
import SimpleBlogConfig from 'Event/template/SimpleBlog/Step3/TechCheckConfig'
import PanelsConfig from 'Event/template/Panels/Step3/TechCheckConfig'
import {OrganizationActionsProvider} from 'Event/ActionsProvider'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'

export interface TechCheckData {
  body: string
  start: string
  is_enabled: boolean
  template: ObvioEvent['template']
}

export default function TechCheckConfig() {
  return (
    <Layout>
      <Page>
        <OrganizationActionsProvider loader={<div>loading...</div>}>
          <TemplateTechCheckConfig />
        </OrganizationActionsProvider>
      </Page>
    </Layout>
  )
}

function TemplateTechCheckConfig() {
  const template = useTemplate()

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogConfig />
    case PANELS:
      return <PanelsConfig />
    default:
      throw new Error('Missing tech check config for template')
  }
}
