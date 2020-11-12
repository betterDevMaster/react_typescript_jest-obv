import {useAsync} from 'lib/async'
import {
  fetchOrganizations,
  Organization,
} from 'obvio/Organizations/organizations-client'
import React from 'react'

interface OrganizationsContextProps {
  organizations: Organization[]
  loading: boolean
}

const OrganizationsContext = React.createContext<
  OrganizationsContextProps | undefined
>(undefined)

export default function OrganizationsProvier(props: {
  children: React.ReactNode
}) {
  const {data, loading} = useAsync(fetchOrganizations)

  // data is null before request is sent, but
  // we're expecting an array
  const organizations = data || []

  return (
    <OrganizationsContext.Provider
      value={{
        organizations,
        loading,
      }}
    >
      {props.children}
    </OrganizationsContext.Provider>
  )
}

export function useOrganizations() {
  const context = React.useContext(OrganizationsContext)
  if (context === undefined) {
    throw new Error(
      `useOrganizations must be used within an OrganizationsProvider`,
    )
  }

  return context
}
