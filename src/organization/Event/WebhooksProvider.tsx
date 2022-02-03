import React, {useCallback, useState, useEffect} from 'react'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'

export type WebhookFormData = {
  webhook_event: string
  url: string
  requires_crc: boolean
}

export type EventWebhookFormData = {
  webhook_url: string
  webhook_access_token_id: number
}

export interface WebhookSaltResponseData {
  webhook_salt: string
}

export interface WebhookTestResponseData {
  headers: string[]
  destination: Partial<Webhook>
  payload: any
  response: string
}

export interface WebhookData {
  has_webhook_crc_salt: boolean
  webhook_access_token_id: number | null
  webhook_url: string | null
}

export interface Webhook {
  id: number
  event_id: number
  webhook_event: string
  url: string | null
  requires_crc: boolean
}

interface WebhooksProviderContextProps {
  closeSaltOverlay: () => void
  generateSalt: () => Promise<string | void>
  removeWebhook: (id: number) => Promise<void>
  salt: string
  saveEventWebhook: (data: EventWebhookFormData) => Promise<void>
  saveWebhook: (data: WebhookFormData | FormData) => Promise<void>
  submitting: boolean
  testRequest?: Webhook
  testResponse?: WebhookTestResponseData
  testWebhook: (webhook: Webhook) => Promise<WebhookTestResponseData | void>
  webhooks: Webhook[]
}

export const AVAILABLE_WEBHOOK_EVENTS = ['attendee.checked_in']

const WebhooksProviderContext = React.createContext<
  undefined | WebhooksProviderContextProps
>(undefined)

export default function WebhooksProvider(props: {
  children: React.ReactElement
}) {
  const [salt, setSalt] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [testRequest, setTestRequest] = useState<Webhook>()
  const [testResponse, setTestResponse] = useState<WebhookTestResponseData>()
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const {loading, data} = useFetchWebhooks()

  const insert = (webhook: Webhook) =>
    setWebhooks((existing) => [...existing, webhook])

  const removeWithId = (id: number) => {
    setWebhooks((webhooks) => webhooks.filter((w) => w.id !== id))
  }

  const requestGenerateSalt = useGenerateSalt()
  const saveSalt = (data: WebhookSaltResponseData): Promise<string> => {
    setSalt(data.webhook_salt)

    return new Promise((resolve) => resolve(data.webhook_salt || ''))
  }
  const generateSalt = useCallback((): Promise<string | void> => {
    setSubmitting(true)

    return requestGenerateSalt()
      .catch((error) => {
        setSubmitting(false)
        throw error
      })
      .then(saveSalt)
      .then(() => setSubmitting(false))
  }, [requestGenerateSalt])

  const closeSaltOverlay = () => setSalt('')

  const sendEventWebhookSettings = useSendEventWebhookSettings()

  const handleEventWebhookSettings = (
    data: EventWebhookFormData,
  ): Promise<void> => {
    setSubmitting(true)

    return sendEventWebhookSettings(data)
      .catch((error) => {
        setSubmitting(false)
        throw error
      })
      .then(() => setSubmitting(false))
  }

  const requestSaveWebhook = useSaveWebhook()
  const saveWebhook = (data: WebhookFormData | FormData): Promise<void> => {
    setSubmitting(true)

    return requestSaveWebhook(data)
      .catch((error) => {
        setSubmitting(false)
        throw error
      })
      .then(insert)
      .then(() => setSubmitting(false))
  }

  const requestRemoveWebhook = useRemoveWebhook()
  const removeWebhook = (id: number): Promise<void> => {
    setSubmitting(true)

    return requestRemoveWebhook(id)
      .then(() => removeWithId(id))
      .then(() => setSubmitting(false))
  }

  const requestTestWebhook = useTestWebhook()
  const testWebhook = (
    webhook: Webhook,
  ): Promise<WebhookTestResponseData | void> => {
    setTestResponse(undefined)
    setTestRequest(webhook)

    return requestTestWebhook(webhook.id).then((data) => {
      if (data) {
        setTestResponse(data)
      }
    })
  }

  useEffect(() => {
    if (!data) {
      return
    }

    setWebhooks(data)
  }, [data])

  if (loading || !data) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  return (
    <WebhooksProviderContext.Provider
      value={{
        closeSaltOverlay,
        generateSalt,
        removeWebhook,
        salt,
        saveEventWebhook: handleEventWebhookSettings,
        saveWebhook,
        submitting,
        testRequest,
        testResponse,
        testWebhook,
        webhooks,
      }}
    >
      {props.children}
    </WebhooksProviderContext.Provider>
  )
}

export function useSendEventWebhookSettings() {
  const updateEvent = useUpdate()

  return (data: EventWebhookFormData) => updateEvent(data)
}

export function useSaveWebhook() {
  const {client} = useOrganization()
  const {event} = useEvent()

  const url = api(`/events/${event.slug}/webhooks`)

  return (data: WebhookFormData | FormData) => client.post<Webhook>(url, data)
}

function useRemoveWebhook() {
  const {client} = useOrganization()

  return (id: number) => client.delete<void>(api(`/webhooks/${id}`))
}

function useTestWebhook() {
  const {client} = useOrganization()

  return (id: number) =>
    client.post<WebhookTestResponseData | void>(api(`/webhooks/${id}/test`))
}

function useGenerateSalt() {
  const {client} = useOrganization()
  const {
    event: {slug},
  } = useEvent()

  return useCallback(() => {
    const url = api(`/events/${slug}/webhooks/salt`)

    return client.post<WebhookSaltResponseData>(url)
  }, [slug, client])
}

function useFetchWebhooks() {
  const {client} = useOrganization()
  const {
    event: {slug: eventSlug},
  } = useEvent()

  const request = useCallback(() => {
    const url = api(`/events/${eventSlug}/webhooks`)

    return client.get<Webhook[]>(url)
  }, [client, eventSlug])

  return useAsync(request)
}

export function useWebhooks() {
  const context = React.useContext(WebhooksProviderContext)

  if (context === undefined) {
    throw new Error('useWebhooks must be used within a WebhooksProvider')
  }

  return context
}
