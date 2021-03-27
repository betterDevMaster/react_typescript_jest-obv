import Button from '@material-ui/core/Button'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import Divider from '@material-ui/core/Divider'
import Tooltip from '@material-ui/core/Tooltip'

export interface AccessToken {
  id: number
  value: string
}

export const ACCESS_TOKENS = 'Access Tokens'

export default function AccessTokens() {
  const [tokens, setTokens] = useState<AccessToken[]>([])
  const [processing, setProcessing] = useState(false)
  const [copiedToken, setCopiedToken] = useState('')

  const {data: fetched, loading} = useAccessTokens()
  const create = useCreateToken()
  const deleteSelectedToken = useDeleteToken()
  useEffect(() => {
    if (!fetched) {
      return
    }

    setTokens(fetched)
  }, [fetched])

  const addToken = (target: AccessToken) => {
    setTokens((tokens) => [...tokens, target])
  }

  const newToken = () => {
    if (processing) {
      return
    }
    setProcessing(true)

    create()
      .then(addToken)
      .finally(() => {
        setProcessing(false)
      })
  }

  const copyCodeToClipboard = (acessToken: string) => {
    navigator.clipboard.writeText(acessToken).then(() => {
      setCopiedToken(acessToken)
    })
  }

  const deleteToken = (token: AccessToken) => {
    if (processing) {
      return
    }
    setProcessing(true)
    deleteSelectedToken(token)
      .then(() => {
        const index = tokens.indexOf(token, 0)
        tokens.splice(index, 1)
        setTokens((tokens) => tokens)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={newToken}
              aria-label="create access token"
              color="primary"
              variant="outlined"
              disabled={processing}
            >
              Create
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <List>
            <Divider />
            {tokens.map((token) => (
              <div key={token.value} aria-label="access-token-list-item">
                <ListItem selected={token.value === copiedToken}>
                  <ListItemText
                    primary={token.value}
                    disableTypography={true}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip
                      title={token.value === copiedToken ? 'Copied' : 'Copy'}
                    >
                      <IconButton
                        edge="end"
                        aria-label="copy"
                        onClick={() => copyCodeToClipboard(token.value)}
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          deleteToken(token)
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider key={token.value} />
              </div>
            ))}
          </List>
        </Grid>
      </Grid>
    </>
  )
}

function useAccessTokens() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/access_tokens`)
  const request = useCallback(() => client.get<AccessToken[]>(url), [
    client,
    url,
  ])

  return useAsync(request)
}

function useCreateToken() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/access_tokens`)

  return () => client.post<AccessToken>(url)
}

function useDeleteToken() {
  const {event} = useEvent()
  const {client} = useOrganization()
  return (token: AccessToken) => {
    const url = api(`/events/${event.slug}/access_tokens/${token.id}`)
    return client.delete<AccessToken>(url)
  }
}
