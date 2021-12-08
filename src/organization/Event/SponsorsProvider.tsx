import {useEvent} from 'Event/EventProvider'
import {Sponsor} from 'Event/SponsorPage'
import {Client} from 'lib/ui/api-client'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState, useCallback} from 'react'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'

interface SponsorsContextProps {
  sponsors: Sponsor[]
  add: (sponsor: Sponsor) => void
  update: (sponsor: Sponsor) => void
  remove: (sponsor: Sponsor) => void
  edit: (sponsor: Sponsor | null) => void
  loading: boolean
  editing: Sponsor | null
}

export const SponsorsContext = React.createContext<
  undefined | SponsorsContextProps
>(undefined)

export function OrganizationSponsorsProvider(props: {
  children: React.ReactNode
}) {
  const {client} = useOrganization()
  return <SponsorsProvider client={client} {...props} />
}

export function EventSponsorsProvider(props: {children: React.ReactNode}) {
  const {client} = useEvent()
  return <SponsorsProvider client={client} {...props} />
}

function SponsorsProvider(props: {client: Client; children: React.ReactNode}) {
  const {client} = props

  const fetch = useFetchSponsors(client)
  const list = useSponsorsList(fetch)

  return (
    <SponsorsContext.Provider value={list}>
      {props.children}
    </SponsorsContext.Provider>
  )
}

export function useSponsorsList(request: () => Promise<Sponsor[]>) {
  const {data: saved, loading} = useAsync(request)
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [editing, setEditing] = useState<Sponsor | null>(null)

  const edit = (sponsor: Sponsor | null) => setEditing(sponsor)

  useEffect(() => {
    if (!saved) {
      return
    }

    setSponsors(saved)
  }, [saved])

  const add = (newSponsor: Sponsor) => {
    const added = [...sponsors, newSponsor]
    setSponsors(added)
  }

  const update = (target: Sponsor) => {
    const updated = sponsors.map((s) => {
      const isTarget = s.id === target.id
      if (isTarget) {
        return target
      }

      return s
    })

    setSponsors(updated)
  }

  const remove = (target: Sponsor) => {
    const removed = sponsors.filter((s) => s.id !== target.id)
    setSponsors(removed)
  }

  return {sponsors, update, loading, editing, add, remove, edit}
}

export function useSponsors() {
  const context = React.useContext(SponsorsContext)

  if (context === undefined) {
    throw new Error('useSponsors must be used within a SponsorsProvider')
  }

  return context
}

export function useFetchSponsors(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/sponsors`)
  return useCallback(() => client.get<Sponsor[]>(url), [client, url])
}
