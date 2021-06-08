import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'

export interface TeamInvitation {
  id: number
  email: string
  token: string
}

interface TeamInviteContextProps {
  loading: boolean
  invitations: TeamInvitation[]
  add: (teamMemberInvite: TeamInvitation) => void
  remove: (teamMemberInvite: TeamInvitation) => void
  processing: boolean
}

const TeamInviteContext =
  React.createContext<TeamInviteContextProps | undefined>(undefined)

export default function TeamInvitationsProvider(props: {
  children: React.ReactNode
}) {
  const fetchInvites = useFetchInvites()
  const {data: saved, loading} = useAsync(fetchInvites)
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const deleteInvitation = useDeleteInvitation()
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!saved) {
      return
    }

    setInvitations(saved)
  }, [saved])

  const add = (teamMemberInvite: TeamInvitation) => {
    setInvitations([teamMemberInvite, ...invitations])
  }

  const remove = (target: TeamInvitation) => {
    if (processing) {
      return
    }

    setProcessing(true)

    deleteInvitation(target)
      .then(() => {
        const updated = invitations.filter((tm) => tm.id !== target.id)
        setInvitations(updated)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  if (loading) {
    return null
  }

  return (
    <TeamInviteContext.Provider
      value={{
        loading,
        invitations,
        add,
        remove,
        processing,
      }}
    >
      {props.children}
    </TeamInviteContext.Provider>
  )
}

export function useTeamInvitations() {
  const context = React.useContext(TeamInviteContext)
  if (context === undefined) {
    throw new Error(
      `useTeamInvitations must be used within a TeamInvitationProvider`,
    )
  }

  return context
}

function useFetchInvites() {
  const {client, organization} = useOrganization()

  return useCallback(() => {
    const url = api(`/organizations/${organization.slug}/team_invitations`)
    return client.get<TeamInvitation[]>(url)
  }, [organization, client])
}

function useDeleteInvitation() {
  const {client} = useOrganization()

  return (target: TeamInvitation) => {
    const url = api(`/team_invitations/${target.id}`)
    return client.delete(url)
  }
}
