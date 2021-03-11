import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'

export interface AccessToken {
  id: number
  value: string
}

export default function AccessTokens() {
  const [tokens, setTokens] = useState<AccessToken[]>([])
  const [processing, setProcessing] = useState(false)

  const {data: fetched} = useAccessTokens()
  const create = useCreateToken()

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

  return (
    <Box>
      <Typography variant="h6">Access Tokens</Typography>
      <CreateButton
        onClick={newToken}
        aria-label="create access token"
        color="primary"
        variant="outlined"
        disabled={processing}
      >
        Create
      </CreateButton>
      {tokens.map(({value}) => (
        <Token key={value}>{value}</Token>
      ))}
    </Box>
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

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]};
`

const Token = styled.div`
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[5]}`};
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const CreateButton = withStyles({
  root: {
    marginTop: spacing[2],
    marginBottom: spacing[5],
  },
})(Button)
