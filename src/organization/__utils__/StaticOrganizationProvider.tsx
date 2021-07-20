import {Organization} from 'organization'
import React from 'react'
import {
  createRoutesFor,
  OrganizationContext,
} from 'organization/OrganizationProvider'
import {teamMemberClient} from 'obvio/obvio-client'

export default function StaticOrganizationProvider(props: {
  organization: Organization
  children: React.ReactNode
}) {
  const routes = createRoutesFor(props.organization)

  return (
    <OrganizationContext.Provider
      value={{
        organization: props.organization,
        routes,
        client: teamMemberClient,
        set: () => {},
      }}
    >
      {props.children}
    </OrganizationContext.Provider>
  )
}
