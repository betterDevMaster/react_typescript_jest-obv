import React from 'react'
import styled from 'styled-components'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {useEvent} from 'Event/EventProvider'
import {
  useWebhooks,
  WebhookTestResponseData,
} from 'organization/Event/WebhooksProvider'

export default function WebhookTestOverlay(props: {
  onClick: () => void
  open: boolean
}) {
  const {open} = props
  const {event} = useEvent()
  const {testRequest, testResponse} = useWebhooks()

  const webhookUrl =
    testResponse?.destination?.url || testRequest?.url || event.webhook_url
  const requiresCrcLabel = testRequest?.requires_crc ? 'Yes' : 'No'

  return (
    <Dialog open={open} maxWidth={'md'}>
      <DialogContent>
        <Title>Webhook Test: {testRequest?.webhook_event}</Title>

        <FullGrid container spacing={2}>
          <FullGrid item>
            <Label>URL</Label>
            <Description>
              <code>{webhookUrl}</code>
            </Description>
          </FullGrid>
          <Grid item xs={3}>
            <Label>Requires CRC</Label>
            <Description>
              <code>{requiresCrcLabel}</code>
            </Description>
          </Grid>
        </FullGrid>

        <Content response={testResponse} />

        <Actions>
          <Button variant="contained" color="primary" onClick={props.onClick}>
            OK
          </Button>
        </Actions>
      </DialogContent>
    </Dialog>
  )
}

function Content(props: {response?: WebhookTestResponseData}) {
  if (props.response) {
    return <Output response={props.response} />
  }

  return <Dispatching />
}

function Output(props: {response: WebhookTestResponseData}) {
  const {
    response: {headers, payload, response},
  } = props

  const formatted = (data: string[] | string) => JSON.stringify(data, null, 2)

  return (
    <>
      <Label>Headers</Label>
      <CodeBlock>{formatted(headers)}</CodeBlock>

      <Label>Payload</Label>
      <CodeBlock>{formatted(payload)}</CodeBlock>

      <Label>Response</Label>
      <CodeBlock>{formatted(response)}</CodeBlock>
    </>
  )
}

function Dispatching() {
  return <Description>Dispatching... Please Wait</Description>
}

const Title = styled.h1`
  margin: 0 0 ${(props) => props.theme.spacing[6]};
  text-align: center;
`
const Actions = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]};
  text-align: center;
`
const Label = styled.div`
  font-weight: bold;
`
const Description = styled.p`
  margin: 0 0 ${(props) => props.theme.spacing[5]};
`
const CodeBlock = styled.pre`
  background-color: #ededed;
  border-radius: 4px;
  margin: 0 0 ${(props) => props.theme.spacing[6]};
  padding: ${(props) => props.theme.spacing[2]};
  white-space: pre-wrap;
`
const FullGrid = styled(Grid)`
  flex-grow: 1;
`
