import {User} from 'auth/user'
import styled from 'styled-components'
import Page from 'organization/user/Layout/Page'
import React, {useCallback, useState} from 'react'
import TeamMemberList from 'organization/Team/TeamMemberList'
import AddTeamMemberForm from 'organization/Team/AddTeamMemberForm'
import {useAsync} from 'lib/async'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import IfOwner from 'organization/auth/IfOwner'

export type TeamMember = User

export default function Team() {
  const fetchTeamMembers = useFetchTeamMembers()
  const {data: savedMembers, loading} = useAsync(fetchTeamMembers)
  const [newMembers, setNewMembers] = useState<TeamMember[]>([])
  const [removedMembers, setRemovedMembers] = useState<TeamMember[]>([])

  const addNewMember = (teamMember: TeamMember) => {
    setNewMembers([teamMember, ...newMembers])
  }

  const removeMember = (teamMember: TeamMember) => {
    setRemovedMembers([teamMember, ...removedMembers])
  }

  const isRemoved = (target: TeamMember) =>
    removedMembers.find((t) => target.email === t.email)

  if (loading || !savedMembers) {
    return null
  }

  // Add new members, and filter out removed members
  const teamMembers = [...newMembers, ...savedMembers].filter(
    (t) => !isRemoved(t),
  )

  return (
    <Page>
      <Title>Team</Title>
      <IfOwner>
        <AddTeamMemberForm onAdd={addNewMember} />
      </IfOwner>
      <TeamMemberList teamMembers={teamMembers} onRemove={removeMember} />
    </Page>
  )
}

const Title = styled.h3`
  text-align: center;
`

function useFetchTeamMembers() {
  const {client, organization} = useOrganization()

  return useCallback(() => {
    const url = api(`/organizations/${organization.slug}/team_members`)
    return client.get<TeamMember[]>(url)
  }, [organization, client])
}
