import React from 'react'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import {TechCheckProps} from 'Event/Step3/TechCheck'
import styled from 'styled-components'
import {Button} from '@material-ui/core'
import ProgressBar from 'lib/ui/ProgressBar'
import {useTemplate} from 'Event/TemplateProvider'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {useJoinUrl} from 'Event/EventProvider'

export default function TechCheck(props: {user: User} & TechCheckProps) {
  const {techCheck} = props
  const template = useTemplate()
  const joinUrl = useJoinUrl(techCheck.area.id)

  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="sm">
        <ProgressBar
          value={props.progress}
          barColor={template.progressBar.barColor}
          textColor={template.progressBar.textColor}
        />
        <Body
          dangerouslySetInnerHTML={{
            __html: techCheck.body,
          }}
        />
        <div>
          <StartButton url={joinUrl} />
        </div>
      </Container>
    </SimpleBlogPage>
  )
}

function StartButton(props: {url: string | null}) {
  const {url} = props

  const button = (
    <Button
      variant="contained"
      color="primary"
      aria-label="start tech check"
      fullWidth
      disabled={!url}
    >
      Start Tech Check
    </Button>
  )

  if (!url) {
    return button
  }

  return (
    <AbsoluteLink to={url} newTab disableStyles aria-label="join link">
      {button}
    </AbsoluteLink>
  )
}

const Body = styled.div`
  max-height: 240px;
  overflow-y: auto;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
