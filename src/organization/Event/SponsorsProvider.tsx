import {Sponsor, useFetchSponsors} from 'Event/SponsorPage'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState} from 'react'

interface SponsorsContextProps {
  sponsors: Sponsor[]
  add: (sponsor: Sponsor) => void
  update: (sponsor: Sponsor) => void
  remove: (sponsor: Sponsor) => void
  edit: (sponsor: Sponsor | null) => void
  loading: boolean
  editing: Sponsor | null
}

const SponsorsContext = React.createContext<undefined | SponsorsContextProps>(
  undefined,
)

export default function SponsorsProvider(props: {
  children: React.ReactElement
}) {
  const {client} = useOrganization()
  const {data: saved, loading} = useFetchSponsors(client)
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

  return (
    <SponsorsContext.Provider
      value={{
        sponsors,
        add,
        update,
        remove,
        loading,
        edit,
        editing,
      }}
    >
      {props.children}
    </SponsorsContext.Provider>
  )
}

export function useSponsors() {
  const context = React.useContext(SponsorsContext)

  if (context === undefined) {
    throw new Error('useSponsors must be used within a SponsorsProvider')
  }

  return context
}
