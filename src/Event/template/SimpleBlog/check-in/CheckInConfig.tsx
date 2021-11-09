import React from 'react'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {SectionTitle} from 'organization/Event/Page'
import ProgressBarConfig from '../ProgressBarConfig'

export default function CheckInConfig() {
  return (
    <Layout>
      <Page>
        <SectionTitle>Check In</SectionTitle>
        <ProgressBarConfig />
      </Page>
    </Layout>
  )
}
