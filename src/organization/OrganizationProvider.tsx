import {useAsync} from 'lib/async'
import {findOrganization, Organization} from 'organization/organizations-client'
import {organizationSlug} from 'organization/url'
import React, {useCallback} from 'react'

const OrganizationContext = React.createContext<Organization | undefined>(
  undefined,
)

export default function OrganizationProvider(props: {
  children: React.ReactNode
}) {
  const slug = organizationSlug()
  const find = useCallback(() => {
    return findOrganization(slug)
  }, [slug])

  const {data: organization, loading} = useAsync(find)

  if (loading) {
    return null
  }

  if (!organization) {
    return (
      <div>
        <h1>404 - Organization not found</h1>
      </div>
    )
  }

  return (
    <OrganizationContext.Provider value={organization}>
      {props.children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = React.useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within a OrganizationProvider',
    )
  }

  return context
}
