import React from 'react'
import styled from 'styled-components'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogLoginConfig from 'Event/template/SimpleBlog/Login/LoginConfig'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import Grid from '@material-ui/core/Grid'
import Login from 'Event/auth/Login'

export default function LoginConfig() {
  const {event} = useEvent()
  return (
    <>
      <Heading variant="h6">Login</Heading>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <EventImageUpload
            label="Background"
            property="login_background"
            current={event.login_background?.url}
          />
          <EventImageUpload
            label="Logo"
            property="login_logo"
            current={event.login_logo?.url}
          />
          <TemplateLoginConfig />
        </Grid>
        <Grid item xs={12} md={6}>
          <PreviewContainer>
            <Login isPreview />
          </PreviewContainer>
        </Grid>
      </Grid>
    </>
  )
}

function TemplateLoginConfig() {
  const template = useTemplate()

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogLoginConfig />
    default:
      throw new Error(`Missing login config for template: ${template.name}`)
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
