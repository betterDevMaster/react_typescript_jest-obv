import React from 'react'
import UserOrganizationsProvier, {
  useUserOrganizations,
} from 'obvio/Organizations/UserOrganizationsProvider'
import Collection from 'obvio/Organizations/Collection'
import {obvioRoutes} from 'obvio/Routes'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Layout from 'obvio/user/Layout'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import Button from '@material-ui/core/Button'
import {useObvioUser} from 'obvio/auth'
import {Redirect} from 'react-router'
import {createRoutesFor} from 'organization/OrganizationProvider'
import {useCanCreateOrganization} from 'obvio/Billing/plans'

export default function Organizations() {
  useBreadcrumbs([
    {
      title: 'Organizations',
      url: obvioRoutes.root,
    },
  ])

  return (
    <UserOrganizationsProvier>
      <Content />
    </UserOrganizationsProvier>
  )
}

function Content() {
  const {organizations} = useUserOrganizations()
  const shouldRedirectToOrganization = useShouldRedirectToOrganization()

  if (shouldRedirectToOrganization) {
    const firstOrganization = organizations[0]
    const routes = createRoutesFor(firstOrganization)
    return <Redirect to={routes.root} />
  }

  return (
    <Layout navbarRight={<CreateOrganizationButton />}>
      <Collection />
    </Layout>
  )
}

function useShouldRedirectToOrganization() {
  const user = useObvioUser()
  const {organizations} = useUserOrganizations()

  // If no organizations exist, there's nothing to
  // auto-redirect to.
  const hasNone = organizations.length === 0
  if (hasNone) {
    return false
  }

  // If a user has multiple organizations, lets let them
  // choose which one they'd like to access.
  const hasMultiple = organizations.length > 1
  if (hasMultiple) {
    return false
  }

  // If a user only has one organization, and they don't have a plan,
  // then they can't create any more, so let's just re-direct them.
  if (!user.plan) {
    return true
  }

  // If a user has an active plan, we'll always show the organizations
  // list
  return false
}

function CreateOrganizationButton() {
  const canCreate = useCanCreateOrganization()
  if (!canCreate) {
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
