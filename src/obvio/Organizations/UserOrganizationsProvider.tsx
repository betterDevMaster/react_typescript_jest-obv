import {useAsync} from 'lib/async'
import {Organization} from 'organization'
import {getUserOrganizations} from 'organization/obvio-client'
import React from 'react'

interface UserOrganizationsContextProps {
  organizations: Organization[]
  loading: boolean
}

const UserOrganizationsContext = React.createContext<
  UserOrganizationsContextProps | undefined
>(undefined)

export default function UserOrganizationsProvier(props: {
  children: React.ReactNode
}) {
  const {data, loading} = useAsync(getUserOrganizations)

  // data is null before request is sent, but
  // we're expecting an array
  const organizations = data || []

  return (
    <UserOrganizationsContext.Provider
      value={{
        organizations,
        loading,
      }}
    >
      {props.children}
    </UserOrganizationsContext.Provider>
  )
}

export function useUserOrganizations() {
  const context = React.useContext(UserOrganizationsContext)
  if (context === undefined) {
    throw new Error(
      `useUserOrganizations must be used within an UserOrganizationsProvier`,
    )
  }

  return context
}
