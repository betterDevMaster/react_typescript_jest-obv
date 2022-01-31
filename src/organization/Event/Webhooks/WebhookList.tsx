import React, {useState} from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DeleteIcon from '@material-ui/icons/Delete'
import {useEvent} from 'Event/EventProvider'
import {useWebhooks} from 'organization/Event/WebhooksProvider'
import WebhookTestOverlay from 'organization/Event/Webhooks/WebhookTestOverlay'

export default function EventWebhookForm() {
  const [overlayOpen, setOverlayOpen] = useState<boolean>(false)
  const {removeWebhook, submitting, testWebhook, webhooks} = useWebhooks()
  const {event} = useEvent()

  return (
    <>
      <WebhookTestOverlay
        onClick={() => setOverlayOpen(false)}
        open={overlayOpen}
      />

      <TableBox>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={200}>Webhook Action</TableCell>
              <TableCell>URL</TableCell>
              <TableCell width={130} align="center">
                Requires CRC
              </TableCell>
              <TableCell width={60}>{/* Test Button Cell */}</TableCell>
              <TableCell width={30}>{/* Delete Cell */}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {webhooks.map((webhook) => {
              // If a specific URL was not set at the individual webhook, we fallback
              // to the default event webhook url.
              const webhookUrl = webhook.url || event.webhook_url

              return (
                <TableRow
                  aria-label={`webhook list row ${webhook.id}`}
                  key={webhook.id}
                >
                  <TableCell
                    aria-label={`webhook ${webhook.id} event`}
                    component="td"
                    scope="row"
                  >
                    {webhook.webhook_event}
                  </TableCell>
                  <TableCell
                    aria-label={`webhook ${webhook.id} url`}
                    component="td"
                    scope="row"
                  >
                    {webhookUrl}
                  </TableCell>
                  <TableCell align="center" component="td" scope="row">
                    <Checkbox
                      checked={webhook.requires_crc || false}
                      disabled
                      inputProps={{
                        'aria-label': `webhook ${webhook.id} requires_crc`,
                      }}
                    />
                  </TableCell>
                  <TableCell component="td" scope="row">
                    <TinyButton
                      aria-label={`webhook ${webhook.id} test`}
                      color="primary"
                      onClick={() => {
                        setOverlayOpen(true)
                        testWebhook(webhook)
                      }}
                      size="small"
                      variant="outlined"
                    >
                      Test
                    </TinyButton>
                  </TableCell>
                  <TableCell component="td" scope="row">
                    <IconButton
                      aria-label={`webhook ${webhook.id} remove`}
                      onClick={() => removeWebhook(webhook.id)}
                      disabled={submitting}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableBox>
    </>
  )
}

const TableBox = styled.div`
  overflow: auto;
`
const TinyButton = styled(Button)`
  font-size: 0.65rem;
  padding: 2px 6px;
`
