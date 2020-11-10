import { Organization } from 'obvio/user/Organizations/OrganizationsProvider'
import React from 'react'

export default function Card(props: {organization: Organization}) {
  return <div>{props.organization.name}</div>
}
