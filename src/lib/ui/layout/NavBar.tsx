import React from 'react'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import styled from 'styled-components'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'

export default function NavBar(props: {
  className?: string
  navbarRight?: React.ReactElement
}) {
  const {breadcrumbs} = useBreadcrumbs()

  return (
    <Box className={props.className}>
      <StyledBreadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((breadcrumb) => (
          <BreadcrumbLink key={breadcrumb.url} to={breadcrumb.url}>
            {breadcrumb.title}
          </BreadcrumbLink>
        ))}
      </StyledBreadcrumbs>
      {props.navbarRight || null}
    </Box>
  )
}

const StyledBreadcrumbs = styled(Breadcrumbs)`
  li {
    color: #ffffff;
  }
`

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: right;
  background: #131d34;
  height: ${(props) => props.theme.spacing[16]};
  padding: 0 ${(props) => props.theme.spacing[5]};
  box-sizing: content-box;
`

const BreadcrumbLink = styled(RelativeLink)`
  color: #ffffff;
`
