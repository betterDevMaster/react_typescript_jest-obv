import React from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

// Payload shared by all requests
const commonJson = {
  uniqid: '61f31b0c762153.63423619',
  ts: 1643322124,
  datetime: '2022-01-27 22:22:04',
  as_test: true,
  webhook_event: 'attendee.checked_in',
  event: {
    end: '2022-01-31T21:48:07.000000Z',
    name: 'Virtual Live Events',
    slug: 'vle-2022',
    start: '2022-01-28T21:48:07.000000Z',
  },
  organization: {id: 1, name: 'ACME Event Management'},
}

// Payload including attendee info
const attendeeJson = Object.assign({}, commonJson, {
  attendee: {
    first_name: 'Verla',
    last_name: 'Quitzon',
    email: 'glegros@example.net',
    event_id: 1,
    waiver: 'http://kemmer.com/',
    tech_check_completed_at: '2022-01-27T22:22:04.000000Z',
    has_password: true,
    groups: [],
    tags: [],
    has_completed_tech_check: true,
    has_checked_in: false,
  },
})

export default function Information() {
  const routes = useEventRoutes()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TOC>
          <h5>On This Page</h5>
          <TOCLink target="#what_is_a_webhook">What is a webhook</TOCLink>
          <TOCLink target="#steps_to_receive_webhooks">
            Steps to receive webhooks
          </TOCLink>
          <TOCLink target="#what_is_a_webhook_endpoint">
            What is a webhook endpoint
          </TOCLink>
          <TOCLink target="#handling_webhook_requests">
            Handling webhook requests
          </TOCLink>
          <TOCLink target="#getting_set_up">Getting set up</TOCLink>
          <TOCLink target="#add_a_new_webhook_listener">
            Add a new webhook listenner
          </TOCLink>
          <TOCLink target="#testing">Testing</TOCLink>
        </TOC>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Title id="what_is_a_webhook">What is a webhook</Title>
        <p>
          A webhook enables Obvio to push real-time notifications to your
          application. Obvio uses HTTPS to send these notifications to your
          application as a{' '}
          <PageLink
            href="https://jsonapi.org/"
            target="_blank"
            rel="noreferrer"
          >
            JSON payload
          </PageLink>
          . You can then use these notifications to execute actions in your
          backend systems.
        </p>

        <Title id="steps_to_receive_webhooks">Steps to receive webhooks</Title>
        <p>
          You can start receiving event notifications in your app using the
          steps in this section:
        </p>

        <ol>
          <li>
            Identify the events you want to monitor and the event payloads to
            parse.
            <Note>
              Note: At the present moment, there is only one event in the Obvio
              platform that triggers a webhook:{' '}
              <CodeInline>attendee.checked_in</CodeInline>. In the near future,
              this list will be expanded to cover more events.
            </Note>
          </li>
          <li>
            Create a webhook endpoint as an HTTP endpoint (URL) on your local
            server that listens to HTTP POST requests.
          </li>
          <li>
            Handle requests from Obvio by parsing each event object and
            returning 2xx response status codes.
          </li>
          <li>
            Test that your webhook endpoint is working properly using the test
            utility from the Webhook listing.
          </li>
          <li>
            Deploy your webhook endpoint so it's a publicly accessible HTTPS
            URL.
          </li>
        </ol>

        <Title id="what_is_a_webhook_endpoint">
          What is a webhook endpoint
        </Title>
        <p>
          Creating a webhook endpoint is no different from creating any other
          page on your website. It's an HTTPS endpoint on your server with a
          URL. If you're still developing your endpoint on your local machine,
          it can be HTTP. After it's publicly accessible and Obvio is attempting
          to send requests, it must be HTTPS. You can use one endpoint to handle
          several different event types at once, or set up individual endpoints
          for specific events.
        </p>

        <Title id="handling_webhook_requests">Handling webhook requests</Title>
        <p>
          Your endpoint must be configured to read event objects for the type of
          event notifications you want to receive. Obvio sends events to your
          webhook endpoint as part of a POST request with a JSON payload.
        </p>

        <h4>Authenticating</h4>
        <p>
          Before you can configure any webhook endpoints, you must select an
          access token to be used for authentication on your endpoint. If you do
          not have any access tokens configured, you can create a new one in the{' '}
          <RelativeLink to={`${routes.services.root}?activeTab=accessTokens`}>
            Serivces - Access Tokens
          </RelativeLink>{' '}
          area.
        </p>

        <p>
          The access token selected will be passed in the{' '}
          <CodeInline>Authorization: Bearer [access token]</CodeInline> header
          on all webhook requests to your endpoint. Validating this access token
          provides you a reasonable level of credibility in regard to the
          originating server. Whether you choose to ensure the token matches is
          entirely up to you, but it's strongly encouraged.
        </p>

        <h4>Webhook payloads</h4>
        <p>
          All webhook events have a common JSON payload, with event-specific
          data merged in to provide context for the Obvio event taking place.
          The common JSON payload has the following shape:
        </p>

        <CodeBlock tight>{JSON.stringify(commonJson, null, 4)}</CodeBlock>

        <Note>
          Note: Whether testing a configured webhook, or processing the live
          webhook payload, the attributes found in the common JSON payload have
          not been "faked", these values are accurate with regard to your
          Organization and Event.
        </Note>

        <p>
          Along with the common JSON payload, there will be extra context
          included which will pertain to the event taking place and this data
          will vary from event to event. As an example, the{' '}
          <CodeInline>attendee.checked_in</CodeInline> event has the following
          JSON payload:
        </p>

        <CodeBlock tight>{JSON.stringify(attendeeJson, null, 4)}</CodeBlock>

        <Note>
          Note: When testing a configured webhook, the contextual data values
          (the <CodeInline>attendee</CodeInline> attribute in this case) will be
          "faked", as it doesn't represent an actual Obvio event taking place
          with real data. The shape of the payload is accurate, however the
          values should be considered placeholders.
        </Note>

        <Title id="getting_set_up">Getting set up</Title>
        <p>
          You must define an Event Webhook URL and select an Access Token. The
          Event Webhook URL is the destination that all webhooks are POSTed to
          and must be an https:// endpoint, for added security. Any webhooks you
          configure are on a per-Event basis, if you have multiple Events within
          your Organization, settings applied to one, will not apply to other
          Events.
        </p>

        <p>
          As mentioned before, you are required to choose an Access Token which
          will be used in an{' '}
          <CodeInline>Authorization: Bearer [access token]</CodeInline> header
          on all POST requests, and it is strongly encouraged to validate that
          token.
        </p>

        <h4>CRC salt</h4>
        <p>
          If you choose to enable a CRC checksum on the individual webhook
          endpoints, you will need to generate a salt to be used in the checksum
          calculation. When you generate a CRC salt, you will have an
          opportunity to copy the salt value to be used in your system to
          calculate the checksum when you receive a webhook from Obvio. If you
          lose this salt value, you will need to generate a new one. You can
          generate a new salt whenever you choose. Keep this value secret, as
          this is your key to being able to validate the payload you are
          receiving has not been forged by any third party attempting to pose as
          Obvio's webhook system.
        </p>

        <p>The checksum is calculated on Obvio's end using PHP:</p>
        <CodeBlock>crc32(json_encode($payload).$crcSalt)</CodeBlock>

        <p>
          The value for <CodeInline>$payload</CodeInline> is the entire JSON
          payload that you would receive from the webhook, rendered as a JSON
          string. It should be noted that the JSON string should not be "pretty
          printed". For example:
        </p>

        <CodeBlock>{JSON.stringify(attendeeJson)}</CodeBlock>

        <p>
          The salt value that is being used is simply concatenated to the end of
          the JSON payload before it is run through the{' '}
          <CodeInline>crc32</CodeInline> calculation. Using{' '}
          <CodeInline>w5eBoEUWe2</CodeInline> as an example CRC salt:
        </p>

        <CodeBlock>{`${JSON.stringify(attendeeJson)}w5eBoEUWe2`}</CodeBlock>

        <p>
          Once the checksum has been calculated, it will be present in the{' '}
          <CodeInline>X-Crc: [checksum]</CodeInline> header on the request. This
          header will only be present if CRC has been enabled for the webhook.
          Use this header's value to compare the calculated checksum in your
          endpoint's processing. When they match,{' '}
        </p>

        <Title id="add_a_new_webhook_listener">
          Add a new webhook listener
        </Title>
        <p>
          A webhook listener waits for the configured Webhook Action to be
          triggered in the Obvio platform and dispatches an HTTP POST to your
          configured endpoint.
        </p>

        <h4>Webhook Action</h4>
        <p>
          Select a Webhook Action to listen for in the Obvio platform. Whenever
          this action takes place, your webhook will be dispatched and you will
          receive the resulting POST to your specified endpoint.
        </p>

        <p>
          You have the ability to create multiple listeners for the same Webhook
          Action. A potential use case could be that you have many disconnected
          systems which need to do separate work for the same Obvio action,
          perhaps your own CMS and an external tracking API.
        </p>

        <h4>Webhook URL</h4>
        <p>
          The per-webhook URL is an optional field, if one is supplied for a
          specific webhook listener, that endpoint will receive the HTTP POST.
          If one is not supplied, the Event Webhook URL defined for the Event is
          used.
        </p>

        <h4>CRC</h4>
        <p>
          As previously mentioned, CRC checksum calculation is enabled on a
          per-webhook basis. If sending an HTTP POST to a system that you do not
          control, there may not be the ability to calculate the checksum on the
          receiving end.
        </p>

        <Title id="testing">Testing</Title>
        <p>
          Once a webhook listener has been configured, you have the ability to
          test the HTTP POST. The configured action will be triggered and your
          endpoint will receive an HTTP POST with the payload it will receive in
          a live situation, with the only differences being:
        </p>

        <ol>
          <li>
            The <CodeInline>asTest</CodeInline> attribute of the payload will
            have a value of <CodeInline>true</CodeInline>
          </li>
          <li>
            The contextual data included in the payload will be "faked", as
            there isn't a live action taking place to populate with data
            accordingly
          </li>
        </ol>

        <p>
          When the request has completed, you will be presented with the output
          of the request to validate the attempt. Included in the output are the
          headers that were calculated, the payload that was built and the
          response received by Obvio's request.
        </p>
      </Grid>
    </Grid>
  )
}

const TOC = styled.div`
  position: sticky;
  top: 6rem;
  align-self: start;
`
const Title = styled.h2`
  margin-top: -80px;
  padding-top: 80px;
`
const TOCLink = styled((props) => {
  const {children, target, ...otherProps} = props

  return (
    <a href={target} {...otherProps}>
      {children}
    </a>
  )
})`
  color: ${(props) => props.theme.colors.primary};
  display: block;

  &:hover {
    color: ${(props) => props.theme.colors.gray400};
  }
`
const PageLink = styled.a`
  color: ${(props) => props.theme.colors.primary};
`
const CodeBlock = styled((props) => {
  const {tight: _, ...otherProps} = props

  return <pre {...otherProps} />
})<{
  tight: boolean
}>`
  background-color: #ededed;
  border-radius: 4px;
  margin: 0 0 ${(props) => (props.tight ? '0' : props.theme.spacing[6])};
  padding: ${(props) => props.theme.spacing[2]};
  white-space: pre-wrap;
  word-wrap: break-word;
`
const CodeInline = styled.code`
  background-color: #ededed;
  border-radius: 4px;
  font-size: 0.95em;
  margin: 0 0 ${(props) => props.theme.spacing[6]};
  padding: ${(props) => props.theme.spacing[1]}
    ${(props) => props.theme.spacing[2]};
  white-space: pre-wrap;
`
const Note = styled.p`
  font-size: 0.8em;
  margin-top: ${(props) => props.theme.spacing[2]};
`
