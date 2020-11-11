import Card from 'obvio/user/Organizations/Collection/Card'
import styled from 'styled-components'
import {useOrganizations} from 'obvio/user/Organizations/OrganizationsProvider'
import React from 'react'
import Button from '@material-ui/core/Button'
import {obvioRoutes} from 'obvio/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function Collection() {
  const {organizations, loading} = useOrganizations()
  const empty = organizations.length === 0

  if (loading) {
    return null
  }

  if (empty) {
    return (
      <EmptyBox>
        <p>No organizations have been created</p>
        <RelativeLink to={obvioRoutes.organizations.create} disableStyles>
          <Button variant="outlined" color="primary">
            Create Organization
          </Button>
        </RelativeLink>
      </EmptyBox>
    )
  }

  return (
    <div>
      {organizations.map((o) => (
        <Card key={o.id} organization={o} />
      ))}
    </div>
  )
}

const EmptyBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[8]};
  text-align: center;
`
