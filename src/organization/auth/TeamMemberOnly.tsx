import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CustomButton from 'lib/ui/Button/CustomButton'
import {colors} from 'lib/ui/theme'
import {useObvioAuth} from 'obvio/auth'
import Page from 'organization/auth/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'

export default function TeamMemberOnly() {
  const {organization} = useOrganization()
  const {logout} = useObvioAuth()

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
        <CustomButton
          variant="text"
          onClick={logout}
          textColor={colors.secondary}
        >
          here
        </CustomButton>{' '}
        to logout, and try again.
      </Typography>
    </Page>
  )
}
