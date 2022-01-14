import React from 'react'
import Box from '@material-ui/core/Box'
import Header from './Header'
import OrganizationList from './OrganizationList'

export enum ViewType {
  LIST,
  GRID,
}

export interface Organization {
  name: string
  avatar: string
}

export type OrganizationsProps = {
  viewType: ViewType
  organizations: Organization[]
}

export default function Organizations(props: OrganizationsProps) {
  const {viewType, organizations} = props

  return (
    <Box>
      <Header viewType={viewType} />
      <OrganizationList viewType={viewType} organizations={organizations} />
    </Box>
  )
}
