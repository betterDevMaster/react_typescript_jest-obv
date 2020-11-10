import {Organization} from 'obvio/user/Organizations/organizations-client'
import React from 'react'

export default function Card(props: {organization: Organization}) {
  return <div>{props.organization.name}</div>
}
