import React from 'react'
import UserOrganizationsProvier from 'obvio/Organizations/UserOrganizationsProvider'
import Collection from 'obvio/Organizations/Collection'
import {obvioRoutes} from 'obvio/Routes'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Layout from 'obvio/user/Layout'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import Button from '@material-ui/core/Button'
import {useObvioUser} from 'obvio/auth'

export default function Organizations() {
  useBreadcrumbs([
    {
      title: 'Organizations',
      url: obvioRoutes.root,
    },
  ])

  return (
    <UserOrganizationsProvier>
      <Layout navbarRight={<CreateOrganizationButton />}>
        <Collection />
      </Layout>
    </UserOrganizationsProvier>
  )
}

function CreateOrganizationButton() {
  const user = useObvioUser()
  if (!user.has_active_subscription) {
    return null
  }

  return (
    <RelativeLink to={obvioRoutes.organizations.create} disableStyles>
      <Button variant="contained" color="primary">
        Create Organization
      </Button>
    </RelativeLink>
  )
}
