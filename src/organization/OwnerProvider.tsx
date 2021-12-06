import {TeamMember} from 'auth/user'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import TeamMemberOnly from 'organization/auth/TeamMemberOnly'
import React, {useCallback} from 'react'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {useObvioAuth} from 'obvio/auth'

type OwnerContextProps = TeamMember

const OwnerContext = React.createContext<OwnerContextProps | undefined>(
  undefined,
)

export default function OwnerProvider(props: {children: React.ReactNode}) {
  const {
    organization: {id},
    client,
  } = useOrganization()

  const fetch = useCallback(() => {
    const url = api(`/organizations/${id}/owner`)
    return client.get<TeamMember>(url)
  }, [id, client])

  const {data: owner, loading} = useAsync(fetch)

  if (loading) {
    return <FullPageLoader />
  }

  if (!owner) {
    return <TeamMemberOnly />
  }

  return (
    <OwnerContext.Provider value={owner}>
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
  const owner = useOwner()
  const {user} = useObvioAuth()

  if (!user || !owner) {
    return false
  }

  return user.email === owner.email
}
