import styled from 'styled-components'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {
  Service,
  useServices,
} from 'organization/Event/Services/ServicesProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import Typography from '@material-ui/core/Typography'

export default function Card(props: {
  service: Service
  link: string
  logo: string
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
          <Typography variant="h6">{props.service}</Typography>
          <Status service={props.service} />
        </BottomLeft>
      </Bottom>
    </div>
  )
}

function Status(props: {service: Service}) {
  const {isLinked} = useServices()

  if (isLinked(props.service)) {
    return <UnlinkButton service={props.service} />
  }

  return <StatusText>Not Linked</StatusText>
}

function UnlinkButton(props: {service: Service}) {
  const {service} = props
  const {unlink, remove} = useServices()

  const handleClickUnlink = () => {
    unlink(service).then(() => remove(service))
  }

  return (
    <DangerButton
      variant="outlined"
      onClick={handleClickUnlink}
      size="small"
      aria-label="unlink service"
    >
      Unlink
    </DangerButton>
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

const StyledLink = styled(RelativeLink)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
  display: block;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);

  &:hover {
    background: ${grey[200]};
  }
`

const StatusText = styled.div`
  font-size: 16px;
  color: ${grey[700]};
`
