import {useAsync} from 'lib/async'
import {findOrganization, Organization} from 'organization/organizations-client'
import {organizationSlug} from 'organization/url'
import React, {useCallback} from 'react'

interface OrganizationContextProps {
  organization: Organization | null
  loading: boolean
}

const OrganizationContext = React.createContext<
  OrganizationContextProps | undefined
>(undefined)

export default function OrganizationProvider(props: {
  children: React.ReactNode
}) {
  const slug = organizationSlug()
  const find = useCallback(() => {
    return findOrganization(slug)
  }, [slug])

  const {data, loading} = useAsync(find)

  return (
    <OrganizationContext.Provider
      value={{
        organization: data,
        loading,
      }}
    >
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
