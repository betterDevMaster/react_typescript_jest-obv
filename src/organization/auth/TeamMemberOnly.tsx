import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from 'lib/ui/Button'
import {colors} from 'lib/ui/theme'
import {useOrganizationAuth} from 'organization/auth'
import Page from 'organization/auth/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'

export default function TeamMemberOnly() {
  const {organization} = useOrganization()
  const {logout} = useOrganizationAuth()

  return (
    <Page>
      <Box mb={2}>
        <Typography variant="h4" align="center">
          {organization.name}
        </Typography>
        <Typography variant="h5" align="center">
          Team Members Only
        </Typography>
      </Box>
      <Typography align="center">
        Please ask to be invited to the organization, or if you think you're
        seeing this page by mistake, click{' '}
        <Button variant="text" onClick={logout} textColor={colors.secondary}>
          here
        </Button>{' '}
        to logout, and try again.
      </Typography>
    </Page>
  )
}
