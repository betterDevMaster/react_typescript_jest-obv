import {client} from 'lib/api-client'
import {api} from 'lib/url'
import {useObvioAuth} from 'obvio/auth'
import React, {useEffect, useState} from 'react'

export interface Organization {
  id: number
  name: string
  slug: string
}

type OrganizationsContextProps = Organization[]

const OrganizationsContext = React.createContext<
  OrganizationsContextProps | undefined
>(undefined)

export default function OrganizationsProvier(props: {
  children: React.ReactNode
}) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const {user} = useObvioAuth()

  useEffect(() => {
    let mounted = true
    if (!user) {
      return
    }

    fetchOrganizations().then((organizations) => {
      if (mounted) {
        setOrganizations(organizations)
      }
    })

    return () => {
      mounted = false
    }
  }, [user])

  return (
    <OrganizationsContext.Provider value={organizations}>
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

function fetchOrganizations() {
  const url = api('/organizations')
  return client.get<Organization[]>(url)
}
