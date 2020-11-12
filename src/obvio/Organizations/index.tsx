import React from 'react'
import OrganizationsProvider from 'obvio/Organizations/OrganizationsProvider'
import Collection from 'obvio/Organizations/Collection'

export default function Organizations() {
  return (
    <OrganizationsProvider>
      <Collection />
    </OrganizationsProvider>
  )
}
