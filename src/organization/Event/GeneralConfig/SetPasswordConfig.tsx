import React from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography/'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSetPasswordFormConfig from 'Event/template/SimpleBlog/SetPasswordForm/SetPasswordFormConfig'
import Grid from '@material-ui/core/Grid'
import {TemplateSetPasswordForm} from 'Event/Step1/SetPasswordForm'
import {useTeamMember} from 'organization/auth'

export default function SetPasswordFormConfig() {
  const user = useTeamMember()

  return (
    <>
      <Heading variant="h6">Set Password Form</Heading>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TemplateSetPasswordFormConfig />
        </Grid>
        <Grid item xs={12} md={6}>
          <PreviewContainer>
            <TemplateSetPasswordForm
              submit={() => {}}
              submitting={false}
              responseError={null}
              progress={25}
              user={user}
            />
          </PreviewContainer>
        </Grid>
      </Grid>
    </>
  )
}

function TemplateSetPasswordFormConfig() {
  const template = useTemplate()

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSetPasswordFormConfig />
    default:
      throw new Error(
        `Missing set password form config for template: ${template.name}`,
      )
  }
}

const Heading = withStyles({
  root: {
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
})(Typography)

const PreviewContainer = styled.div`
  padding: ${(props) => props.theme.spacing[2]};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
`
