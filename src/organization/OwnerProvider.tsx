import {TeamMember} from 'auth/user'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import TeamMemberOnly from 'organization/auth/TeamMemberOnly'
import React, {useCallback, useEffect, useState} from 'react'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {useObvioAuth} from 'obvio/auth'
import {PlanName} from 'obvio/Billing/plans'

export interface OwnerContextProps {
  owner: TeamMember
  setOwner: (owner: TeamMember | null) => void
}

export const OwnerContext = React.createContext<OwnerContextProps | undefined>(
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

/**
 * Will only render if the owner in the current context
 * has the target plan.
 *
 * @param props
 * @returns
 */
export function IfOwnerHasPlan(props: {
  plan: PlanName
  children: JSX.Element | JSX.Element[]
}) {
  const {owner} = useOwner()
  if (!owner.plan) {
    return null
  }

  const isCorrectPlan = owner.plan.name === props.plan
  if (!isCorrectPlan) {
    return null
  }

  return <>{props.children}</>
}
