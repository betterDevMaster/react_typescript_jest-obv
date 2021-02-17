import React, {useEffect, useState} from 'react'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import {TechCheckProps} from 'Event/Step3/TechCheck'
import styled from 'styled-components'
import {Button} from '@material-ui/core'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {ResponseError} from 'lib/api-client'
import ProgressBar from 'lib/ui/ProgressBar'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'

export default function TechCheck(props: {user: User} & TechCheckProps) {
  const [joinUrl, setJoinUrl] = useState<null | string>(null)
  const {event, client} = useEvent()
  const {techCheck} = props
  const [error, setError] = useState<ResponseError | null>(null)
  const template = useTemplate()

  useEffect(() => {
    const url = api(`/events/${event.slug}/areas/${techCheck.area.id}/join`)

    client
      .get<{url: string}>(url)
      .then(({url}) => setJoinUrl(url))
      .catch(setError)
  }, [client, event, techCheck])

  const launchMeeting = () => {
    if (!joinUrl) {
      return
    }

    // Got Join URL, open in new window
    window.open(joinUrl, '_blank')
  }

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
          <Button
            variant="contained"
            color="primary"
            aria-label="start tech check"
            fullWidth
            disabled={!joinUrl}
            onClick={launchMeeting}
          >
            Start Tech Check
          </Button>
          <Error>{error}</Error>
        </div>
      </Container>
    </SimpleBlogPage>
  )
}

function Error(props: {children: ResponseError | null}) {
  if (!props.children) {
    return null
  }

  return (
    <ErrorText>
      Tech Check seems to be offline at the moment. Refresh your page to try
      again, or contact us for some help.
      <br />
      <ErrorReason>Reason: {props.children.message}</ErrorReason>
    </ErrorText>
  )
}

const Body = styled.div`
  max-height: 240px;
  overflow-y: auto;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

const ErrorText = styled.p`
  margin-top: ${(props) => props.theme.spacing[4]};
  text-align: center;
  color: ${(props) => props.theme.colors.error};
`

const ErrorReason = styled.span`
  font-size: 12px;
  text-decoration: underline;
`
