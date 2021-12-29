import React from 'react'

import {Box} from '@material-ui/core'

import ProgressBarConfig from './ProgressBarConfig'

import {SectionTitle} from 'organization/Event/Page'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'

export type Step = 1 | 2 | 3

export default function CheckInConfig() {
  return (
    <Layout>
      <Page>
        <Box mb={2}>
          <SectionTitle>Check In</SectionTitle>
        </Box>
        <Box mb={2}>
          <ProgressBarConfig />
        </Box>
      </Page>
    </Layout>
  )
}
