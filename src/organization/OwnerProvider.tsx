import {TeamMember} from 'auth/user'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import TeamMemberOnly from 'organization/auth/TeamMemberOnly'
import React, {useCallback, useEffect, useState} from 'react'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {useObvioAuth} from 'obvio/auth'

export interface OwnerContextProps {
  owner: TeamMember
  setOwner: (owner: TeamMember | null) => void
}

const OwnerContext = React.createContext<OwnerContextProps | undefined>(
  undefined,
)

export default function OwnerProvider(props: {children: React.ReactNode}) {
  const [owner, setOwner] = useState<TeamMember | null>()
  const [loading, setLoading] = useState(true)

  const {
    organization: {id},
    client,
  } = useOrganization()

  const fetch = useCallback(() => {
    const url = api(`/organizations/${id}/owner`)
    return client.get<TeamMember>(url)
  }, [id, client])

  useEffect(() => {
    fetch()
      .then((owner) => {
        setOwner(owner)
      })
      .catch(() => {
        // ignore errors since we'll just assume they're unauthenticated
      })
      .finally(() => {
        setLoading(false)
      })
  }, [fetch])

  if (loading) {
    return <FullPageLoader />
  }

  if (!owner) {
    return <TeamMemberOnly />
  }

  return (
    <OwnerContext.Provider value={{owner, setOwner}}>
      {props.children}
    </OwnerContext.Provider>
  )
}

export function useOwner() {
  const context = React.useContext(OwnerContext)
  if (context === undefined) {
    throw new Error(`useOwner must be used within a OwnerProvider`)
  }

  return context
}

export function useIsOwner() {
  const {owner} = useOwner()
  const {user} = useObvioAuth()

  if (!user || !owner) {
    return false
  }

  return user.email === owner.email
}
