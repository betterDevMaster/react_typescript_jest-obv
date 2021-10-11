import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useCallback, useEffect, useState} from 'react'

export interface AccessToken {
  id: number
  value: string
}

interface AccessTokensContextProps {
  addToken: () => void
  tokens: AccessToken[]
  deleteToken: (token: AccessToken) => void
  processing: boolean
}

const AccessTokensContext = React.createContext<
  AccessTokensContextProps | undefined
>(undefined)

export default function AccessTokensProvider(props: {
  children: React.ReactElement
}) {
  const [tokens, setTokens] = useState<AccessToken[]>([])
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const {data: fetched, loading} = useListTokens()
  const requestDelete = useDeleteToken()

  useEffect(() => {
    if (!fetched) {
      return
    }
    setTokens(fetched)
  }, [fetched])

  const create = useCreateToken()

  const insert = useCallback((target: AccessToken) => {
    setTokens((tokens) => [...tokens, target])
  }, [])

  const addToken = useCallback(() => {
    if (processing) {
      return
    }
    toggleProcessing()

    create().then(insert).finally(toggleProcessing)
  }, [processing, toggleProcessing, create, insert])

  const removeToken = (token: AccessToken) => {
    setTokens((tokens) => tokens.filter((t) => t.id !== token.id))
  }

  const deleteToken = (token: AccessToken) => {
    if (processing) {
      return
    }
    toggleProcessing()

    requestDelete(token)
      .then(() => removeToken(token))
      .finally(toggleProcessing)
  }

  if (loading) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  return (
    <AccessTokensContext.Provider
      value={{
        addToken,
        tokens,
        deleteToken,
        processing,
      }}
    >
      {props.children}
    </AccessTokensContext.Provider>
  )
}

export function useAccessTokens() {
  const context = React.useContext(AccessTokensContext)
  if (context === undefined) {
    throw new Error(
      'useAccessTokens must be used within a AccessTokensProvider',
    )
  }

  return context
}

export function useListTokens() {
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

  return useCallback(() => client.post<AccessToken>(url), [client, url])
}

function useDeleteToken() {
  const {event} = useEvent()
  const {client} = useOrganization()
  return (token: AccessToken) => {
    const url = api(`/events/${event.slug}/access_tokens/${token.id}`)
    return client.delete(url)
  }
}
