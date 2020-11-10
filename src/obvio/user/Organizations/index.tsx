import React from 'react'
import OrganizationsProvider from 'obvio/user/Organizations/OrganizationsProvider'
import Collection from 'obvio/user/Organizations/Collection'

export default function Organizations() {
  return (
    <OrganizationsProvider>
      <Collection />
    </OrganizationsProvider>
  )
}
