import Card from 'obvio/Organizations/Collection/Card'
import styled from 'styled-components'
import {useUserOrganizations} from 'obvio/Organizations/UserOrganizationsProvider'
import React from 'react'

export default function Collection() {
  const {organizations, loading} = useUserOrganizations()
  const empty = organizations.length === 0

  if (loading) {
    return null
  }

  if (empty) {
    return (
      <EmptyBox>
        <p>No organizations have been created</p>
      </EmptyBox>
    )
  }

  return (
    <Grid>
      {organizations.map((o) => (
        <Card key={o.id} organization={o} />
      ))}
    </Grid>
  )
}

const column = `minmax(270px, auto)`

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-gap: ${(props) => props.theme.spacing[8]};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: ${column} ${column};
    grid-template-rows: auto auto;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: ${column} ${column} ${column};
    grid-template-rows: auto auto auto;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: ${column} ${column} ${column} ${column};
    grid-template-rows: auto auto auto auto;
  }
`

const EmptyBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[8]};
  text-align: center;
`
