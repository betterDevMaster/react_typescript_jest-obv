import React, {useState} from 'react'
import styled from 'styled-components'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import Box from '@material-ui/core/Box'
import AudienceSelect from 'organization/Event/Services/Apps/Mailchimp/Config/AudienceSelect'
import {useMailchimp} from 'organization/Event/Services/Apps/Mailchimp'
import LoginUrlFieldSelect from 'organization/Event/Services/Apps/Mailchimp/Config/LoginUrlFieldSelect/LoginUrlFieldSelect'
import EnableAutoSyncSwitch from 'organization/Event/Services/Apps/Mailchimp/Config/EnableAutoSyncSwitch'
import TagsConfig from 'organization/Event/Services/Apps/Mailchimp/Config/TagsConfig'
import AccessTokenSelect from 'organization/Event/Services/Apps/Mailchimp/Config/AccessTokenSelect'
import Typography from '@material-ui/core/Typography'
import AccessTokenAutoSelect from 'organization/Event/Services/Apps/Mailchimp/Config/AccessTokenAutoSelect'
import ImportAudienceButton from 'organization/Event/Services/Apps/Mailchimp/Config/ImportAudienceButton'
import InfoAlert from 'lib/ui/alerts/InfoAlert'

export default function Config() {
  return (
    <Layout>
      <Page>
        <Box mb={3}>
          <Typography variant="h4">Mailchimp</Typography>
        </Box>
        <Box mb={2}>
          <Content />
        </Box>
      </Page>
    </Layout>
  )
}

/**
 * Config should 'guide' user through each step required to
 * complete config. On completion it should show all the
 * individual options.
 *
 * @returns
 */
function Content() {
  const [successMessage, setSuccessMessage] = useState<null | string>(null)
  const mailchimp = useMailchimp()

  const clearSuccessMessage = () => setSuccessMessage(null)

  if (!mailchimp.audience_id) {
    return <AudienceSelect />
  }

  if (!mailchimp.access_token_id) {
    return <AccessTokenAutoSelect />
  }

  if (!mailchimp.login_url_field_id) {
    return <LoginUrlFieldSelect />
  }

  return (
    <>
      <StyledSuccessAlert onClose={clearSuccessMessage}>
        {successMessage}
      </StyledSuccessAlert>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <EnableAutoSyncSwitch />
      </Box>
      <AudienceSelect />
      <Box mb={4}>
        <ImportAudienceButton onSuccess={setSuccessMessage} />
      </Box>
      <AccessTokenSelect />
      <LoginUrlFieldSelect />
      <TagsConfig />
    </>
  )
}

const StyledSuccessAlert = styled(InfoAlert)`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`
