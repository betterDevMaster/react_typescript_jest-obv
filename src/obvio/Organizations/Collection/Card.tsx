import styled from 'styled-components'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import {Organization} from 'organization'
import {createRoutesFor} from 'organization/OrganizationProvider'
import logoImgVertical from 'assets/images/logo_vertical.png'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function Card(props: {organization: Organization}) {
  const routes = createRoutesFor(props.organization)
  const url = routes.root
  const label = `view ${props.organization.name}`
  return (
    <div>
      <Link to={url} disableStyles aria-label={label}>
        <CardContent>
          <img src={logoImgVertical} alt="organization_logo" />
        </CardContent>
      </Link>
      <Bottom>
        <BottomLeft>
          <span>{props.organization.name}</span>
        </BottomLeft>
      </Bottom>
    </div>
  )
}

const CardContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
`

const BottomLeft = styled.div`
  display: flex;
  flex-direction: column;
`

const Link = styled(RelativeLink)`
  padding: ${(props) => props.theme.spacing[5]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  display: block;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);

  &:hover {
    background: ${grey[200]};
  }
`
