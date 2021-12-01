import React from 'react'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import LoginFieldIdInput from 'organization/Event/Services/Apps/Infusionsoft/Config/LoginFieldInput'

export default function Step1() {
  return (
    <Layout>
      <Page>
        <Box mb={3}>
          <Typography variant="h4">Infusionsoft</Typography>
        </Box>
        <Box mb={2}>
          <Typography>
            We'll generate a login token for each attendee, and save the token
            to an Infusionsoft custom field. Create a custom field to store the
            token, and enter its ID below.
          </Typography>
        </Box>
        <LoginFieldIdInput />
      </Page>
    </Layout>
  )
}
