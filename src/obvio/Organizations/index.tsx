import React from 'react'
import UserOrganizationsProvier from 'obvio/Organizations/UserOrganizationsProvider'
import Collection from 'obvio/Organizations/Collection'
import {obvioRoutes} from 'obvio/Routes'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Layout from 'obvio/user/Layout'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import Button from '@material-ui/core/Button'

export default function Organizations() {
  useBreadcrumbs([
    {
      title: 'Organizations',
      url: obvioRoutes.root,
    },
  ])

  return (
    <UserOrganizationsProvier>
      <Layout
        navbarRight={
          <RelativeLink to={obvioRoutes.organizations.create} disableStyles>
            <Button variant="contained" color="primary">
              New Organization
            </Button>
          </RelativeLink>
        }
      >
        <Collection />
      </Layout>
    </UserOrganizationsProvier>
  )
}
