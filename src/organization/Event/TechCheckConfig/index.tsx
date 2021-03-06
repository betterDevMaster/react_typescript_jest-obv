import React from 'react'

import {ObvioEvent} from 'Event'
import {OrganizationActionsProvider} from 'Event/ActionsProvider'
import {useTemplate} from 'Event/TemplateProvider'

import SimpleBlogConfig from 'Event/template/SimpleBlog/Step3/TechCheckConfig'
import PanelsConfig from 'Event/template/Panels/Step3/TechCheckConfig'
import CardsConfig from 'Event/template/Cards/Step3/TechCheckConfig'
import NiftyFiftyConfig from 'Event/template/NiftyFifty/Step3/TechCheckConfig'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'

import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'

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
    case CARDS:
      return <CardsConfig />
    case NIFTY_FIFTY:
      return <NiftyFiftyConfig />
    default:
      throw new Error('Missing tech check config for template')
  }
}
