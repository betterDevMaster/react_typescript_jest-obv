import {Rule as AttendeeRule} from 'Event/attendee-rules'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState, useCallback} from 'react'
import {useArea} from 'organization/Event/Area/AreaProvider'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'

export interface Rule {
  id: number | string
  conditions: AttendeeRule[]
  rooms: number[]
}

export interface RulesContextProps {
  update: (rule: Rule) => void
  remove: (rule: Rule) => void
  add: (rule: Rule) => void
  rules: Rule[]
  loading: boolean
  processing: boolean
  error: string | null
  clearError: () => void
  setRules: (rules: Rule[]) => void
  save: () => void
}

export const RulesContext = React.createContext<RulesContextProps | undefined>(
  undefined,
)

export default function RulesProvider(props: {children: React.ReactElement}) {
  const {rules: saved, loading} = useSavedRules()
  const [rules, setRules] = useState<Rule[]>([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const clearError = () => setError(null)

  const sendSave = useSaveRequest()

  const save = () => {
    if (processing) {
      return
    }

    setProcessing(true)
    clearError()

    sendSave(rules)
      .then(setRules)
      .catch((e) => setError(e.message))
      .finally(() => setProcessing(false))
  }

  useEffect(() => {
    if (!saved) {
      return
    }

    setRules(saved)
  }, [saved])

  const update = (rule: Rule) => {
    const updated = rules.map((r) => {
      const isTarget = r.id === rule.id
      if (!isTarget) {
        return r
      }

      return rule
    })

    setRules(updated)
  }

  const remove = (rule: Rule) => {
    const removed = rules.filter((a) => a.id !== rule.id)
    setRules(removed)
  }

  const add = (rule: Rule) => {
    const added = [...rules, rule]
    setRules(added)
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
    <RulesContext.Provider
      value={{
        update,
        remove,
        add,
        rules,
        loading,
        processing,
        save,
        error,
        clearError,
        setRules,
      }}
    >
      {props.children}
    </RulesContext.Provider>
  )
}

export function useRules() {
  const context = React.useContext(RulesContext)
  if (context === undefined) {
    throw new Error('useRules must be used within a RulesProvider')
  }

  return context
}

export function useSavedRules() {
  const {client} = useOrganization()
  const {
    area: {id},
  } = useArea()
  const {
    event: {slug},
  } = useEvent()

  const request = useCallback(() => {
    const url = api(`/events/${slug}/areas/${id}/rules`)
    return client.get<Rule[]>(url)
  }, [client, slug, id])

  const {data, loading} = useAsync(request)

  return {
    rules: data,
    loading,
  }
}

function useSaveRequest() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()

  return (rules: Rule[]) => {
    return client.put<Rule[]>(
      api(`/events/${event.slug}/areas/${area.id}/rules`),
      {rules},
    )
  }
}
