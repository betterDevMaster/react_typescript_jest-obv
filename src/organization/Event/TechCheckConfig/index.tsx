import React from 'react'
import Layout from 'organization/user/Layout'
import {ObvioEvent} from 'Event'
import Page from 'organization/Event/Page'
import Form from 'organization/Event/TechCheckConfig/Form'

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
        <Form />
      </Page>
    </Layout>
  )
}
