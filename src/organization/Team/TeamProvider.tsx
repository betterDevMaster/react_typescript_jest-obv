import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {TeamMember} from 'auth/user'
import React, {useCallback, useEffect, useState} from 'react'

interface TeamContextProps {
  loading: boolean
  members: TeamMember[]
  add: (teamMember: TeamMember) => void
  update: (teamMember: TeamMember) => void
  remove: (teamMember: TeamMember) => void
  processing: boolean
}

const TeamContext = React.createContext<TeamContextProps | undefined>(undefined)

export default function TeamProvider(props: {children: React.ReactNode}) {
  const fetchTeamMembers = useFetchTeamMembers()
  const {data: savedMembers, loading} = useAsync(fetchTeamMembers)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [processing, setProcessing] = useState(false)
  const removeFromTeam = useRemoveFromTeam()

  useEffect(() => {
    if (!savedMembers) {
      return
    }

    setMembers(savedMembers)
  }, [savedMembers])

  const add = (teamMember: TeamMember) => {
    setMembers([teamMember, ...members])
  }

  const update = (teamMember: TeamMember) => {
    const updated = members.map((tm) => {
      const isTarget = tm.id === teamMember.id
      if (isTarget) {
        return teamMember
      }

      return tm
    })
    setMembers(updated)
  }

  const remove = (target: TeamMember) => {
    if (processing) {
      return
    }

    setProcessing(true)

    removeFromTeam(target)
      .then(() => {
        const updated = members.filter((tm) => tm.id !== target.id)
        setMembers(updated)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  if (loading) {
    return null
  }

  return (
    <TeamContext.Provider
      value={{
        loading,
        members,
        add,
        update,
        remove,
        processing,
      }}
    >
      {props.children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = React.useContext(TeamContext)
  if (context === undefined) {
    throw new Error(`useTeam must be used within a TeamProvider`)
  }

  return context
}

function useFetchTeamMembers() {
  const {client, organization} = useOrganization()

  return useCallback(() => {
    const url = api(`/organizations/${organization.slug}/team_members`)
    return client.get<TeamMember[]>(url)
  }, [organization, client])
}

function useRemoveFromTeam() {
  const {organization, client} = useOrganization()

  return (target: TeamMember) => {
    const url = api(
      `/organizations/${organization.slug}/team_members/${target.id}`,
    )

    return client.delete<TeamMember>(url)
  }
}
