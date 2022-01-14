import React from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import OrganizationItem from './OrganizationItem'
import {ViewType, Organization} from '.'

export type OrganizationListProps = {
  viewType: ViewType
  organizations: Organization[]
}

export default function OrganizationList(props: OrganizationListProps) {
  const {viewType, organizations} = props
  if (viewType === ViewType.LIST) {
    return (
      <Box>
        {organizations.map((organization) => (
          <OrganizationItem
            viewType={viewType}
            organization={organization}
            key={organization.name}
          />
        ))}
      </Box>
    )
  }

  return (
    <Grid container>
      {organizations.map((organization) => (
        <Grid item xs={12} sm={4} md={3} key={organization.name}>
          <OrganizationItem viewType={viewType} organization={organization} />
        </Grid>
      ))}
    </Grid>
  )
}
