import Card from 'obvio/user/Organizations/Collection/Card'
import styled from 'styled-components'
import {useOrganizations} from 'obvio/user/Organizations/OrganizationsProvider'
import React from 'react'
import Button from '@material-ui/core/Button'
import { obvioRoutes } from 'obvio/Routes'
import { Link } from 'react-router-dom'

export default function Collection() {
  const organizations = useOrganizations()
  const empty = organizations.length === 0

  if (empty) {
    return (
      <EmptyBox>
        <p>No organizations have been created</p>
        <Link to={obvioRoutes.organizations.create}>
          <Button variant="outlined" color="primary">
            Create Organization
          </Button>
        </Link>
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
