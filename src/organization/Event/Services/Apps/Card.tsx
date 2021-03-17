import styled from 'styled-components'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {Service} from 'organization/Event/Services/ServicesProvider'

export default function Card(props: {
  service: Service
  link: string
  logo: string
  isLinked: boolean
}) {
  return (
    <div>
      <StyledLink to={props.link} disableStyles aria-label={props.service}>
        <CardContent>
          <img
            src={props.logo}
            width="100%"
            height="150px"
            alt={`${props.service} logo`}
          />
        </CardContent>
      </StyledLink>
      <Bottom>
        <BottomLeft>
          <span>{props.service}</span>
          <Status isLinked={props.isLinked} />
        </BottomLeft>
      </Bottom>
    </div>
  )
}

function Status(props: {isLinked: boolean}) {
  const label = props.isLinked ? 'Linked' : 'Not Linked'
  return <StatusText isConnected={props.isLinked}>{label}</StatusText>
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

const StyledLink = styled(RelativeLink)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
  display: block;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);

  &:hover {
    background: ${grey[200]};
  }
`

const StatusText = styled.div<{isConnected: boolean}>`
  ${(props) =>
    props.isConnected ? `color: ${props.theme.colors.primary};` : ''}
  font-size: 16px;
`
