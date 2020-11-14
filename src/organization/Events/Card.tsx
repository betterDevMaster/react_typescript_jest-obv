import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import styled from 'styled-components'
import {Event} from 'organization/Events'
import grey from '@material-ui/core/colors/grey'
import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import {useOrganization} from 'organization/OrganizationProvider'
import {organizationUrl} from 'organization/url'

export default function Card(props: {event: Event}) {
  const label = `view ${props.event.name}`
  const organization = useOrganization()
  const url = `${organizationUrl(organization)}/${props.event.slug}`

  return (
    <Link to={url} disableStyles aria-label={label}>
      {props.event.name}
      <URL variant="caption">{url}</URL>
    </Link>
  )
}

const Link = styled(AbsoluteLink)`
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing[5]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  border-radius: 6px;
  display: block;

  &:hover {
    background: ${grey[200]};
  }
`

const URL = withStyles({
  root: {
    display: 'block',
    marginTop: spacing[1],
  },
})(Typography)
